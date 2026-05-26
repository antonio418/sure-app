import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkStatusCount() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('status')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  const counts = {};
  data.forEach(lead => {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
  });
  
  console.log("LEADS BY STATUS FOR THE CLINIC PROJECT:");
  console.log(counts);
  console.log(`Total leads: ${data.length}`);
}
checkStatusCount();
