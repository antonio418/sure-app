const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  // Query Supabase REST for table structures or check what tables exist
  // We can query schema info from postgres if service role key allows it, or check typical tables
  const tables = ['projects', 'leads_campaign', 'blacklist_domains', 'vip_tokens'];
  for (const t of tables) {
     const res = await fetch(`${supabaseUrl}/rest/v1/${t}?limit=1`, {
       headers: {
         "apikey": supabaseKey,
         "Authorization": `Bearer ${supabaseKey}`
       }
     });
     console.log(`Table ${t} accessibility:`, res.status, res.statusText);
  }
}

check();
