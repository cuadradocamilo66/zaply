import { createClient } from "@supabase/supabase-js"

export interface Template {
  id: string
  slug: string
  title: string
  description: string
  fullDescription: string
  category: string
  thumbnailUrl: string
  videoUrl: string
  previewImages: string[]
  price: number
  isFree: boolean
  featured: boolean
  resolution: string
  duration: string
  aeVersion: string
  plugins: string | null
  features: string[]
  instructions: string
}

export interface Category {
  id: string
  slug: string
  name: string
  imageUrl: string
  description: string
}

// Datos de ejemplo para las plantillas (fallback)
const staticTemplates: Template[] = [
  {
    id: "1",
    slug: "dynamic-logo-reveal",
    title: "Dynamic Logo Reveal",
    description: "Una animación elegante para revelar tu logo con partículas y efectos de luz.",
    fullDescription:
      "Esta plantilla de After Effects ofrece una forma impactante de presentar tu logo. Con efectos de partículas dinámicas y destellos de luz, esta animación captará la atención de tu audiencia desde el primer momento. Perfecta para intros de videos, presentaciones corporativas o contenido de redes sociales.",
    category: "Intros",
    thumbnailUrl: "/placeholder.svg?key=5myzg",
    videoUrl: "/placeholder.svg?key=60tmg",
    previewImages: [
      "/placeholder.svg?key=pj5of",
      "/placeholder.svg?key=6pcxl",
      "/placeholder.svg?key=5rxsp",
      "/placeholder.svg?key=th38u",
    ],
    price: 29.99,
    isFree: false,
    featured: true,
    resolution: "3840x2160 (4K)",
    duration: "0:10",
    aeVersion: "CC 2020 o superior",
    plugins: null,
    features: [
      "Animación de alta calidad en 4K",
      "Fácil personalización con controladores intuitivos",
      "Incluye 3 variaciones de color",
      "Sin plugins requeridos",
      "Tutorial de uso incluido",
    ],
    instructions:
      "Para personalizar esta plantilla, simplemente reemplaza el logo placeholder con tu propio logo en formato PNG o AI. Ajusta los colores y la duración según tus necesidades utilizando los controladores preconfigurados.",
  },
  {
    id: "2",
    slug: "modern-titles-pack",
    title: "Modern Titles Pack",
    description: "Colección de 20 títulos animados con estilo moderno y minimalista.",
    fullDescription:
      "Este paquete incluye 20 títulos animados con un diseño moderno y minimalista. Cada título está cuidadosamente animado para ofrecer transiciones suaves y efectos visuales atractivos. Ideal para videos de YouTube, documentales, presentaciones corporativas o cualquier proyecto que requiera títulos elegantes.",
    category: "Títulos",
    thumbnailUrl: "/placeholder.svg?key=31d8l",
    videoUrl: "/placeholder.svg?key=kvh4l",
    previewImages: [
      "/placeholder.svg?key=s2hbm",
      "/placeholder.svg?key=g368l",
      "/placeholder.svg?key=7kmnj",
      "/placeholder-9hl0i.png",
    ],
    price: 39.99,
    isFree: false,
    featured: true,
    resolution: "3840x2160 (4K)",
    duration: "0:05 - 0:10 por título",
    aeVersion: "CC 2019 o superior",
    plugins: null,
    features: [
      "20 títulos animados en 4K",
      "Personalización sencilla de texto y colores",
      "Incluye variaciones con diferentes efectos",
      "Sin plugins requeridos",
      "Organizado en carpetas para fácil navegación",
    ],
    instructions:
      "Abre el archivo del proyecto y navega a la composición del título que deseas utilizar. Haz doble clic para abrirla, luego selecciona la capa de texto y modifica el contenido. Puedes ajustar los colores utilizando los controles de efectos preconfigurados.",
  },
  {
    id: "3",
    slug: "cinematic-trailer",
    title: "Cinematic Trailer",
    description: "Plantilla para crear trailers cinematográficos con efectos visuales impactantes.",
    fullDescription:
      "Esta plantilla te permite crear trailers cinematográficos con un aspecto profesional. Incluye transiciones dinámicas, efectos de partículas, destellos de lente y elementos de distorsión para lograr un estilo visual impactante. Perfecta para promocionar películas, videojuegos, eventos o productos.",
    category: "Trailers",
    thumbnailUrl: "/placeholder-99wxr.png",
    videoUrl: "/placeholder-99wxr.png",
    previewImages: [
      "/placeholder-bfxfj.png",
      "/placeholder-mjwem.png",
      "/placeholder-kqvpb.png",
      "/placeholder-08bjx.png",
    ],
    price: 49.99,
    isFree: false,
    featured: true,
    resolution: "3840x2160 (4K)",
    duration: "1:30",
    aeVersion: "CC 2020 o superior",
    plugins: "Trapcode Particular (opcional)",
    features: [
      "15 placeholders para imágenes o videos",
      "10 títulos animados",
      "Efectos de transición cinematográficos",
      "Corrección de color incluida",
      "Marcadores para facilitar la edición",
    ],
    instructions:
      "Reemplaza los placeholders con tus propias imágenes o videos. Ajusta los títulos según tus necesidades. La plantilla incluye marcadores para ayudarte a identificar dónde realizar cambios. Para obtener mejores resultados, utiliza Trapcode Particular, aunque la plantilla funcionará sin este plugin.",
  },
  {
    id: "4",
    slug: "social-media-pack",
    title: "Social Media Pack",
    description: "30 animaciones para redes sociales con diferentes estilos y formatos.",
    fullDescription:
      "Este paquete incluye 30 animaciones diseñadas específicamente para redes sociales. Cubre múltiples formatos (cuadrado, vertical y horizontal) para Instagram, TikTok, Facebook y YouTube. Cada animación es moderna, llamativa y fácil de personalizar para adaptarse a tu marca.",
    category: "Redes Sociales",
    thumbnailUrl: "/placeholder-kg7fd.png",
    videoUrl: "/placeholder-kg7fd.png",
    previewImages: [
      "/placeholder-i68zo.png",
      "/placeholder-nf9wn.png",
      "/placeholder-qbry2.png",
      "/placeholder-7h4a5.png",
    ],
    price: 34.99,
    isFree: false,
    featured: false,
    resolution: "1920x1080 (Full HD)",
    duration: "0:15 - 0:30 por animación",
    aeVersion: "CC 2018 o superior",
    plugins: null,
    features: [
      "30 animaciones en diferentes formatos",
      "Optimizado para redes sociales",
      "Incluye versiones para Instagram, TikTok, Facebook y YouTube",
      "Sin plugins requeridos",
      "Tutorial detallado incluido",
    ],
    instructions:
      "Selecciona la animación que deseas utilizar según la red social y el formato. Reemplaza el texto y las imágenes con tu propio contenido. Ajusta los colores para que coincidan con tu marca utilizando los controles preconfigurados.",
  },
  {
    id: "5",
    slug: "typography-animations",
    title: "Typography Animations",
    description: "Colección de animaciones tipográficas creativas y dinámicas.",
    fullDescription:
      "Esta colección de animaciones tipográficas te permite crear textos dinámicos y atractivos para tus videos. Incluye efectos de entrada, salida y énfasis con diferentes estilos, desde minimalistas hasta más elaborados. Perfecta para destacar mensajes importantes, crear intros o animar citas.",
    category: "Tipografía",
    thumbnailUrl: "/placeholder-vm84o.png",
    videoUrl: "/placeholder-vm84o.png",
    previewImages: [
      "/placeholder-3ian0.png",
      "/placeholder-2t962.png",
      "/placeholder-m8m9c.png",
      "/placeholder-ukwmm.png",
    ],
    price: 0,
    isFree: true,
    featured: false,
    resolution: "1920x1080 (Full HD)",
    duration: "0:05 - 0:15 por animación",
    aeVersion: "CC 2017 o superior",
    plugins: null,
    features: [
      "25 animaciones tipográficas",
      "Fácil personalización de texto y colores",
      "Incluye efectos de entrada, salida y énfasis",
      "Sin plugins requeridos",
      "Fuentes incluidas (gratuitas)",
    ],
    instructions:
      "Abre la composición de la animación que deseas utilizar. Selecciona la capa de texto y modifica el contenido. Puedes ajustar la fuente, el tamaño y el color según tus preferencias. Las animaciones están preconfiguradas, pero puedes modificar los parámetros para ajustar la velocidad y el estilo.",
  },
  {
    id: "6",
    slug: "lower-thirds-essential",
    title: "Lower Thirds Essential",
    description: "Pack de 15 lower thirds modernos y profesionales para tus videos.",
    fullDescription:
      "Este paquete incluye 15 lower thirds (tercios inferiores) con diseños modernos y profesionales. Cada lower third está animado con transiciones suaves y efectos elegantes. Ideal para entrevistas, documentales, noticias, videos corporativos o cualquier contenido que requiera mostrar nombres, títulos o información adicional.",
    category: "Lower Thirds",
    thumbnailUrl: "/placeholder-ebpkt.png",
    videoUrl: "/placeholder-ebpkt.png",
    previewImages: [
      "/placeholder-5pwr7.png",
      "/placeholder-owwdx.png",
      "/placeholder-hadel.png",
      "/placeholder.svg?height=720&width=1280&query=lower third animation frame 4",
    ],
    price: 0,
    isFree: true,
    featured: false,
    resolution: "3840x2160 (4K)",
    duration: "0:10 por lower third",
    aeVersion: "CC 2018 o superior",
    plugins: null,
    features: [
      "15 lower thirds en 4K",
      "Personalización sencilla de texto y colores",
      "Animaciones de entrada y salida incluidas",
      "Sin plugins requeridos",
      "Incluye versiones con 1 y 2 líneas de texto",
    ],
    instructions:
      "Selecciona el lower third que deseas utilizar. Modifica el texto según tus necesidades. Puedes ajustar los colores utilizando los controles preconfigurados para que coincidan con tu marca o estilo visual.",
  },
]

// Datos de ejemplo para las categorías
const categories: Category[] = [
  {
    id: "1",
    slug: "openers",
    name: "Openers",
    imageUrl: "/placeholder.svg?height=500&width=500&query=video opener animation",
    description: "Free Openers Projects",
  },
  {
    id: "2",
    slug: "video-displays",
    name: "Video Displays",
    imageUrl: "/placeholder.svg?height=500&width=500&query=video displays",
    description: "Free Video Displays Projects",
  },
  {
    id: "3",
    slug: "logo-stings",
    name: "Logo Stings",
    imageUrl: "/placeholder.svg?height=500&width=500&query=logo sting animation",
    description: "Free Logo Stings Projects",
  },
  {
    id: "4",
    slug: "titles",
    name: "Titles",
    imageUrl: "/placeholder.svg?height=500&width=500&query=animated titles",
    description: "Free Titles Projects",
  },
  {
    id: "5",
    slug: "elements",
    name: "Elements",
    imageUrl: "/placeholder.svg?height=500&width=500&query=motion elements",
    description: "Free Elements Projects",
  },
  {
    id: "6",
    slug: "infographics",
    name: "Infographics",
    imageUrl: "/placeholder.svg?height=500&width=500&query=animated infographics",
    description: "Free Infographics Projects",
  },
  {
    id: "7",
    slug: "product-promo",
    name: "Product Promo",
    imageUrl: "/placeholder.svg?height=500&width=500&query=product promotion animation",
    description: "Free Product Promo Projects",
  },
  {
    id: "8",
    slug: "broadcast-packages",
    name: "Broadcast Packages",
    imageUrl: "/placeholder.svg?height=500&width=500&query=broadcast package animation",
    description: "Free Broadcast Packages Projects",
  },
  {
    id: "9",
    slug: "element-3d",
    name: "Element 3D",
    imageUrl: "/placeholder.svg?height=500&width=500&query=element 3d animation",
    description: "Free Element 3D Projects",
  },
  {
    id: "10",
    slug: "after-effects-add-ons",
    name: "After Effects Add Ons",
    imageUrl: "/placeholder.svg?height=500&width=500&query=after effects plugins",
    description: "Plugin, Script and Presets",
  },
  {
    id: "11",
    slug: "final-cut-pro-plugins",
    name: "Final Cut Pro X Plugins & Effects",
    imageUrl: "/placeholder.svg?height=500&width=500&query=final cut pro plugins",
    description: "All Free Plugin For FCPX",
  },
  {
    id: "12",
    slug: "apple-motion-templates",
    name: "Apple Motion & FCPX Templates",
    imageUrl: "/placeholder.svg?height=500&width=500&query=apple motion templates",
    description: "All Free Templates",
  },
  {
    id: "13",
    slug: "davinci-resolve-templates",
    name: "Davinci Resolve Templates",
    imageUrl: "/placeholder.svg?height=500&width=500&query=davinci resolve templates",
    description: "All Free Davinci Resolve Template",
  },
]

// Función para inicializar el cliente de Supabase
function getSupabaseClient() {
  const supabaseUrl = "https://pvzavggnmluqorrulxqx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emF2Z2dubWx1cW9ycnVseHF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1NTUyMSwiZXhwIjoyMDYyODMxNTIxfQ.Ylddk4lQklZCA-MY2i_v5fNnLdBmigy32CJnoIqAuJQ" // Tu ANON_KEY

  return createClient(supabaseUrl, supabaseKey)
}

// Convertir formato de base de datos a formato de Template
function dbToTemplate(dbTemplate: any): Template {
  return {
    id: dbTemplate.id,
    slug: dbTemplate.slug,
    title: dbTemplate.name,
    description: dbTemplate.description,
    fullDescription: dbTemplate.full_description || "",
    category: dbTemplate.category || "",
    thumbnailUrl: dbTemplate.thumbnail_url || "/placeholder.svg",
    videoUrl: dbTemplate.file_url || "",
    previewImages: dbTemplate.preview_images || [],
    price: typeof dbTemplate.price === "string" ? Number.parseFloat(dbTemplate.price) : dbTemplate.price || 0,
    isFree: dbTemplate.is_free || false,
    featured: dbTemplate.featured || false,
    resolution: dbTemplate.resolution || "",
    duration: dbTemplate.duration || "",
    aeVersion: dbTemplate.ae_version || "",
    plugins: dbTemplate.plugins || null,
    features: dbTemplate.features || [],
    instructions: dbTemplate.instructions || "",
  }
}

// Funciones para obtener datos
export async function getAllTemplates(): Promise<Template[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("products").select("*")

    if (error) {
      console.error("Error al obtener plantillas de Supabase:", error)
      return staticTemplates
    }

    if (data && data.length > 0) {
      return data.map(dbToTemplate)
    }

    return staticTemplates
  } catch (error) {
    console.error("Error al obtener plantillas:", error)
    return staticTemplates
  }
}

export async function getFeaturedTemplates(): Promise<Template[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("products").select("*").eq("featured", true)

    if (error) {
      console.error("Error al obtener plantillas destacadas de Supabase:", error)
      return staticTemplates.filter((template) => template.featured)
    }

    if (data && data.length > 0) {
      return data.map(dbToTemplate)
    }

    return staticTemplates.filter((template) => template.featured)
  } catch (error) {
    console.error("Error al obtener plantillas destacadas:", error)
    return staticTemplates.filter((template) => template.featured)
  }
}

export async function getFreeTemplates(): Promise<Template[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("products").select("*").eq("is_free", true)

    if (error) {
      console.error("Error al obtener plantillas gratuitas de Supabase:", error)
      return staticTemplates.filter((template) => template.isFree)
    }

    if (data && data.length > 0) {
      return data.map(dbToTemplate)
    }

    return staticTemplates.filter((template) => template.isFree)
  } catch (error) {
    console.error("Error al obtener plantillas gratuitas:", error)
    return staticTemplates.filter((template) => template.isFree)
  }
}

export async function getTemplateBySlug(slug: string): Promise<Template | undefined> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error al obtener plantilla por slug de Supabase:", error)
      return staticTemplates.find((template) => template.slug === slug)
    }

    if (data) {
      return dbToTemplate(data)
    }

    return staticTemplates.find((template) => template.slug === slug)
  } catch (error) {
    console.error("Error al obtener plantilla por slug:", error)
    return staticTemplates.find((template) => template.slug === slug)
  }
}

export async function getRelatedTemplates(currentId: string, category: string): Promise<Template[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", currentId)
      .limit(3)

    if (error) {
      console.error("Error al obtener plantillas relacionadas de Supabase:", error)
      return staticTemplates
        .filter((template) => template.id !== currentId && template.category === category)
        .slice(0, 3)
    }

    if (data && data.length > 0) {
      return data.map(dbToTemplate)
    }

    return staticTemplates.filter((template) => template.id !== currentId && template.category === category).slice(0, 3)
  } catch (error) {
    console.error("Error al obtener plantillas relacionadas:", error)
    return staticTemplates.filter((template) => template.id !== currentId && template.category === category).slice(0, 3)
  }
}

export function getCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}

export async function getNewTemplates(): Promise<Template[]> {
  try {
    const allTemplates = await getAllTemplates()
    // Ordenar por ID para obtener los más recientes (asumiendo que los IDs más altos son más recientes)
    return allTemplates.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3)
  } catch (error) {
    console.error("Error al obtener nuevas plantillas:", error)
    return staticTemplates.slice(0, 3)
  }
}
