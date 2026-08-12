# Contexto — Alfredo correcciones 2

Resumen de arranque para continuar el trabajo de Alfredo en un chat nuevo.
Pega este contenido (o su esencia) como primer mensaje del nuevo chat.

---

## Quién soy
Antonio, **MB PROCDI** (Kaunas, Lituania). Hago sourcing de commodities y desarrollo la
plataforma **SURE**: forense anti-fraude / Due Diligence (RMA), DNS, PDC, y **Alfredo**
(generación de leads B2B).

- **Repo:** `sure-app`
- **Despliegue:** Vercel → producción en `sureforensic.com`
- **Base de datos:** Supabase
- **Correos:** Resend · **Verificación:** Hunter.io · **Búsqueda de leads:** Gemini

## Flujo de trabajo
Edito en la carpeta conectada → **Commit + Push en GitHub Desktop** (rama `main`) →
Vercel despliega a producción. Un build fallido **NO** afecta la web en vivo.
El asistente no puede hacer git desde su entorno (permisos): los push los hago yo.

## ESTADO ACTUAL / lo que falta hacer YA
- Cambios **sin commitear** en el árbol de trabajo:
  - `dispatch-drip` → verificación Hunter **relajada** (acepta catch-all `accept_all`).
  - `page.tsx` → **botón lápiz** para editar la web.
  - `update-lead-meta` → comentario de documentación.
  - Falta: **Commit + Push**.
- Ya aplicado en base de datos: **36 leads restaurados** PARKED → APPROVED
  (los que nunca recibieron correo). 17 que ya tenían email enviado se dejaron aparcados.
- **Plan inmediato:** verificar los 36 en sus webs → aprobar ~10 →
  poner `DAILY_EMAIL_LIMIT = 10` en Vercel → push del código (un solo deploy) →
  "Despachar Cola".

## Piezas clave del flujo de correos
- El despacho **solo envía desde proyectos ACTIVOS**.
- `DAILY_EMAIL_LIMIT` capa los envíos por día (aprobar no envía; el límite sí).
- Blackout: viernes 8PM – lunes 6AM (zona Vilnius); cron automático a las 3 AM.
- Verificación pre-envío Hunter: acepta `valid` y `accept_all` (catch-all);
  aparca solo inválidos o si Hunter falla (fallo seguro).
- Webhook de Resend activo: marca rebotes/quejas y evita reenviar.

## Campos editables en la tabla
empresa · contacto · **cargo** · **correo** (con validación de formato) ·
**web** (enlace + lápiz) · país · form ✓ · **comentario** (modal con textarea).
Alfredo ahora pide el cargo a Gemini y **excluye los descartados** de nuevas búsquedas.

## Internacionalización (i18n)
Panel Alfredo con selector de 9 idiomas. Traducciones en `src/lib/translations.ts`
(`alfredoTranslations`). Idioma por defecto: inglés.

## Gotchas importantes
- El build completo **no** se puede correr localmente (se pasa de tiempo) → confiar en Vercel.
- `page.tsx` se editó también en otra sesión (columnas País/Web/Form/Comentario) →
  **mantener todo el trabajo de Alfredo en un solo chat** para no pisar cambios.

## Rumbo estratégico
Pivote a **Due Diligence forense** como foco comercial (más dolor y menos commodity que la
prospección). Posts de LinkedIn redactados (ángulo forense). Conexión reciente con
Dr Terry Ramabulana (IntelliMat — DD de ESG/gobernanza, adyacente y potencialmente competidor).
