-- SCRIPT: TABLA DE ENCUESTAS DE SATISFACCIÓN DNS
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.

CREATE TABLE IF NOT EXISTS public.dns_survey_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_analyzed TEXT,
    q1_ease TEXT,
    q2_confidence TEXT,
    q3_recommend TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.dns_survey_results ENABLE ROW LEVEL SECURITY;

-- Permitir que el Backend (Service Role) inserte datos libremente
CREATE POLICY "Allow Service Role full access to dns surveys"
ON public.dns_survey_results
FOR ALL
USING (true)
WITH CHECK (true);
