import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, Clock, Lock } from "lucide-react"

export default function DownloadErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string }
}) {
  const reason = searchParams.reason || "unknown"

  let title = "Error de Descarga"
  let description = "No se pudo procesar tu solicitud de descarga."
  let icon = <AlertTriangle className="h-16 w-16 text-red-500" />

  switch (reason) {
    case "expired":
      title = "Enlace Expirado"
      description = "El enlace de descarga ha expirado."
      icon = <Clock className="h-16 w-16 text-amber-500" />
      break
    case "limit":
      title = "Límite Alcanzado"
      description = "Has alcanzado el límite máximo de descargas para este producto."
      icon = <Lock className="h-16 w-16 text-amber-500" />
      break
    case "invalid":
      title = "Enlace Inválido"
      description = "El enlace de descarga no es válido o no existe."
      icon = <AlertTriangle className="h-16 w-16 text-red-500" />
      break
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{icon}</div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Si crees que esto es un error, por favor contáctanos con los detalles de tu compra.
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
