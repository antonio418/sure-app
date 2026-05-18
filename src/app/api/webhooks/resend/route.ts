import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (!type || !data || !data.to || data.to.length === 0) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const email = data.to[0];
    let updatePayload: any = {};

    switch (type) {
      case 'email.delivered':
        updatePayload = { resend_status: 'delivered' };
        break;
      case 'email.bounced':
        // Si rebota, marcamos el lead como BOUNCED
        updatePayload = { resend_status: 'bounced', status: 'BOUNCED' };
        break;
      case 'email.opened':
        updatePayload = { resend_status: 'opened', has_opened: true };
        break;
      case 'email.clicked':
        updatePayload = { resend_status: 'clicked', has_clicked: true };
        break;
      case 'email.complained':
        updatePayload = { resend_status: 'complained', status: 'BOUNCED' };
        break;
      default:
        return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }

    // Update the database matching by email
    const { error } = await supabaseAdmin
      .from('leads_campaign')
      .update(updatePayload)
      .eq('email', email);

    if (error) {
      console.error('Error updating lead from webhook:', error);
      throw error;
    }

    // =========================================================================
    // AUTO-CUARENTENA DE DOMINIO (2 Strikes para Rebotes, 1 Strike para Quejas)
    // =========================================================================
    if (type === 'email.bounced' || type === 'email.complained') {
      const domain = email.split('@')[1];
      if (domain) {
         let shouldQuarantine = false;
         let quarantineReason = '';

         if (type === 'email.complained') {
            // Instant quarantine for spam complaints
            shouldQuarantine = true;
            quarantineReason = 'Auto-Congelado (Spam): Un contacto en este dominio marcó el correo como Spam.';
         } else {
            // 2 Strikes rule for regular bounces
            const { data: bounces } = await supabaseAdmin
              .from('leads_campaign')
              .select('id')
              .ilike('email', `%@${domain}`)
              .in('resend_status', ['bounced', 'complained']);
              
            if (bounces && bounces.length >= 2) {
               shouldQuarantine = true;
               quarantineReason = `Auto-Congelado (2 Strikes): El dominio reportó múltiples rebotes (${bounces.length}).`;
            }
         }
           
         if (shouldQuarantine) {
            await supabaseAdmin
              .from('leads_campaign')
              .update({ status: 'PARKED', nota_contacto: quarantineReason })
              .ilike('email', `%@${domain}`)
              .in('status', ['NEW', 'DRAFT', 'APPROVED']);
            console.log(`[Webhook] Auto-Cuarentena activada para el dominio: @${domain} - ${quarantineReason}`);
         }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Resend Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
