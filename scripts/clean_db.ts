import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndInject() {
  console.log("Borrando inyección falsa previa...");
  const { error: delError } = await supabase.from('leads_campaign').delete().eq('status', 'DISCOVERED');
  if (delError) console.error("Error borrando:", delError);
  console.log("Limpieza completada. Usa inyectar_leads.ts ahora.");
}
cleanAndInject();
