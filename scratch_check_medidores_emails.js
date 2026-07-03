const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
    const { data: leads, error } = await supabase
      .from('leads_campaign')
      .select('id, empresa, nombre_contacto, email, email_1_subject, status')
      .eq('project_id', projectId)
      .eq('status', 'APPROVED');
    
    if (error) throw error;
    
    console.log(`=== APPROVED LEADS FOR MEDIDORES (${leads.length}) ===`);
    leads.forEach((lead, index) => {
      console.log(`${index + 1}. Company: ${lead.empresa} | Contact: ${lead.nombre_contacto} | Email: ${lead.email} | Subject: ${lead.email_1_subject}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
