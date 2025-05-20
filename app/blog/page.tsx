"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Calendar, Clock, User } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { getBlogPosts } from "@/lib/blog"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredButton, setHoveredButton] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  const blogPosts = getBlogPosts()
  const featuredPost = blogPosts[0]
  const recentPosts = blogPosts.slice(1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para buscar posts
    console.log("Buscando:", searchQuery)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog y Tutoriales</h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Aprende técnicas de After Effects, consejos de diseño y mantente al día con las últimas tendencias.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-12">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Input
            type="search"
            placeholder="Buscar artículos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Artículo destacado */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Artículo Destacado</h2>
        <Link href={`/blog/${featuredPost.slug}`}>
          <Card
            className={cn(
              "overflow-hidden transition-all duration-500 relative",
              hoveredId === "featured" && isDarkTheme && "neon-glow-pink dark-hover-card-pink",
              hoveredId === "featured" && !isDarkTheme && "light-hover-card-pink",
            )}
            onMouseEnter={() => setHoveredId("featured")}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Efecto de fondo para hover */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none z-10",
                hoveredId === "featured" && "opacity-100",
                isDarkTheme
                  ? "bg-gradient-to-br from-pink-900/30 via-pink-800/20 to-pink-900/30 border border-pink-500/30"
                  : "bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 border border-pink-200",
              )}
            ></div>

            {/* Efecto de brillo neón en modo oscuro */}
            {isDarkTheme && (
              <div
                className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none blur-xl z-0",
                  hoveredId === "featured" && "opacity-40",
                )}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(236, 72, 153, 0.5) 0%, rgba(236, 72, 153, 0) 70%)",
                }}
              ></div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 relative z-20">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={featuredPost.coverImage || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={cn(
                        "transition-all duration-300",
                        hoveredId === "featured" && isDarkTheme && "bg-pink-900 text-pink-100 hover:bg-pink-800",
                        hoveredId === "featured" && !isDarkTheme && "bg-pink-100 text-pink-800 hover:bg-pink-200",
                      )}
                    >
                      {featuredPost.category}
                    </Badge>
                    {featuredPost.featured && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "transition-all duration-300",
                          hoveredId === "featured" &&
                            isDarkTheme &&
                            "bg-pink-800/60 text-pink-100 hover:bg-pink-700/60",
                          hoveredId === "featured" && !isDarkTheme && "bg-pink-100 text-pink-800 hover:bg-pink-200",
                        )}
                      >
                        Destacado
                      </Badge>
                    )}
                  </div>
                  <h3
                    className={cn(
                      "text-2xl font-bold mb-2 transition-colors duration-300",
                      hoveredId === "featured" && isDarkTheme && "text-pink-300",
                      hoveredId === "featured" && !isDarkTheme && "text-pink-700",
                    )}
                  >
                    {featuredPost.title}
                  </h3>
                  <p
                    className={cn(
                      "text-muted-foreground mb-4 transition-colors duration-300",
                      hoveredId === "featured" && isDarkTheme && "text-pink-200/80",
                      hoveredId === "featured" && !isDarkTheme && "text-pink-700/80",
                    )}
                  >
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime} min de lectura</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-fit transition-all duration-300",
                      hoveredId === "featured" && isDarkTheme && "border-pink-500 text-pink-300 hover:bg-pink-950/50",
                      hoveredId === "featured" && !isDarkTheme && "border-pink-500 text-pink-700 hover:bg-pink-50",
                    )}
                  >
                    Leer artículo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Artículos recientes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Artículos Recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card
                className={cn(
                  "overflow-hidden transition-all duration-500 relative h-full",
                  hoveredId === post.id && isDarkTheme && "neon-glow-blue dark-hover-card-blue",
                  hoveredId === post.id && !isDarkTheme && "light-hover-card-blue",
                )}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Efecto de fondo para hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none z-10",
                    hoveredId === post.id && "opacity-100",
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
                      hoveredId === post.id && "opacity-40",
                    )}
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                    }}
                  ></div>
                )}

                <div className="relative z-20">
                  <div className="relative aspect-video">
                    <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={cn(
                          "transition-all duration-300",
                          hoveredId === post.id && isDarkTheme && "bg-blue-900 text-blue-100 hover:bg-blue-800",
                          hoveredId === post.id && !isDarkTheme && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                        )}
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3
                      className={cn(
                        "font-bold mb-2 transition-colors duration-300",
                        hoveredId === post.id && isDarkTheme && "text-blue-300",
                        hoveredId === post.id && !isDarkTheme && "text-blue-700",
                      )}
                    >
                      {post.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm text-muted-foreground mb-4 line-clamp-2 transition-colors duration-300",
                        hoveredId === post.id && isDarkTheme && "text-blue-200/80",
                        hoveredId === post.id && !isDarkTheme && "text-blue-700/80",
                      )}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {["Tutoriales", "Consejos", "Tendencias", "Recursos", "Inspiración", "Noticias"].map((category) => (
            <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm py-1 px-3 cursor-pointer transition-all duration-300",
                  hoveredId === category && isDarkTheme && "border-purple-500 text-purple-300 hover:bg-purple-950/50",
                  hoveredId === category && !isDarkTheme && "border-purple-500 text-purple-700 hover:bg-purple-50",
                )}
                onMouseEnter={() => setHoveredId(category)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {category}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Botón para ver más */}
      <div className="flex justify-center mt-10">
        <Button
          size="lg"
          className={cn(
            "gap-2 group transition-all duration-300 relative",
            hoveredButton && isDarkTheme && "bg-purple-700 hover:bg-purple-600",
            hoveredButton && !isDarkTheme && "bg-purple-600 hover:bg-purple-700",
          )}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
        >
          {/* Efecto de brillo neón en modo oscuro */}
          {isDarkTheme && hoveredButton && (
            <div
              className="absolute inset-0 rounded-md opacity-40 blur-md -z-10"
              style={{
                background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%)",
              }}
            ></div>
          )}
          Cargar más artículos
          <ArrowRight
            className={cn(
              "ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
              hoveredButton && "text-white",
            )}
          />
        </Button>
      </div>
    </div>
  )
}
