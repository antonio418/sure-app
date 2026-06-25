const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, email_1_content')
    .eq('project_id', projectId);

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  const rawJsonLeads = leads.filter(lead => {
    return lead.email_1_content && lead.email_1_content.trim().startsWith('{');
  });

  rawJsonLeads.forEach(lead => {
    const filename = `scratch/raw_text_${lead.empresa.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    fs.writeFileSync(filename, lead.email_1_content, 'utf8');
    console.log(`Saved raw text of ${lead.empresa} to ${filename}`);
  });
}

run();
