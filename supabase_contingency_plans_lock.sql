-- SEGURIDAD: quitar la lectura pública de los planes de contingencia
-- -------------------------------------------------------------------
-- Antes, cualquiera con la clave pública (anon) podía leer TODA la tabla
-- contingency_plans (política "Allow public read access to plans by ID"
-- con USING (true)). Ahora los planes se leen desde el backend, en el
-- endpoint /api/rma/get-plan, usando la Service Role Key.
--
-- Ejecuta este script en el "SQL Editor" de tu panel de Supabase.

-- 1. Eliminar la política de lectura pública.
DROP POLICY IF EXISTS "Allow public read access to plans by ID" ON public.contingency_plans;

-- 2. (Opcional, refuerzo) Revocar el acceso directo del rol anónimo a la tabla.
--    El backend usa Service Role, que ignora RLS, así que seguirá funcionando.
REVOKE SELECT ON TABLE public.contingency_plans FROM anon;

-- La política de Service Role ("Allow Service Role full access to contingency plans")
-- se mantiene: el backend sigue pudiendo leer y escribir con normalidad.
