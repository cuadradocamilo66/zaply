import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface DownloadPageProps {
  params: {
    token: string
  }
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = params
  const supabase = createServerComponentClient({ cookies })

  // Buscar el token de descarga
  const { data: download, error } = await supabase
    .from("downloads")
    .select(`
      id,
      expires_at,
      download_count,
      max_downloads,
      product:products (
        file_url
      )
    `)
    .eq("download_token", token)
    .single()

  // Si no existe el token o hay un error, redirigir a la página de error
  if (error || !download) {
    redirect("/download/error?reason=invalid")
  }

  // Verificar si el enlace ha expirado
  const now = new Date()
  const expiresAt = new Date(download.expires_at)
  if (now > expiresAt) {
    redirect("/download/error?reason=expired")
  }

  // Verificar si se ha alcanzado el límite de descargas
  if (download.download_count >= download.max_downloads) {
    redirect("/download/error?reason=limit")
  }

  // Incrementar el contador de descargas
  await supabase
    .from("downloads")
    .update({ download_count: download.download_count + 1 })
    .eq("id", download.id)

  // Redirigir al archivo
  redirect(download.product.file_url)
}
