import { getSiteUrl } from "@/lib/utils"

export default function robots() {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
