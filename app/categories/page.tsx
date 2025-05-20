import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { getCategories } from "@/lib/templates"

export default function CategoriesPage() {
  const categories = getCategories()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-start space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Categorías</h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Explora nuestras plantillas por categoría para encontrar exactamente lo que necesitas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="overflow-hidden h-full template-card-hover-effect">
              <div className="relative aspect-square">
                <Image
                  src={category.imageUrl || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{category.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
