-- ==============================================================================
-- SURE PLATFORM: Webhooks Database Schema Update
-- Ejecuta este script en el SQL Editor de Supabase para añadir seguimiento 
-- de correos en tiempo real (delivered, bounced, opened).
-- ==============================================================================

-- 1. Añadir columna para el estado real en Resend
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS resend_status TEXT DEFAULT 'pending';

-- 2. Añadir booleanos para tracking avanzado
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS has_opened BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_clicked BOOLEAN DEFAULT FALSE;
