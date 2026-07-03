const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const { data, error } = await supabase
      .from('leads_campaign')
      .update({ email_1_subject: 'Sourcing of ANSI Smart Meters - Partnership with SONGAM SYSCOM CO., LTD.' })
      .eq('email', 'info@songam.co.kr');
    
    if (error) throw error;
    console.log("✅ Subject for SONGAM updated successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
