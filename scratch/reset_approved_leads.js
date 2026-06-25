import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  process.exit(1);
}

async function run() {
  // Calculate one hour ago in UTC
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  console.log(`Searching for leads approved after: ${oneHourAgo} (UTC)`);

  // Fetch approved leads for the Medidores project updated in the last hour
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  const url = `${supabaseUrl}/rest/v1/leads_campaign?status=eq.APPROVED&project_id=eq.${projectId}&updated_at=gte.${oneHourAgo}`;
  
  const res = await fetch(url, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });

  if (!res.ok) {
    console.error("Error fetching approved leads:", await res.text());
    return;
  }

  const leads = await res.json();
  console.log(`Found ${leads.length} approved leads updated in the last hour.`);

  if (leads.length === 0) {
    console.log("No leads need to be reset.");
    return;
  }

  let resetCount = 0;
  for (const lead of leads) {
    console.log(`Resetting approved lead ${lead.email} (${lead.empresa})...`);
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: 'NEW',
        email_1_subject: null,
        email_1_content: null,
        email_2_subject: null,
        email_2_content: null,
        email_3_subject: null,
        email_3_content: null
      })
    });

    if (updateRes.ok) {
      resetCount++;
    } else {
      console.error(`Failed to reset lead ${lead.email}:`, await updateRes.text());
    }
  }

  console.log(`Successfully reset ${resetCount} approved leads back to NEW status.`);
}

run();
