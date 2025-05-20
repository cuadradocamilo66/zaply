"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

export default function NewBlogPost() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [category, setCategory] = useState("")
  const [author, setAuthor] = useState("")
  const [readTime, setReadTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  // Generar slug automáticamente a partir del título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-"),
    )
  }

  async function handleSave() {
    if (!title || !slug || !excerpt) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el título, slug y extracto",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          category,
          author,
          readTime,
          published,
          featured,
          date: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Entrada creada",
        description: "La entrada del blog ha sido creada correctamente",
      })

      router.push("/admin/blog")
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la entrada del blog",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Nueva Entrada de Blog</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              window.open(
                `/blog/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`,
                "_blank",
              )
            }
          >
            <Eye className="h-4 w-4" />
            Vista previa
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={title} onChange={handleTitleChange} placeholder="Título de la entrada" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="titulo-de-la-entrada"
                />
                <p className="text-xs text-muted-foreground">La URL será: yourdomain.com/blog/{slug}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extracto</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descripción de la entrada"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenido de la entrada (soporta Markdown)"
                  rows={15}
                />
                <p className="text-xs text-muted-foreground">Puedes usar Markdown para dar formato al contenido</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Imagen de portada</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="URL de la imagen de portada"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Categoría de la entrada"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
