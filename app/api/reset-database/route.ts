import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // SQL para eliminar la tabla products
    const dropTableSQL = `DROP TABLE IF EXISTS products;`

    // Ejecutar SQL para eliminar la tabla
    const { error } = await supabase.rpc("exec_sql", { sql: dropTableSQL })

    if (error) {
      return NextResponse.json({ error: `Error al eliminar la tabla: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos reiniciada correctamente. Ahora puedes sincronizar las plantillas nuevamente.",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
