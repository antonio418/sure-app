import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  console.log("Supabase URL:", supabaseUrl);
  
  const res = await fetch(`${supabaseUrl}/rest/v1/vip_tokens?select=*`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });
  
  if (!res.ok) {
     const error = await res.text();
     console.error("DB Error:", error);
     return;
  }
  
  const data = await res.json();
  console.log("\n--- ACTIVE VIP TOKENS ---");
  data.forEach((t) => {
    console.log(`ID: ${t.id}`);
    console.log(`Token: "${t.token}"`);
    console.log(`Company: "${t.company_name}"`);
    console.log(`Is Used?: ${t.is_used}`);
    console.log(`Used By: ${t.used_by_email || 'N/A'}`);
    console.log(`Used At: ${t.used_at || 'N/A'}`);
    console.log(`Created At: ${t.created_at}`);
    console.log("------------------------");
  });
}

check();
