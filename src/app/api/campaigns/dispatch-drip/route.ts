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
    // WEEKEND & FRIDAY NIGHT KILLSWITCH (Lithuania Timezone: Europe/Vilnius)
    // =========================================================================
    const ltDateStr = new Date().toLocaleString('en-US', { timeZone: 'Europe/Vilnius' });
    const ltDate = new Date(ltDateStr);
    const ltDay = ltDate.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday, 6 = Saturday
    const ltHour = ltDate.getHours();

    const isWeekend = ltDay === 0 || ltDay === 6;
    const isFridayNight = ltDay === 5 && ltHour >= 20; // Friday after 8 PM
    const isMondayEarly = ltDay === 1 && ltHour < 6;   // Monday before 6 AM

    if (isWeekend || isFridayNight || isMondayEarly) {
      console.log(`[Drip Engine] Horario no permitido (Lituania: ${ltDateStr}). Abortando envío.`);
      return NextResponse.json({ 
        success: true, 
        message: 'Fuera de horario permitido (Viernes 8 PM - Lunes 6 AM). No se envían correos.', 
        dispatched: 0 
      });
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
    // DRIP ENGINE LOGIC: Find a batch of leads eligible for an email
    // =========================================================================
    let batchLimit = 10; // Límite por defecto de correos a despachar por llamada
    const limitVal = req.nextUrl.searchParams.get('limit');
    if (limitVal) {
      const parsedLimit = parseInt(limitVal, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        batchLimit = parsedLimit;
      }
    } else {
      try {
        const body = await req.json().catch(() => ({}));
        if (body.limit) {
          const parsedLimit = parseInt(body.limit, 10);
          if (!isNaN(parsedLimit) && parsedLimit > 0) {
            batchLimit = parsedLimit;
          }
        }
      } catch (e) {}
    }

    // Fetch Blacklist once
    const { data: blacklistData } = await supabaseAdmin.from('blacklist_domains').select('domain');
    const blacklistedDomains = new Set((blacklistData || []).map(b => b.domain.toLowerCase().trim()));

    // Helper: Find safe leads whose domain or corporate group hasn't received an email in 48h
    // and make sure we do not repeat domains or company prefixes in the same execution.
    const findSafeLeads = async (candidates: any[], currentBatch: any[], batchDomains: Set<string>, batchCompanies: Set<string>, limit: number) => {
      const safeLeads: any[] = [];
      
      for (const lead of candidates) {
        if (currentBatch.length + safeLeads.length >= limit) break;
        if (!lead.email) continue;
        const domain = lead.email.split('@')[1]?.toLowerCase().trim();
        if (!domain) continue;

        // Prevent duplicate domain in the same batch
        if (batchDomains.has(domain)) {
          console.log(`[Batch Shield] Omitiendo ${lead.email} en este lote: ya hay otro correo para el dominio ${domain} programado en esta ejecución.`);
          continue;
        }

        // Check against Blacklist
        if (blacklistedDomains.has(domain)) {
          console.log(`[Blacklist Shield] Bloqueando envío a ${lead.email} (Dominio vetado). Marcando como REJECTED.`);
          await supabaseAdmin.from('leads_campaign').update({ status: 'REJECTED' }).eq('id', lead.id);
          continue;
        }

        // Extract root company name to catch variants (e.g. "ABB Americas" -> "ABB")
        let rootCompany = "";
        if (lead.empresa) {
           const parts = lead.empresa.split(/[\s,.-]+/);
           if (parts.length > 0 && parts[0].length > 2) {
               rootCompany = parts[0].toLowerCase().trim();
           } else if (parts.length > 1) {
               rootCompany = (parts[0] + ' ' + parts[1]).toLowerCase().trim();
           }
        }

        if (rootCompany && batchCompanies.has(rootCompany)) {
          console.log(`[Batch Shield] Omitiendo ${lead.email} en este lote: ya hay otro correo para la empresa ${rootCompany} programado en esta ejecución.`);
          continue;
        }

        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        
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
          safeLeads.push(lead);
          batchDomains.add(domain);
          if (rootCompany) {
            batchCompanies.add(rootCompany);
          }
        } else {
          console.log(`[Corporate Throttling] Omitiendo ${lead.email} (${lead.empresa}): Ya se envió a este dominio o grupo corporativo en las últimas 48h.`);
        }
      }
      return safeLeads;
    };

    // Fetch active project IDs (status = 'active')
    const { data: activeProjects } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('status', 'active');
    
    const activeProjectIds = (activeProjects || []).map(p => p.id);

    if (activeProjectIds.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay campañas activas configuradas para envíos automáticos (todos los proyectos están pausados).', dispatched: 0 });
    }

    const leadsToDispatch: Array<{ lead: any, nextStep: number }> = [];
    const batchDomains = new Set<string>();
    const batchCompanies = new Set<string>();

    // 1. Check for leads ready for Email 1
    const { data: leads1 } = await supabaseAdmin
      .from('leads_campaign')
      .select('*')
      .eq('status', 'APPROVED')
      .eq('has_replied', false)
      .in('project_id', activeProjectIds)
      .limit(50);

    if (leads1 && leads1.length > 0) {
      const safeLeads = await findSafeLeads(leads1, leadsToDispatch, batchDomains, batchCompanies, batchLimit);
      safeLeads.forEach(lead => {
        leadsToDispatch.push({ lead, nextStep: 1 });
      });
    }

    // 2. Check for leads ready for Email 2 (3 working days after Email 1)
    if (leadsToDispatch.length < batchLimit) {
      const { data: leads2 } = await supabaseAdmin
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
        const eligibleLeads = leads2.filter((l: any) => l.email_1_enviado_at && getWorkingDaysDifference(l.email_1_enviado_at, now) >= 3);
        const safeLeads = await findSafeLeads(eligibleLeads, leadsToDispatch, batchDomains, batchCompanies, batchLimit);
        safeLeads.forEach(lead => {
          leadsToDispatch.push({ lead, nextStep: 2 });
        });
      }
    }

    // 3. Check for leads ready for Email 3 (4 working days after Email 2)
    if (leadsToDispatch.length < batchLimit) {
      const { data: leads3 } = await supabaseAdmin
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
        const eligibleLeads = leads3.filter((l: any) => l.email_2_enviado_at && getWorkingDaysDifference(l.email_2_enviado_at, now) >= 4);
        const safeLeads = await findSafeLeads(eligibleLeads, leadsToDispatch, batchDomains, batchCompanies, batchLimit);
        safeLeads.forEach(lead => {
          leadsToDispatch.push({ lead, nextStep: 3 });
        });
      }
    }

    if (leadsToDispatch.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay correos pendientes de envío en la cola de Drip.', dispatched: 0 });
    }

    // =========================================================================
    // EXECUTE DISPATCH BATCH
    // =========================================================================
    const results: any[] = [];
    const errors: string[] = [];

    for (let index = 0; index < leadsToDispatch.length; index++) {
      const { lead, nextStep } = leadsToDispatch[index];

      // Delay 2 seconds between sends to avoid rate limiting
      if (index > 0) {
        await new Promise(r => setTimeout(r, 2000));
      }

      try {
        let emailSubject = "";
        let emailBody = "";

        if (nextStep === 1) {
          emailSubject = lead.email_1_subject;
          emailBody = lead.email_1_content;
        } else if (nextStep === 2) {
          emailSubject = lead.email_2_subject;
          emailBody = lead.email_2_content;
        } else if (nextStep === 3) {
          emailSubject = lead.email_3_subject;
          emailBody = lead.email_3_content;
        }

        // Correos por defecto para SURE Forensics
        let fromEmail = 'Alfredo - SURE Forensics <alfredo@sure-forensic.com>';
        let bccEmail = 'alfredo@sure-forensic.com';
        let projectLanguage = 'en';

        if (lead.project_id) {
           const { data: project } = await supabaseAdmin.from('projects').select('name, objective, language').eq('id', lead.project_id).single();
           if (project) {
              projectLanguage = project.language || 'en';
              const nameLower = (project.name || '').toLowerCase();
              const objectiveLower = (project.objective || '').toLowerCase();
              const emailBodyLower = (emailBody || '').toLowerCase();
              
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

        let subject = emailSubject;
        let body = emailBody;
        
        if (!subject || !body) {
           const fallbackMap: Record<string, { subject: string; body: string }> = {
                es: {
                    subject: "SURE: Oportunidad Estratégica",
                    body: `Estimado ${lead.nombre_contacto || 'Equipo Directivo'},\n\nNos ponemos en contacto en relación a sus operaciones en el sector de ${lead.sector || 'comercio internacional'}.\n\nAtentamente,\nSURE Ecosystem`
                },
                en: {
                    subject: "SURE: Strategic Opportunity",
                    body: `Dear ${lead.nombre_contacto || 'Management Team'},\n\nWe are writing to you in relation to your operations in the ${lead.sector || 'international trade'} sector.\n\nBest regards,\nSURE Ecosystem`
                },
                fr: {
                    subject: "SURE: Opportunité Stratégique",
                    body: `Cher ${lead.nombre_contacto || 'Équipe de Direction'},\n\nNous vous contactons concernant vos activités dans le secteur de ${lead.sector || 'commerce international'}.\n\nCordialement,\nSURE Ecosystem`
                },
                de: {
                    subject: "SURE: Strategische Gelegenheit",
                    body: `Sehr geehrte(r) ${lead.nombre_contacto || 'Geschäftsführung'},\n\nwir kontaktieren Sie bezüglich Ihrer Aktivitäten im Bereich ${lead.sector || 'internationaler Handel'}.\n\nMit freundlichen Grüßen,\nSURE Ecosystem`
                },
                pt: {
                    subject: "SURE: Oportunidade Estratégica",
                    body: `Prezado ${lead.nombre_contacto || 'Diretoria'},\n\nEntramos em contato em relação às suas operações no setor de ${lead.sector || 'comércio internacional'}.\n\nAtenciosamente,\nSURE Ecosystem`
                },
                zh: {
                    subject: "SURE: 战略合作机会",
                    body: `尊敬的 ${lead.nombre_contacto || '管理团队'}：\n\n我们写信给您是关于您在 ${lead.sector || '国际贸易'} 领域的业务运营。\n\n此致，\nSURE Ecosystem`
                },
                ru: {
                    subject: "SURE: Стратегическая возможность",
                    body: `Уважаемый ${lead.nombre_contacto || 'Руководитель'},\n\nМы обращаемся к вам по поводу вашей деятельности в секторе ${lead.sector || 'международная торговля'}.\n\nС уважением,\nSURE Ecosystem`
                },
                ar: {
                    subject: "SURE: فرصة استراتيجية",
                    body: `عزيزي ${lead.nombre_contacto || 'فريق الإدارة'}،\n\nنكتب إليكم بخصوص عملياتكم في قطاع ${lead.sector || 'التجارة الدولية'}.\n\nمع أطيب التحيات،\nSURE Ecosystem`
                },
                hi: {
                    subject: "SURE: रणनीतिक अवसर",
                    body: `प्रिय ${lead.nombre_contacto || 'प्रबंधन दल'},\n\nहम ${lead.sector || 'अंतरराष्ट्रीय व्यापार'} क्षेत्र में आपके संचालन के संबंध में आपसे संपर्क कर रहे हैं।\n\nसादर,\nSURE Ecosystem`
                },
                lt: {
                    subject: "SURE: Strateginė galimybė",
                    body: `Gerb. ${lead.nombre_contacto || 'Vadovybe'},\n\nKreipiamės į jus dėl jūsų veiklos ${lead.sector || 'tarptautinės prekybos'} sektoriuje.\n\nPagarbiai,\nSURE Ecosystem`
                }
           };

           const info = fallbackMap[projectLanguage] || fallbackMap.en;
           subject = subject || info.subject;
           body = body || info.body;
        }
        
        const isHtml = body.includes('<!DOCTYPE html>') || body.includes('<html');

        const sendPayload: any = {
           from: fromEmail,
           to: lead.email,
           subject: subject,
           bcc: bccEmail
        };
        
        if (isHtml) {
            sendPayload.html = body;
        } else {
            sendPayload.text = body;
        }

        const { data: resendData, error: resendError } = await resend.emails.send(sendPayload);

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
           .eq('id', lead.id);

        if (dbError) {
            throw new Error(`Error BD al actualizar el lead: ${dbError.message}`);
        }

        results.push({ email: lead.email, step: nextStep, success: true });

      } catch (err: any) {
        console.error(`Error enviando correo a ${lead.email}:`, err);
        errors.push(`Error con ${lead.email}: ${err.message}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      dispatched: results.length, 
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error("Drip Dispatch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
