import { getFreeTemplates } from "@/lib/templates"
import FiltersContainer from "@/components/filters-container"

export default async function FreeTemplatesPage() {
  const templates = await getFreeTemplates()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Plantillas Gratuitas</h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Descarga plantillas de After Effects de alta calidad sin costo alguno.
        </p>
      </div>

      <FiltersContainer templates={templates} />
    </div>
  )
}
