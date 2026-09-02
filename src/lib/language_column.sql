-- Idioma por lead para la campaña de outreach.
-- Guarda el código de idioma en el que se generan/envían los correos de ese lead ('es' | 'en' | ...).
-- Se rellena al importar el CSV (columna Language S/E -> es/en) y lo usa el generador de correos
-- (send-batch) con fallback al idioma del proyecto cuando está vacía.
ALTER TABLE leads_campaign ADD COLUMN IF NOT EXISTS language TEXT;
