const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanSuppressedLeads() {
  const suppressedEmails = [
    'egle.vaitkeviciene@dantufėja.lt',
    'egle.vaitkeviciene@dantufeja.lt',
    'violeta.ozeraitiene@medicinapractica.lt',
    'laura.petrauskiene@dantucentras.lt',
    'tomas.petrauskas@dantucentras.lt'
  ];

  const bouncedEmails = [
    'gintaras.janusauskas@denticija.lt'
  ];

  console.log("Cleaning up suppressed and bounced leads in Supabase...");

  // Update suppressed leads to REJECTED
  for (const email of suppressedEmails) {
    const { data, error } = await supabase
      .from('leads_campaign')
      .update({ status: 'REJECTED' })
      .eq('email', email)
      .eq('project_id', 'f588b680-816b-4bfe-99dd-18e81fbf2752');

    if (error) {
      console.error(`❌ Error updating suppressed email ${email}:`, error.message);
    } else {
      console.log(`✅ Marked ${email} as REJECTED (Suppressed)`);
    }
  }

  // Update bounced leads to BOUNCED
  for (const email of bouncedEmails) {
    const { data, error } = await supabase
      .from('leads_campaign')
      .update({ status: 'BOUNCED' })
      .eq('email', email)
      .eq('project_id', 'f588b680-816b-4bfe-99dd-18e81fbf2752');

    if (error) {
      console.error(`❌ Error updating bounced email ${email}:`, error.message);
    } else {
      console.log(`✅ Marked ${email} as BOUNCED`);
    }
  }

  console.log("Cleanup completed.");
}

cleanSuppressedLeads();
