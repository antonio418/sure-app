-- ==========================================
-- FASE 1: WORKSPACES CORPORATIVOS
-- ==========================================

-- Tabla de Organizaciones (La "Bolsa Corporativa")
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    available_credits INTEGER DEFAULT 0,
    active_plan TEXT DEFAULT 'none',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabla de Miembros (Correos autorizados para gastar de la bolsa)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'member', -- 'admin' o 'member'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migrar usuarios existentes (los que ya tienen créditos en 'user_credits') a sus propias organizaciones
INSERT INTO organizations (name, available_credits, active_plan)
SELECT 'Personal Workspace - ' || email, available_credits, active_plan
FROM user_credits;

-- Llenar organization_members con los dueños recién creados
INSERT INTO organization_members (organization_id, email, role)
SELECT o.id, split_part(o.name, ' - ', 2), 'admin'
FROM organizations o
WHERE o.name LIKE 'Personal Workspace - %';

-- ==========================================
-- FASE 2: SELF-LEARNING (MEMORIA VECTORIAL)
-- ==========================================

-- 1. Habilitar la extensión pgvector nativa
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Crear tabla de conocimiento (El "Cerebro" de SURE)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name TEXT NOT NULL, -- Nombre de la empresa o entidad investigada
    anomaly_title TEXT NOT NULL,
    anomaly_description TEXT NOT NULL,
    context_vector vector(768), -- Dimensiones del modelo de Google Gemini Text Embeddings
    report_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL -- Si queremos RAG privado por empresa
);

-- 3. Crear función de búsqueda por similitud de cosenos para RAG
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  org_filter UUID DEFAULT NULL
)
RETURNS TABLE (
  entity_name text,
  anomaly_title text,
  anomaly_description text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.entity_name,
    kb.anomaly_title,
    kb.anomaly_description,
    1 - (kb.context_vector <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 1 - (kb.context_vector <=> query_embedding) > match_threshold
    -- Si se pasa org_filter, solo busca en el conocimiento de esa empresa. Si es nulo, busca globalmente.
    AND (org_filter IS NULL OR kb.organization_id = org_filter)
  ORDER BY kb.context_vector <=> query_embedding
  LIMIT match_count;
END;
$$;
