const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const { data: lead, error } = await supabase
      .from('leads_campaign')
      .select('*')
      .eq('email', 'info@songam.co.kr')
      .single();
    
    if (error) throw error;
    
    console.log("=== SONGAM LEAD FULL CONTENT ===");
    console.log(lead.email_1_content);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
