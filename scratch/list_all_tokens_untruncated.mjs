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
  console.log(`Total tokens in database: ${data.length}`);
  
  // Look for any token that contains "GIOVANNY" or is used by someone recently
  console.log("\nSearching for any tokens matching 'Giovanny' or similar:");
  const giovannyTokens = data.filter(t => 
    (t.token && t.token.toUpperCase().includes('GIOVANNY')) || 
    (t.company_name && t.company_name.toUpperCase().includes('GIOVANNY')) ||
    (t.used_by_email && t.used_by_email.toUpperCase().includes('GIOVANNY'))
  );
  
  if (giovannyTokens.length > 0) {
    giovannyTokens.forEach(t => console.log(JSON.stringify(t, null, 2)));
  } else {
    console.log("No specific 'Giovanny' tokens found. Listing last 10 created tokens:");
    // Sort by created_at descending
    const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    sorted.slice(0, 15).forEach(t => {
      console.log(`Token: "${t.token}" | Company: "${t.company_name}" | IsUsed: ${t.is_used} | UsedBy: ${t.used_by_email || 'N/A'}`);
    });
  }
}

check();
