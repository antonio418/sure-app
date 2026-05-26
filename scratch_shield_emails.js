import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function shieldEmails() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  
  // 1. Fetch all leads for the clinic project
  const { data: leads, error } = await supabase.from('leads_campaign')
    .select('id, empresa, email_1_content, email_2_content, email_3_content')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log(`Analyzing and shielding ${leads.length} leads in the database...`);
  let updatedCount = 0;
  
  for (const lead of leads) {
    let modified = false;
    let email1 = lead.email_1_content || "";
    let email2 = lead.email_2_content || "";
    let email3 = lead.email_3_content || "";
    
    // Replacement A: "Medicininis triažas ir skubios pagalbos (Skubu) valdymas" -> "Skubios pagalbos (Skubu) administravimas"
    const targetA = "Medicininis triažas ir skubios pagalbos (Skubu) valdymas";
    const replacementA = "Skubios pagalbos (Skubu) administravimas";
    
    if (email1.includes(targetA)) {
      email1 = email1.split(targetA).join(replacementA);
      modified = true;
    }
    
    // Replacement B: General check for "triaž" declensions in email 1
    // Lithuanian forms: triažas, triažo, triažą, triaže, triažu
    if (email1.toLowerCase().includes("triaž")) {
      email1 = email1
        .replace(/medicininis triažas/gi, "pirminis administracinis poreikių surinkimas")
        .replace(/medicininio triažo/gi, "pirminio administracinio poreikių surinkimo")
        .replace(/medicininį triažą/gi, "pirminį administracinį poreikių surinkimą")
        .replace(/medicininio triažo/gi, "pirminio administracinio poreikių surinkimo")
        .replace(/triažo/gi, "poreikių įvertinimo")
        .replace(/triažas/gi, "poreikių įvertinimas")
        .replace(/triažą/gi, "poreikių įvertinimą")
        .replace(/triaže/gi, "poreikių įvertinime");
      modified = true;
    }

    // Replacement C: Check email 2 for "triaž"
    if (email2.toLowerCase().includes("triaž")) {
      email2 = email2
        .replace(/medicininis triažas/gi, "pirminis administracinis poreikių surinkimas")
        .replace(/medicininio triažo/gi, "pirminio administracinio poreikių surinkimo")
        .replace(/medicininį triažą/gi, "pirminį administracinį poreikių surinkimą")
        .replace(/triažo/gi, "poreikių įvertinimo")
        .replace(/triažas/gi, "poreikių įvertinimas")
        .replace(/triažą/gi, "poreikių įvertinimą")
        .replace(/triaže/gi, "poreikių įvertinime");
      modified = true;
    }

    // Replacement D: Check email 3 for "triaž"
    if (email3.toLowerCase().includes("triaž")) {
      email3 = email3
        .replace(/medicininis triažas/gi, "pirminis administracinis poreikių surinkimas")
        .replace(/medicininio triažo/gi, "pirminio administracinio poreikių surinkimo")
        .replace(/medicininį triažą/gi, "pirminį administracinį poreikių surinkimą")
        .replace(/triažo/gi, "poreikių įvertinimo")
        .replace(/triažas/gi, "poreikių įvertinimas")
        .replace(/triažą/gi, "poreikių įvertinimą")
        .replace(/triaže/gi, "poreikių įvertinime");
      modified = true;
    }
    
    if (modified) {
      const { error: updateError } = await supabase.from('leads_campaign')
        .update({
          email_1_content: email1,
          email_2_content: email2,
          email_3_content: email3,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);
      
      if (updateError) {
        console.error(`Error updating lead ${lead.empresa}:`, updateError.message);
      } else {
        console.log(`✅ Shielded email templates for lead: ${lead.empresa}`);
        updatedCount++;
      }
    }
  }
  
  console.log(`\n========================================================`);
  console.log(`🎉 SHIELDING PROCESS COMPLETE`);
  console.log(`🛡️ Successfully shielded ${updatedCount} leads out of ${leads.length} total.`);
  console.log(`========================================================\n`);
}

shieldEmails();
