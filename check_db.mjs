const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kzyujcivutwktpbdztgu.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_KEY_HERE";

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?limit=1`, {
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
  console.log("Data in leads_campaign:", JSON.stringify(data));
}

check();
