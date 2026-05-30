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

async function run() {
  const token = 'GIOVANNY_VIP_RMA';
  const company = 'Giovanny Pesantes Proyectos';
  
  // 1. Insert new token
  const res = await fetch(`${supabaseUrl}/rest/v1/vip_tokens`, {
    method: 'POST',
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
      token: token,
      company_name: company,
      is_used: false
    })
  });
  
  if (!res.ok) {
     const error = await res.text();
     console.error("Error creating token:", error);
     return;
  }
  
  const data = await res.json();
  console.log("Successfully created a second VIP Token in Supabase:");
  console.log(JSON.stringify(data, null, 2));
}

run();
