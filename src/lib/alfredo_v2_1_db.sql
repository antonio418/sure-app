-- ==========================================
-- SCRIPT DE MIGRACIÓN: ALFREDO V2.1 (ADJUNTOS)
-- ==========================================

-- Añadir la columna de attachment_url a la tabla de proyectos
ALTER TABLE projects ADD COLUMN IF NOT EXISTS attachment_url TEXT;
