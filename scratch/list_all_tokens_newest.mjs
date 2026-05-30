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
  const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  console.log("--- ALL VIP TOKENS (NEWEST FIRST) ---");
  sorted.forEach((t, i) => {
    console.log(`${i+1}. Token: "${t.token}" | Company: "${t.company_name}" | IsUsed: ${t.is_used} | UsedBy: ${t.used_by_email || 'N/A'}`);
  });
}

check();
