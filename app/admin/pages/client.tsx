"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface Page {
  id: string
  title: string
  slug: string
  visible: boolean
  order: number
  content?: string
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

interface PagesClientProps {
  initialPages: Page[]
}

export function PagesClient({ initialPages }: PagesClientProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Función para cambiar la visibilidad de una página
  async function toggleVisibility(page: Page) {
    try {
      const { error } = await supabase.from("pages").update({ visible: !page.visible }).eq("id", page.id)

      if (error) throw error

      // Actualizar el estado local
      setPages(pages.map((p) => (p.id === page.id ? { ...p, visible: !p.visible } : p)))

      toast({
        title: "Visibilidad actualizada",
        description: `La página "${page.title}" ahora está ${!page.visible ? "visible" : "oculta"}.`,
      })
    } catch (error) {
      console.error("Error toggling visibility:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la visibilidad de la página.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar una página
  async function deletePage() {
    if (!pageToDelete) return

    try {
      const { error } = await supabase.from("pages").delete().eq("id", pageToDelete.id)

      if (error) throw error

      // Actualizar el estado local
      setPages(pages.filter((p) => p.id !== pageToDelete.id))

      toast({
        title: "Página eliminada",
        description: `La página "${pageToDelete.title}" ha sido eliminada.`,
      })
    } catch (error) {
      console.error("Error deleting page:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la página.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPageToDelete(null)
    }
  }

  // Función para confirmar la eliminación
  function confirmDelete(page: Page) {
    setPageToDelete(page)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Páginas</h1>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Página
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Visibilidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No hay páginas creadas. Crea una nueva página para empezar.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.order}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => toggleVisibility(page)}>
                      {page.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      <span className="sr-only">{page.visible ? "Ocultar" : "Mostrar"}</span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/pages/edit/${page.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(page)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la página "{pageToDelete?.title}" y todos
              sus contenidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deletePage}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
