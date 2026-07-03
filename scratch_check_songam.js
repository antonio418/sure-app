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
    
    console.log("=== SONGAM LEAD DETAILS ===");
    console.log("Email:", lead.email);
    console.log("Subject 1:", lead.email_1_subject);
    console.log("Content 1 Length:", lead.email_1_content ? lead.email_1_content.length : 0);
    console.log("Content 1 Snippet:", lead.email_1_content ? lead.email_1_content.substring(0, 300) : 'None');
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
