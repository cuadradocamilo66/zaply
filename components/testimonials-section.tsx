"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "Motion Designer",
    content:
      "Las plantillas son de excelente calidad y muy fáciles de personalizar. He ahorrado horas de trabajo en mis proyectos.",
    avatar: "/professional-man-portrait.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Laura Martínez",
    role: "Creadora de Contenido",
    content:
      "Increíble relación calidad-precio. Las plantillas son modernas y profesionales, perfectas para mis videos de YouTube.",
    avatar: "/professional-woman-portrait.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Miguel Ángel",
    role: "Editor de Video",
    content:
      "He probado muchas plantillas de After Effects, pero estas son las más intuitivas y bien organizadas que he encontrado.",
    avatar: "/young-man-portrait.png",
    rating: 4,
  },
]

export default function TestimonialsSection() {
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="bg-muted/30 py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Descubre por qué los profesionales confían en nuestras plantillas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className={cn(
                "h-full transition-all duration-500 relative group",
                hoveredId === testimonial.id && isDarkTheme && "neon-glow-purple dark-hover-card",
                hoveredId === testimonial.id && !isDarkTheme && "light-hover-card",
              )}
              onMouseEnter={() => setHoveredId(testimonial.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Efecto de fondo para hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none",
                  hoveredId === testimonial.id && "opacity-100",
                  isDarkTheme
                    ? "bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 border border-purple-500/30"
                    : "bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200",
                )}
              ></div>

              {/* Efecto de brillo neón en modo oscuro */}
              {isDarkTheme && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none blur-xl",
                    hoveredId === testimonial.id && "opacity-40",
                  )}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 70%)",
                  }}
                ></div>
              )}

              <CardContent className="p-6 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    className={cn(
                      "transition-all duration-500",
                      hoveredId === testimonial.id &&
                        isDarkTheme &&
                        "ring-2 ring-purple-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3
                      className={cn(
                        "font-medium transition-colors duration-500",
                        hoveredId === testimonial.id && isDarkTheme && "text-purple-300",
                        hoveredId === testimonial.id && !isDarkTheme && "text-purple-700",
                      )}
                    >
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4 transition-colors duration-500",
                          i < testimonial.rating
                            ? hoveredId === testimonial.id && isDarkTheme
                              ? "fill-purple-400 text-purple-400"
                              : hoveredId === testimonial.id && !isDarkTheme
                                ? "fill-purple-600 text-purple-600"
                                : "fill-primary text-primary"
                            : "fill-muted text-muted",
                        )}
                      />
                    ))}
                </div>

                <p
                  className={cn(
                    "text-muted-foreground flex-1 transition-colors duration-500",
                    hoveredId === testimonial.id && isDarkTheme && "text-gray-200",
                    hoveredId === testimonial.id && !isDarkTheme && "text-gray-700",
                  )}
                >
                  {testimonial.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
