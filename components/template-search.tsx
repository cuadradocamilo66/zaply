"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useFilters } from "./filters-context"

export default function TemplateSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const { filters, setSearch } = useFilters()

  // Sincronizar el estado local con el contexto
  useEffect(() => {
    if (filters.search !== searchQuery) {
      setSearchQuery(filters.search)
    }
  }, [filters.search])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchQuery)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Input
        type="search"
        placeholder="Buscar plantillas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pr-16 transition-all duration-300",
          isFocused && isDarkTheme && "border-blue-500 ring-1 ring-blue-500/30",
          isFocused && !isDarkTheme && "border-blue-500 ring-1 ring-blue-500/20",
        )}
      />
      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute right-8 top-0 h-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpiar búsqueda</span>
        </Button>
      )}
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
        <Search className="h-4 w-4" />
        <span className="sr-only">Buscar</span>
      </Button>
    </form>
  )
}
