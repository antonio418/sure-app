require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixDB() {
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: "ALTER TABLE leads_campaign ADD COLUMN IF NOT EXISTS cargo TEXT;"
  });
  if (error) {
    console.error("Error with RPC, trying direct insert/update or psql if possible:", error.message);
  } else {
    console.log("Columna cargo agregada.");
  }
}

fixDB();
