import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function reset() {
  const { error } = await supabase.from('leads_campaign').update({ status: 'NEW', email_1_subject: null, email_1_content: null }).neq('status', 'NEW');
  console.log("Reset done, error:", error);
}
reset();
