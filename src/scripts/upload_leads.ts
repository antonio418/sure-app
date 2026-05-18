import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadLeads() {
  const filePath = path.resolve('./src/scripts/extracted_dns_leads.json');
  if (!fs.existsSync(filePath)) {
    console.error("❌ File extracted_dns_leads.json not found.");
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const leads = JSON.parse(rawData);

  console.log(`📤 Uploading ${leads.length} leads to Supabase...`);

  // Upload in chunks of 500 to avoid request limits
  const chunkSize = 500;
  let successCount = 0;

  for (let i = 0; i < leads.length; i += chunkSize) {
    const chunk = leads.slice(i, i + chunkSize);
    
    // We use upsert to ignore duplicates if run multiple times
    const { error } = await supabase
      .from('dns_leads')
      .upsert(chunk, { onConflict: 'email', ignoreDuplicates: true });

    if (error) {
      console.error(`❌ Error uploading chunk ${i}:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`✅ Uploaded ${successCount}/${leads.length}`);
    }
  }

  console.log("🎉 All leads uploaded successfully! Ready for auditing.");
}

uploadLeads();
