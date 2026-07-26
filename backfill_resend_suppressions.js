/**
 * =====================================================================
 * SURE ALFREDO — Backfill de supresiones de Resend hacia Supabase
 * =====================================================================
 * Recorre TODOS los correos enviados desde tu cuenta de Resend
 * (endpoint GET /emails, con paginación) y, para los que rebotaron
 * (`bounced`) o fueron marcados como spam (`complained`), marca el
 * lead correspondiente en `leads_campaign` para no volver a escribirle.
 *
 * Espeja la misma lógica del webhook, pero de forma retroactiva.
 *
 * ---------------------------------------------------------------------
 * SEGURIDAD:
 *   - Por defecto corre en MODO SIMULACIÓN (dry-run): NO cambia nada,
 *     solo imprime lo que haría.
 *   - Para aplicar los cambios de verdad:  node backfill_resend_suppressions.js --apply
 *
 * REQUISITOS (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 *
 * NOTA: ejecutar DESPUÉS de aplicar supabase_alfredo_webhook_tracking.sql
 *       (necesita las columnas resend_status, suppression_reason, etc.).
 * =====================================================================
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
if (!RESEND_API_KEY) {
  console.error('❌ Falta RESEND_API_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Eventos que implican supresión (no volver a enviar)
const SUPPRESSED_EVENTS = new Set(['bounced', 'complained']);

/**
 * Trae una página de correos enviados desde Resend.
 * GET https://api.resend.com/emails?limit=100&after=<cursor>
 */
async function fetchEmailsPage(afterCursor) {
  const url = new URL('https://api.resend.com/emails');
  url.searchParams.set('limit', '100');
  if (afterCursor) url.searchParams.set('after', afterCursor);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log('======================================================');
  console.log(' Backfill de supresiones Resend → Supabase');
  console.log(` Modo: ${APPLY ? '🟢 APLICAR CAMBIOS' : '🟡 SIMULACIÓN (no cambia nada)'}`);
  console.log('======================================================\n');

  let cursor = null;
  let totalScanned = 0;
  let totalSuppressed = 0;
  let totalMatched = 0;
  let totalUpdated = 0;
  const notFound = [];

  while (true) {
    const page = await fetchEmailsPage(cursor);
    const emails = page.data || [];
    if (emails.length === 0) break;

    for (const em of emails) {
      totalScanned++;
      const lastEvent = (em.last_event || '').toLowerCase();
      if (!SUPPRESSED_EVENTS.has(lastEvent)) continue;

      totalSuppressed++;
      const recipient = Array.isArray(em.to) && em.to.length > 0 ? em.to[0] : null;
      const resendId = em.id;

      // Buscar el lead: primero por resend_email_id, luego por email
      let lead = null;
      if (resendId) {
        const { data } = await supabase
          .from('leads_campaign')
          .select('id, email, status')
          .eq('resend_email_id', resendId)
          .limit(1);
        if (data && data.length > 0) lead = data[0];
      }
      if (!lead && recipient) {
        const { data } = await supabase
          .from('leads_campaign')
          .select('id, email, status')
          .eq('email', recipient)
          .limit(1);
        if (data && data.length > 0) lead = data[0];
      }

      if (!lead) {
        notFound.push(recipient || resendId);
        continue;
      }

      totalMatched++;

      const reason = lastEvent === 'complained' ? 'queja_previa' : 'rebote_previo';
      const updatePayload = {
        status: 'BOUNCED',
        resend_status: lastEvent,
        suppression_reason: reason,
        last_event_at: em.created_at || new Date().toISOString(),
      };
      if (lastEvent === 'complained') updatePayload.complaint = true;

      console.log(
        `  ${lastEvent === 'complained' ? '🚫 QUEJA ' : '↩️  REBOTE'}  ${lead.email}  (${lead.status} → BOUNCED)`
      );

      if (APPLY) {
        const { error } = await supabase
          .from('leads_campaign')
          .update(updatePayload)
          .eq('id', lead.id);
        if (error) {
          console.error(`     ❌ Error al actualizar ${lead.email}: ${error.message}`);
        } else {
          totalUpdated++;
        }
      }
    }

    if (!page.has_more) break;
    cursor = emails[emails.length - 1].id; // paginación hacia adelante
    await sleep(600); // respetar límite de ~2 req/s de Resend
  }

  console.log('\n======================================================');
  console.log(' RESUMEN');
  console.log(`   Correos revisados en Resend : ${totalScanned}`);
  console.log(`   Con rebote/queja            : ${totalSuppressed}`);
  console.log(`   Encontrados en la base      : ${totalMatched}`);
  if (APPLY) {
    console.log(`   Actualizados a BOUNCED      : ${totalUpdated}`);
  } else {
    console.log(`   (Simulación: no se actualizó nada. Usa --apply para aplicar.)`);
  }
  if (notFound.length > 0) {
    console.log(`   Sin lead coincidente        : ${notFound.length}`);
  }
  console.log('======================================================');
}

main().catch((err) => {
  console.error('\n❌ Error en el backfill:', err.message);
  process.exit(1);
});
