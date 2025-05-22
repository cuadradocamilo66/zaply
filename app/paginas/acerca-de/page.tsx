import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Acerca de Zaply - Plantillas profesionales para After Effects",
  description:
    "Conoce a Zaply y a nuestro equipo de expertos en After Effects. Descubre nuestra misión y valores que nos impulsan a crear las mejores plantillas.",
}

export default async function AcercaDePage() {
  const supabase = createServerComponentClient({ cookies })
  const slug = "/acerca-de"

  const { data: page, error } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (error || !page) {
    console.error("Error fetching page:", error)
    notFound()
  }

  const joelSkills = [
    { name: "After Effects", level: 95 },
    { name: "Premiere Pro", level: 90 },
    { name: "Photoshop", level: 85 },
    { name: "Illustrator", level: 80 },
    { name: "Cinema 4D", level: 75 },
  ]

  const camiloSkills = [
    { name: "After Effects", level: 90 },
    { name: "Desarrollo Web", level: 85 },
    { name: "UI/UX Design", level: 80 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
  ]

  const services = [
    {
      id: "templates",
      title: "Plantillas Personalizadas",
      description: "Creación de plantillas de After Effects a medida para tus necesidades específicas.",
      icon: "/template-icon.png",
    },
    {
      id: "animation",
      title: "Animación de Logos",
      description: "Animaciones profesionales para dar vida a tu marca y captar la atención de tu audiencia.",
      icon: "/animation-icon.png",
    },
    {
      id: "motion",
      title: "Motion Graphics",
      description: "Gráficos animados para videos, presentaciones y contenido digital de alta calidad.",
      icon: "/placeholder-tn07r.png",
    },
    {
      id: "training",
      title: "Formación y Tutorías",
      description: "Sesiones personalizadas para aprender After Effects y mejorar tus habilidades.",
      icon: "/training-icon.png",
    },
  ]

  return (
    <div className="container py-12">
      {page.featured_image && (
        <div className="mb-8">
          <img
            src={page.featured_image || "/placeholder.svg"}
            alt={page.title}
            className="w-full h-[300px] object-cover rounded-lg"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Sobre Zaply</h1>

        <p className="mb-6">
          Zaply es una empresa dedicada a la creación de plantillas profesionales para After Effects, fundada por dos entusiastas del diseño y la animación digital que buscan simplificar y potenciar el trabajo creativo de otros profesionales.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Nuestro Equipo</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                <Image src="/professional-man-portrait.png" alt="Joel Salcedo Ojeda" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Joel Salcedo Ojeda</h3>
              <p className="text-muted-foreground">Co-fundador & Director Creativo</p>

              <div className="flex gap-2 mt-2">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
              </div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">Sobre mí</TabsTrigger>
                <TabsTrigger value="skills">Habilidades</TabsTrigger>
                <TabsTrigger value="experience">Experiencia</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <p>
                  Especialista en animación y efectos visuales con más de 8 años de experiencia en la industria. Joel
                  aporta su visión creativa y conocimiento técnico para crear plantillas de la más alta calidad.
                </p>
                <p className="mt-2">
                  Su pasión por el diseño de movimiento comenzó cuando descubrió el poder de After Effects para dar vida
                  a ideas creativas. Desde entonces, ha perfeccionado su habilidad para crear animaciones que destacan.
                </p>
              </TabsContent>

              <TabsContent value="skills" className="mt-4 space-y-4">
                {joelSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="experience" className="mt-4">
                <div className="space-y-4">
                  <div className="relative pl-6 pb-4 border-l border-muted">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-0"></div>
                    <div className="mb-1">
                      <Badge>2020 - Presente</Badge>
                    </div>
                    <h4 className="font-semibold">Co-fundador y Director Creativo</h4>
                    <p className="text-sm text-muted-foreground">Zaply</p>
                  </div>

                  <div className="relative pl-6 pb-4 border-l border-muted">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-0"></div>
                    <div className="mb-1">
                      <Badge>2017 - 2020</Badge>
                    </div>
                    <h4 className="font-semibold">Motion Designer Senior</h4>
                    <p className="text-sm text-muted-foreground">Estudio Creativo Nexus</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                <Image src="/young-man-portrait.png" alt="Camilo Cuadrado" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Camilo Cuadrado</h3>
              <p className="text-muted-foreground">Co-fundador & Director Técnico</p>

              <div className="flex gap-2 mt-2">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
              </div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">Sobre mí</TabsTrigger>
                <TabsTrigger value="skills">Habilidades</TabsTrigger>
                <TabsTrigger value="experience">Experiencia</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <p>
                  Con una sólida formación en diseño digital y programación, Camilo se encarga de que nuestras
                  plantillas sean técnicamente impecables y fáciles de usar para todos nuestros clientes.
                </p>
                <p className="mt-2">
                  Su enfoque en la usabilidad y la experiencia del usuario garantiza que cada plantilla no solo se vea
                  increíble, sino que también sea intuitiva y accesible para usuarios de todos los niveles.
                </p>
              </TabsContent>

              <TabsContent value="skills" className="mt-4 space-y-4">
                {camiloSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="experience" className="mt-4">
                <div className="space-y-4">
                  <div className="relative pl-6 pb-4 border-l border-muted">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-0"></div>
                    <div className="mb-1">
                      <Badge>2020 - Presente</Badge>
                    </div>
                    <h4 className="font-semibold">Co-fundador y Director Técnico</h4>
                    <p className="text-sm text-muted-foreground">Zaply</p>
                  </div>

                  <div className="relative pl-6 pb-4 border-l border-muted">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-0"></div>
                    <div className="mb-1">
                      <Badge>2016 - 2020</Badge>
                    </div>
                    <h4 className="font-semibold">Desarrollador Frontend</h4>
                    <p className="text-sm text-muted-foreground">Agencia Digital Impulso</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Nuestros Servicios</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Image src={service.icon || "/placeholder.svg"} alt={service.title} width={24} height={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Nuestra Misión</h2>
        <p className="mb-6">
          En Zaply, nos dedicamos a crear plantillas de After Effects que combinan diseño profesional, animaciones
          fluidas y facilidad de uso. Nuestro objetivo es ayudar a creadores de contenido, diseñadores y empresas a
          elevar la calidad de sus proyectos audiovisuales sin necesidad de partir desde cero.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Nuestros Valores</h2>
        <ul className="list-disc pl-6 mb-10 space-y-2">
          <li>
            <strong>Calidad:</strong> Cada plantilla es cuidadosamente diseñada y probada para garantizar resultados
            profesionales.
          </li>
          <li>
            <strong>Innovación:</strong> Constantemente exploramos nuevas técnicas y tendencias para mantenernos a la
            vanguardia.
          </li>
          <li>
            <strong>Accesibilidad:</strong> Creamos plantillas que son fáciles de personalizar, incluso para usuarios
            con conocimientos básicos.
          </li>
          <li>
            <strong>Servicio al cliente:</strong> Ofrecemos soporte técnico y estamos comprometidos con la satisfacción
            de nuestros clientes.
          </li>
        </ul>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">¿Listo para trabajar juntos?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Si estás interesado en nuestros servicios o quieres saber más sobre nuestras plantillas de After Effects, no
            dudes en contactarnos.
          </p>
          <Link href="/contact">
            <Button className="gap-2">
              Contactar ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
