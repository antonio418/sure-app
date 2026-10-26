-- SCRIPT: REGISTRO DE EJECUCIONES DEL ANALISIS (DIAGNOSTICO DE TIEMPOS Y CORTES)
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.
-- Guarda solo datos tecnicos de cada llamada: agente, modo, duracion, motivo de fin y error.
-- Nunca guarda el contenido de los documentos ni del informe.
-- Una fila que se queda en estado 'started' mucho tiempo indica que la funcion fue cortada.

CREATE TABLE IF NOT EXISTS public.analysis_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT,
    mode TEXT,
    status TEXT DEFAULT 'started',
    duration_ms INTEGER,
    stop_reason TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS analysis_runs_created_idx ON public.analysis_runs (created_at DESC);

ALTER TABLE public.analysis_runs ENABLE ROW LEVEL SECURITY;
-- Sin politicas: solo el Backend (Service Role) puede leer y escribir.
