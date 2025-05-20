"use client"

import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  fileUrl: string
}

export default function DownloadButton({ fileUrl }: DownloadButtonProps) {
  return (
    <Button
      onClick={() => {
        window.open(fileUrl, "_blank")
      }}
    >
      Descargar gratis
    </Button>
  )
}
