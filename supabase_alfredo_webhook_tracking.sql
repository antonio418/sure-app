-- =====================================================================
-- SURE ALFREDO — Reparación de seguimiento de correos (webhook Resend)
-- =====================================================================
-- Este script completa la parte de base de datos que quedó a medias:
--   1) Crea la tabla `processed_webhook_events` (idempotencia del webhook).
--   2) Añade a `leads_campaign` las columnas de seguimiento que faltan.
--
-- SEGURO DE EJECUTAR: todo usa "IF NOT EXISTS". Si algo ya existe,
-- simplemente se omite. No borra ni sobrescribe datos existentes.
-- Ejecutar en Supabase → SQL Editor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabla de eventos de webhook ya procesados (evita duplicados)
--    El webhook guarda aquí el ID de cada evento (svix-id) y así no
--    vuelve a procesar el mismo evento si Resend lo reenvía.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
    event_id    text PRIMARY KEY,
    received_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. Columnas de seguimiento en leads_campaign
--    Todas las que usan el webhook (route.ts) y el motor de envíos
--    (dispatch-drip/route.ts). Se añaden solo si no existen.
-- ---------------------------------------------------------------------
ALTER TABLE public.leads_campaign
    ADD COLUMN IF NOT EXISTS resend_email_id    text,          -- ID que devuelve Resend al enviar
    ADD COLUMN IF NOT EXISTS resend_status      text DEFAULT 'pending', -- sent / delivered / bounced / complained / opened / clicked / suppressed
    ADD COLUMN IF NOT EXISTS bounce_type        text,          -- 'hard' o 'soft'
    ADD COLUMN IF NOT EXISTS complaint          boolean DEFAULT false,  -- marcó como spam
    ADD COLUMN IF NOT EXISTS suppression_reason text,          -- 'rebote_previo' / 'queja_previa'
    ADD COLUMN IF NOT EXISTS has_opened         boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS has_clicked        boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS last_event_at      timestamptz;   -- fecha del último evento recibido

-- ---------------------------------------------------------------------
-- 3. Índice para acelerar la correlación del webhook por resend_email_id
--    (el webhook busca el lead por este campo en cada evento entrante)
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_campaign_resend_email_id
    ON public.leads_campaign (resend_email_id);

-- =====================================================================
-- FIN. Tras ejecutar, el webhook de Resend podrá registrar eventos
-- sin fallar por tabla/columna inexistente.
-- =====================================================================
