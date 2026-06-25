const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, status, email_1_subject, email_1_content')
    .eq('project_id', projectId);

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  const rawJsonLeads = leads.filter(lead => {
    return lead.email_1_content && lead.email_1_content.trim().startsWith('{');
  });

  console.log(`Found ${rawJsonLeads.length} leads with raw JSON in email_1_content:`);
  rawJsonLeads.forEach(lead => {
    console.log(`- Company: ${lead.empresa} | Email: ${lead.email} | Status: ${lead.status}`);
    console.log(`  Content snippet: ${lead.email_1_content.substring(0, 100)}...${lead.email_1_content.substring(lead.email_1_content.length - 100)}`);
  });
}

run();
