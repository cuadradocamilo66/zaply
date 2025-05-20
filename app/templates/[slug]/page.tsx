import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoPlayer from "@/components/video-player"
import BuyButton from "@/components/buy-button"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getTemplateBySlug, getRelatedTemplates } from "@/lib/templates"
import DownloadButton from "@/components/ui/DownloadButton"

interface TemplatePageProps {
  params: {
    slug: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Obtener el producto desde la base de datos
  const { data: dbTemplate, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single()

  let template: any = null

  if (error || !dbTemplate) {
    // Fallback a datos estáticos
    const staticTemplate = await getTemplateBySlug(params.slug)

    if (!staticTemplate) {
      notFound()
    }

    template = {
      id: staticTemplate.id,
      name: staticTemplate.title,
      slug: staticTemplate.slug,
      description: staticTemplate.description,
      full_description: staticTemplate.fullDescription,
      category: staticTemplate.category,
      thumbnail_url: staticTemplate.thumbnailUrl,
      file_url: staticTemplate.videoUrl,
      preview_images: staticTemplate.previewImages,
      price: staticTemplate.price,
      is_free: staticTemplate.isFree,
      featured: staticTemplate.featured,
      resolution: staticTemplate.resolution,
      duration: staticTemplate.duration,
      ae_version: staticTemplate.aeVersion,
      plugins: staticTemplate.plugins,
      features: staticTemplate.features,
      instructions: staticTemplate.instructions,
    }
  } else {
    template = dbTemplate
  }

  if (!template) {
    notFound()
  }

  // Obtener plantillas relacionadas
  let relatedTemplates = []
  try {
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("category", template.category)
      .neq("id", template.id)
      .limit(3)

    if (related && related.length > 0) {
      relatedTemplates = related
    } else {
      // Fallback a datos estáticos
      const staticRelated = await getRelatedTemplates(template.id, template.category)
      if (Array.isArray(staticRelated)) {
        relatedTemplates = staticRelated.map(item => ({
          id: item.id,
          name: item.title,
          slug: item.slug,
          description: item.description,
          thumbnail_url: item.thumbnailUrl,
          category: item.category,
          price: item.price,
          is_free: item.isFree,
        }))
      } else {
        console.error("getRelatedTemplates no devolvió un array:", staticRelated)
        relatedTemplates = []
      }
    }
  } catch (error) {
    console.error("Error al obtener plantillas relacionadas de Supabase:", error)

    try {
      const staticRelated = await getRelatedTemplates(template.id, template.category)
      if (Array.isArray(staticRelated)) {
        relatedTemplates = staticRelated.map(item => ({
          id: item.id,
          name: item.title,
          slug: item.slug,
          description: item.description,
          thumbnail_url: item.thumbnailUrl,
          category: item.category,
          price: item.price,
          is_free: item.isFree,
        }))
      } else {
        console.error("getRelatedTemplates no devolvió un array:", staticRelated)
        relatedTemplates = []
      }
    } catch (relatedError) {
      console.error("Error al procesar plantillas relacionadas estáticas:", relatedError)
      relatedTemplates = []
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4 md:space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
            <VideoPlayer
              src={template.file_url || ""}
              poster={template.thumbnail_url}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(template.preview_images || []).map((image: string, index: number) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg border bg-muted cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge>{template.category}</Badge>
              {template.featured && <Badge variant="secondary">Destacado</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl">{template.name}</h1>
            <p className="text-xl md:text-2xl font-bold mt-2">
              $
              {typeof template.price === "string"
                ? Number.parseFloat(template.price).toFixed(2)
                : template.price.toFixed(2)}{" "}
              USD
            </p>
          </div>

          <p className="text-muted-foreground">{template.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Resolución</p>
              <p className="font-medium">{template.resolution}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Duración</p>
              <p className="font-medium">{template.duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Versión AE</p>
              <p className="font-medium">{template.ae_version}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Plugins requeridos</p>
              <p className="font-medium">{template.plugins || "Ninguno"}</p>
            </div>
          </div>

         <div className="flex flex-col sm:flex-row gap-4">
  {template.is_free ? (
    <DownloadButton fileUrl={template.file_url || ""} />
  ) : (
    <BuyButton
      productId={template.id}
      price={
        typeof template.price === "string"
          ? Number.parseFloat(template.price)
          : template.price
      }
      isFree={template.is_free}
    />
  )}
  <Button variant="outline">Vista previa</Button>
</div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 mt-4">
              <p>{template.full_description || template.description}</p>
            </TabsContent>
            <TabsContent value="features" className="space-y-4 mt-4">
              <ul className="list-disc pl-5 space-y-2">
                {(template.features || []).map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="instructions" className="space-y-4 mt-4">
              <p>{template.instructions || "No hay instrucciones disponibles para este producto."}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12 md:mt-20">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Plantillas relacionadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedTemplates.length > 0 ? (
            relatedTemplates.map((related: any) => (
              <div key={related.id} className="group">
                <a href={`/templates/${related.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted mb-3">
                    <Image
                      src={related.thumbnail_url || "/placeholder.svg"}
                      alt={related.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{related.name}</h3>
                  <p className="text-muted-foreground line-clamp-2 mt-1">{related.description}</p>
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No se encontraron plantillas relacionadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
