"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Category } from "@/lib/templates"

export interface FiltersState {
  search: string
  categories: string[]
  priceRange: [number, number]
  freeOnly: boolean
  resolutions: string[]
  durations: string[]
  plugins: string[]
}

interface FiltersContextType {
  filters: FiltersState
  setSearch: (search: string) => void
  toggleCategory: (category: string) => void
  setPriceRange: (range: [number, number]) => void
  toggleFreeOnly: () => void
  toggleResolution: (resolution: string) => void
  toggleDuration: (duration: string) => void
  togglePlugin: (plugin: string) => void
  resetFilters: () => void
  availableCategories: Category[]
  setAvailableCategories: (categories: Category[]) => void
}

const initialFilters: FiltersState = {
  search: "",
  categories: [],
  priceRange: [0, 100],
  freeOnly: false,
  resolutions: [],
  durations: [],
  plugins: [],
}

// Crear el contexto con un valor inicial definido
export const FiltersContext = createContext<FiltersContextType>({
  filters: initialFilters,
  setSearch: () => {},
  toggleCategory: () => {},
  setPriceRange: () => {},
  toggleFreeOnly: () => {},
  toggleResolution: () => {},
  toggleDuration: () => {},
  togglePlugin: () => {},
  resetFilters: () => {},
  availableCategories: [],
  setAvailableCategories: () => {},
})

// Hook personalizado para usar el contexto
export function useFilters() {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error("useFilters debe ser usado dentro de un FiltersProvider")
  }
  return context
}

// Proveedor del contexto
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters)
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [mounted, setMounted] = useState(false)

  // Manejar el montaje del componente
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Cargar filtros desde localStorage al iniciar
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const savedFilters = localStorage.getItem("templateFilters")
        if (savedFilters) {
          setFilters(JSON.parse(savedFilters))
        }
      } catch (error) {
        console.error("Error al cargar los filtros:", error)
      }
    }
  }, [mounted])

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem("templateFilters", JSON.stringify(filters))
      } catch (error) {
        console.error("Error al guardar los filtros:", error)
      }
    }
  }, [filters, mounted])

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(category)
      return {
        ...prev,
        categories: isSelected ? prev.categories.filter((c) => c !== category) : [...prev.categories, category],
      }
    })
  }

  const setPriceRange = (priceRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange }))
  }

  const toggleFreeOnly = () => {
    setFilters((prev) => ({ ...prev, freeOnly: !prev.freeOnly }))
  }

  const toggleResolution = (resolution: string) => {
    setFilters((prev) => {
      const isSelected = prev.resolutions.includes(resolution)
      return {
        ...prev,
        resolutions: isSelected ? prev.resolutions.filter((r) => r !== resolution) : [...prev.resolutions, resolution],
      }
    })
  }

  const toggleDuration = (duration: string) => {
    setFilters((prev) => {
      const isSelected = prev.durations.includes(duration)
      return {
        ...prev,
        durations: isSelected ? prev.durations.filter((d) => d !== duration) : [...prev.durations, duration],
      }
    })
  }

  const togglePlugin = (plugin: string) => {
    setFilters((prev) => {
      const isSelected = prev.plugins.includes(plugin)
      return {
        ...prev,
        plugins: isSelected ? prev.plugins.filter((p) => p !== plugin) : [...prev.plugins, plugin],
      }
    })
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // Proporcionar un valor por defecto mientras el componente no está montado
  if (!mounted) {
    return <>{children}</>
  }

  const value = {
    filters,
    setSearch,
    toggleCategory,
    setPriceRange,
    toggleFreeOnly,
    toggleResolution,
    toggleDuration,
    togglePlugin,
    resetFilters,
    availableCategories,
    setAvailableCategories,
  }

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}
