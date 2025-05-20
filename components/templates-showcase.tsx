"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"

export default function TemplatesShowcase() {
  const [activeTab, setActiveTab] = useState("motion-graphics")

  const showcaseItems = {
    "motion-graphics": {
      title: "Motion Graphics",
      description: "Animaciones dinámicas y efectos visuales para captar la atención de tu audiencia",
      image: "/placeholder-kqvpb.png",
      videoUrl: "https://example.com/video1.mp4",
      features: ["Transiciones fluidas", "Efectos de partículas", "Animaciones de texto", "Elementos 3D"],
    },
    intros: {
      title: "Intros y Logos",
      description: "Presentaciones impactantes para tu marca o canal que dejarán una impresión duradera",
      image: "/placeholder-mjwem.png",
      videoUrl: "https://example.com/video2.mp4",
      features: ["Revelaciones de logo", "Animaciones 3D", "Efectos de luz", "Audio sincronizado"],
    },
    titles: {
      title: "Títulos y Tercios",
      description: "Elementos gráficos profesionales para tus videos y producciones audiovisuales",
      image: "/placeholder-bfxfj.png",
      videoUrl: "https://example.com/video3.mp4",
      features: ["Títulos animados", "Lower thirds", "Subtítulos", "Créditos finales"],
    },
    social: {
      title: "Redes Sociales",
      description: "Plantillas optimizadas para Instagram, TikTok, YouTube y otras plataformas sociales",
      image: "/placeholder-99wxr.png",
      videoUrl: "https://example.com/video4.mp4",
      features: ["Formato vertical", "Transiciones rápidas", "Efectos de texto", "Elementos interactivos"],
    },
  }

  const item = showcaseItems[activeTab as keyof typeof showcaseItems]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Descubre Nuestras Plantillas en Acción
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Visualiza cómo nuestras plantillas pueden transformar tus proyectos con ejemplos reales
          </p>
        </div>

        <Tabs defaultValue="motion-graphics" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="motion-graphics">Motion Graphics</TabsTrigger>
              <TabsTrigger value="intros">Intros y Logos</TabsTrigger>
              <TabsTrigger value="titles">Títulos y Tercios</TabsTrigger>
              <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            </TabsList>
          </div>

          {Object.keys(showcaseItems).map((key) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    key={activeTab}
                  >
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground mb-6">{item.description}</p>

                    <div className="mb-8">
                      <h4 className="font-medium mb-3">Características:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {item.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={`/templates?category=${activeTab}`}>
                        <Button>Ver plantillas de {item.title}</Button>
                      </Link>
                      <Link href="/templates">
                        <Button variant="outline">Explorar todas</Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                <div className="relative order-1 md:order-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    key={`img-${activeTab}`}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-xl"
                  >
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-16 h-16 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all"
                      >
                        <Play className="h-8 w-8 text-primary" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
