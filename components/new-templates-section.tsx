"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Template } from "@/lib/templates"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface NewTemplatesSectionProps {
  templates: Template[]
}

export default function NewTemplatesSection({ templates = [] }: NewTemplatesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  if (!templates || templates.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nuevas Plantillas</h2>
          <Link href="/templates">
            <Button variant="ghost" className="gap-2">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">No hay plantillas nuevas disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nuevas Plantillas</h2>
        <Link href="/templates">
          <Button variant="ghost" className="gap-2">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.slug}`}>
            <Card
              className={cn(
                "overflow-hidden transition-all duration-300",
                hoveredId === template.id && "shadow-lg",
                hoveredId === template.id && isDarkTheme && "border-blue-500/50",
                hoveredId === template.id && !isDarkTheme && "border-blue-200",
              )}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative aspect-video">
                <Image
                  src={template.thumbnailUrl || "/placeholder.svg"}
                  alt={template.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    className={cn(
                      hoveredId === template.id && isDarkTheme && "bg-blue-900 text-blue-100",
                      hoveredId === template.id && !isDarkTheme && "bg-blue-100 text-blue-800",
                    )}
                  >
                    {template.category}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    Nuevo
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3
                  className={cn(
                    "font-medium line-clamp-1",
                    hoveredId === template.id && isDarkTheme && "text-blue-300",
                    hoveredId === template.id && !isDarkTheme && "text-blue-700",
                  )}
                >
                  {template.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
