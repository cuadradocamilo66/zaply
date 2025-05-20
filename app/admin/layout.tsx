import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, ShoppingCart, Download, Settings, FileText, LayoutDashboard, Layout, Layers } from "lucide-react"

export const metadata: Metadata = {
  title: "Panel de Administración - Zaply",
  description: "Panel de administración para gestionar plantillas, pedidos y configuración del sitio.",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/admin" className="font-bold">
            Panel de Administración
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Ver Sitio</Button>
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-64 border-r bg-muted/40 p-4 hidden md:block">
          <nav className="flex flex-col gap-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Separator className="my-2" />
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Productos
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Pedidos
              </Button>
            </Link>
            <Link href="/admin/downloads">
              <Button variant="ghost" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Descargas
              </Button>
            </Link>
            <Separator className="my-2" />
            <Link href="/admin/pages">
              <Button variant="ghost" className="w-full justify-start">
                <Layout className="mr-2 h-4 w-4" />
                Páginas
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Blog
              </Button>
            </Link>
            <Link href="/admin/templates/edit">
              <Button variant="ghost" className="w-full justify-start">
                <Layers className="mr-2 h-4 w-4" />
                Secciones
              </Button>
            </Link>
            <Separator className="my-2" />
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}
