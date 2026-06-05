import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: projects, error } = await supabase.from('projects').select('*');
  if (error) {
    console.error("Error fetching projects:", error);
  } else {
    console.log("PROJECTS IN DB:", projects);
  }
}
run();
