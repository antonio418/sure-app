-- ==============================================================================
-- SURE PLATFORM: Drip Campaign Database Schema Update
-- Ejecuta este script en el SQL Editor de Supabase para preparar la tabla
-- de Contactos Estratégicos (leads_campaign) para el envío automatizado de correos.
-- ==============================================================================

-- 1. Añadir columnas para el Secuencia 1 (El primer toque)
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS email_1_subject TEXT,
ADD COLUMN IF NOT EXISTS email_1_content TEXT,
ADD COLUMN IF NOT EXISTS email_1_enviado_at TIMESTAMP WITH TIME ZONE;

-- 2. Añadir columnas para el Seguimiento 1 (Follow-up tras 3 días)
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS email_2_subject TEXT,
ADD COLUMN IF NOT EXISTS email_2_content TEXT,
ADD COLUMN IF NOT EXISTS email_2_enviado_at TIMESTAMP WITH TIME ZONE;

-- 3. Añadir columnas para el Seguimiento 2 (Último intento - Rompimiento)
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS email_3_subject TEXT,
ADD COLUMN IF NOT EXISTS email_3_content TEXT,
ADD COLUMN IF NOT EXISTS email_3_enviado_at TIMESTAMP WITH TIME ZONE;

-- 4. Variables de control de la máquina de Drip
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS has_replied BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS drip_step INTEGER DEFAULT 0;

-- Opcional: Si quieres reiniciar los contactos de prueba a "NEW" para volver a generar correos:
-- UPDATE leads_campaign SET status = 'NEW' WHERE status != 'NEW';

-- Opcional: Si quieres reiniciar contactos que ya enviaron para probar el envío de nuevo:
-- UPDATE leads_campaign SET status = 'APPROVED', email_1_enviado_at = NULL, drip_step = 0 WHERE status = 'email_1_enviado';
