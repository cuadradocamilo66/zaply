"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Mail, MessageSquare, User } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario de forma no asíncrona
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      formRef.current?.reset()

      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 2000)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nombre completo
        </Label>
        <div className="relative">
          <Input id="name" placeholder="Tu nombre" required className="pl-10" />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Input id="email" type="email" placeholder="tu@email.com" required className="pl-10" />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium">
          Asunto
        </Label>
        <Input id="subject" placeholder="¿Sobre qué quieres hablar?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Mensaje
        </Label>
        <div className="relative">
          <Textarea
            id="message"
            placeholder="Escribe tu mensaje aquí..."
            rows={5}
            required
            className="resize-none pl-10 pt-8"
          />
          <MessageSquare className="absolute left-3 top-8 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isSubmitted}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : isSubmitted ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            ¡Mensaje enviado!
          </>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  )
}
