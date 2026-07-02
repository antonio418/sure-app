const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const dns = require('dns/promises');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve('./.env.local') });

// Force DNS servers to avoid local ISP blocks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
  console.error("❌ Faltan credenciales en .env.local (Supabase o Resend)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

const EMAILS_TO_SEND = 23;
const DELAY_MS = 5 * 60 * 1000; // 5 minutos (300,000 ms)

// Helper: Working days difference
const getWorkingDaysDifference = (startDateStr, endDate) => {
  const start = new Date(startDateStr);
  let count = 0;
  let current = new Date(start);
  while (current < endDate) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
};

// Helper: Throttling & Blacklist
const findSafeLead = async (candidates, blacklistedDomains) => {
  for (const lead of candidates) {
    if (!lead.email) continue;
    const domain = lead.email.split('@')[1]?.toLowerCase().trim();
    if (!domain) continue;

    // Check Blacklist
    if (blacklistedDomains.has(domain)) {
      console.log(`[Blacklist] Omitiendo ${lead.email} (Dominio vetado). Marcando como REJECTED.`);
      await supabase.from('leads_campaign').update({ status: 'REJECTED' }).eq('id', lead.id);
      continue;
    }

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    
    // Extract root company name
    let rootCompany = "";
    if (lead.empresa) {
       const parts = lead.empresa.split(/[\s,.-]+/);
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

    const { data: recentEmails } = await supabase
      .from('leads_campaign')
      .select('id')
      .or(matchCondition)
      .or(`email_1_enviado_at.gte.${fortyEightHoursAgo},email_2_enviado_at.gte.${fortyEightHoursAgo},email_3_enviado_at.gte.${fortyEightHoursAgo}`)
      .limit(1);

    if (!recentEmails || recentEmails.length === 0) {
      return lead;
    } else {
      console.log(`[Throttling] Omitiendo ${lead.email} (${lead.empresa}): Ya se envió a este dominio/grupo en las últimas 48h.`);
    }
  }
  return null;
};

async function dispatchOneEmail(blacklistedDomains) {
  // Fetch active project IDs
  const { data: activeProjects } = await supabase
    .from('projects')
    .select('id')
    .eq('status', 'active');
  
  const activeProjectIds = (activeProjects || []).map(p => p.id);

  if (activeProjectIds.length === 0) {
    console.log("⚠️ No hay campañas activas configuradas.");
    return { success: false, reason: 'No active campaigns' };
  }

  let targetLead = null;
  let nextStep = 0;
  let emailSubject = "";
  let emailBody = "";

  // 1. Check for leads ready for Email 1 (APPROVED)
  const { data: leads1 } = await supabase
    .from('leads_campaign')
    .select('*')
    .eq('status', 'APPROVED')
    .eq('has_replied', false)
    .in('project_id', activeProjectIds)
    .limit(20);

  if (leads1 && leads1.length > 0) {
    const safeLead = await findSafeLead(leads1, blacklistedDomains);
    if (safeLead) {
      targetLead = safeLead;
      nextStep = 1;
      emailSubject = targetLead.email_1_subject;
      emailBody = targetLead.email_1_content;
    }
  } 
  
  // 2. Check for leads ready for Email 2 (3 working days after Email 1)
  if (!targetLead) {
    const { data: leads2 } = await supabase
      .from('leads_campaign')
      .select('*')
      .eq('status', 'email_1_enviado')
      .eq('has_replied', false)
      .eq('drip_step', 1)
      .in('project_id', activeProjectIds)
      .order('email_1_enviado_at', { ascending: true })
      .limit(50);

    if (leads2 && leads2.length > 0) {
      const now = new Date();
      const eligibleLeads = leads2.filter(l => l.email_1_enviado_at && getWorkingDaysDifference(l.email_1_enviado_at, now) >= 3);
      const safeLead = await findSafeLead(eligibleLeads, blacklistedDomains);
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
    const { data: leads3 } = await supabase
      .from('leads_campaign')
      .select('*')
      .eq('status', 'email_2_enviado')
      .eq('has_replied', false)
      .eq('drip_step', 2)
      .in('project_id', activeProjectIds)
      .order('email_2_enviado_at', { ascending: true })
      .limit(50);

    if (leads3 && leads3.length > 0) {
      const now = new Date();
      const eligibleLeads = leads3.filter(l => l.email_2_enviado_at && getWorkingDaysDifference(l.email_2_enviado_at, now) >= 4);
      const safeLead = await findSafeLead(eligibleLeads, blacklistedDomains);
      if (safeLead) {
        targetLead = safeLead;
        nextStep = 3;
        emailSubject = targetLead.email_3_subject;
        emailBody = targetLead.email_3_content;
      }
    }
  }

  if (!targetLead) {
    return { success: false, reason: 'No pending emails in queue' };
  }

  // Execute Send
  const subject = emailSubject || "SURE: Oportunidad Estratégica";
  const body = emailBody || "Cuerpo de correo vacío.";
  const isHtml = body.includes('<!DOCTYPE html>') || body.includes('<html');

  let fromEmail = 'Alfredo - SURE Forensics <alfredo@sure-forensic.com>';
  let bccEmail = 'alfredo@sure-forensic.com';

  if (targetLead.project_id) {
     const { data: project } = await supabase.from('projects').select('name, objective').eq('id', targetLead.project_id).single();
     if (project) {
        const nameLower = (project.name || '').toLowerCase();
        const objectiveLower = (project.objective || '').toLowerCase();
        const emailBodyLower = body.toLowerCase();
        
        const isProcdiProject = 
            nameLower.includes('clinica') || 
            nameLower.includes('clínica') ||
            nameLower.includes('medical') || 
            nameLower.includes('kaun') || 
            nameLower.includes('vilniu') ||
            nameLower.includes('marija') ||
            nameLower.includes('procdi') ||
            nameLower.includes('odontolog') ||
            nameLower.includes('dant') ||
            nameLower.includes('lietuva') ||
            objectiveLower.includes('procdi') ||
            objectiveLower.includes('antonio@procdi.com') ||
            objectiveLower.includes('marija') ||
            objectiveLower.includes('gerb') ||
            objectiveLower.includes('laba diena') ||
            emailBodyLower.includes('procdi') ||
            emailBodyLower.includes('antonio@procdi.com') ||
            emailBodyLower.includes('marija');

        if (isProcdiProject) {
           fromEmail = 'Antonio Baronas - MB PROCDI <antonio@procdi.com>';
           bccEmail = 'antonio@procdi.com';
        }
     }
  }

  const sendPayload = {
     from: fromEmail,
     to: targetLead.email,
     subject: subject,
     bcc: bccEmail
  };
  
  if (isHtml) {
      sendPayload.html = body;
  } else {
      sendPayload.text = body;
  }

  const { error: resendError } = await resend.emails.send(sendPayload);

  if (resendError) {
     throw new Error(`Resend Error: ${resendError.message}`);
  }

  // Update DB State
  const now = new Date().toISOString();
  let updatePayload = {};

  if (nextStep === 1) {
    updatePayload = { status: 'email_1_enviado', drip_step: 1, email_1_enviado_at: now };
  } else if (nextStep === 2) {
    updatePayload = { status: 'email_2_enviado', drip_step: 2, email_2_enviado_at: now };
  } else if (nextStep === 3) {
    updatePayload = { status: 'drip_completado', drip_step: 3, email_3_enviado_at: now };
  }

  const { error: dbError } = await supabase
     .from('leads_campaign')
     .update(updatePayload)
     .eq('id', targetLead.id);

  if (dbError) {
      throw new Error(`DB Update Error: ${dbError.message}`);
  }

  console.log(`✅ [ENVIADO] Lead: ${targetLead.email} | Paso: ${nextStep} | Subject: "${subject}"`);
  return { success: true, email: targetLead.email };
}

async function start() {
  console.log(`🚀 Iniciando cola manual para enviar ${EMAILS_TO_SEND} correos (uno cada 5 minutos)...`);
  
  // Fetch Blacklist
  const { data: blacklistData } = await supabase.from('blacklist_domains').select('domain');
  const blacklistedDomains = new Set((blacklistData || []).map(b => b.domain.toLowerCase().trim()));

  let sentCount = 0;

  for (let i = 0; i < EMAILS_TO_SEND; i++) {
    console.log(`\n[${new Date().toLocaleTimeString()}] Intentando envío ${i + 1} de ${EMAILS_TO_SEND}...`);
    try {
      const result = await dispatchOneEmail(blacklistedDomains);
      
      if (!result.success) {
        console.log(`⏹️ Deteniendo: ${result.reason}`);
        break;
      }
      
      sentCount++;
      
      if (sentCount < EMAILS_TO_SEND) {
        console.log(`⏳ Esperando 5 minutos antes del próximo envío...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      console.error("❌ Error en este ciclo:", error.message);
      console.log(`⏳ Esperando 5 minutos para reintentar con el siguiente...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(`\n🎉 Proceso completado. Se enviaron ${sentCount} correos con éxito.`);
}

start();
