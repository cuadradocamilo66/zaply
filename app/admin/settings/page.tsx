"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, Loader2, Save, Copy } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

interface StoreSettings {
  store_name: string
  store_description: string
  contact_email: string
  contact_phone: string
  address: string
  currency: string
  currency_symbol: string
  tax_rate: number
  enable_tax: boolean
  enable_free_templates: boolean
  enable_featured_templates: boolean
  social_facebook: string
  social_twitter: string
  social_instagram: string
  social_youtube: string
  meta_title: string
  meta_description: string
  terms_conditions: string
  privacy_policy: string
  refund_policy: string
}

const defaultSettings: StoreSettings = {
  store_name: "Zaply",
  store_description: "Plantillas profesionales de After Effects",
  contact_email: "info@zaply.com",
  contact_phone: "+34 912 345 678",
  address: "Calle Gran Vía 123, 28013 Madrid, España",
  currency: "USD",
  currency_symbol: "$",
  tax_rate: 21,
  enable_tax: true,
  enable_free_templates: true,
  enable_featured_templates: true,
  social_facebook: "https://facebook.com/zaply",
  social_twitter: "https://twitter.com/zaply",
  social_instagram: "https://instagram.com/zaply",
  social_youtube: "https://youtube.com/zaply",
  meta_title: "Zaply - Plantillas profesionales de After Effects",
  meta_description:
    "Descubre nuestra colección de plantillas premium para After Effects. Mejora tus proyectos con efectos visuales profesionales.",
  terms_conditions: "Aquí van los términos y condiciones...",
  privacy_policy: "Aquí va la política de privacidad...",
  refund_policy: "Aquí va la política de reembolso...",
}

// SQL para crear la tabla store_settings
const createTableSQL = `
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

-- Habilitar RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir acceso
CREATE POLICY "Allow full access to store_settings" ON store_settings FOR ALL USING (true);

-- Insertar valores por defecto si la tabla está vacía
INSERT INTO store_settings (
  store_name, store_description, contact_email, contact_phone, address,
  currency, currency_symbol, tax_rate, enable_tax, enable_free_templates,
  enable_featured_templates, social_facebook, social_twitter, social_instagram,
  social_youtube, meta_title, meta_description, terms_conditions, privacy_policy,
  refund_policy
)
SELECT 
  'Zaply', 'Plantillas profesionales de After Effects', 'info@zaply.com',
  '+34 912 345 678', 'Calle Gran Vía 123, 28013 Madrid, España', 'USD', '$',
  21, true, true, true, 'https://facebook.com/zaply', 'https://twitter.com/zaply',
  'https://instagram.com/zaply', 'https://youtube.com/zaply',
  'Zaply - Plantillas profesionales de After Effects',
  'Descubre nuestra colección de plantillas premium para After Effects. Mejora tus proyectos con efectos visuales profesionales.',
  'Aquí van los términos y condiciones...', 'Aquí va la política de privacidad...',
  'Aquí va la política de reembolso...'
WHERE NOT EXISTS (SELECT 1 FROM store_settings);
`

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tableExists, setTableExists] = useState(true)
  const [showSQLInstructions, setShowSQLInstructions] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true)

        // Intentar obtener los datos
        const { data, error } = await supabase.from("store_settings").select("*").maybeSingle()

        if (error) {
          console.error("Error al obtener la configuración:", error)

          // Verificar si el error es porque la tabla no existe
          if (error.message.includes("does not exist")) {
            setTableExists(false)
            setShowSQLInstructions(true)
          }

          // Usar valores por defecto
          setSettings(defaultSettings)
        } else if (data) {
          // Combinar los datos obtenidos con los valores por defecto
          setSettings({ ...defaultSettings, ...data })
        }
      } catch (error) {
        console.error("Error general:", error)
        // Usar valores por defecto
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createTableSQL)
    toast({
      title: "Copiado",
      description: "SQL copiado al portapapeles",
    })
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!tableExists) {
        toast({
          title: "Error",
          description: "La tabla store_settings no existe. Por favor, crea la tabla primero.",
          variant: "destructive",
        })
        setShowSQLInstructions(true)
        return
      }

      // Verificar si ya existe un registro
      const { data, count, error: countError } = await supabase.from("store_settings").select("*", { count: "exact" })

      if (countError) {
        throw new Error(`Error al verificar registros: ${countError.message}`)
      }

      let saveError

      if (!data || data.length === 0) {
        // Insertar nuevo registro
        const { error } = await supabase.from("store_settings").insert(settings)

        saveError = error
      } else {
        // Actualizar el primer registro existente
        const { error } = await supabase.from("store_settings").update(settings).eq("id", data[0].id)

        saveError = error
      }

      if (saveError) {
        throw new Error(`Error al guardar la configuración: ${saveError.message}`)
      }

      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente",
      })
    } catch (error: any) {
      console.error("Error al guardar:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Configuración de la Tienda</h1>
      </div>

      {!tableExists && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>La tabla store_settings no existe</AlertTitle>
          <AlertDescription>
            Para guardar la configuración, necesitas crear la tabla en Supabase.
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => setShowSQLInstructions(!showSQLInstructions)}
            >
              {showSQLInstructions ? "Ocultar instrucciones" : "Mostrar instrucciones"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showSQLInstructions && (
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones para crear la tabla</CardTitle>
            <CardDescription>
              Ejecuta el siguiente SQL en el editor SQL de Supabase para crear la tabla store_settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md relative">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">{createTableSQL}</pre>
              <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Una vez creada la tabla, recarga esta página para poder guardar la configuración.
            </p>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Pagos</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        {/* Pestaña General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Configura la información básica de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Nombre de la Tienda</Label>
                  <Input id="store_name" name="store_name" value={settings.store_name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email de Contacto</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store_description">Descripción de la Tienda</Label>
                <Textarea
                  id="store_description"
                  name="store_description"
                  value={settings.store_description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={settings.contact_phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={settings.address} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_title">Título Meta (SEO)</Label>
                <Input id="meta_title" name="meta_title" value={settings.meta_title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Descripción Meta (SEO)</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  value={settings.meta_description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_free_templates"
                    checked={settings.enable_free_templates}
                    onCheckedChange={(checked) => handleSwitchChange("enable_free_templates", checked)}
                  />
                  <Label htmlFor="enable_free_templates">Habilitar plantillas gratuitas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_featured_templates"
                    checked={settings.enable_featured_templates}
                    onCheckedChange={(checked) => handleSwitchChange("enable_featured_templates", checked)}
                  />
                  <Label htmlFor="enable_featured_templates">Habilitar plantillas destacadas</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Pagos */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pagos</CardTitle>
              <CardDescription>Configura las opciones de pago y moneda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input id="currency" name="currency" value={settings.currency} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency_symbol">Símbolo de Moneda</Label>
                  <Input
                    id="currency_symbol"
                    name="currency_symbol"
                    value={settings.currency_symbol}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tasa de Impuesto (%)</Label>
                <Input
                  id="tax_rate"
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.tax_rate}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_tax"
                  checked={settings.enable_tax}
                  onCheckedChange={(checked) => handleSwitchChange("enable_tax", checked)}
                />
                <Label htmlFor="enable_tax">Habilitar impuestos</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Redes Sociales */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Configura los enlaces a tus redes sociales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    name="social_facebook"
                    value={settings.social_facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    name="social_twitter"
                    value={settings.social_twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/tu-usuario"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    name="social_instagram"
                    value={settings.social_instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/tu-usuario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    name="social_youtube"
                    value={settings.social_youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/tu-canal"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Legal */}
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Información Legal</CardTitle>
              <CardDescription>Configura los textos legales de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms_conditions">Términos y Condiciones</Label>
                <Textarea
                  id="terms_conditions"
                  name="terms_conditions"
                  value={settings.terms_conditions}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy_policy">Política de Privacidad</Label>
                <Textarea
                  id="privacy_policy"
                  name="privacy_policy"
                  value={settings.privacy_policy}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund_policy">Política de Reembolso</Label>
                <Textarea
                  id="refund_policy"
                  name="refund_policy"
                  value={settings.refund_policy}
                  onChange={handleChange}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !tableExists} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
