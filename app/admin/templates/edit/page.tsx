"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { getAllTemplates } from "@/lib/templates"

export default function EditTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setIsLoading(true)

        // Intentar obtener templates de la base de datos
        const { data: dbTemplates, error } = await supabase.from("products").select("*").order("name")

        if (error) {
          console.error("Error al obtener templates de la base de datos:", error)

          // Si hay error, usar los templates estáticos
          const staticTemplates = getAllTemplates().map((template) => ({
            id: template.id,
            name: template.title,
            slug: template.slug,
            description: template.description,
            full_description: template.fullDescription,
            category: template.category,
            thumbnail_url: template.thumbnailUrl,
            file_url: template.videoUrl,
            preview_images: template.previewImages,
            price: template.price,
            is_free: template.isFree,
            featured: template.featured,
            resolution: template.resolution,
            duration: template.duration,
            ae_version: template.aeVersion,
            plugins: template.plugins,
            features: template.features,
            instructions: template.instructions,
          }))

          setTemplates(staticTemplates)
          if (staticTemplates.length > 0) {
            setSelectedTemplate(staticTemplates[0].id)
          }
        } else {
          // Si hay datos en la base de datos, usarlos
          if (dbTemplates && dbTemplates.length > 0) {
            setTemplates(dbTemplates)
            setSelectedTemplate(dbTemplates[0].id)
          } else {
            // Si no hay datos en la base de datos, usar los templates estáticos
            const staticTemplates = getAllTemplates().map((template) => ({
              id: template.id,
              name: template.title,
              slug: template.slug,
              description: template.description,
              full_description: template.fullDescription,
              category: template.category,
              thumbnail_url: template.thumbnailUrl,
              file_url: template.videoUrl,
              preview_images: template.previewImages,
              price: template.price,
              is_free: template.isFree,
              featured: template.featured,
              resolution: template.resolution,
              duration: template.duration,
              ae_version: template.aeVersion,
              plugins: template.plugins,
              features: template.features,
              instructions: template.instructions,
            }))

            setTemplates(staticTemplates)
            if (staticTemplates.length > 0) {
              setSelectedTemplate(staticTemplates[0].id)
            }
          }
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [supabase])

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => (template.id === selectedTemplate ? { ...template, [name]: value } : template)),
    )
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === selectedTemplate ? { ...template, [name]: Number.parseFloat(value) || 0 } : template,
      ),
    )
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => (template.id === selectedTemplate ? { ...template, [name]: checked } : template)),
    )
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const featuresArray = e.target.value.split("\n").filter((line) => line.trim() !== "")

    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === selectedTemplate ? { ...template, features: featuresArray } : template,
      ),
    )
  }

  const handlePreviewImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const imagesArray = e.target.value.split("\n").filter((line) => line.trim() !== "")

    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === selectedTemplate ? { ...template, preview_images: imagesArray } : template,
      ),
    )
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Verificar si existe la tabla
      const { error: tableCheckError } = await supabase.from("products").select("*", { count: "exact", head: true })

      if (tableCheckError) {
        // La tabla no existe, intentar crearla
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY,
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
          
          -- Habilitar RLS
          ALTER TABLE products ENABLE ROW LEVEL SECURITY;
          
          -- Crear política para permitir acceso
          CREATE POLICY "Allow full access to products" ON products FOR ALL USING (true);
        `

        // Ejecutar SQL para crear la tabla
        const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

        if (createError) {
          throw new Error(`Error al crear la tabla: ${createError.message}`)
        }
      }

      // Guardar todos los templates
      const { error } = await supabase.from("products").upsert(templates, {
        onConflict: "id",
        ignoreDuplicates: false,
      })

      if (error) {
        throw new Error(`Error al guardar los templates: ${error.message}`)
      }

      toast({
        title: "Éxito",
        description: "Templates guardados correctamente",
      })
    } catch (error: any) {
      console.error("Error al guardar:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar los templates",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedTemplateData = templates.find((template) => template.id === selectedTemplate) || null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Templates</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-select">Template</Label>
              <select
                id="template-select"
                className="w-full p-2 border rounded-md"
                value={selectedTemplate || ""}
                onChange={handleTemplateChange}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTemplateData && (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="details">Detalles Técnicos</TabsTrigger>
            <TabsTrigger value="media">Medios</TabsTrigger>
          </TabsList>

          {/* Pestaña Información Básica */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" value={selectedTemplateData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={selectedTemplateData.slug} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Corta</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={selectedTemplateData.description}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Descripción Completa</Label>
                  <Textarea
                    id="full_description"
                    name="full_description"
                    value={selectedTemplateData.full_description || ""}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      name="category"
                      value={selectedTemplateData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={selectedTemplateData.price}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_free"
                      checked={selectedTemplateData.is_free}
                      onCheckedChange={(checked) => handleSwitchChange("is_free", checked)}
                    />
                    <Label htmlFor="is_free">Es gratuito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={selectedTemplateData.featured}
                      onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                    />
                    <Label htmlFor="featured">Destacado</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Detalles Técnicos */}
          <TabsContent value="details">
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
                      value={selectedTemplateData.resolution}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={selectedTemplateData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ae_version">Versión After Effects</Label>
                    <Input
                      id="ae_version"
                      name="ae_version"
                      value={selectedTemplateData.ae_version}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plugins">Plugins Requeridos</Label>
                    <Input
                      id="plugins"
                      name="plugins"
                      value={selectedTemplateData.plugins || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instrucciones</Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    value={selectedTemplateData.instructions || ""}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Características (una por línea)</Label>
                  <Textarea
                    id="features"
                    value={(selectedTemplateData.features || []).join("\n")}
                    onChange={handleFeaturesChange}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Medios */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Medios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">URL de la Miniatura</Label>
                  <Input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    value={selectedTemplateData.thumbnail_url}
                    onChange={handleInputChange}
                  />
                  {selectedTemplateData.thumbnail_url && (
                    <div className="mt-2 relative w-full h-40 border rounded-md overflow-hidden">
                      <img
                        src={selectedTemplateData.thumbnail_url || "/placeholder.svg"}
                        alt="Miniatura"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_url">URL del Archivo</Label>
                  <Input
                    id="file_url"
                    name="file_url"
                    value={selectedTemplateData.file_url}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preview_images">Imágenes de Vista Previa (una URL por línea)</Label>
                  <Textarea
                    id="preview_images"
                    value={(selectedTemplateData.preview_images || []).join("\n")}
                    onChange={handlePreviewImagesChange}
                    rows={6}
                  />
                  {selectedTemplateData.preview_images && selectedTemplateData.preview_images.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedTemplateData.preview_images.map((url: string, index: number) => (
                        <div key={index} className="relative h-24 border rounded-md overflow-hidden">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Vista previa ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Templates
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
