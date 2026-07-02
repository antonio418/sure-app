-- SCRIPT: TABLA DE PLANES DE CONTINGENCIA PERSONALIZADOS (RMA)
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.

CREATE TABLE IF NOT EXISTS public.contingency_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_type TEXT NOT NULL,
    survey_responses JSONB NOT NULL,
    generated_plan_md TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.contingency_plans ENABLE ROW LEVEL SECURITY;

-- Permitir que el Backend (Service Role) realice todas las operaciones libremente
CREATE POLICY "Allow Service Role full access to contingency plans"
ON public.contingency_plans
FOR ALL
USING (true)
WITH CHECK (true);

-- Opcional: Permitir lectura pública de los planes si se comparte el ID de UUID
-- (Esto permite que el frontend lea el plan generado directamente usando el cliente de Supabase anon)
CREATE POLICY "Allow public read access to plans by ID"
ON public.contingency_plans
FOR SELECT
TO public
USING (true);
