"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

interface ProductData {
  id: string
  name: string
  slug: string
  description: string
  full_description: string | null
  price: number
  category: string | null
  thumbnail_url: string
  file_url: string
  file_size: number | null
  resolution: string | null
  duration: string | null
  ae_version: string | null
  plugins: string | null
  instructions: string | null
  is_free: boolean
  featured: boolean
  preview_images: string[] | null
  features: string[] | null
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<ProductData | null>(null)
  const [originalData, setOriginalData] = useState<ProductData | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) {
          throw new Error(`Error al cargar el producto: ${error.message}`)
        }

        if (!data) {
          throw new Error("Producto no encontrado")
        }

        setFormData(data)
        setOriginalData(data)
        setThumbnailPreview(data.thumbnail_url)
      } catch (error: any) {
        console.error("Error fetching product:", error)
        setError(error.message || "Error al cargar el producto")
        toast({
          title: "Error",
          description: error.message || "No se pudo cargar el producto",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => (prev ? { ...prev, [name]: checked } : null))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)

      // Crear una URL para previsualizar la imagen
      const objectUrl = URL.createObjectURL(file)
      setThumbnailPreview(objectUrl)

      // Limpiar la URL cuando el componente se desmonte
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductFile(e.target.files[0])
    }
  }

  const generateSlug = () => {
    if (formData?.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => (prev ? { ...prev, slug } : null))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    try {
      setIsSubmitting(true)
      setError(null)

      if (!formData.name || !formData.slug || !formData.price) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      let thumbnailUrl = formData.thumbnail_url
      let fileUrl = formData.file_url

      // Si hay un nuevo archivo de miniatura, súbelo
      if (thumbnailFile) {
        const thumbnailExt = thumbnailFile.name.split(".").pop()
        const thumbnailPath = `thumbnails/${formData.slug}-${Date.now()}.${thumbnailExt}`

        const { error: thumbnailError } = await supabase.storage.from("products").upload(thumbnailPath, thumbnailFile)

        if (thumbnailError) {
          throw new Error(`Error al subir la imagen: ${thumbnailError.message}`)
        }

        const { data: thumbnailData } = supabase.storage.from("products").getPublicUrl(thumbnailPath)

        thumbnailUrl = thumbnailData.publicUrl
      }

      // Si hay un nuevo archivo de producto, súbelo
      if (productFile) {
        const productExt = productFile.name.split(".").pop()
        const productPath = `files/${formData.slug}-${Date.now()}.${productExt}`

        const { error: productError } = await supabase.storage.from("products").upload(productPath, productFile)

        if (productError) {
          throw new Error(`Error al subir el archivo del producto: ${productError.message}`)
        }

        const { data: productData } = supabase.storage.from("products").getPublicUrl(productPath)

        fileUrl = productData.publicUrl
      }

      // Actualizar el producto en la base de datos
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        full_description: formData.full_description,
        price: Number(formData.price),
        category: formData.category,
        thumbnail_url: thumbnailUrl,
        file_url: fileUrl,
        file_size: productFile ? productFile.size : formData.file_size,
        resolution: formData.resolution,
        duration: formData.duration,
        ae_version: formData.ae_version,
        plugins: formData.plugins,
        instructions: formData.instructions,
        is_free: formData.is_free,
        featured: formData.featured,
      }

      const { error: updateError } = await supabase.from("products").update(productData).eq("id", id)

      if (updateError) {
        throw new Error(`Error al actualizar el producto: ${updateError.message}`)
      }

      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })

      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      setError(error.message || "No se pudo actualizar el producto")
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando producto...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-medium mb-2">No se pudo cargar el producto</p>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/admin/products">
              <Button>Volver a Productos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No se encontró el producto solicitado</p>
            <Link href="/admin/products">
              <Button>Volver a Productos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Producto</h1>
      </div>

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
                value={formData.full_description || ""}
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
                <Input id="category" name="category" value={formData.category || ""} onChange={handleChange} />
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
                  value={formData.resolution || ""}
                  onChange={handleChange}
                  placeholder="Ej: 3840x2160 (4K)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration || ""}
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
                  value={formData.ae_version || ""}
                  onChange={handleChange}
                  placeholder="Ej: CC 2020 o superior"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plugins">Plugins Requeridos</Label>
                <Input
                  id="plugins"
                  name="plugins"
                  value={formData.plugins || ""}
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
                value={formData.instructions || ""}
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
              <Label htmlFor="thumbnail">Imagen de Portada</Label>
              {thumbnailPreview && (
                <div className="relative w-full aspect-video mb-4 border rounded-md overflow-hidden">
                  <Image
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} />
              <p className="text-xs text-muted-foreground">
                Recomendado: 1920x1080px, formato JPG o PNG. Dejar en blanco para mantener la imagen actual.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_file">Archivo del Producto</Label>
              <Input id="product_file" type="file" accept=".zip,.aep,.mov,.mp4" onChange={handleProductFileChange} />
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: ZIP, AEP, MOV, MP4. Dejar en blanco para mantener el archivo actual.
              </p>
              {formData.file_url && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <p className="text-xs">
                    Archivo actual:{" "}
                    <a
                      href={formData.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {formData.file_url.split("/").pop()}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
