import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import HeroSection from "@/components/hero-section"
import FeaturedTemplates from "@/components/featured-templates"
import NewTemplatesSection from "@/components/new-templates-section"
import TestimonialsSection from "@/components/testimonials-section"
import FreeTemplatesSection from "@/components/free-templates-section"
import NewsletterSection from "@/components/newsletter-section"
import ExploreTemplatesCta from "@/components/explore-templates-cta"
import TemplatesShowcase from "@/components/templates-showcase"
import { getFeaturedTemplates, getFreeTemplates, getNewTemplates } from "@/lib/templates"

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })

  // Obtener los templates necesarios
  const featuredTemplates = await getFeaturedTemplates()
  const freeTemplates = await getFreeTemplates()
  const newTemplates = await getNewTemplates()

  // Buscar la página de inicio en la base de datos (slug = /)
  const { data: page } = await supabase.from("pages").select("*").eq("slug", "/").single()

  // Si existe una página con slug "/" y tiene contenido, mostrarla
  if (page && page.content) {
    return (
      <main className="container mx-auto py-12">
        {page.featured_image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={page.featured_image || "/placeholder.svg"}
              alt={page.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>
    )
  }

  // Si no hay página personalizada, mostrar la página de inicio predeterminada
  return (
    <main>
      <HeroSection />
      <div className="py-16">
        <NewTemplatesSection templates={newTemplates} />
      </div>
      <ExploreTemplatesCta />
      <div className="py-16">
        <FeaturedTemplates templates={featuredTemplates} />
      </div>
      <TemplatesShowcase />
      <div className="py-16">
        <TestimonialsSection />
      </div>
      <div className="py-16">
        <FreeTemplatesSection templates={freeTemplates} />
      </div>
      <NewsletterSection />
    </main>
  )
}

export async function generateMetadata() {
  const supabase = createServerComponentClient({ cookies })

  // Buscar la página de inicio en la base de datos (slug = /)
  const { data: page } = await supabase.from("pages").select("*").eq("slug", "/").single()

  if (page && page.meta_title) {
    return {
      title: page.meta_title,
      description: page.meta_description || "Zaply - Plantillas profesionales para After Effects",
    }
  }

  return {
    title: "Zaply - Plantillas profesionales para After Effects",
    description:
      "Descubre nuestra colección de plantillas premium para After Effects. Mejora tus proyectos con efectos visuales profesionales.",
  }
}
