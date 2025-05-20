import TemplatesShowcase from "@/components/templates-showcase"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ejemplos - After Effects Templates",
  description: "Descubre cómo nuestras plantillas pueden transformar tus proyectos con ejemplos reales.",
}

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">Ejemplos de Plantillas</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualiza cómo nuestras plantillas pueden transformar tus proyectos con ejemplos reales
        </p>
      </div>

      <TemplatesShowcase />
    </div>
  )
}
