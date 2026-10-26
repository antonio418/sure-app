-- SCRIPT: REGISTRO DE HUELLAS (SHA-256) DE LOS INFORMES EMITIDOS
-- -------------------------------------------------------------
-- Ejecuta este script en la vista "SQL Editor" de tu panel de Supabase.
-- Guarda SOLO la huella, el numero de informe y la fecha. Nunca el contenido del informe.

CREATE TABLE IF NOT EXISTS public.report_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    mode TEXT,
    variant TEXT DEFAULT 'full',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT report_fingerprints_unique UNIQUE (report_id, sha256)
);

CREATE INDEX IF NOT EXISTS report_fingerprints_sha256_idx ON public.report_fingerprints (sha256);

-- Seguridad a nivel de fila: solo el Backend (Service Role) accede a la tabla.
ALTER TABLE public.report_fingerprints ENABLE ROW LEVEL SECURITY;

-- Sin politicas: con RLS activado, nadie desde el navegador (anon/authenticated) puede leer ni escribir.
-- El Backend usa la Service Role Key, que ignora RLS, y es el unico que accede a esta tabla.
