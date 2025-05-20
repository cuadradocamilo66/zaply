import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { table } = await request.json()

    if (table === "pages") {
      // Crear la tabla pages
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS pages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          visible BOOLEAN DEFAULT true,
          order INTEGER DEFAULT 0,
          meta_title TEXT,
          meta_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS pero permitir acceso completo
        ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON pages;
        CREATE POLICY "Allow full access to all users" ON pages FOR ALL USING (true);
      `)

      return NextResponse.json({ success: true, message: "Tabla pages creada correctamente" })
    }

    if (table === "page_sections") {
      // Crear la tabla page_sections
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS page_sections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          component TEXT NOT NULL,
          is_visible BOOLEAN DEFAULT true,
          page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
          order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS pero permitir acceso completo
        ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON page_sections;
        CREATE POLICY "Allow full access to all users" ON page_sections FOR ALL USING (true);
      `)

      return NextResponse.json({ success: true, message: "Tabla page_sections creada correctamente" })
    }

    if (table === "blog_tables") {
      // Crear las tablas para el blog
      await supabase.query(`
        -- Tabla para posts del blog
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT,
          cover_image TEXT,
          published BOOLEAN DEFAULT false,
          featured BOOLEAN DEFAULT false,
          author TEXT,
          category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Tabla para categorías del blog
        CREATE TABLE IF NOT EXISTS blog_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS pero permitir acceso completo
        ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON blog_posts;
        CREATE POLICY "Allow full access to all users" ON blog_posts FOR ALL USING (true);
        
        ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow full access to all users" ON blog_categories;
        CREATE POLICY "Allow full access to all users" ON blog_categories FOR ALL USING (true);
      `)

      return NextResponse.json({ success: true, message: "Tablas del blog creadas correctamente" })
    }

    return NextResponse.json({ error: "Tabla no especificada" }, { status: 400 })
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
