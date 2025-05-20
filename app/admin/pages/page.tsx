import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { PagesClient } from "./client"

export default async function PagesAdminPage() {
  const supabase = createServerComponentClient({ cookies })

  // Obtener todas las páginas
  const { data: pages, error } = await supabase.from("pages").select("*").order("order")

  if (error) {
    console.error("Error fetching pages:", error)
    return <div>Error al cargar las páginas. Por favor, intenta de nuevo.</div>
  }

  return <PagesClient initialPages={pages || []} />
}
