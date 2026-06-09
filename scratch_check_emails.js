const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEmails() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('id, empresa, email_1_subject, email_1_content, email_2_subject, email_2_content, status')
    .eq('project_id', projectId)
    .limit(5);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log("LEADS EMAIL CONTENT INSPECTION:");
  data.forEach((lead, i) => {
    console.log(`\n--- Lead ${i+1}: ${lead.empresa} (Status: ${lead.status}) ---`);
    console.log(`Subject 1: ${lead.email_1_subject}`);
    console.log(`Content 1 snippet:\n${lead.email_1_content ? lead.email_1_content.substring(0, 300) : 'N/A'}`);
    console.log(`Subject 2: ${lead.email_2_subject}`);
    console.log(`Content 2 snippet:\n${lead.email_2_content ? lead.email_2_content.substring(0, 300) : 'N/A'}`);
  });
}
checkEmails();
