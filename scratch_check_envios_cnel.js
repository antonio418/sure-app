const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
    
    // Fetch all leads for the project
    const { data: leads, error } = await supabase
      .from('leads_campaign')
      .select('id, empresa, email, status, email_1_enviado_at')
      .eq('project_id', projectId);
      
    if (error) throw error;
    
    console.log(`=== ALL LEADS STATUS FOR PROJECT CNEL (Total: ${leads.length}) ===`);
    
    const approved = leads.filter(l => l.status === 'APPROVED');
    const sent = leads.filter(l => l.status === 'email_1_enviado');
    const other = leads.filter(l => l.status !== 'APPROVED' && l.status !== 'email_1_enviado');
    
    console.log(`\n--- APPROVED LEADS (${approved.length}) ---`);
    approved.forEach((l, i) => {
      console.log(`${i+1}. ${l.empresa} (${l.email})`);
    });
    
    console.log(`\n--- SENT LEADS (${sent.length}) ---`);
    sent.sort((a, b) => new Date(a.email_1_enviado_at) - new Date(b.email_1_enviado_at));
    sent.forEach((l, i) => {
      console.log(`${i+1}. ${l.empresa} (${l.email}) | Sent At: ${l.email_1_enviado_at}`);
    });
    
    console.log(`\n--- OTHER LEADS (${other.length}) ---`);
    other.forEach((l, i) => {
      console.log(`${i+1}. ${l.empresa} (${l.email}) | Status: ${l.status}`);
    });
    
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
