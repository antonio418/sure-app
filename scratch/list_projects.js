const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/projects?select=*`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });
  if (!res.ok) {
     console.error("Projects Fetch Error:", await res.text());
     return;
  }
  const data = await res.json();
  console.log("PROJECTS IN DB:", JSON.stringify(data, null, 2));
}

check();
