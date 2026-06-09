const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixDbWords() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data: leads, error } = await supabase.from('leads_campaign')
    .select('id, empresa, email_1_content, email_2_content, email_1_subject, email_2_subject')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log(`Checking ${leads.length} leads in DB for any 'padeta' or 'padėta' to replace with 'padeda'...`);
  let updateCount = 0;
  
  for (const lead of leads) {
    let needsUpdate = false;
    const updatePayload = {};
    
    const fields = ['email_1_content', 'email_2_content', 'email_1_subject', 'email_2_subject'];
    for (const field of fields) {
      if (lead[field] && (lead[field].includes('padeta') || lead[field].includes('padėta'))) {
        console.log(`  Found match in lead "${lead.empresa}" field "${field}"`);
        // Replace padeta and padėta with padeda, matching case if needed (usually lowercase)
        let newContent = lead[field]
          .replace(/padėta/g, 'padeda')
          .replace(/padeta/g, 'padeda')
          .replace(/Padėta/g, 'Padeda')
          .replace(/Padeta/g, 'Padeda');
        
        updatePayload[field] = newContent;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      const { error: updateError } = await supabase.from('leads_campaign')
        .update(updatePayload)
        .eq('id', lead.id);
      
      if (updateError) {
        console.error(`  ❌ Error updating lead ${lead.empresa}:`, updateError.message);
      } else {
        console.log(`  ✅ Successfully updated lead "${lead.empresa}"`);
        updateCount++;
      }
    }
  }
  
  console.log(`Finished checking DB. Updated ${updateCount} leads.`);
}

fixDbWords();
