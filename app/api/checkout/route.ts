import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, customerEmail } = body

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: "Product ID and customer email are required" },
        { status: 400 }
      )
    }

    // Inicializar Supabase
    const supabase = createServerComponentClient({ cookies })

    // Obtener el producto
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      console.error("Product fetch error:", productError)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Validar precio
    if (typeof product.price !== "number" || isNaN(product.price)) {
      return NextResponse.json({ error: "Invalid product price" }, { status: 400 })
    }

    if (product.price === 0) {
      // Producto gratis: crear orden directamente como completada
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          stripe_session_id: null,
          customer_email: customerEmail,
          amount: 0,
          status: "completed",
        })
        .select()
        .single()

      if (orderError) {
        console.error("Error creating free order:", orderError)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
      }

      const { error: itemError } = await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: product.id,
        price: 0,
      })

      if (itemError) {
        console.error("Error creating order item:", itemError)
        return NextResponse.json({ error: "Failed to create order item" }, { status: 500 })
      }

      // Retornar url para ir a la plantilla o confirmación
      return NextResponse.json({ url: `/templates/${product.slug}` })
    }

    // Producto con precio > 0: crear sesión Stripe normalmente
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: product.thumbnail_url ? [product.thumbnail_url] : [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/templates/`,
      customer_email: customerEmail,
      metadata: {
        productId: product.id,
      },
    })

    if (!session || !session.id || !session.url) {
      return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 })
    }

    // Crear orden pendiente
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        amount: product.price,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", {
        message: orderError.message,
        code: orderError.code,
        details: orderError.details,
        hint: orderError.hint,
      })
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Crear item de orden
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      price: product.price,
    })

    if (itemError) {
      console.error("Error creating order item:", itemError)
      return NextResponse.json({ error: "Failed to create order item" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Checkout error:", error?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
