import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: projects } = await supabase.from('projects').select('id, name, objective');
  console.log("Projects:", JSON.stringify(projects, null, 2));
}
check();
