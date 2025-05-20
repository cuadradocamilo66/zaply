"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { getCategories } from "@/lib/templates"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function CategoryShowcase() {
  const categories = getCategories()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  return (
    <section className="container px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explora por Categoría</h2>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Encuentra la plantilla perfecta para tu proyecto específico.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card
              className={cn(
                "overflow-hidden h-full template-card-hover-effect transition-all duration-500 relative",
                hoveredId === category.id && isDarkTheme && "neon-glow-amber dark-hover-card-amber",
                hoveredId === category.id && !isDarkTheme && "light-hover-card-amber",
              )}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Efecto de fondo para hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none z-10",
                  hoveredId === category.id && "opacity-100",
                  isDarkTheme
                    ? "bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-amber-500/30"
                    : "bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 border border-amber-200",
                )}
              ></div>

              {/* Efecto de brillo neón en modo oscuro */}
              {isDarkTheme && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none blur-xl z-0",
                    hoveredId === category.id && "opacity-40",
                  )}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(245, 158, 11, 0.5) 0%, rgba(245, 158, 11, 0) 70%)",
                  }}
                ></div>
              )}

              <div className="relative aspect-square z-20">
                <Image
                  src={category.imageUrl || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 transition-all duration-300",
                    hoveredId === category.id && isDarkTheme && "from-black/80 to-transparent/90",
                    hoveredId === category.id && !isDarkTheme && "from-black/60 to-transparent/80",
                  )}
                >
                  <h3
                    className={cn(
                      "text-white font-medium transition-all duration-300",
                      hoveredId === category.id && isDarkTheme && "text-amber-200 translate-y-[-4px]",
                      hoveredId === category.id && !isDarkTheme && "text-amber-50 translate-y-[-4px]",
                    )}
                  >
                    {category.name}
                  </h3>
                  <p
                    className={cn(
                      "text-white/70 text-sm mt-1 transition-all duration-300",
                      hoveredId === category.id && isDarkTheme && "text-amber-200/80",
                      hoveredId === category.id && !isDarkTheme && "text-amber-50/90",
                    )}
                  >
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
