"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { Trash2 } from "lucide-react"
import CheckoutForm from "@/components/checkout-form"

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price, 0)

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex flex-col items-center justify-center text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
          <p className="text-muted-foreground">Parece que aún no has agregado ninguna plantilla a tu carrito.</p>
          <Link href="/templates">
            <Button size="lg">Explorar plantillas</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image src={item.thumbnailUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar del carrito"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg space-y-4">
            <h2 className="text-xl font-bold">Resumen del pedido</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={() => setIsCheckingOut(true)} disabled={isCheckingOut}>
              Proceder al pago
            </Button>
          </div>

          {isCheckingOut && (
            <div className="p-6 border rounded-lg space-y-4">
              <h2 className="text-xl font-bold">Información de pago</h2>
              <CheckoutForm onSuccess={() => clearCart()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
