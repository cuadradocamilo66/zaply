"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, AlertTriangle, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResetDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const { toast } = useToast()

  const handleReset = async () => {
    // Confirmación adicional
    if (
      !window.confirm(
        "¿Estás seguro? Esta acción eliminará TODAS las plantillas de la base de datos y no se puede deshacer.",
      )
    ) {
      return
    }

    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/reset-database", { method: "POST" })
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
        toast({
          title: "Base de datos reiniciada",
          description: data.message,
        })
      } else {
        setResult({ success: false, error: data.error })
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message })
      toast({
        title: "Error",
        description: "No se pudo reiniciar la base de datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Reiniciar Base de Datos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Reiniciar Base de Datos
          </CardTitle>
          <CardDescription>
            Esta acción eliminará TODAS las plantillas de la base de datos. Esta operación no se puede deshacer. Después
            de reiniciar la base de datos, deberás sincronizar las plantillas nuevamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleReset} disabled={isLoading} variant="destructive" className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Trash2 className="h-4 w-4 animate-pulse" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Reiniciar Base de Datos
              </>
            )}
          </Button>

          {result && (
            <div
              className={`mt-4 p-4 rounded-md ${
                result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-start gap-2">
                {result.success ? (
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{result.success ? "Operación exitosa" : "Error"}</p>
                  <p>{result.message || result.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Pasos recomendados:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Reiniciar la base de datos (esta acción)</li>
              <li>Ir a la página de sincronización de plantillas</li>
              <li>Sincronizar las plantillas desde el código</li>
              <li>Verificar que las plantillas aparezcan en el editor</li>
            </ol>
          </div>

          <div className="mt-4 flex gap-2">
            <Link href="/admin/templates/sync">
              <Button variant="outline">Ir a Sincronizar Plantillas</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">Volver al Panel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
