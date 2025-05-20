import { notFound } from "next/navigation"
import { getCategoryBySlug, getAllTemplates } from "@/lib/templates"
import FiltersContainer from "@/components/filters-container"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const allTemplates = getAllTemplates()
  const templates = allTemplates.filter((template) => template.category === category.name)

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{category.name}</h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">{category.description}</p>
      </div>

      <FiltersContainer templates={templates} />
    </div>
  )
}
