"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getCategories } from "@/lib/templates"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useFilters } from "./filters-context"

interface TemplateFiltersProps {
  onFilterApply?: () => void
}

export default function TemplateFilters({ onFilterApply }: TemplateFiltersProps) {
  const {
    filters,
    toggleCategory,
    setPriceRange,
    toggleFreeOnly,
    toggleResolution,
    toggleDuration,
    togglePlugin,
    resetFilters,
    availableCategories,
    setAvailableCategories,
  } = useFilters()

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [hoveredReset, setHoveredReset] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  // Cargar categorías
  useEffect(() => {
    const categories = getCategories()
    setAvailableCategories(categories)
  }, [setAvailableCategories])

  // Sincronizar el estado local con el contexto
  useEffect(() => {
    setLocalPriceRange(filters.priceRange)
  }, [filters.priceRange])

  // Actualizar contador de filtros activos
  useEffect(() => {
    let count = 0
    if (filters.search) count++
    count += filters.categories.length
    if (filters.freeOnly) count++
    count += filters.resolutions.length
    count += filters.durations.length
    count += filters.plugins.length
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) {
      count++
    }
    setActiveFiltersCount(count)
  }, [filters])

  // Manejar cambio en el slider de precio
  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  // Aplicar cambio de precio cuando se suelta el slider
  const handlePriceChangeCommitted = () => {
    setPriceRange(localPriceRange as [number, number])
    onFilterApply?.()
  }

  // Función para aplicar filtros y cerrar el panel en móvil
  const handleFilterChange = (callback: () => void) => {
    callback()
    onFilterApply?.()
  }

  return (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Filtros activos ({activeFiltersCount})</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetFilters()
                onFilterApply?.()
              }}
              className={cn(
                "text-xs h-7 px-2 transition-colors duration-300",
                hoveredReset && isDarkTheme && "text-red-300 hover:text-red-200",
                hoveredReset && !isDarkTheme && "text-red-600 hover:text-red-700",
              )}
              onMouseEnter={() => setHoveredReset(true)}
              onMouseLeave={() => setHoveredReset(false)}
            >
              Limpiar todos
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="outline" className="flex items-center gap-1 group">
                Búsqueda: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(resetFilters)}
                />
              </Badge>
            )}
            {filters.categories.map((category) => (
              <Badge key={category} variant="outline" className="flex items-center gap-1 group">
                {category}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(() => toggleCategory(category))}
                />
              </Badge>
            ))}
            {filters.freeOnly && (
              <Badge variant="outline" className="flex items-center gap-1 group">
                Solo gratis
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(toggleFreeOnly)}
                />
              </Badge>
            )}
            {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) && (
              <Badge variant="outline" className="flex items-center gap-1 group">
                Precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(() => setPriceRange([0, 100]))}
                />
              </Badge>
            )}
            {filters.resolutions.map((resolution) => (
              <Badge key={resolution} variant="outline" className="flex items-center gap-1 group">
                {resolution}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(() => toggleResolution(resolution))}
                />
              </Badge>
            ))}
            {filters.durations.map((duration) => (
              <Badge key={duration} variant="outline" className="flex items-center gap-1 group">
                {duration}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(() => toggleDuration(duration))}
                />
              </Badge>
            ))}
            {filters.plugins.map((plugin) => (
              <Badge key={plugin} variant="outline" className="flex items-center gap-1 group">
                {plugin}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                  onClick={() => handleFilterChange(() => togglePlugin(plugin))}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["categories", "price", "resolution"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.name)}
                    onCheckedChange={() => handleFilterChange(() => toggleCategory(category.name))}
                  />
                  <Label htmlFor={`category-${category.id}`} className="cursor-pointer text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={[localPriceRange[0], localPriceRange[1]]}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceChangeCommitted}
                className="mt-6"
              />
              <div className="flex items-center justify-between">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free-only"
                  checked={filters.freeOnly}
                  onCheckedChange={() => handleFilterChange(toggleFreeOnly)}
                />
                <Label htmlFor="free-only" className="cursor-pointer text-sm">
                  Solo plantillas gratuitas
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="resolution">
          <AccordionTrigger>Resolución</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resolution-4k"
                  checked={filters.resolutions.includes("4K")}
                  onCheckedChange={() => handleFilterChange(() => toggleResolution("4K"))}
                />
                <Label htmlFor="resolution-4k" className="cursor-pointer text-sm">
                  4K
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resolution-1080p"
                  checked={filters.resolutions.includes("Full HD (1080p)")}
                  onCheckedChange={() => handleFilterChange(() => toggleResolution("Full HD (1080p)"))}
                />
                <Label htmlFor="resolution-1080p" className="cursor-pointer text-sm">
                  Full HD (1080p)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resolution-720p"
                  checked={filters.resolutions.includes("HD (720p)")}
                  onCheckedChange={() => handleFilterChange(() => toggleResolution("HD (720p)"))}
                />
                <Label htmlFor="resolution-720p" className="cursor-pointer text-sm">
                  HD (720p)
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger>Duración</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duration-short"
                  checked={filters.durations.includes("Corta (< 10s)")}
                  onCheckedChange={() => handleFilterChange(() => toggleDuration("Corta (< 10s)"))}
                />
                <Label htmlFor="duration-short" className="cursor-pointer text-sm">
                  Corta ({`<`} 10s)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duration-medium"
                  checked={filters.durations.includes("Media (10-30s)")}
                  onCheckedChange={() => handleFilterChange(() => toggleDuration("Media (10-30s)"))}
                />
                <Label htmlFor="duration-medium" className="cursor-pointer text-sm">
                  Media (10-30s)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duration-long"
                  checked={filters.durations.includes("Larga (> 30s)")}
                  onCheckedChange={() => handleFilterChange(() => toggleDuration("Larga (> 30s)"))}
                />
                <Label htmlFor="duration-long" className="cursor-pointer text-sm">
                  Larga ({`>`} 30s)
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="plugins">
          <AccordionTrigger>Plugins</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-plugins"
                  checked={filters.plugins.includes("Sin plugins")}
                  onCheckedChange={() => handleFilterChange(() => togglePlugin("Sin plugins"))}
                />
                <Label htmlFor="no-plugins" className="cursor-pointer text-sm">
                  Sin plugins
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plugin-trapcode"
                  checked={filters.plugins.includes("Trapcode Suite")}
                  onCheckedChange={() => handleFilterChange(() => togglePlugin("Trapcode Suite"))}
                />
                <Label htmlFor="plugin-trapcode" className="cursor-pointer text-sm">
                  Trapcode Suite
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plugin-element3d"
                  checked={filters.plugins.includes("Element 3D")}
                  onCheckedChange={() => handleFilterChange(() => togglePlugin("Element 3D"))}
                />
                <Label htmlFor="plugin-element3d" className="cursor-pointer text-sm">
                  Element 3D
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plugin-particular"
                  checked={filters.plugins.includes("Particular")}
                  onCheckedChange={() => handleFilterChange(() => togglePlugin("Particular"))}
                />
                <Label htmlFor="plugin-particular" className="cursor-pointer text-sm">
                  Particular
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Botón de aplicar filtros para móvil */}
      <div className="md:hidden mt-6">
        <Button className="w-full" onClick={() => onFilterApply?.()}>
          Aplicar filtros
        </Button>
      </div>
    </div>
  )
}
