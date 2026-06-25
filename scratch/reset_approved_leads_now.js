const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Use a 90-minute window (1.5 hours) to ensure we capture all leads approved in the last hour
  const lookbackMs = 90 * 60 * 1000;
  const timeThreshold = new Date(Date.now() - lookbackMs).toISOString();
  console.log(`Searching for leads approved after: ${timeThreshold} (UTC)`);

  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88'; // Medidores Inteligentes CNEL EP

  const { data: leads, error: fetchError } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, status, updated_at')
    .eq('project_id', projectId)
    .eq('status', 'APPROVED')
    .gte('updated_at', timeThreshold);

  if (fetchError) {
    console.error("Error fetching leads:", fetchError);
    return;
  }

  console.log(`Found ${leads.length} approved leads updated in the last 90 minutes.`);

  if (leads.length === 0) {
    console.log("No leads found that need to be reset.");
    return;
  }

  let resetCount = 0;
  for (const lead of leads) {
    console.log(`Resetting approved lead: ${lead.empresa} (${lead.email}) | Last updated: ${lead.updated_at}...`);
    
    const { error: updateError } = await supabase
      .from('leads_campaign')
      .update({
        status: 'NEW',
        email_1_subject: null,
        email_1_content: null,
        email_2_subject: null,
        email_2_content: null,
        email_3_subject: null,
        email_3_content: null
      })
      .eq('id', lead.id);

    if (!updateError) {
      console.log(`Successfully reset lead ${lead.email}.`);
      resetCount++;
    } else {
      console.error(`Failed to reset lead ${lead.email}:`, updateError);
    }
  }

  console.log(`\nOperation finished. Successfully reset ${resetCount} of ${leads.length} approved leads back to NEW status.`);
}

run();
