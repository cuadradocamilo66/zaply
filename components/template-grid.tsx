"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllTemplates } from "@/lib/templates"
import type { Template } from "@/lib/templates"
import { useFilters } from "./filters-context"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface TemplateGridProps {
  templates?: Template[]
}

export default function TemplateGrid({ templates: propTemplates }: TemplateGridProps) {
  const [allTemplates, setAllTemplates] = useState<Template[]>(propTemplates || [])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const { filters } = useFilters()

  // Cargar templates si no se proporcionan como props
  useEffect(() => {
    if (!propTemplates) {
      const loadTemplates = async () => {
        try {
          const templates = await getAllTemplates()
          setAllTemplates(templates || [])
        } catch (error) {
          console.error("Error al cargar templates:", error)
          setAllTemplates([])
        }
      }
      loadTemplates()
    }
  }, [propTemplates])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (!Array.isArray(allTemplates)) {
      setFilteredTemplates([])
      return
    }

    let result = [...allTemplates]

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (template) =>
          template.title.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.category.toLowerCase().includes(searchLower),
      )
    }

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      result = result.filter((template) => filters.categories.includes(template.category))
    }

    // Filtrar por precio
    if (filters.freeOnly) {
      result = result.filter((template) => template.isFree)
    } else {
      result = result.filter(
        (template) => template.price >= filters.priceRange[0] && template.price <= filters.priceRange[1],
      )
    }

    // Filtrar por resolución
    if (filters.resolutions.length > 0) {
      result = result.filter((template) => {
        if (filters.resolutions.includes("4K") && template.resolution.includes("4K")) return true
        if (filters.resolutions.includes("Full HD (1080p)") && template.resolution.includes("1080")) return true
        if (filters.resolutions.includes("HD (720p)") && template.resolution.includes("720")) return true
        return false
      })
    }

    // Filtrar por duración
    if (filters.durations.length > 0) {
      result = result.filter((template) => {
        const duration = parseDuration(template.duration)
        if (filters.durations.includes("Corta (< 10s)") && duration < 10) return true
        if (filters.durations.includes("Media (10-30s)") && duration >= 10 && duration <= 30) return true
        if (filters.durations.includes("Larga (> 30s)") && duration > 30) return true
        return false
      })
    }

    // Filtrar por plugins
    if (filters.plugins.length > 0) {
      result = result.filter((template) => {
        if (filters.plugins.includes("Sin plugins") && !template.plugins) return true
        if (template.plugins) {
          return filters.plugins.some((plugin) => plugin !== "Sin plugins" && template.plugins?.includes(plugin))
        }
        return false
      })
    }

    setFilteredTemplates(result)
  }, [filters, allTemplates])

  // Función para parsear la duración en segundos
  const parseDuration = (duration: string): number => {
    // Si es un rango, tomar el valor máximo
    if (duration.includes("-")) {
      const parts = duration.split("-")
      return parseDuration(parts[1].trim())
    }

    // Convertir "0:10" a segundos
    if (duration.includes(":")) {
      const [minutes, seconds] = duration.split(":").map(Number)
      return minutes * 60 + seconds
    }

    // Si solo dice "por título" o similar, asumir duración media
    if (duration.includes("por")) {
      return 15
    }

    // Intentar extraer números
    const match = duration.match(/\d+/)
    return match ? Number.parseInt(match[0]) : 0
  }

  return (
    <div className="space-y-6">
      {!Array.isArray(filteredTemplates) || filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No se encontraron plantillas</h3>
          <p className="text-muted-foreground max-w-md">
            No hay plantillas que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
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
                      {template.isFree ? "Gratis" : `$${template.price.toFixed(2)}`}
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
      )}
    </div>
  )
}
