import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data } = await supabase.from('leads_campaign')
    .select('empresa, status, email, email_1_subject')
    .eq('project_id', projectId)
    .eq('status', 'APPROVED');
  
  console.log("Approved clinic leads count:", data.length);
  console.log("Details:", JSON.stringify(data, null, 2));
}
check();
