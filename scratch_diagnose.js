import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testQuery() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  
  const { data } = await supabase.from('leads_campaign')
    .select('empresa, status, email')
    .eq('project_id', projectId);
    
  console.log("All leads:", data);
}
testQuery();
