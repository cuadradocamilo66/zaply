"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  ImageIcon,
  LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Loader2,
  Trash2,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  coverImage: string
  date: string
  author: string
  category: string
  readTime: number
  featured: boolean
  published: boolean
}

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    readTime: 5,
    featured: false,
    published: false,
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>("/placeholder.svg")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([
    "Tutoriales",
    "Consejos",
    "Tendencias",
    "Recursos",
    "Inspiración",
    "Noticias",
  ])
  const [newCategory, setNewCategory] = useState("")

  const contentRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPost()
    fetchCategories()
  }, [params.id])

  async function fetchPost() {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

      if (error) {
        throw error
      }

      if (data) {
        setPost(data)
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          category: data.category || "",
          author: data.author || "",
          readTime: data.readTime || 5,
          featured: data.featured || false,
          published: data.published || false,
        })
        setCoverImagePreview(data.coverImage || "/placeholder.svg")
      } else {
        toast({
          title: "Error",
          description: "No se encontró la entrada del blog",
          variant: "destructive",
        })
        router.push("/admin/blog")
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la entrada del blog",
        variant: "destructive",
      })
      router.push("/admin/blog")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const { data, error } = await supabase.from("blog_categories").select("name")

      if (!error && data && data.length > 0) {
        setCategories(data.map((cat) => cat.name))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setFormData((prev) => ({ ...prev, slug }))
  }

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setFormData((prev) => ({ ...prev, category: newCategory }))
      setNewCategory("")
    }
  }

  const insertToContent = (markdown: string) => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart
      const end = contentRef.current.selectionEnd
      const text = formData.content

      const newText = text.substring(0, start) + markdown + text.substring(end)
      setFormData((prev) => ({ ...prev, content: newText }))

      // Establecer el cursor después del texto insertado
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus()
          contentRef.current.selectionStart = start + markdown.length
          contentRef.current.selectionEnd = start + markdown.length
        }
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post) return

    try {
      setIsSubmitting(true)

      if (!formData.title || !formData.slug || !formData.excerpt) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      let coverImageUrl = post.coverImage

      // Si hay una nueva imagen de portada, subirla
      if (coverImage) {
        const fileExt = coverImage.name.split(".").pop()
        const filePath = `blog/${formData.slug}-${Date.now()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("products")
          .upload(filePath, coverImage)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from("products").getPublicUrl(filePath)

        coverImageUrl = urlData.publicUrl
      }

      // Actualizar la entrada del blog
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: coverImageUrl,
          author: formData.author,
          category: formData.category,
          readTime: formData.readTime,
          featured: formData.featured,
          published: formData.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id)

      if (error) throw error

      // Guardar la categoría si es nueva
      if (formData.category && !categories.includes(formData.category)) {
        await supabase.from("blog_categories").insert({ name: formData.category })
      }

      toast({
        title: "Entrada actualizada",
        description: "La entrada del blog se ha actualizado correctamente",
      })

      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error updating blog post:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la entrada del blog",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Entrada no encontrada</h2>
        <Link href="/admin/blog">
          <Button>Volver al blog</Button>
        </Link>
      </div>
    )
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
          <h1 className="text-2xl font-bold">Editar Entrada: {post.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.")) {
                supabase
                  .from("blog_posts")
                  .delete()
                  .eq("id", post.id)
                  .then(() => {
                    toast({
                      title: "Entrada eliminada",
                      description: "La entrada del blog se ha eliminado correctamente",
                    })
                    router.push("/admin/blog")
                  })
                  .catch((error) => {
                    toast({
                      title: "Error",
                      description: "No se pudo eliminar la entrada del blog",
                      variant: "destructive",
                    })
                  })
              }
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <div className="flex gap-2">
                  <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Ejemplo: mi-articulo-de-blog</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto *</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Breve descripción que aparecerá en las tarjetas y listados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <div className="flex gap-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Button type="button" variant="outline" onClick={() => setNewCategory("")}>
                    +
                  </Button>
                </div>
              </div>

              {newCategory !== "" && (
                <div className="space-y-2">
                  <Label htmlFor="newCategory">Nueva Categoría</Label>
                  <div className="flex gap-2">
                    <Input id="newCategory" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <Button type="button" variant="outline" onClick={addCategory}>
                      Añadir
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nombre del autor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime">Tiempo de lectura (min)</Label>
                <Input
                  id="readTime"
                  name="readTime"
                  type="number"
                  min="1"
                  value={formData.readTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Destacar en portada</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleSwitchChange("published", checked)}
                />
                <Label htmlFor="published">Publicado</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagen de Portada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Seleccionar imagen</Label>
                <Input id="coverImage" type="file" accept="image/*" onChange={handleCoverImageChange} />
                <p className="text-xs text-muted-foreground">Recomendado: 1200x630px, formato JPG o PNG</p>
              </div>

              <div className="relative aspect-video rounded-md overflow-hidden border border-input">
                <Image src={coverImagePreview || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertToContent("**texto en negrita**")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertToContent("*texto en cursiva*")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertToContent("\n# Título H1\n")}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertToContent("\n## Título H2\n")}>
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertToContent("\n### Título H3\n")}>
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("\n- Elemento de lista\n- Otro elemento\n")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("\n1. Primer elemento\n2. Segundo elemento\n")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("[texto del enlace](https://ejemplo.com)")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("![texto alternativo](https://ejemplo.com/imagen.jpg)")}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("\n```\ncódigo aquí\n```\n")}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertToContent("\n> Texto de la cita\n")}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="write">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Escribir</TabsTrigger>
                <TabsTrigger value="preview">Vista previa</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-4 pt-4">
                <Textarea
                  id="content"
                  name="content"
                  ref={contentRef}
                  value={formData.content}
                  onChange={handleChange}
                  rows={20}
                  placeholder="Escribe el contenido de tu artículo usando Markdown..."
                  className="font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4 pt-4">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none border rounded-md p-4">
                  {formData.content ? (
                    <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
                  ) : (
                    <p className="text-muted-foreground">No hay contenido para previsualizar</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
