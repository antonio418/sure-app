-- SCRIPT DE INSTALACIÓN: TABLA DE CRÉDITOS SURE
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.

-- 1. Crear la tabla de usuarios y sus créditos
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT,
    active_plan TEXT DEFAULT 'free', -- 'tactico', 'operativo', 'corporativo'
    available_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de logs para los webhooks (opcional pero muy recomendado para ver errores rápidos)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'error'
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS (Row Level Security) 
-- Dejamos las tablas seguras para que nadie pueda consultarlas directamente desde el Front-End.
-- Solo nuestro webhook de backend (con la Service Role Key) o tú en el panel administrativo podrán editarlas.
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Nota: No creamos políticas (Policies) públicas porque manejaremos todo desde el Backend (Service Role).
-- 
-- ⚠️ NOTA DE SEGURIDAD (Supabase - Mayo 2026):
-- A partir de esta fecha, las tablas nuevas en el esquema 'public' no se exponen por defecto a la API de datos
-- (PostgREST / supabase-js para anon/authenticated). 
-- Como estas tablas (user_credits y webhook_logs) se acceden exclusivamente desde tu Backend seguro con 
-- la Service Role Key, esta restricción es ideal y no requiere ningún cambio.
-- Si en el futuro creases una tabla que debas consultar directamente desde el Front-End, 
-- deberás añadir explícitamente:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.nombre_tabla TO anon, authenticated;

