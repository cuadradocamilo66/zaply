"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes"

interface Page {
  id: string
  title: string
  slug: string
  visible: boolean
  order: number
}

export default function Header() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [pages, setPages] = React.useState<Page[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClientComponentClient()

  // Añadir un intervalo para actualizar las páginas periódicamente
  React.useEffect(() => {
    fetchPages()

    // Actualizar las páginas cada 5 segundos para reflejar cambios
    const interval = setInterval(() => {
      fetchPages()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Modificar la función fetchPages para corregir la ruta de "Acerca de"
  async function fetchPages() {
    try {
      console.log("Fetching pages for navigation...")

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("visible", true) // Solo obtener páginas visibles
        .order("order")

      if (error) {
        throw error
      }

      console.log("Pages fetched:", data)

      // Eliminar duplicados basados en slug
      const uniquePages = data ? removeDuplicates(data, "slug") : []

      // Filtrar para asegurarnos de que no haya dos "Acerca de"
      const filteredPages = uniquePages.filter(
        (page) => page.slug !== "/about", // Eliminar la página /about
      )

      // Corregir la ruta de "Acerca de" si existe
      const correctedPages = filteredPages.map((page) => {
        if (page.title === "Acerca de" || page.slug === "/acerca-de") {
          return { ...page, slug: "/paginas/acerca-de" }
        }
        return page
      })

      setPages(correctedPages)
    } catch (error) {
      console.error("Error fetching pages:", error)
      // Fallback a navegación estática en caso de error
      setPages([
        { id: "1", title: "Inicio", slug: "/", visible: true, order: 1 },
        { id: "2", title: "Plantillas", slug: "/templates", visible: true, order: 2 },
        { id: "3", title: "Plantillas Gratuitas", slug: "/free-templates", visible: true, order: 3 },
        { id: "4", title: "Categorías", slug: "/categories", visible: true, order: 4 },
        { id: "5", title: "Blog", slug: "/blog", visible: true, order: 5 },
        { id: "6", title: "Ejemplos", slug: "/examples", visible: true, order: 6 },
        { id: "7", title: "Acerca de", slug: "/paginas/acerca-de", visible: true, order: 7 },
        { id: "8", title: "Contacto", slug: "/contact", visible: true, order: 8 },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar duplicados basados en una propiedad
  function removeDuplicates(array: any[], key: string) {
    return array.filter((item, index, self) => index === self.findIndex((t) => t[key] === item[key]))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Zaply</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {!loading &&
              pages.map((page) => (
                <Link
                  key={page.id}
                  href={page.slug}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === page.slug ? "text-foreground" : "text-foreground/60",
                    theme === "light" ? "hover:text-gray-900" : "",
                  )}
                >
                  {page.title}
                </Link>
              ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="ml-auto hidden h-8 lg:flex">
              <Link href="/contact">Contacto</Link>
            </Button>
          </div>
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
