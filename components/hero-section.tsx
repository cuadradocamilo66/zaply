"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const handleScroll = () => {
      // Función para manejar el scroll
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Función para manejar cuando el iframe ha cargado
  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  // Variantes para las animaciones
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo de Spline - Nuevo modelo de montaña rusa galáctica */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          ref={iframeRef}
          src="https://my.spline.design/galaxyrollercoaster-ODZq12bqMO8EEkp1FcZ1KVMe/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full pointer-events-auto"
          onLoad={handleIframeLoad}
          title="Galaxy Roller Coaster 3D Background"
          style={{ zIndex: 1 }}
        />

        {/* Overlay para mejorar la legibilidad del texto - Ajustado para ambos modos */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isDark
              ? "bg-gradient-to-b from-background/70 via-background/30 to-transparent"
              : "bg-gradient-to-b from-white/80 via-white/50 to-transparent"
          }`}
          style={{ zIndex: 2 }}
        />
      </div>

      {/* Partículas flotantes - Ajustadas para complementar el nuevo fondo */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-purple-500/10" : "bg-purple-500/5"
        }`}
        style={{ zIndex: 3 }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-cyan-500/10" : "bg-cyan-500/5"
        }`}
        style={{ zIndex: 3 }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Contenido del hero - Ajustado para mejor contraste con el nuevo fondo */}
      <div className="container relative px-4 md:px-6 flex flex-col items-center text-center" style={{ zIndex: 10 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto pointer-events-none"
          style={{
            opacity: iframeLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <motion.h1
            variants={titleVariants}
            className={cn(
              "text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6",
              isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500" : "text-white", // Cambiado a blanco sólido en modo claro
            )}
          >
            Eleva Tus Creaciones con After Effects
          </motion.h1>

          <motion.p
            custom={0}
            variants={fadeInUp}
            className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${isDark ? "text-white" : "text-white"}`}
          >
            Plantillas profesionales diseñadas para transformar tus proyectos y destacar en el mundo digital
          </motion.p>

          <motion.div
            custom={1}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
          >
            <Link href="/templates">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-8 py-6">
                Explorar Plantillas
              </Button>
            </Link>
            <Link href="/free-templates">
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "text-lg px-8 py-6",
                  isDark
                    ? "border-purple-400 text-white hover:bg-purple-500/20"
                    : "border-white text-white bg-transparent hover:bg-white/20", // Mejorado para visibilidad en modo claro
                )}
              >
                Plantillas Gratuitas
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Flecha de scroll - Ajustada para mejor visibilidad */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 10 }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isDark ? "text-white" : "text-white"}
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  )
}
