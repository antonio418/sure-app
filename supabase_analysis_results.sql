-- SCRIPT: BUZON TEMPORAL DE RESULTADOS (RECUPERACION TRAS UN CORTE DE CONEXION)
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.
-- Guarda el informe final SOLO de forma temporal: se vacia en cuanto se descuenta el credito
-- y las filas se borran solas pasadas 24 horas. Sirve para que un corte de conexion
-- no haga perder un informe ya generado, y para no cobrar dos veces el mismo informe.

CREATE TABLE IF NOT EXISTS public.analysis_results (
    job_id UUID PRIMARY KEY,
    email TEXT,
    report TEXT,
    credit_charged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analysis_results_created_idx ON public.analysis_results (created_at);

ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
-- Sin politicas: solo el Backend (Service Role) puede leer y escribir.
