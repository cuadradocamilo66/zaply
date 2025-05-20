"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  post_count?: number
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setIsLoading(true)

      // Verificar si existe la tabla blog_categories
      const { error: tableCheckError } = await supabase
        .from("blog_categories")
        .select("id", { count: "exact", head: true })

      if (tableCheckError) {
        // La tabla no existe, mostrar mensaje
        toast({
          title: "Tabla no encontrada",
          description: "La tabla de categorías no existe. Por favor, crea primero la tabla de blog.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Obtener categorías con conteo de posts
      const { data, error } = await supabase.rpc("get_categories_with_post_count")

      if (error) {
        // Si falla el RPC, intentar obtener solo las categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .order("name", { ascending: true })

        if (categoriesError) throw categoriesError

        setCategories(categoriesData || [])
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addCategory() {
    if (!newCategory.trim()) return

    try {
      setIsSaving(true)

      const { data, error } = await supabase.from("blog_categories").insert({ name: newCategory.trim() }).select()

      if (error) throw error

      toast({
        title: "Categoría añadida",
        description: `La categoría "${newCategory}" ha sido añadida correctamente`,
      })

      setNewCategory("")
      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "No se pudo añadir la categoría",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function updateCategory() {
    if (!editingCategory) return

    try {
      setIsSaving(true)

      const { error } = await supabase
        .from("blog_categories")
        .update({ name: editingCategory.name })
        .eq("id", editingCategory.id)

      if (error) throw error

      toast({
        title: "Categoría actualizada",
        description: `La categoría ha sido actualizada correctamente`,
      })

      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteCategory(id: string, name: string) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)) {
      return
    }

    try {
      const { error } = await supabase.from("blog_categories").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Categoría eliminada",
        description: `La categoría "${name}" ha sido eliminada correctamente`,
      })

      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
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
          <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Añadir Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <Button
              onClick={addCategory}
              disabled={!newCategory.trim() || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Añadir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay categorías disponibles</div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                  {editingCategory?.id === category.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && updateCategory()}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" onClick={() => setEditingCategory(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" onClick={updateCategory} disabled={isSaving}>
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.slug}
                        </Badge>
                        {category.post_count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {category.post_count} {category.post_count === 1 ? "entrada" : "entradas"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategory(category.id, category.name)}
                          disabled={category.post_count ? category.post_count > 0 : false}
                          title={
                            category.post_count && category.post_count > 0
                              ? "No se puede eliminar una categoría con entradas"
                              : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
