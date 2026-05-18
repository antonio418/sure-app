-- Actualización de la tabla leads_campaign para añadir los nuevos campos de contexto de Alfredo
ALTER TABLE leads_campaign 
ADD COLUMN IF NOT EXISTS nombre_oficial_empresa TEXT,
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS nota_empresa TEXT,
ADD COLUMN IF NOT EXISTS nota_contacto TEXT,
ADD COLUMN IF NOT EXISTS telefono TEXT,
ADD COLUMN IF NOT EXISTS pais TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;
