-- ============================================================
-- Esquema de base de datos para catálogo SGestion
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS public.productos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  precio      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  categoria   TEXT NOT NULL,
  imagen_url  TEXT,
  stock       INTEGER,          -- NULL = sin control de stock
  destacado   BOOLEAN NOT NULL DEFAULT false,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para mejorar performance en los filtros más usados
CREATE INDEX IF NOT EXISTS idx_productos_categoria  ON public.productos (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo     ON public.productos (activo);
CREATE INDEX IF NOT EXISTS idx_productos_destacado  ON public.productos (destacado);
CREATE INDEX IF NOT EXISTS idx_productos_nombre     ON public.productos (nombre);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_productos_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo productos activos
CREATE POLICY "Lectura pública de productos activos"
  ON public.productos
  FOR SELECT
  USING (activo = true);

-- Escritura: solo usuarios autenticados (admin)
CREATE POLICY "Admin puede leer todos los productos"
  ON public.productos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede insertar productos"
  ON public.productos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar productos"
  ON public.productos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar productos"
  ON public.productos
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Datos de ejemplo (opcional, quitar en producción)
-- ============================================================

INSERT INTO public.productos (nombre, descripcion, precio, categoria, destacado, activo) VALUES
  ('Sistema de Gestión Comercial', 'Software completo para administrar ventas, stock e inventario.', 45000, 'Sistemas', true, true),
  ('Módulo de Facturación', 'Integración con AFIP para factura electrónica A, B y C.', 18000, 'Sistemas', false, true),
  ('Soporte Técnico Mensual', 'Asistencia remota y presencial. SLA 4 horas hábiles.', 8500, 'Servicios', false, true),
  ('Teclado Mecánico TKL', 'Switches Red, retroiluminado RGB, conexión USB-C.', 22000, 'Hardware', true, true),
  ('Mouse Inalámbrico', 'Sensor óptico 1600 DPI, batería recargable.', 9800, 'Hardware', false, true)
ON CONFLICT DO NOTHING;
