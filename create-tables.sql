-- Crear la tabla pages si no existe
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

-- Crear la tabla page_sections si no existe
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
