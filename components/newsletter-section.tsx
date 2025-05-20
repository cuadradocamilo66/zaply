"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el email a tu servicio de newsletter
    setIsSubmitted(true)
  }

  return (
    <section className="bg-muted/30 py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Mantente actualizado</h2>
          <p className="text-muted-foreground md:text-lg">
            Suscríbete para recibir notificaciones sobre nuevas plantillas, tutoriales y ofertas especiales.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-green-500">
              <Check className="h-5 w-5" />
              <span>¡Gracias por suscribirte!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Tu dirección de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sm:flex-1"
              />
              <Button type="submit">Suscribirse</Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground">
            Respetamos tu privacidad. No compartiremos tu información con terceros.
          </p>
        </div>
      </div>
    </section>
  )
}
