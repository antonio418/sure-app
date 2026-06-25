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
  console.log("Fetching leads in status DRAFT...");
  
  // Fetch leads in DRAFT status
  const res = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?status=eq.DRAFT`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error fetching leads:", errorText);
    return;
  }

  const leads = await res.json();
  console.log(`Found ${leads.length} leads in DRAFT status.`);

  let resetCount = 0;
  for (const lead of leads) {
    // Check if email_1_content contains raw unparsed JSON starting with "{" or containing JSON keys
    const content = lead.email_1_content || '';
    if (content.trim().startsWith('{') && content.includes('"email_1_subject"')) {
      console.log(`Resetting lead ${lead.email} (${lead.empresa})...`);
      
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?id=eq.${lead.id}`, {
        method: 'PATCH',
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
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
        const errText = await updateRes.text();
        console.error(`Failed to reset lead ${lead.email}:`, errText);
      }
    }
  }

  console.log(`Done. Reset ${resetCount} bad drafts back to NEW status.`);
}

run();
