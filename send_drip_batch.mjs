import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan las credenciales de Supabase en .env.local");
  process.exit(1);
}

if (!resendApiKey) {
  console.error("❌ Falta la clave RESEND_API_KEY en .env.local. No se pueden enviar correos.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

// =========================================================================
// CONFIGURACIÓN DE LA CAMPAÑA DE GOTEO (DRIP / LEAK)
// =========================================================================
const BATCH_LIMIT = 10;            // Límite de correos a enviar hoy
const DELAY_MINUTES = 4.5;         // Minutos de espera entre correos (4 minutos y 30 segundos)
// =========================================================================

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para reemplazar caracteres acentuados lituanos por caracteres ASCII estándar
function sanitizeLithuanianEmail(email) {
  const map = {
    'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
    'Ą': 'a', 'Č': 'c', 'Ę': 'e', 'Ė': 'e', 'Į': 'i', 'Š': 's', 'Ų': 'u', 'Ū': 'u', 'Ž': 'z'
  };
  return email.replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, match => map[match]);
}

// Función para mostrar una cuenta regresiva visual en la consola
async function countdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    const mins = Math.floor(i / 60);
    const secs = i % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    process.stdout.write(`⏳ Próximo envío en: \x1b[36m${timeStr}\x1b[0m... (Presiona Ctrl+C para abortar)\r`);
    await sleep(1000);
  }
  process.stdout.write("                                                                                \r");
}

async function runDripBatch() {
  console.log("\n=========================================================================");
  console.log("🚀 INICIANDO MOTOR DE ENVÍOS EN GOTEO (DRIP/LEAK ENGINE) B2B");
  console.log(`📋 Configuración: Máximo ${BATCH_LIMIT} correos | Intervalo: ${DELAY_MINUTES} minutos`);
  console.log("=========================================================================\n");

  // 1. Obtener leads aprobados del proyecto específico de Clínicas de Kaunas ('Clinicas od. Kauna')
  const CLINIC_PROJECT_ID = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('*')
    .eq('project_id', CLINIC_PROJECT_ID)
    .eq('status', 'APPROVED')
    .eq('has_replied', false)
    .order('created_at', { ascending: true }) // Los más antiguos primero
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("❌ Error al obtener los leads de la base de datos:", error.message);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log("ℹ️ No se encontraron leads con estado 'APPROVED' listos para enviar.");
    console.log("💡 Recuerda ir al panel de administración, seleccionar tus leads en 'DRAFT' y pulsar 'Aprobar Seleccionados' para pasarlos a la cola.");
    return;
  }

  console.log(`🎯 Se encontraron ${leads.length} leads listos para ser enviados hoy.`);
  console.log(`⏱️ Tiempo estimado total de ejecución: ~${Math.round((leads.length - 1) * DELAY_MINUTES)} minutos.\n`);

  let successCount = 0;

  for (let index = 0; index < leads.length; index++) {
    const lead = leads[index];
    const leadNum = index + 1;
    
    try {
      // Limpiar comillas dobles, espacios y caracteres lituanos con acento en el correo
      const rawEmail = (lead.email || '').replace(/"/g, '').trim();
      const cleanEmail = sanitizeLithuanianEmail(rawEmail);

      if (!cleanEmail || !cleanEmail.includes('@')) {
        console.log(`[${leadNum}/${leads.length}] ⏭️ \x1b[31mSaltando lead:\x1b[0m ${lead.empresa || 'Sin Empresa'} (Correo electrónico vacío o inválido: "${lead.email}"). Marcando como REJECTED.`);
        await supabase.from('leads_campaign').update({ status: 'REJECTED' }).eq('id', lead.id);
        continue;
      }

      console.log(`[${leadNum}/${leads.length}] Procesando envío para: \x1b[33m${cleanEmail}\x1b[0m (${lead.empresa || 'Sin Empresa'})`);
      
      const subject = lead.email_1_subject || "SURE: Oportunidad Estratégica";
      const body = lead.email_1_content || "";
      const isHtml = body.includes('<!DOCTYPE html>') || body.includes('<html');

      // Configurar remitente inteligente (antonio@procdi.com para clínicas/lituano)
      let fromEmail = 'Alfredo - SURE Forensics <alfredo@sure-forensic.com>';
      let bccEmail = 'alfredo@sure-forensic.com';

      // Obtener información del proyecto para validar remitente
      let projectName = '';
      if (lead.project_id) {
        const { data: project } = await supabase.from('projects').select('name').eq('id', lead.project_id).single();
        if (project) projectName = project.name;
      }

      const nameLower = (projectName || '').toLowerCase();
      const bodyLower = body.toLowerCase();

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
        bodyLower.includes('procdi') ||
        bodyLower.includes('antonio@procdi.com') ||
        bodyLower.includes('marija');

      if (isProcdiProject) {
        fromEmail = 'Antonio Baronas - MB PROCDI <antonio@procdi.com>';
        bccEmail = 'antonio@procdi.com';
      }

      const sendPayload = {
        from: fromEmail,
        to: cleanEmail,
        subject: subject,
        bcc: bccEmail
      };

      if (isHtml) {
        sendPayload.html = body;
      } else {
        sendPayload.text = body;
      }

      // Enviar correo a través de Resend
      const { error: resendError } = await resend.emails.send(sendPayload);

      if (resendError) {
        console.error(`   ❌ Error en Resend para ${cleanEmail}:`, resendError.message);
        continue;
      }

      // Actualizar el estado del lead a 'email_1_enviado' en Supabase
      const now = new Date().toISOString();
      const { error: dbError } = await supabase
        .from('leads_campaign')
        .update({
          status: 'email_1_enviado',
          drip_step: 1,
          email_1_enviado_at: now
        })
        .eq('id', lead.id);

      if (dbError) {
        console.error(`   ⚠️ El correo se envió, pero falló la actualización en la base de datos para ${cleanEmail}:`, dbError.message);
      } else {
        console.log(`   ✅ \x1b[32mCorreo enviado con éxito desde:\x1b[0m ${fromEmail}`);
        successCount++;
      }

      // Si no es el último lead de la lista, esperar el tiempo configurado
      if (leadNum < leads.length) {
        const delaySeconds = DELAY_MINUTES * 60;
        console.log(`   * Esperando ${DELAY_MINUTES} minutos antes del siguiente envío...`);
        await countdown(delaySeconds);
        console.log(""); // Nueva línea después del countdown
      }

    } catch (err) {
      console.error(`   ❌ Error crítico procesando el lead ${cleanEmail}:`, err);
    }
  }

  console.log("\n=========================================================================");
  console.log(`🎉 EJECUCIÓN DEL LOTE COMPLETADA`);
  console.log(`📈 Correos enviados con éxito hoy: ${successCount}/${leads.length}`);
  console.log("💡 Mañana puedes volver a ejecutar este script para enviar los siguientes 10 leads.");
  console.log("=========================================================================\n");
}

runDripBatch();
