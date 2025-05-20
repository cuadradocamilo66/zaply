"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Loader2, ArrowRight } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DownloadItem {
  id: string
  product_id: string
  download_token: string
  product: {
    name: string
    thumbnail_url: string
  }
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró información de la sesión")
      setIsLoading(false)
      return
    }

    async function fetchOrderDetails() {
      try {
        // Buscar la orden por el ID de sesión de Stripe
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("id")
          .eq("stripe_session_id", sessionId)
          .single()

        if (orderError || !order) {
          throw new Error("No se encontró la orden")
        }

        // Buscar los enlaces de descarga
        const { data, error: downloadsError } = await supabase
          .from("downloads")
          .select(`
            id,
            product_id,
            download_token,
            product:products (
              name,
              thumbnail_url
            )
          `)
          .eq("order_id", order.id)

        if (downloadsError) {
          throw new Error("Error al obtener los enlaces de descarga")
        }

        setDownloads(data || [])
      } catch (err: any) {
        console.error("Error fetching order details:", err)
        setError(err.message || "Ocurrió un error al procesar tu pedido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, supabase])

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">Procesando tu pedido...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Error en el Pedido</CardTitle>
            <CardDescription className="text-center">
              Lo sentimos, ha ocurrido un problema al procesar tu pedido.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-muted-foreground">
              Si ya realizaste el pago y ves este mensaje, por favor contáctanos con tu número de referencia.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Gracias por tu compra!</CardTitle>
          <CardDescription>Tu pedido ha sido procesado correctamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Hemos enviado un correo electrónico con los detalles de tu compra y los enlaces de descarga.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Tus descargas:</h3>
            {downloads.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                  </div>
                  <Link href={`/download/${item.download_token}`} target="_blank">
                    <Button size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-1">
              Continuar comprando
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
