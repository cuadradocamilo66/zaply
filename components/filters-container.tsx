"use client"

import { useState } from "react"
import { FiltersProvider } from "./filters-context"
import TemplateSearch from "./template-search"
import TemplateFilters from "./template-filters"
import TemplateGrid from "./template-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import type { Template } from "@/lib/templates"

interface FiltersContainerProps {
  templates?: Template[]
  title?: string
  description?: string
}

export default function FiltersContainer({ templates, title, description }: FiltersContainerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <FiltersProvider>
      {/* Botón móvil para mostrar/ocultar filtros */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setFiltersOpen(!filtersOpen)}>
          {filtersOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          {filtersOpen ? "Cerrar filtros" : "Mostrar filtros"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Panel de filtros - visible en desktop, condicional en móvil */}
        <div
          className={`${filtersOpen ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0 bg-background md:bg-transparent z-20 md:z-auto ${filtersOpen ? "fixed md:relative inset-0 p-4 pt-16 overflow-auto" : ""}`}
        >
          {filtersOpen && (
            <div className="md:hidden absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          <TemplateSearch />
          <TemplateFilters onFilterApply={() => setFiltersOpen(false)} />
        </div>

        {/* Contenido principal */}
        <div className="flex-1">{isLoading ? <TemplateGridSkeleton /> : <TemplateGrid templates={templates} />}</div>
      </div>
    </FiltersProvider>
  )
}

function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
    </div>
  )
}
