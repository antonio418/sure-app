const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  // Find leads from other projects that were updated recently or have email_1_enviado but don't belong to the Medidores or Clinics project,
  // or simply change their status to REJECTED so no followups are sent.
  const emails = ['info@chinawinchs.com', 'greg.kim@chardonkorea.com', 'directindustry@directindustry.com', 'security@cnsyu.com', 'navin.ramnarine@hadcoltd.com'];
  
  for (const email of emails) {
    const res = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: 'REJECTED',
        has_replied: true // prevents any followup
      })
    });
    if (res.ok) {
      console.log(`Successfully marked ${email} as REJECTED/has_replied=true to stop followups.`);
    } else {
      console.error(`Failed to update ${email}:`, await res.text());
    }
  }
}

run();
