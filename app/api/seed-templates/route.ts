import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAllTemplates } from "@/lib/templates"

// Función para generar un UUID v4 válido
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Obtener todas las plantillas del archivo templates.ts
    const templates = await getAllTemplates()

    // Convertir las plantillas al formato de la base de datos
    const dbTemplates = templates.map((template) => ({
      // Usar un UUID v4 completo y válido
      id: uuidv4(),
      name: template.title,
      slug: template.slug,
      description: template.description,
      full_description: template.fullDescription,
      category: template.category,
      thumbnail_url: template.thumbnailUrl,
      file_url: template.videoUrl,
      preview_images: template.previewImages,
      price: template.price,
      is_free: template.isFree,
      featured: template.featured,
      resolution: template.resolution,
      duration: template.duration,
      ae_version: template.aeVersion,
      plugins: template.plugins,
      features: template.features,
      instructions: template.instructions,
    }))

    // Intentar eliminar la tabla existente primero
    try {
      const dropTableSQL = `DROP TABLE IF EXISTS products;`
      await supabase.rpc("exec_sql", { sql: dropTableSQL })
    } catch (dropError) {
      console.error("Error al eliminar la tabla:", dropError)
      // Continuamos incluso si hay error al eliminar
    }

    // Crear la tabla con la estructura correcta
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        full_description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT,
        thumbnail_url TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size BIGINT,
        resolution TEXT,
        duration TEXT,
        ae_version TEXT,
        plugins TEXT,
        instructions TEXT,
        is_free BOOLEAN DEFAULT FALSE,
        featured BOOLEAN DEFAULT FALSE,
        preview_images TEXT[] DEFAULT '{}',
        features TEXT[] DEFAULT '{}'
      );
      
      -- Habilitar RLS
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      
      -- Crear política para permitir acceso
      CREATE POLICY "Allow full access to products" ON products FOR ALL USING (true);
    `

    // Ejecutar SQL para crear la tabla
    const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

    if (createError) {
      return NextResponse.json({ error: `Error al crear la tabla: ${createError.message}` }, { status: 500 })
    }

    // Insertar las plantillas en la base de datos
    const { error } = await supabase.from("products").upsert(dbTemplates, {
      onConflict: "id",
      ignoreDuplicates: false,
    })

    if (error) {
      return NextResponse.json({ error: `Error al insertar plantillas: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${dbTemplates.length} plantillas sincronizadas correctamente`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
