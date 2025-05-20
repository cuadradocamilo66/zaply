"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    full_description: "",
    price: "",
    category: "",
    resolution: "",
    duration: "",
    ae_version: "",
    plugins: "",
    instructions: "",
    is_free: false,
    featured: false,
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasRLSError, setHasRLSError] = useState(false)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  // Verificar que el bucket existe y probar permisos al cargar la página
  useEffect(() => {
    async function verifySetup() {
      try {
        setIsLoading(true)
        setHasRLSError(false)

        // 1. Verificar si el bucket existe
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

        if (bucketError) {
          console.error("Error al verificar buckets:", bucketError)
          toast({
            title: "Error",
            description: "No se pudo verificar la configuración de almacenamiento",
            variant: "destructive",
          })
          return
        }

        const productsBucketExists = buckets?.some((bucket) => bucket.name === "products")

        if (!productsBucketExists) {
          toast({
            title: "Error de configuración",
            description: "No se encontró el bucket 'products'. Por favor, contacta al administrador.",
            variant: "destructive",
          })
          return
        }

        // 2. Verificar si la tabla products existe
        const { count, error: tableError } = await supabase.from("products").select("*", { count: "exact", head: true })

        if (tableError) {
          console.error("Error al verificar tabla products:", tableError)
          setTableExists(false)
          toast({
            title: "Error de configuración",
            description: "La tabla 'products' no existe o no tienes permisos para acceder a ella.",
            variant: "destructive",
          })
          return
        }

        setTableExists(true)

        // 3. Probar permisos subiendo un archivo de prueba
        try {
          const testBlob = new Blob(["test"], { type: "text/plain" })
          const testFilePath = `test-${Date.now()}.txt`

          const { error: uploadError } = await supabase.storage.from("products").upload(testFilePath, testBlob)

          if (uploadError) {
            console.error("Error al probar permisos:", uploadError)

            // Verificar si es un error de RLS
            if (
              uploadError.message.includes("row-level security") ||
              uploadError.message.includes("violates row-level security policy")
            ) {
              setHasRLSError(true)
            }
          } else {
            // Si la prueba fue exitosa, eliminamos el archivo de prueba
            await supabase.storage.from("products").remove([testFilePath])
          }
        } catch (testError) {
          console.error("Error en prueba de permisos:", testError)
        }
      } catch (error) {
        console.error("Error al inicializar:", error)
      } finally {
        setIsLoading(false)
      }
    }

    verifySetup()
  }, [supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductFile(e.target.files[0])
    }
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      if (!formData.name || !formData.slug || !formData.price || !thumbnailFile || !productFile) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // 1. Subir la imagen de portada
      const thumbnailExt = thumbnailFile.name.split(".").pop()
      const thumbnailPath = `thumbnails/${formData.slug}-${Date.now()}.${thumbnailExt}`

      const { error: thumbnailError } = await supabase.storage.from("products").upload(thumbnailPath, thumbnailFile)

      if (thumbnailError) {
        // Verificar si es un error de RLS
        if (
          thumbnailError.message.includes("row-level security") ||
          thumbnailError.message.includes("violates row-level security policy")
        ) {
          setHasRLSError(true)
          throw new Error("No tienes permisos para subir archivos. Por favor, configura las políticas RLS en Supabase.")
        }
        throw new Error(`Error al subir la imagen: ${thumbnailError.message}`)
      }

      // 2. Subir el archivo del producto
      const productExt = productFile.name.split(".").pop()
      const productPath = `files/${formData.slug}-${Date.now()}.${productExt}`

      const { error: productError } = await supabase.storage.from("products").upload(productPath, productFile)

      if (productError) {
        throw new Error(`Error al subir el archivo del producto: ${productError.message}`)
      }

      // 3. Obtener las URLs públicas
      const { data: thumbnailData } = supabase.storage.from("products").getPublicUrl(thumbnailPath)

      const { data: productDataFromStorage } = supabase.storage.from("products").getPublicUrl(productPath)

      // 4. Crear el producto en la base de datos
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        full_description: formData.full_description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        thumbnail_url: thumbnailData.publicUrl,
        file_url: productDataFromStorage.publicUrl,
        file_size: productFile.size,
        resolution: formData.resolution,
        duration: formData.duration,
        ae_version: formData.ae_version,
        plugins: formData.plugins || null,
        instructions: formData.instructions,
        is_free: formData.is_free,
        featured: formData.featured,
        preview_images: [thumbnailData.publicUrl], // Por defecto usamos la misma imagen
        features: [], // Array vacío por defecto
      }

      console.log("Datos a insertar:", productData)

      const { error: insertError, data: insertedData } = await supabase.from("products").insert(productData).select()

      if (insertError) {
        console.error("Error detallado al insertar:", insertError)
        throw new Error(
          `Error al crear el producto: ${insertError.message || insertError.details || JSON.stringify(insertError)}`,
        )
      }

      console.log("Producto insertado:", insertedData)

      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      })

      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Componente para mostrar instrucciones de RLS
  const RLSInstructions = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error de permisos</AlertTitle>
      <AlertDescription>
        <div className="space-y-4">
          <p>
            No tienes permisos para subir archivos al bucket "products". Necesitas configurar políticas de seguridad
            (RLS) en Supabase para permitir la subida de archivos.
          </p>
          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Sigue estos pasos para configurar las políticas:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Ve al panel de Supabase</li>
              <li>Navega a la sección "Storage"</li>
              <li>Haz clic en "Policies" en el menú lateral</li>
              <li>Selecciona el bucket "products"</li>
              <li>Haz clic en "Add Policy" para cada operación (INSERT, SELECT, UPDATE, DELETE)</li>
              <li>Para una configuración rápida, puedes usar la política "Allow access to all users"</li>
              <li>Guarda los cambios y vuelve a intentar</li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                Abrir Supabase
              </Button>
            </a>
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              Verificar de nuevo
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )

  // Componente para mostrar instrucciones de creación de tabla
  const TableInstructions = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Tabla no encontrada</AlertTitle>
      <AlertDescription>
        <div className="space-y-4">
          <p>
            La tabla "products" no existe en la base de datos o no tienes permisos para acceder a ella. Necesitas crear
            esta tabla antes de continuar.
          </p>
          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Ejecuta este SQL para crear la tabla:</h3>
            <pre className="bg-black text-white p-4 rounded-md text-xs overflow-auto">
              {`CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  full_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  thumbnail_url TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  resolution TEXT,
  duration TEXT,
  ae_version TEXT,
  plugins TEXT,
  instructions TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  preview_images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}'
);

-- Habilitar la extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear política RLS para permitir acceso a todos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to products" ON products FOR ALL USING (true);`}
            </pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                Abrir Supabase SQL Editor
              </Button>
            </a>
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              Verificar de nuevo
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nuevo Producto</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Verificando configuración...</span>
        </div>
      ) : (
        <>
          {tableExists === false && <TableInstructions />}
          {hasRLSError && <RLSInstructions />}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <div className="flex gap-2">
                      <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                      <Button type="button" variant="outline" onClick={generateSlug}>
                        Generar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Corta *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Descripción Completa</Label>
                  <Textarea
                    id="full_description"
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (USD) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 flex items-end gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_free"
                        checked={formData.is_free}
                        onCheckedChange={(checked) => handleSwitchChange("is_free", checked)}
                      />
                      <Label htmlFor="is_free">Gratis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                      />
                      <Label htmlFor="featured">Destacado</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolución</Label>
                    <Input
                      id="resolution"
                      name="resolution"
                      value={formData.resolution}
                      onChange={handleChange}
                      placeholder="Ej: 3840x2160 (4K)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Ej: 0:10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ae_version">Versión After Effects</Label>
                    <Input
                      id="ae_version"
                      name="ae_version"
                      value={formData.ae_version}
                      onChange={handleChange}
                      placeholder="Ej: CC 2020 o superior"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plugins">Plugins Requeridos</Label>
                    <Input
                      id="plugins"
                      name="plugins"
                      value={formData.plugins}
                      onChange={handleChange}
                      placeholder="Ej: Trapcode Particular, Element 3D"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instrucciones de Uso</Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archivos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Imagen de Portada *</Label>
                  <Input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} required />
                  <p className="text-xs text-muted-foreground">Recomendado: 1920x1080px, formato JPG o PNG</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_file">Archivo del Producto *</Label>
                  <Input
                    id="product_file"
                    type="file"
                    accept=".zip,.aep,.mov,.mp4"
                    onChange={handleProductFileChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Formatos aceptados: ZIP, AEP, MOV, MP4</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/admin/products">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || hasRLSError || tableExists === false}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Producto"
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
