const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: projects, error: projError } = await supabase.from('projects').select('id, name');
  if (projError) {
    console.error("Error fetching projects:", projError);
    return;
  }

  const projMap = {};
  projects.forEach(p => {
    projMap[p.id] = p.name;
  });

  const { data: leads, error: leadsError } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, status, updated_at, project_id')
    .eq('status', 'APPROVED')
    .order('updated_at', { ascending: false })
    .limit(30);

  if (leadsError) {
    console.error("Error fetching leads:", leadsError);
    return;
  }

  console.log(`Found ${leads.length} APPROVED leads in top 30.`);
  console.log("\nApproved leads ordered by last updated (newest first):");
  leads.forEach(lead => {
    const projectName = projMap[lead.project_id] || lead.project_id;
    console.log(`- Project: "${projectName}" | Company: ${lead.empresa} | Email: ${lead.email} | Updated: ${lead.updated_at}`);
  });
}

run();
