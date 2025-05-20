-- Crear tabla de productos
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

-- Crear tabla de configuración de la tienda
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL,
  store_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  currency TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  tax_rate NUMERIC DEFAULT 0,
  enable_tax BOOLEAN DEFAULT false,
  enable_free_templates BOOLEAN DEFAULT true,
  enable_featured_templates BOOLEAN DEFAULT true,
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_youtube TEXT,
  meta_title TEXT,
  meta_description TEXT,
  terms_conditions TEXT,
  privacy_policy TEXT,
  refund_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar la extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar RLS para ambas tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir acceso
CREATE POLICY "Allow full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Allow full access to store_settings" ON store_settings FOR ALL USING (true);
