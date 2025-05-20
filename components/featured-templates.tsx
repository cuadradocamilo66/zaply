"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Template } from "@/lib/templates"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface FeaturedTemplatesProps {
  templates: Template[]
}

export default function FeaturedTemplates({ templates = [] }: FeaturedTemplatesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  if (!templates || templates.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Plantillas Destacadas</h2>
        <p className="text-muted-foreground">No hay plantillas destacadas disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Plantillas Destacadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.slug}`}>
            <Card
              className={cn(
                "overflow-hidden template-card-hover-effect transition-all duration-500 relative",
                hoveredId === template.id && isDarkTheme && "neon-glow-blue dark-hover-card-blue",
                hoveredId === template.id && !isDarkTheme && "light-hover-card-blue",
              )}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Efecto de fondo para hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none z-10",
                  hoveredId === template.id && "opacity-100",
                  isDarkTheme
                    ? "bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-blue-900/30 border border-blue-500/30"
                    : "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 border border-blue-200",
                )}
              ></div>

              {/* Efecto de brillo neón en modo oscuro */}
              {isDarkTheme && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none blur-xl z-0",
                    hoveredId === template.id && "opacity-40",
                  )}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                  }}
                ></div>
              )}

              <div
                className="relative aspect-video video-hover-container z-20"
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Image
                  src={template.thumbnailUrl || "/placeholder.svg"}
                  alt={template.title}
                  fill
                  className="object-cover"
                />

                {hoveredId === template.id && template.videoUrl && (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover video-preview"
                  >
                    <source src={template.videoUrl} type="video/mp4" />
                  </video>
                )}

                <div className="absolute top-2 left-2 z-30">
                  <Badge
                    className={cn(
                      "transition-all duration-300",
                      hoveredId === template.id && isDarkTheme && "bg-blue-900 text-blue-100 hover:bg-blue-800",
                      hoveredId === template.id && !isDarkTheme && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    )}
                  >
                    {template.category}
                  </Badge>
                </div>

                <div className="absolute bottom-2 right-2 z-30">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "transition-all duration-300",
                      hoveredId === template.id && isDarkTheme && "bg-blue-800/60 text-blue-100 hover:bg-blue-700/60",
                      hoveredId === template.id && !isDarkTheme && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    )}
                  >
                    ${template.price.toFixed(2)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 relative z-20">
                <h3
                  className={cn(
                    "font-medium line-clamp-1 transition-colors duration-300",
                    hoveredId === template.id && isDarkTheme && "text-blue-300",
                    hoveredId === template.id && !isDarkTheme && "text-blue-700",
                  )}
                >
                  {template.title}
                </h3>
                <p
                  className={cn(
                    "text-sm text-muted-foreground line-clamp-2 mt-1 transition-colors duration-300",
                    hoveredId === template.id && isDarkTheme && "text-blue-200/80",
                    hoveredId === template.id && !isDarkTheme && "text-blue-700/80",
                  )}
                >
                  {template.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
