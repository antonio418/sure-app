import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dns from 'dns/promises';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve('./.env.local') });

// Force DNS servers to avoid local ISP blocks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

if (!resendApiKey) {
  console.error("❌ Missing RESEND_API_KEY in .env.local. Emails cannot be sent.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

// ==========================================
// CONFIGURATION: SENDER & LIMITS
// ==========================================
const SENDER_EMAIL = 'antonio@procdi.com'; 
const DAILY_LIMIT = 45; 
const IS_TEST_MODE = true; 
const TEST_EMAIL_ADDRESS = 'antonio@procdi.com'; 
// ==========================================

async function getProvider(domain: string): Promise<string | null> {
  try {
    const mxRecords = await dns.resolveMx(domain);
    const mxStr = mxRecords.map(r => r.exchange.toLowerCase()).join(' ');
    
    // US / Global Providers
    if (mxStr.includes('google.com') || mxStr.includes('googlemail.com')) return 'Google Workspace';
    if (mxStr.includes('outlook.com') || mxStr.includes('protection.outlook.com')) return 'Microsoft 365';
    if (mxStr.includes('mimecast.com')) return 'Mimecast';
    if (mxStr.includes('proofpoint.com')) return 'Proofpoint';
    if (mxStr.includes('zoho.com')) return 'Zoho Mail';
    if (mxStr.includes('amazon.com') || mxStr.includes('awsapps.com')) return 'Amazon WorkMail';
    if (mxStr.includes('yahoodns.net')) return 'Yahoo Business';
    if (mxStr.includes('barracudanetworks.com')) return 'Barracuda Networks';

    // Asian / Chinese Providers
    if (mxStr.includes('mxhichina.com') || mxStr.includes('aliyun.com')) return 'Alibaba Corporate Mail';
    if (mxStr.includes('exmail.qq.com')) return 'Tencent Exmail';
    if (mxStr.includes('163.com') || mxStr.includes('126.com') || mxStr.includes('qiye.163.com')) return 'NetEase Enterprise';
    if (mxStr.includes('coremail.cn')) return 'Coremail';
    
  } catch (e) {
    // Ignore errors
  }
  return null;
}

function detectLanguage(domain: string): 'es' | 'pt' | 'en' {
  const tld = domain.split('.').pop()?.toLowerCase() || '';
  
  const spanishTlds = ['ar', 'bo', 'cl', 'co', 'cr', 'cu', 'do', 'ec', 'sv', 'gt', 'hn', 'mx', 'ni', 'pa', 'py', 'pe', 'pr', 'es', 'uy', 've'];
  const portugueseTlds = ['br', 'pt'];
  
  if (spanishTlds.includes(tld)) return 'es';
  if (portugueseTlds.includes(tld)) return 'pt';
  
  return 'en';
}

function getSubjectAndBody(nombre: string | null, empresa: string, lang: 'es' | 'pt' | 'en') {
  // Rotamos solo entre 3 modelos de élite (A/B/C Testing)
  const modelId = Math.floor(Math.random() * 3) + 1;
  let subject = '';
  let body = '';
  
  const cleanEmpresa = empresa !== "tu empresa" ? empresa.toUpperCase() : "your company";

  let greeting = '';
  if (lang === 'en') {
    greeting = nombre ? `Hi ${nombre},` : `Good morning,`;
    switch (modelId) {
      case 1:
        // Modelo A: Velocidad y KYC
        subject = `Accelerating due diligence at ${cleanEmpresa}`;
        body = `${greeting}<br><br>I'm reaching out because I noticed ${cleanEmpresa}'s active role in international commodity trading.<br><br>Currently, corporate due diligence and KYC processes in international trade can take up to 3 weeks, paralyzing legitimate deal closures. I built SURE Ecosystem—an autonomous AI vault that compresses counterpart due diligence from weeks to just 7 minutes by conducting triangular validation across all physical, financial, and contractual documentation.<br><br>Do you have 5 minutes next week to review a brief executive PDF on how we can accelerate and secure your deal flow?<br><br>Best regards,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
      case 2:
        // Modelo B: Protección de Capital (Ex-Modelo 3)
        subject = `Securing ${cleanEmpresa}'s trade operations`;
        body = `${greeting}<br><br>I'm writing to you because protecting capital and assets during international commodity transactions is paramount for ${cleanEmpresa}.<br><br>Masterfully forged trade documents are costing the industry millions, hurting both buyers and sellers. Our AI system prevents these losses by conducting triangular validation across all physical and financial documentation in real-time, catching what human eyes miss.<br><br>If you are managing these counterpart risks internally, would you be open to reviewing a 5-page summary on how we secure trade operations?<br><br>Best regards,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
      case 3:
        // Modelo C: Limpieza de Pipeline (Ex-Modelo 4)
        subject = `Increasing legitimate closures at ${cleanEmpresa}`;
        body = `${greeting}<br><br>I wanted to reach out regarding ${cleanEmpresa}'s commercial pipeline.<br><br>Up to 40% of international trade pipelines are polluted by ghost counterparties—buyers without real funds or sellers without real product. Trading desks waste months negotiating contracts that never materialize. Our forensic AI vault instantly audits the true corporate structure and financial capacity of counterparties, discarding bad actors before a contract is ever signed.<br><br>By filtering out these threats, we help companies increase their legitimate trade closures by 30%. Would you be open to a quick overview of how our autonomous network achieves this?<br><br>Best regards,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
    }
  } else {
    // Fallback to Spanish
    const cleanEmpresaEs = empresa !== "tu empresa" ? empresa.toUpperCase() : "su empresa";
    greeting = nombre ? `Hola ${nombre},` : `Buen día,`;
    switch (modelId) {
      case 1:
        // Modelo A: Velocidad y KYC
        subject = `Acelerando la debida diligencia en ${cleanEmpresaEs}`;
        body = `${greeting}<br><br>Me pongo en contacto con usted debido al rol activo de ${cleanEmpresaEs} en el comercio internacional de commodities.<br><br>Actualmente, la debida diligencia corporativa y el proceso KYC pueden tardar hasta 3 semanas, paralizando el cierre de negocios legítimos. He construido SURE Ecosystem—una bóveda autónoma de IA que comprime la validación de contrapartes de semanas a solo 7 minutos, realizando validaciones triangulares en toda la documentación física, financiera y contractual.<br><br>¿Tienen 5 minutos la próxima semana para revisar un breve PDF ejecutivo sobre cómo podemos acelerar y blindar sus operaciones comerciales?<br><br>Saludos cordiales,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
      case 2:
        // Modelo B: Protección de Capital (Ex-Modelo 3)
        subject = `Asegurando las operaciones comerciales de ${cleanEmpresaEs}`;
        body = `${greeting}<br><br>Le escribo porque proteger su capital y sus activos durante las transacciones internacionales es primordial para ${cleanEmpresaEs}.<br><br>La falsificación de documentos comerciales está costando millones a la industria, afectando tanto a compradores como a vendedores. Nuestra IA previene estos fraudes realizando validaciones triangulares en toda la documentación física y financiera en tiempo real.<br><br>Si manejan el riesgo de contraparte internamente, ¿estaría abierto a revisar un resumen de 5 páginas sobre cómo blindamos las operaciones?<br><br>Saludos cordiales,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
      case 3:
        // Modelo C: Limpieza de Pipeline (Ex-Modelo 4)
        subject = `Aumentando los cierres de negocios en ${cleanEmpresaEs}`;
        body = `${greeting}<br><br>Quería ponerme en contacto con usted respecto al flujo comercial en ${cleanEmpresaEs}.<br><br>Hasta un 40% de los pipelines comerciales internacionales están contaminados por contrapartes fantasma: compradores sin fondos reales o vendedores sin producto. Los equipos comerciales pierden meses negociando contratos que nunca se materializan. Nuestra bóveda de IA forense audita instantáneamente la estructura corporativa y la capacidad real de la contraparte, descartando actores maliciosos antes de firmar cualquier contrato.<br><br>Al filtrar estas amenazas, ayudamos a las empresas a aumentar sus cierres legítimos en un 30%. ¿Estaría abierto a una vista rápida de cómo nuestra red autónoma logra esto?<br><br>Saludos cordiales,<br>Antonio Baronas<br>Creator & CEO | SURE Ecosystem<br>www.sureforensic.com`;
        break;
    }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #111; line-height: 1.6;">
      <p>${body}</p>
    </div>
  `;

  return { subject, html, modelId };
}

async function runMailerEngine() {
  console.log(`🚀 Starting Alfredo's Mailer Engine (Limit: ${DAILY_LIMIT} emails)`);
  if (IS_TEST_MODE) {
    console.log(`⚠️ TEST MODE ENABLED: All emails will be sent to ${TEST_EMAIL_ADDRESS}`);
  }

  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('*')
    .eq('status', 'lead_nuevo')
    .limit(DAILY_LIMIT);

  if (error) {
    console.error("❌ Error fetching leads:", error.message);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log("✅ No new leads to process today.");
    return;
  }

  let successCount = 0;

  for (const lead of leads) {
    try {
      // IGNORAR LOS LEADS CARGADOS MANUALMENTE PARA LINKEDIN
      if (lead.email && lead.email.includes('@linkedin.local')) {
         console.log(`   ⏭️ Saltando lead de LinkedIn: ${lead.nombre_contacto} (No tiene email real)`);
         continue;
      }

      let vuln = "Origin Authentication Failure (DMARC/SPF missing)";
      const lang = detectLanguage(lead.email.split('@')[1] || "");
      
      // Localize vulnerability name roughly
      if (lang === 'es') vuln = "Falla de Autenticación de Origen (DMARC/SPF ausente)";
      if (lang === 'pt') vuln = "Falha de Autenticação de Origem (DMARC/SPF ausente)";

      if (lead.sector && lead.sector.includes("DNS Fail:")) {
        const parts = lead.sector.split("DNS Fail:");
        if (parts.length > 1) {
           // We keep the generic localized one if it's too hard to parse, or we can use the English one
           // Since the original was in English from the scraper, we'll just use the localized default above
           // because "DMARC Absent" is universally understood.
        }
      }

      const domain = lead.email.split('@')[1] || "tu empresa";
      const cleanEmpresa = (lead.empresa || domain).replace(/\.(com|net|org|co|uk)$/i, '');
      
      const { subject, html, modelId } = getSubjectAndBody(
        lead.nombre_contacto || null,
        cleanEmpresa,
        lang
      );

      const targetEmail = IS_TEST_MODE ? TEST_EMAIL_ADDRESS : lead.email;

      console.log(`   -> Sending to: ${targetEmail} (Real Contact: ${lead.email}) [Lang: ${lang.toUpperCase()}, Model: ${modelId}]`);

      const { error: resendError } = await resend.emails.send({
        from: `Antonio Baronas - MB PROCDI <${SENDER_EMAIL}>`,
        to: targetEmail,
        subject: subject,
        html: html,
        bcc: 'antonio@procdi.com'
      });

      if (resendError) {
        console.error(`      ❌ Resend API Error for ${lead.email}:`, resendError.message);
        continue;
      }

      if (!IS_TEST_MODE) {
        await supabase
          .from('leads_campaign')
          .update({ status: 'contactado_fase_1', last_contacted_at: new Date().toISOString() })
          .eq('id', lead.id);
      }

      successCount++;
      console.log(`      ✅ Sent successfully.`);

      const delay = Math.floor(Math.random() * 10000) + 5000;
      await new Promise(resolve => setTimeout(resolve, delay));

    } catch (err) {
      console.error(`      ❌ Critical error processing lead ${lead.email}:`, err);
    }
  }

  console.log(`\n🎉 Mailer Engine finished. Successfully sent ${successCount}/${leads.length} emails.`);
}

runMailerEngine();
