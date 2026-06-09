const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findLead() {
  // Let's search by email or name
  const { data, error } = await supabase.from('leads_campaign')
    .select('*')
    .or('email.ilike.%clinicdpc%,empresa.ilike.%SB DANTŲ%,empresa.ilike.%Clinic DPC%');
    
  if (error) {
    console.error("Error finding lead:", error);
    return;
  }
  
  console.log("Found leads:");
  console.log(JSON.stringify(data, null, 2));
}

findLead();
