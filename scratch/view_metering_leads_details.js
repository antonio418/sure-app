require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email_1_subject, email_1_content, status')
    .eq('project_id', projectId);
    
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Total leads:", leads.length);
  const statusCounts = {};
  leads.forEach(l => {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  });
  console.log("Status counts:", statusCounts);
  
  console.log("\nSample Lead 1 (with valid email):");
  const firstWithEmail = leads.find(l => !l.email_1_content?.startsWith('no-email-'));
  if (firstWithEmail) {
    console.log("ID:", firstWithEmail.id);
    console.log("Empresa:", firstWithEmail.empresa);
    console.log("Subject:", firstWithEmail.email_1_subject);
    console.log("Content:\n", firstWithEmail.email_1_content);
  }
}

check();
