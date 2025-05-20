"use client"

import type { ReactNode } from "react"

export default function FiltersWrapper({ children }: { children: ReactNode }) {
  // Simplemente pasar los children sin envolver en un FiltersProvider adicional
  return <>{children}</>
}
