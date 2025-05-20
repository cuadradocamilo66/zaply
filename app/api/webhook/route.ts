import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"

// Esta función maneja los webhooks de Stripe
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createServerComponentClient({ cookies })

  // Manejar el evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    try {
      // Actualizar el estado de la orden
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent,
          customer_name: session.customer_details?.name || null,
        })
        .eq("stripe_session_id", session.id)
        .select()
        .single()

      if (orderError) {
        console.error("Error updating order:", orderError)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
      }

      // Obtener los items de la orden
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("product_id")
        .eq("order_id", order.id)

      if (itemsError) {
        console.error("Error fetching order items:", itemsError)
        return NextResponse.json({ error: "Failed to fetch order items" }, { status: 500 })
      }

      // Crear enlaces de descarga para cada producto
      const downloadPromises = orderItems.map(async (item) => {
        const downloadToken = randomUUID()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // Válido por 7 días

        return supabase.from("downloads").insert({
          order_id: order.id,
          product_id: item.product_id,
          download_token: downloadToken,
          expires_at: expiresAt.toISOString(),
        })
      })

      await Promise.all(downloadPromises)

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("Error processing webhook:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
