"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "./cart-provider"
import type { Template } from "@/lib/templates"
import { useState } from "react"

interface AddToCartButtonProps {
  template: Template
}

export default function AddToCartButton({ template }: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart()
  const [isAdded, setIsAdded] = useState(isInCart(template.id))

  const handleAddToCart = () => {
    if (!isAdded) {
      addToCart(template)
      setIsAdded(true)

      // Reset button after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }
  }

  return (
    <Button onClick={handleAddToCart} size="lg" className="gap-2" disabled={isAdded}>
      {isAdded ? (
        <>
          <Check className="h-5 w-5" />
          Añadido al carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Añadir al carrito
        </>
      )}
    </Button>
  )
}
