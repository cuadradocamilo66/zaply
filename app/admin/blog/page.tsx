"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Search, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  date: string
  author: string
  category: string
  published: boolean
  featured: boolean
  created_at: string
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all")

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    initializeDatabase()
  }, [])

  async function initializeDatabase() {
    try {
      setIsLoading(true)

      // Crear tablas si no existen
      await createBlogTablesIfNotExist()

      // Cargar posts
      await fetchPosts()
    } catch (error) {
      console.error("Error initializing blog database:", error)
      toast({
        title: "Error",
        description: "No se pudo inicializar la base de datos del blog",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function createBlogTablesIfNotExist() {
    try {
      // Crear tabla blog_posts si no existe
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT NOT NULL,
          content TEXT,
          coverImage TEXT,
          date TEXT,
          author TEXT,
          category TEXT,
          readTime INTEGER DEFAULT 5,
          featured BOOLEAN DEFAULT false,
          published BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Habilitar RLS pero permitir acceso completo
      await supabase.query(`
        ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON blog_posts;
        CREATE POLICY "Allow full access to all users" ON blog_posts FOR ALL USING (true)
      `)

      // Crear tabla blog_categories si no existe
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS blog_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Habilitar RLS pero permitir acceso completo
      await supabase.query(`
        ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON blog_categories;
        CREATE POLICY "Allow full access to all users" ON blog_categories FOR ALL USING (true)
      `)

      console.log("Tablas del blog creadas correctamente")
    } catch (error) {
      console.error("Error creating blog tables:", error)
      throw error
    }
  }

  async function fetchPosts() {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las entradas del blog",
        variant: "destructive",
      })
    }
  }

  async function togglePostPublished(post: BlogPost) {
    try {
      const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id)

      if (error) throw error

      setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)))

      toast({
        title: "Entrada actualizada",
        description: `La entrada "${post.title}" ahora está ${!post.published ? "publicada" : "en borrador"}`,
      })
    } catch (error) {
      console.error("Error toggling post published:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la entrada",
        variant: "destructive",
      })
    }
  }

  async function togglePostFeatured(post: BlogPost) {
    try {
      const { error } = await supabase.from("blog_posts").update({ featured: !post.featured }).eq("id", post.id)

      if (error) throw error

      setPosts(posts.map((p) => (p.id === post.id ? { ...p, featured: !p.featured } : p)))

      toast({
        title: "Entrada actualizada",
        description: `La entrada "${post.title}" ${!post.featured ? "ahora es destacada" : "ya no es destacada"}`,
      })
    } catch (error) {
      console.error("Error toggling post featured:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado destacado de la entrada",
        variant: "destructive",
      })
    }
  }

  async function deletePost(postId: string) {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

      if (error) throw error

      setPosts(posts.filter((p) => p.id !== postId))

      toast({
        title: "Entrada eliminada",
        description: "La entrada ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la entrada",
        variant: "destructive",
      })
    }
  }

  // Filtrar posts según el término de búsqueda y el filtro seleccionado
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "published") return matchesSearch && post.published
    if (filter === "draft") return matchesSearch && !post.published
    if (filter === "featured") return matchesSearch && post.featured

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Gestor de Blog</h1>
        </div>
        <Link href="/admin/blog/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar entradas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todas
          </Button>
          <Button
            variant={filter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("published")}
          >
            Publicadas
          </Button>
          <Button variant={filter === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilter("draft")}>
            Borradores
          </Button>
          <Button
            variant={filter === "featured" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("featured")}
          >
            Destacadas
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No hay entradas que coincidan con tu búsqueda</p>
            <Link href="/admin/blog/new">
              <Button>Crear nueva entrada</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={cn("overflow-hidden", !post.published && "opacity-70")}>
              {post.coverImage && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg line-clamp-2">{post.title}</span>
                  <div className="flex gap-1">
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Publicada" : "Borrador"}
                    </Badge>
                    {post.featured && <Badge variant="secondary">Destacada</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Categoría: {post.category || "Sin categoría"}</span>
                  <span>{new Date(post.date || post.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <Link href={`/admin/blog/edit/${post.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => togglePostPublished(post)}
                    >
                      {post.published ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Borrador
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Publicar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
