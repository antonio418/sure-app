-- ==========================================
-- SCRIPT DE MIGRACIÓN: ALFREDO V2 (PROYECTOS)
-- ==========================================

-- 1. Crear la tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    objective TEXT NOT NULL,
    originator TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insertar un proyecto por defecto para no romper los leads antiguos
INSERT INTO projects (id, name, objective, originator)
VALUES (
    '00000000-0000-0000-0000-000000000000', 
    'Germanio / Proyecto Legacy', 
    'Solicitar cotización de Germanio para PROCDI', 
    'Antonio'
) ON CONFLICT DO NOTHING;

-- 3. Añadir la columna de proyecto a la tabla de leads
ALTER TABLE leads_campaign ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- 4. Asignar el proyecto por defecto a los leads existentes
UPDATE leads_campaign SET project_id = '00000000-0000-0000-0000-000000000000' WHERE project_id IS NULL;
