"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SyncTemplatesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const { toast } = useToast()

  const handleSync = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/seed-templates")
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
        toast({
          title: "Éxito",
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
        description: "No se pudieron sincronizar las plantillas",
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
        <h1 className="text-2xl font-bold">Sincronizar Plantillas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sincronizar Plantillas del Código a la Base de Datos</CardTitle>
          <CardDescription>
            Esta acción tomará todas las plantillas definidas en el código (lib/templates.ts) y las sincronizará con la
            base de datos. Las plantillas existentes se actualizarán y se añadirán las nuevas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSync} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sincronizar Plantillas
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
                  <p className="font-medium">{result.success ? "Sincronización exitosa" : "Error de sincronización"}</p>
                  <p>{result.message || result.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">¿Qué hace esta función?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Lee todas las plantillas definidas en el código (lib/templates.ts)</li>
              <li>Crea la tabla "products" en la base de datos si no existe</li>
              <li>Inserta o actualiza todas las plantillas en la base de datos</li>
              <li>Mantiene los IDs originales para evitar duplicados</li>
            </ul>
          </div>

          <div className="mt-4">
            <Link href="/admin/templates/edit">
              <Button variant="outline">Ir a Editar Plantillas</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
