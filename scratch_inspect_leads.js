import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('*')
    .eq('project_id', projectId)
    .limit(1);
  
  if (error) {
    console.error("Error fetching lead:", error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log("LEAD COLUMNS AND SAMPLE VALUE:");
    console.log(data[0]);
  } else {
    console.log("No data found");
  }
}
inspect();
