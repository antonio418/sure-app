import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';

function verifySvixSignature(payloadString: string, headers: Headers, secret: string) {
  const svixId = headers.get('webhook-id') || headers.get('svix-id');
  const svixTimestamp = headers.get('webhook-timestamp') || headers.get('svix-timestamp');
  const svixSignature = headers.get('webhook-signature') || headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error('Missing svix headers');
  }

  const now = Math.floor(Date.now() / 1000);
  const timestamp = parseInt(svixTimestamp, 10);
  if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
    throw new Error('Timestamp drift too large');
  }

  const signatures = svixSignature.split(' ');
  const toSign = `${svixId}.${svixTimestamp}.${payloadString}`;
  
  const secretKey = secret.startsWith('whsec_') ? secret.substring(6) : secret;
  const secretBuffer = Buffer.from(secretKey, 'base64');

  const expectedSignature = crypto
    .createHmac('sha256', secretBuffer)
    .update(toSign)
    .digest('base64');

  const match = signatures.some(sig => {
    const parts = sig.split(',');
    if (parts.length === 2 && parts[0] === 'v1') {
      return parts[1] === expectedSignature;
    }
    return false;
  });

  if (!match) {
    throw new Error('Signature mismatch');
  }
  return svixId;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    
    // Validate signature if secret is defined
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    let svixId: string = crypto.randomUUID(); // Fallback if no secret configured
    
    if (secret) {
      try {
        svixId = verifySvixSignature(rawBody, req.headers, secret);
      } catch (err: any) {
        console.error('[Webhook Signature Validation Failed]:', err.message);
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, data, created_at } = payload;

    if (!type || !data) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    // Idempotency check
    const { data: existingEvent } = await supabaseAdmin
      .from('processed_webhook_events')
      .select('event_id')
      .eq('event_id', svixId)
      .single();

    if (existingEvent) {
      console.log(`[Webhook] Evento duplicado omitido: ${svixId}`);
      return NextResponse.json({ success: true, message: 'Evento ya procesado (Idempotente)' });
    }

    const email = (data.to && data.to.length > 0) ? data.to[0] : null;
    const resendEmailId = data.id;

    if (!resendEmailId && !email) {
      return NextResponse.json({ error: 'No se pudo identificar el correo ni el ID' }, { status: 400 });
    }

    const now = created_at || new Date().toISOString();
    let updatePayload: any = {
      last_event_at: now
    };

    switch (type) {
      case 'email.sent':
        updatePayload.resend_status = 'sent';
        break;
      case 'email.delivered':
        updatePayload.resend_status = 'delivered';
        break;
      case 'email.bounced':
        updatePayload.resend_status = 'bounced';
        updatePayload.status = 'BOUNCED';
        if (data.bounce && data.bounce.type) {
          updatePayload.bounce_type = data.bounce.type.toLowerCase(); // 'hard' or 'soft'
        }
        break;
      case 'email.complained':
        updatePayload.resend_status = 'complained';
        updatePayload.status = 'BOUNCED'; // Keep status in sync with legacy BOUNCED filter
        updatePayload.complaint = true;
        break;
      case 'email.delivery_delayed':
        updatePayload.resend_status = 'delayed';
        break;
      default:
        // Ignore opened/clicked in stats or just log it
        if (type === 'email.opened') {
          updatePayload.resend_status = 'opened';
          updatePayload.has_opened = true;
        } else if (type === 'email.clicked') {
          updatePayload.resend_status = 'clicked';
          updatePayload.has_clicked = true;
        } else {
          return NextResponse.json({ success: true, message: 'Evento ignorado' });
        }
    }

    // Correlation logic: first by resend_email_id, then fallback to email address
    let leadToUpdate = null;
    if (resendEmailId) {
      const { data: matchedLeads } = await supabaseAdmin
        .from('leads_campaign')
        .select('id, email')
        .eq('resend_email_id', resendEmailId)
        .limit(1);

      if (matchedLeads && matchedLeads.length > 0) {
        leadToUpdate = matchedLeads[0];
      }
    }

    if (!leadToUpdate && email) {
      const { data: matchedLeads } = await supabaseAdmin
        .from('leads_campaign')
        .select('id, email')
        .eq('email', email)
        .limit(1);

      if (matchedLeads && matchedLeads.length > 0) {
        leadToUpdate = matchedLeads[0];
      }
    }

    if (!leadToUpdate) {
      console.warn(`[Webhook] No match found in leads_campaign for resend_email_id: ${resendEmailId}, email: ${email}`);
      return NextResponse.json({ success: true, message: 'Evento recibido pero sin destinatario coincidente en BD' });
    }

    // Perform database update
    const { error: dbError } = await supabaseAdmin
      .from('leads_campaign')
      .update(updatePayload)
      .eq('id', leadToUpdate.id);

    if (dbError) {
      console.error('Error updating lead from webhook:', dbError);
      throw dbError;
    }

    // Save webhook event to processed events for idempotency
    await supabaseAdmin
      .from('processed_webhook_events')
      .insert({ event_id: svixId });

    // =========================================================================
    // AUTO-CUARENTENA DE DOMINIO (2 Strikes para Rebotes, 1 Strike para Quejas)
    // =========================================================================
    const targetEmail = leadToUpdate.email || email;
    if (targetEmail && (type === 'email.bounced' || type === 'email.complained')) {
      const domain = targetEmail.split('@')[1];
      if (domain) {
         let shouldQuarantine = false;
         let quarantineReason = '';

         if (type === 'email.complained') {
            shouldQuarantine = true;
            quarantineReason = 'Auto-Congelado (Spam): Un contacto en este dominio marcó el correo como Spam.';
         } else {
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
