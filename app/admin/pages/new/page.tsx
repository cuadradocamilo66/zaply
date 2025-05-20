"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    visible: true,
    order: 10,
    featured_image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Generar slug automáticamente desde el título
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({ ...prev, slug: `/${slug}` }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, visible: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar datos
      if (!formData.title || !formData.slug) {
        toast({
          title: "Error",
          description: "El título y la URL son obligatorios",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Asegurarse de que el slug comienza con /
      const slug = formData.slug.startsWith("/") ? formData.slug : `/${formData.slug}`

      // Insertar la página
      const { data, error } = await supabase.from("pages").insert([
        {
          title: formData.title,
          slug,
          content: formData.content,
          meta_title: formData.meta_title || formData.title,
          meta_description: formData.meta_description,
          visible: formData.visible,
          order: formData.order,
          featured_image: formData.featured_image,
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Página creada",
        description: "La página se ha creado correctamente",
      })

      router.push("/admin/pages")
      router.refresh()
    } catch (error) {
      console.error("Error creating page:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear la página",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/admin/pages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nueva Página</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Información básica de la página</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título de la página"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL</Label>
                  <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="/mi-pagina" />
                  <p className="text-sm text-muted-foreground">
                    La URL debe comenzar con / y no debe contener espacios ni caracteres especiales.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">Imagen Destacada (URL)</Label>
                  <Input
                    id="featured_image"
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="visible" checked={formData.visible} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="visible">Visible en navegación</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contenido</CardTitle>
                <CardDescription>Contenido HTML de la página</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  placeholder="<div>Contenido de la página...</div>"
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Puedes usar HTML para dar formato al contenido. También puedes usar clases de Tailwind CSS.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Información para motores de búsqueda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Título</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="Título para SEO"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Descripción</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción para SEO"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              "Guardar Página"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
