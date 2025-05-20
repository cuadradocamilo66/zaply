export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  coverImage: string
  date: string
  author: string
  category: string
  readTime: number
  featured: boolean
}

// Datos de ejemplo para los posts del blog
const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "10-consejos-para-mejorar-tus-animaciones-en-after-effects",
    title: "10 consejos para mejorar tus animaciones en After Effects",
    excerpt: "Aprende técnicas avanzadas para llevar tus animaciones al siguiente nivel y destacar en tus proyectos.",
    coverImage: "/placeholder.svg?key=e8b70",
    date: "15 de mayo, 2023",
    author: "Carlos Rodríguez",
    category: "Tutoriales",
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "tendencias-de-motion-graphics-para-2023",
    title: "Tendencias de Motion Graphics para 2023",
    excerpt: "Descubre las tendencias más populares en motion graphics que dominarán la industria este año.",
    coverImage: "/placeholder.svg?key=g86ep",
    date: "3 de abril, 2023",
    author: "Laura Martínez",
    category: "Tendencias",
    readTime: 6,
    featured: false,
  },
  {
    id: "3",
    slug: "como-crear-transiciones-fluidas-en-after-effects",
    title: "Cómo crear transiciones fluidas en After Effects",
    excerpt: "Guía paso a paso para crear transiciones profesionales que impresionarán a tu audiencia.",
    coverImage: "/placeholder.svg?key=t7g3w",
    date: "18 de marzo, 2023",
    author: "Miguel Ángel",
    category: "Tutoriales",
    readTime: 10,
    featured: false,
  },
  {
    id: "4",
    slug: "plugins-esenciales-para-after-effects-en-2023",
    title: "Plugins esenciales para After Effects en 2023",
    excerpt: "Una selección de los mejores plugins que todo motion designer debería tener en su arsenal.",
    coverImage: "/placeholder.svg?height=720&width=1280&query=after effects plugins",
    date: "5 de febrero, 2023",
    author: "Carlos Rodríguez",
    category: "Recursos",
    readTime: 7,
    featured: false,
  },
  {
    id: "5",
    slug: "optimizacion-de-rendimiento-en-after-effects",
    title: "Optimización de rendimiento en After Effects",
    excerpt: "Aprende a mejorar la velocidad y eficiencia de After Effects para trabajar con proyectos complejos.",
    coverImage: "/placeholder.svg?height=720&width=1280&query=after effects performance optimization",
    date: "20 de enero, 2023",
    author: "Laura Martínez",
    category: "Consejos",
    readTime: 9,
    featured: false,
  },
  {
    id: "6",
    slug: "animacion-de-personajes-en-after-effects",
    title: "Animación de personajes en After Effects",
    excerpt:
      "Técnicas avanzadas para dar vida a tus personajes utilizando After Effects y herramientas complementarias.",
    coverImage: "/placeholder.svg?height=720&width=1280&query=character animation after effects",
    date: "10 de diciembre, 2022",
    author: "Miguel Ángel",
    category: "Tutoriales",
    readTime: 12,
    featured: false,
  },
]

// Funciones para obtener datos
export function getBlogPosts(): BlogPost[] {
  return blogPosts
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentId: string, category: string): BlogPost[] {
  return blogPosts.filter((post) => post.id !== currentId && post.category === category).slice(0, 3)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured)
}
