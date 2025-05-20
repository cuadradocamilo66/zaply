import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Download, Settings, Edit, Layout } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Plantillas disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Ventas totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Descargas totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Productos</CardTitle>
            <CardDescription>Administra las plantillas de After Effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Link href="/admin/products">
                <Button className="w-full">Ver todos los productos</Button>
              </Link>
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full">
                  Crear nuevo producto
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Contenido</CardTitle>
            <CardDescription>Administra las páginas y el blog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Link href="/admin/pages">
                <Button className="w-full flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Gestionar Páginas
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full">
                  Gestionar Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Ajustes generales de la tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Link href="/admin/settings">
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                <Settings className="h-4 w-4" />
                Configuración General
              </Button>
            </Link>
            <Link href="/admin/templates/edit">
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                <Edit className="h-4 w-4" />
                Editar Templates de Prueba
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
