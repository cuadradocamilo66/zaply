"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

interface RelatedTemplatesProps {
  currentTemplateId: string
  category: string
}

interface Template {
  id: string
  name: string
  slug: string
  description: string
  thumbnail_url: string
  category: string
  price: number
  is_free: boolean
}

export default function RelatedTemplates({ currentTemplateId, category }: RelatedTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchRelatedTemplates() {
      try {
        setIsLoading(true)

        // Obtener plantillas relacionadas por categoría, excluyendo la actual
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, description, thumbnail_url, category, price, is_free")
          .eq("category", category)
          .neq("id", currentTemplateId)
          .limit(3)

        if (error) throw error
        setTemplates(data || [])
      } catch (error) {
        console.error("Error fetching related templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedTemplates()
  }, [currentTemplateId, category, supabase])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay plantillas relacionadas disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Link key={template.id} href={`/templates/${template.slug}`}>
          <Card className="overflow-hidden template-card-hover-effect">
            <div
              className="relative aspect-video video-hover-container"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={template.thumbnail_url || "/placeholder.svg"}
                alt={template.name}
                fill
                className="object-cover"
              />

              <div className="absolute top-2 left-2">
                <Badge>{template.category}</Badge>
              </div>

              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary">{template.is_free ? "Gratis" : `$${template.price.toFixed(2)}`}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
