import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

export const maxDuration = 60; 

export async function GET(req: NextRequest) {
  return handleDispatch(req);
}

export async function POST(req: NextRequest) {
  return handleDispatch(req);
}

async function handleDispatch(req: NextRequest) {
  try {
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return NextResponse.json({ error: 'Falta clave de API de Resend' }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    // =========================================================================
    // WEEKEND KILLSWITCH
    // =========================================================================
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6) { // 0 is Sunday, 6 is Saturday
      console.log("[Drip Engine] Fin de semana detectado. Abortando envío.");
      return NextResponse.json({ success: true, message: 'Es fin de semana. No se envían correos.', dispatched: 0 });
    }

    // =========================================================================
    // DAILY SEND LIMIT CHECK
    // =========================================================================
    const dailyLimitStr = process.env.DAILY_EMAIL_LIMIT || '50';
    const dailyLimit = parseInt(dailyLimitStr, 10);
    
    // Count emails sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: sentToday1 } = await supabaseAdmin
        .from('leads_campaign')
        .select('id', { count: 'exact', head: true })
        .gte('email_1_enviado_at', todayISO);
        
    const { count: sentToday2 } = await supabaseAdmin
        .from('leads_campaign')
        .select('id', { count: 'exact', head: true })
        .gte('email_2_enviado_at', todayISO);

    const { count: sentToday3 } = await supabaseAdmin
        .from('leads_campaign')
        .select('id', { count: 'exact', head: true })
        .gte('email_3_enviado_at', todayISO);

    const totalSentToday = (sentToday1 || 0) + (sentToday2 || 0) + (sentToday3 || 0);

    if (totalSentToday >= dailyLimit) {
        console.log(`[Drip Engine] Límite diario alcanzado (${totalSentToday}/${dailyLimit}). Abortando envío.`);
        return NextResponse.json({ success: true, message: `Límite diario de ${dailyLimit} alcanzado.`, dispatched: 0 });
    }

    // =========================================================================
    // HELPER: WORKING DAYS CALCULATION
    // =========================================================================
    const getWorkingDaysDifference = (startDateStr: string, endDate: Date) => {
      const start = new Date(startDateStr);
      let count = 0;
      let current = new Date(start);
      // Avanzar día a día hasta llegar a endDate, contando solo días hábiles
      while (current < endDate) {
        current.setDate(current.getDate() + 1);
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
      }
      return count;
    };

    // =========================================================================
    // DRIP ENGINE LOGIC: Find exactly 1 lead eligible for an email
    // =========================================================================
    let targetLead = null;
    let nextStep = 0;
    let emailSubject = "";
    let emailBody = "";

    // Fetch Blacklist once
    const { data: blacklistData } = await supabaseAdmin.from('blacklist_domains').select('domain');
    const blacklistedDomains = new Set((blacklistData || []).map(b => b.domain.toLowerCase().trim()));

    // Helper: Find first lead whose domain or corporate group hasn't received an email in 48h (2 days)
    const findSafeLead = async (candidates: any[]) => {
      for (const lead of candidates) {
        if (!lead.email) continue;
        const domain = lead.email.split('@')[1]?.toLowerCase().trim();
        if (!domain) continue;

        // Check against Blacklist
        if (blacklistedDomains.has(domain)) {
          console.log(`[Blacklist Shield] Bloqueando envío a ${lead.email} (Dominio vetado). Marcando como REJECTED.`);
          await supabaseAdmin.from('leads_campaign').update({ status: 'REJECTED' }).eq('id', lead.id);
          continue;
        }

        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        
        // Extract root company name to catch variants (e.g. "ABB Americas" -> "ABB")
        let rootCompany = "";
        if (lead.empresa) {
           const parts = lead.empresa.split(/[\s,.-]+/);
           // Use the first word if it's substantial (e.g. IBM, ABB), otherwise combine first two
           if (parts.length > 0 && parts[0].length > 2) {
               rootCompany = parts[0];
           } else if (parts.length > 1) {
               rootCompany = parts[0] + ' ' + parts[1];
           }
        }

        let matchCondition = `email.ilike.%@${domain}`;
        if (rootCompany) {
            matchCondition += `,empresa.ilike."${rootCompany}%"`;
        }

        const { data: recentEmails } = await supabaseAdmin
          .from('leads_campaign')
          .select('id')
          .or(matchCondition)
          .or(`email_1_enviado_at.gte.${fortyEightHoursAgo},email_2_enviado_at.gte.${fortyEightHoursAgo},email_3_enviado_at.gte.${fortyEightHoursAgo}`)
          .limit(1);

        if (!recentEmails || recentEmails.length === 0) {
          return lead;
        } else {
          console.log(`[Corporate Throttling] Omitiendo ${lead.email} (${lead.empresa}): Ya se envió a este dominio o grupo corporativo en las últimas 48h.`);
        }
      }
      return null;
    };

    // 1. Check for leads ready for Email 1
    const { data: leads1 } = await supabaseAdmin
      .from('leads_campaign')
      .select('*')
      .eq('status', 'APPROVED')
      .eq('has_replied', false)
      .limit(20);

    if (leads1 && leads1.length > 0) {
      const safeLead = await findSafeLead(leads1);
      if (safeLead) {
        targetLead = safeLead;
        nextStep = 1;
        emailSubject = targetLead.email_1_subject;
        emailBody = targetLead.email_1_content;
      }
    } 
    
    // 2. Check for leads ready for Email 2 (3 working days after Email 1)
    if (!targetLead) {
      const { data: leads2 } = await supabaseAdmin
        .from('leads_campaign')
        .select('*')
        .eq('status', 'email_1_enviado')
        .eq('has_replied', false)
        .eq('drip_step', 1)
        .order('email_1_enviado_at', { ascending: true }) // Oldest first
        .limit(50);

      if (leads2 && leads2.length > 0) {
        const now = new Date();
        const eligibleLeads = leads2.filter((l: any) => l.email_1_enviado_at && getWorkingDaysDifference(l.email_1_enviado_at, now) >= 3);
        const safeLead = await findSafeLead(eligibleLeads);
        if (safeLead) {
          targetLead = safeLead;
          nextStep = 2;
          emailSubject = targetLead.email_2_subject;
          emailBody = targetLead.email_2_content;
        }
      }
    }

    // 3. Check for leads ready for Email 3 (4 working days after Email 2)
    if (!targetLead) {
      const { data: leads3 } = await supabaseAdmin
        .from('leads_campaign')
        .select('*')
        .eq('status', 'email_2_enviado')
        .eq('has_replied', false)
        .eq('drip_step', 2)
        .order('email_2_enviado_at', { ascending: true }) // Oldest first
        .limit(50);

      if (leads3 && leads3.length > 0) {
        const now = new Date();
        const eligibleLeads = leads3.filter((l: any) => l.email_2_enviado_at && getWorkingDaysDifference(l.email_2_enviado_at, now) >= 4);
        const safeLead = await findSafeLead(eligibleLeads);
        if (safeLead) {
          targetLead = safeLead;
          nextStep = 3;
          emailSubject = targetLead.email_3_subject;
          emailBody = targetLead.email_3_content;
        }
      }
    }

    if (!targetLead) {
      return NextResponse.json({ success: true, message: 'No hay correos pendientes de envío en la cola de Drip.', dispatched: 0 });
    }

    // =========================================================================
    // EXECUTE DISPATCH
    // =========================================================================
    const subject = emailSubject || "SURE: Oportunidad Estratégica";
    const body = emailBody || "Cuerpo de correo vacío.";
    const isHtml = body.includes('<!DOCTYPE html>') || body.includes('<html');

    // Correos por defecto para SURE Forensics
    let fromEmail = 'Alfredo - SURE Forensics <alfredo@sure-forensic.com>';
    let bccEmail = 'alfredo@sure-forensic.com';

    if (targetLead.project_id) {
       const { data: project } = await supabaseAdmin.from('projects').select('name').eq('id', targetLead.project_id).single();
       // Si es necesario usar otro correo para proyectos específicos en el futuro, se puede agregar aquí.
    }

    const sendPayload: any = {
       from: fromEmail,
       to: targetLead.email,
       subject: subject,
       bcc: bccEmail
    };
    
    if (isHtml) {
        sendPayload.html = body;
    } else {
        // Formato para plain text para evitar correos apretados
        sendPayload.text = body;
    }

    const { data, error: resendError } = await resend.emails.send(sendPayload);

    if (resendError) {
       throw new Error(`Error de Resend: ${resendError.message}`);
    }

    // =========================================================================
    // UPDATE STATE IN DATABASE
    // =========================================================================
    const now = new Date().toISOString();
    let updatePayload: any = {};

    if (nextStep === 1) {
      updatePayload = { status: 'email_1_enviado', drip_step: 1, email_1_enviado_at: now };
    } else if (nextStep === 2) {
      updatePayload = { status: 'email_2_enviado', drip_step: 2, email_2_enviado_at: now };
    } else if (nextStep === 3) {
      updatePayload = { status: 'drip_completado', drip_step: 3, email_3_enviado_at: now };
    }

    const { error: dbError } = await supabaseAdmin
       .from('leads_campaign')
       .update(updatePayload)
       .eq('id', targetLead.id);

    if (dbError) {
        throw new Error(`Error BD al actualizar el lead: ${dbError.message}`);
    }

    return NextResponse.json({ 
      success: true, 
      dispatched: 1, 
      email: targetLead.email, 
      step_sent: nextStep 
    });

  } catch (error: any) {
    console.error("Drip Dispatch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
