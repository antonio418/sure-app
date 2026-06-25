const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Fetching leads in status DRAFT...");
  
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, email_1_content')
    .eq('status', 'DRAFT');

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  console.log(`Found ${leads.length} leads in DRAFT status.`);

  let resetCount = 0;
  for (const lead of leads) {
    const content = lead.email_1_content || '';
    if (content.trim().startsWith('{') && content.includes('"email_1_subject"')) {
      console.log(`Resetting corrupted draft for lead ${lead.email} (${lead.empresa})...`);
      
      const { error: updateError } = await supabase
        .from('leads_campaign')
        .update({
          status: 'NEW',
          email_1_subject: null,
          email_1_content: null,
          email_2_subject: null,
          email_2_content: null,
          email_3_subject: null,
          email_3_content: null
        })
        .eq('id', lead.id);

      if (!updateError) {
        resetCount++;
        console.log(`Successfully reset lead ${lead.email}.`);
      } else {
        console.error(`Failed to reset lead ${lead.email}:`, updateError);
      }
    }
  }

  console.log(`Done. Reset ${resetCount} bad drafts back to NEW status.`);
}

run();
