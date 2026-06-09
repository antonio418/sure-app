const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDetails() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('empresa, nombre_contacto, email, telefono, cargo, status')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log("DENTAL LEADS:");
  data.forEach((lead, i) => {
    console.log(`${i+1}. ${lead.empresa} | Contact: ${lead.nombre_contacto} | Email: ${lead.email} | Phone: ${lead.telefono} | Web: ${lead.cargo} | Status: ${lead.status}`);
  });
}
checkDetails();
