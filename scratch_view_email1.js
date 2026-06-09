const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function viewEmail1() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data: leads, error } = await supabase.from('leads_campaign')
    .select('empresa, email_1_content')
    .eq('project_id', projectId)
    .eq('status', 'email_1_enviado')
    .limit(1);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  if (leads && leads.length > 0) {
    console.log(`Lead: ${leads[0].empresa}`);
    console.log("Email 1 Content:");
    console.log(leads[0].email_1_content);
  } else {
    console.log("No sent leads found.");
  }
}
viewEmail1();
