"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2 } from "lucide-react"

interface CheckoutFormProps {
  onSuccess: () => void
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsComplete(true)

    // Simular redirección a página de descarga
    setTimeout(() => {
      onSuccess()
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="text-xl font-bold">¡Pago completado!</h3>
        <p className="text-muted-foreground">
          Tu pedido ha sido procesado correctamente. Serás redirigido a la página de descarga en unos segundos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">Nombre</Label>
            <Input id="first-name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Apellido</Label>
            <Input id="last-name" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Información de pago</h3>

        <div className="space-y-2">
          <Label htmlFor="card-number">Número de tarjeta</Label>
          <Input id="card-number" placeholder="1234 5678 9012 3456" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Fecha de expiración</Label>
            <Input id="expiry" placeholder="MM/AA" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" required />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          "Completar compra"
        )}
      </Button>
    </form>
  )
}
