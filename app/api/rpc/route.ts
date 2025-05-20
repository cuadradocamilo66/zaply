import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { action, params } = await request.json()

  try {
    if (action === "create_pages_table") {
      // Crear la tabla de páginas
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS pages (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          visible BOOLEAN DEFAULT true,
          order INTEGER DEFAULT 0,
          meta_title TEXT,
          meta_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    if (action === "create_blog_tables") {
      // Crear las tablas para el blog
      const { error: blogError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          content TEXT,
          excerpt TEXT,
          featured_image TEXT,
          published BOOLEAN DEFAULT false,
          featured BOOLEAN DEFAULT false,
          author_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS blog_categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS blog_post_categories (
          post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
          category_id INTEGER REFERENCES blog_categories(id) ON DELETE CASCADE,
          PRIMARY KEY (post_id, category_id)
        );
      `)

      if (blogError) throw blogError

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
  } catch (error) {
    console.error("RPC error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
