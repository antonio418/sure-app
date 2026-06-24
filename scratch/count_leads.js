const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: projects, error: projError } = await supabase.from('projects').select('id, name');
  if (projError) {
    console.error("Error fetching projects:", projError);
    return;
  }
  
  console.log(`Found ${projects.length} projects.`);
  for (const project of projects) {
    const { data: leads, error: leadsError } = await supabase
      .from('leads_campaign')
      .select('status')
      .eq('project_id', project.id);
      
    if (leadsError) {
      console.error(`Error fetching leads for ${project.name}:`, leadsError);
      continue;
    }
    
    const counts = {};
    leads.forEach(lead => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    
    console.log(`\nProject: "${project.name}" (ID: ${project.id})`);
    console.log(`Total leads in DB: ${leads.length}`);
    console.log("Status breakdown:", counts);
  }
}

check();
