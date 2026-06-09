import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

if (!resendApiKey) {
  console.error("❌ Missing RESEND_API_KEY in .env.local. Cannot send emails.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

// =========================================================================
// CONFIGURATION FOR THE DRIP CAMPAIGN (FOLLOW-UP / EMAIL 2)
// =========================================================================
const BATCH_LIMIT = 10;            // Limit of follow-up emails to send today
const DELAY_MINUTES = 4.5;         // Minutes to wait between emails (4m 30s)
// =========================================================================

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Replace Lithuanian accented characters with standard ASCII for email delivery safety
function sanitizeLithuanianEmail(email) {
  const map = {
    'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
    'Ą': 'a', 'Č': 'c', 'Ę': 'e', 'Ė': 'e', 'Į': 'i', 'Š': 's', 'Ų': 'u', 'Ū': 'u', 'Ž': 'z'
  };
  return email.replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, match => map[match]);
}

// Visual countdown in console
async function countdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    const mins = Math.floor(i / 60);
    const secs = i % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    process.stdout.write(`⏳ Next follow-up email in: \x1b[36m${timeStr}\x1b[0m... (Press Ctrl+C to stop)\r`);
    await sleep(1000);
  }
  process.stdout.write("                                                                                \r");
}

async function runFollowupBatch() {
  console.log("\n=========================================================================");
  console.log("🚀 STARTING AUTOMATED FOLLOW-UP PROSPECTING AGENT (EMAIL 2)");
  console.log(`📋 Config: Max ${BATCH_LIMIT} follow-ups | Interval: ${DELAY_MINUTES} minutes`);
  console.log("=========================================================================\n");

  const CLINIC_PROJECT_ID = 'f588b680-816b-4bfe-99dd-18e81fbf2752'; // Kaunas dental project
  
  // 1. Fetch leads that have already received Email 1 (status = 'email_1_enviado') and haven't replied
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('*')
    .eq('project_id', CLINIC_PROJECT_ID)
    .eq('status', 'email_1_enviado')
    .eq('has_replied', false)
    .order('created_at', { ascending: true }) // Oldest first
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("❌ Error fetching leads from database:", error.message);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log("ℹ️ No leads with status 'email_1_enviado' were found ready for follow-up.");
    return;
  }

  console.log(`🎯 Found ${leads.length} leads ready for a follow-up email today.`);
  console.log(`⏱️ Estimated total execution time: ~${Math.round((leads.length - 1) * DELAY_MINUTES)} minutes.\n`);

  let successCount = 0;

  for (let index = 0; index < leads.length; index++) {
    const lead = leads[index];
    const leadNum = index + 1;
    
    try {
      const rawEmail = (lead.email || '').replace(/"/g, '').trim();
      const cleanEmail = sanitizeLithuanianEmail(rawEmail);

      if (!cleanEmail || !cleanEmail.includes('@')) {
        console.log(`[${leadNum}/${leads.length}] ⏭️ \x1b[31mSkipping lead:\x1b[0m ${lead.empresa || 'Unnamed Clinic'} (Invalid email: "${lead.email}"). Marking as REJECTED.`);
        await supabase.from('leads_campaign').update({ status: 'REJECTED' }).eq('id', lead.id);
        continue;
      }

      console.log(`[${leadNum}/${leads.length}] Sending follow-up to: \x1b[33m${cleanEmail}\x1b[0m (${lead.empresa || 'Unnamed Clinic'})`);
      
      // Fixed subject with ONLY the clinic name changing
      const subject = `Kaip užkirsti kelią praleistoms užklausoms klinikoje „${lead.empresa}“? (Marija DI demo)`;
      
      // Body content in Lithuanian using formal "Jūs" and greeting the specific contact person if available
      const contactGreeting = lead.nombre_contacto ? `gerb. ${lead.nombre_contacto}` : 'gerb. vadove';
      const body = `Laba diena, ${contactGreeting},

Neseniai siuntėme Jums pristatymą apie „Marija DI“ – autonominę asistentę, sukurtą specialiai Lietuvos klinikoms.

„Marija DI“ padeda Jūsų registratūrai neprarasti pacientų po darbo valandų, automatizuodama šias funkcijas tiesiog Jūsų svetainėje:

• Daugiakalbis palaikymas: bendrauja lietuvių, anglų, rusų, lenkų ir kitomis kalbomis.
• 24/7 pacientų aptarnavimas: vizitų rezervavimas, keitimas ir atšaukimas realiuoju laiku.
• Automatiniai priminimai: pranešimai apie artėjančius vizitus (padeda išvengti neatvykimų).
• Pooperacinė priežiūra: automatinis pranešimas praėjus 24 valandoms po vizito, pasiteiraujantis apie paciento savijautą.
• Skubių simptomų atpažinimas: ūmaus skausmo atvejų atpažinimas ir automatinis nukreipimas budinčiam gydytojui.
• Nulinis IT stresas: diegimas svetainėje trunka vos 10 minučių (įterpiama viena kodo eilutė).

Mielai paruošime nemokamą interaktyvų demonstracinį kloną, pritaikytą būtent Jūsų klinikai, kad galėtumėte patys įvertinti asistentės efektyvumą.

🔗 Demo užklausą galite pateikti čia: https://sure-app-nine.vercel.app/intake

Rytdienos skambučio metu mielai trumpai atsakysiu į Jūsų klausimus.

Su pagarba,
Antonio Baronas
Direktorius, MB PROCDI
Tel. +37068941110 | antonio@procdi.com`;

      const fromEmail = 'Antonio Baronas - MB PROCDI <antonio@procdi.com>';
      const bccEmail = 'antonio@procdi.com';

      const sendPayload = {
        from: fromEmail,
        to: cleanEmail,
        subject: subject,
        text: body,
        bcc: bccEmail
      };

      // Send the email via Resend
      const { error: resendError } = await resend.emails.send(sendPayload);

      if (resendError) {
        console.error(`   ❌ Resend Error for ${cleanEmail}:`, resendError.message);
        continue;
      }

      // Update lead status to 'email_2_enviado' and set drip_step = 2
      const now = new Date().toISOString();
      const { error: dbError } = await supabase
        .from('leads_campaign')
        .update({
          status: 'email_2_enviado',
          drip_step: 2,
          email_2_enviado_at: now
        })
        .eq('id', lead.id);

      if (dbError) {
        console.error(`   ⚠️ Email was sent, but database update failed for ${cleanEmail}:`, dbError.message);
      } else {
        console.log(`   ✅ \x1b[32mFollow-up email successfully sent from:\x1b[0m ${fromEmail}`);
        successCount++;
      }

      // Wait if there are more emails left in the batch
      if (leadNum < leads.length) {
        const delaySeconds = DELAY_MINUTES * 60;
        console.log(`   * Waiting ${DELAY_MINUTES} minutes before next email...`);
        await countdown(delaySeconds);
        console.log(""); 
      }

    } catch (err) {
      console.error(`   ❌ Critical error processing lead ${cleanEmail}:`, err);
    }
  }

  console.log("\n=========================================================================");
  console.log(`🎉 BATCH EXECUTION COMPLETED`);
  console.log(`📈 Emails successfully sent today: ${successCount}/${leads.length}`);
  console.log("=========================================================================\n");
}

runFollowupBatch();
