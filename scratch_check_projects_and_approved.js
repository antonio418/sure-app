const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, name, objective, status');
    
    if (projError) throw projError;
    console.log("=== PROJECTS ===");
    console.log(projects);

    for (const proj of projects) {
      const { count, error: countError } = await supabase
        .from('leads_campaign')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', proj.id)
        .eq('status', 'APPROVED');
      
      if (countError) {
        console.error(`Error counting for ${proj.name}:`, countError);
      } else {
        console.log(`Project: ${proj.name} (ID: ${proj.id}) - Status: ${proj.status} | APPROVED Leads: ${count}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
