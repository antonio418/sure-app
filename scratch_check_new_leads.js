import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDetails() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('empresa, direccion, status')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log("LEADS DETAILS:");
  data.forEach((lead, i) => {
    console.log(`${i+1}. ${lead.empresa} | Address: ${lead.direccion} | Status: ${lead.status}`);
  });
}
checkDetails();
