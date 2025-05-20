import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageParams {
  params: {
    slug: string
  }
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  const slug = `/${params.slug}`

  const { data: page } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (!page) {
    return {
      title: "Página no encontrada",
      description: "La página que buscas no existe",
    }
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || "",
  }
}

export default async function DynamicPage({ params }: PageParams) {
  const supabase = createServerComponentClient({ cookies })
  const slug = `/${params.slug}`

  const { data: page, error } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (error || !page) {
    console.error("Error fetching page:", error)
    notFound()
  }

  return (
    <div className="container py-12">
      {page.featured_image && (
        <div className="mb-8">
          <img
            src={page.featured_image || "/placeholder.svg"}
            alt={page.title}
            className="w-full h-[300px] object-cover rounded-lg"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

      {page.content ? (
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="text-muted-foreground">Esta página no tiene contenido.</p>
      )}
    </div>
  )
}
