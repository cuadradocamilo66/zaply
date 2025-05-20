"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, ThumbsUp } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.id, post.category)

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Navegación de regreso */}
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="ghost"
              className={cn(
                "gap-2 transition-all duration-300",
                hoveredAction === "back" && isDarkTheme && "text-pink-300",
                hoveredAction === "back" && !isDarkTheme && "text-pink-700",
              )}
              onMouseEnter={() => setHoveredAction("back")}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Button>
          </Link>
        </div>

        {/* Encabezado del artículo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge>{post.category}</Badge>
            {post.featured && <Badge variant="secondary">Destacado</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min de lectura</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </div>
        </div>

        {/* Imagen de portada */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        {/* Acciones del artículo */}
        <div className="flex justify-between mb-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 transition-all duration-300",
                hoveredAction === "share" && isDarkTheme && "border-blue-500 text-blue-300 hover:bg-blue-950/50",
                hoveredAction === "share" && !isDarkTheme && "border-blue-500 text-blue-700 hover:bg-blue-50",
              )}
              onMouseEnter={() => setHoveredAction("share")}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 transition-all duration-300",
                hoveredAction === "save" && isDarkTheme && "border-green-500 text-green-300 hover:bg-green-950/50",
                hoveredAction === "save" && !isDarkTheme && "border-green-500 text-green-700 hover:bg-green-50",
              )}
              onMouseEnter={() => setHoveredAction("save")}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <Bookmark className="h-4 w-4" />
              Guardar
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 transition-all duration-300",
              hoveredAction === "like" && isDarkTheme && "border-pink-500 text-pink-300 hover:bg-pink-950/50",
              hoveredAction === "like" && !isDarkTheme && "border-pink-500 text-pink-700 hover:bg-pink-50",
            )}
            onMouseEnter={() => setHoveredAction("like")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <ThumbsUp className="h-4 w-4" />
            Me gusta
          </Button>
        </div>

        {/* Contenido del artículo */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            {post.content ||
              `
              Este es un artículo de ejemplo sobre ${post.title}. Aquí iría el contenido completo del artículo.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
              nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia,
              nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
            `}
          </p>

          <h2>Introducción a After Effects</h2>
          <p>
            After Effects es una herramienta poderosa para crear animaciones y efectos visuales. En este artículo,
            exploraremos cómo utilizar After Effects para crear animaciones impresionantes para tus proyectos.
          </p>

          <h2>Conceptos básicos</h2>
          <p>
            Antes de sumergirnos en técnicas avanzadas, es importante comprender los conceptos básicos de After Effects.
            La interfaz de usuario, las capas, las composiciones y la línea de tiempo son elementos fundamentales que
            debes dominar.
          </p>

          <h2>Técnicas avanzadas</h2>
          <p>
            Una vez que hayas dominado los conceptos básicos, puedes comenzar a explorar técnicas más avanzadas como el
            seguimiento de movimiento, la rotoscopia, las expresiones y los efectos de partículas.
          </p>

          <h2>Conclusión</h2>
          <p>
            After Effects es una herramienta versátil que puede ayudarte a llevar tus proyectos al siguiente nivel. Con
            práctica y paciencia, podrás crear animaciones impresionantes que captarán la atención de tu audiencia.
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Artículos relacionados */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                <Card
                  className={cn(
                    "overflow-hidden transition-all duration-500 relative h-full",
                    hoveredId === relatedPost.id && isDarkTheme && "neon-glow-blue dark-hover-card-blue",
                    hoveredId === relatedPost.id && !isDarkTheme && "light-hover-card-blue",
                  )}
                  onMouseEnter={() => setHoveredId(relatedPost.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Efecto de fondo para hover */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 pointer-events-none z-10",
                      hoveredId === relatedPost.id && "opacity-100",
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
                        hoveredId === relatedPost.id && "opacity-40",
                      )}
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      }}
                    ></div>
                  )}

                  <div className="relative z-20">
                    <div className="relative aspect-video">
                      <Image
                        src={relatedPost.coverImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={cn(
                            "transition-all duration-300",
                            hoveredId === relatedPost.id &&
                              isDarkTheme &&
                              "bg-blue-900 text-blue-100 hover:bg-blue-800",
                            hoveredId === relatedPost.id &&
                              !isDarkTheme &&
                              "bg-blue-100 text-blue-800 hover:bg-blue-200",
                          )}
                        >
                          {relatedPost.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3
                        className={cn(
                          "font-bold mb-2 transition-colors duration-300",
                          hoveredId === relatedPost.id && isDarkTheme && "text-blue-300",
                          hoveredId === relatedPost.id && !isDarkTheme && "text-blue-700",
                        )}
                      >
                        {relatedPost.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm text-muted-foreground mb-4 line-clamp-2 transition-colors duration-300",
                          hoveredId === relatedPost.id && isDarkTheme && "text-blue-200/80",
                          hoveredId === relatedPost.id && !isDarkTheme && "text-blue-700/80",
                        )}
                      >
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{relatedPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{relatedPost.readTime} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
