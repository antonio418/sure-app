const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  
  // 1. Fetch project info
  const projRes = await fetch(`${supabaseUrl}/rest/v1/projects?id=eq.${projectId}`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });
  if (!projRes.ok) {
     console.error("Proj Fetch Error:", await projRes.text());
     return;
  }
  const projData = await projRes.json();
  console.log("PROJECT DETAILS:", projData);

  // 2. Count leads by status
  const leadsRes = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?project_id=eq.${projectId}&select=status`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });
  if (!leadsRes.ok) {
     console.error("Leads Fetch Error:", await leadsRes.text());
     return;
  }
  const leads = await leadsRes.json();
  const counts = {};
  leads.forEach(l => {
     counts[l.status] = (counts[l.status] || 0) + 1;
  });
  console.log("LEADS COUNT BY STATUS:", counts);
}

check();
