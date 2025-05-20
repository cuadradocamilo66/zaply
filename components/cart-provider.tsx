"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { Template } from "@/lib/templates"

interface CartContextType {
  cart: Template[]
  addToCart: (template: Template) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
}

// Crear el contexto con un valor inicial definido
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
})

// Exportar el hook useCart
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider")
  }
  return context
}

// Exportar el componente CartProvider
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Template[]>([])
  const [mounted, setMounted] = useState(false)

  // Manejar el montaje del componente
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error)
      }
    }
  }, [mounted])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem("cart", JSON.stringify(cart))
      } catch (error) {
        console.error("Error al guardar el carrito:", error)
      }
    }
  }, [cart, mounted])

  const addToCart = (template: Template) => {
    if (!isInCart(template.id)) {
      setCart((prevCart) => [...prevCart, template])
    }
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id)
  }

  // Proporcionar un valor por defecto mientras el componente no está montado
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}
