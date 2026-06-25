const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('*')
    .ilike('empresa', '%Salzer%');

  if (error) {
    console.error("Error fetching lead:", error);
    return;
  }

  console.log(`Found ${leads.length} matching leads.`);
  leads.forEach(lead => {
    console.log(`\n--- Lead: ${lead.empresa} (${lead.email}) ---`);
    console.log(`Status: ${lead.status}`);
    console.log(`email_1_subject: ${lead.email_1_subject}`);
    console.log(`email_1_content (length: ${lead.email_1_content ? lead.email_1_content.length : 0}):`);
    console.log(lead.email_1_content);
    console.log(`email_2_subject: ${lead.email_2_subject}`);
    console.log(`email_2_content: ${lead.email_2_content}`);
    console.log(`email_3_subject: ${lead.email_3_subject}`);
    console.log(`email_3_content: ${lead.email_3_content}`);
  });
}

run();
