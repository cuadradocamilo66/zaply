import { getAllTemplates } from "@/lib/templates"
import FiltersContainer from "@/components/filters-container"

export default async function TemplatesPage() {
  const templates = await getAllTemplates()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explora Plantillas</h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Encuentra la plantilla perfecta para tu próximo proyecto.
        </p>
      </div>

      <FiltersContainer templates={templates} />
    </div>
  )
}
