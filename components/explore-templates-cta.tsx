"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"

export default function ExploreTemplatesCta() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0) 70%)"
            : "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Elementos decorativos */}
      <motion.div
        className="absolute -left-20 top-1/4 w-40 h-40 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl"
        animate={{
          x: [0, 20, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-20 bottom-1/4 w-60 h-60 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl"
        animate={{
          x: [0, -30, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Explora Todas Nuestras Plantillas</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección completa de plantillas premium y gratuitas para After Effects. Encuentra la
              plantilla perfecta para tu próximo proyecto.
            </p>

            <Link href="/templates">
              <Button className="group">
                Ver Todas las Plantillas
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                    repeatDelay: 1,
                  }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
