const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env.local';
let envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
let envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      envUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      envKey = line.split('=')[1].trim();
    }
  });
}

const supabaseAdmin = createClient(envUrl, envKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  console.log(`Total users found: ${data.users.length}`);
  data.users.forEach(u => {
    console.log(`- Email: ${u.email}`);
    console.log(`  Metadata:`, JSON.stringify(u.user_metadata, null, 2));
  });
}

run();
