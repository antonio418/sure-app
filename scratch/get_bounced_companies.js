const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const emails = [
    'david.wang@risesun.cn',
    'kevin.li@deye.com.cn',
    'kevin.li@deye.com',
    'leo.huang@techrise.com.cn',
    'allen.liu@topband-e.com',
    'amy.wang@topband-e.com',
    'wei.zhang@techrise.com.cn',
    'wang.lei@holley.cn'
  ];

  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, status, website, sector, nota_empresa')
    .in('email', emails);

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  console.log(`Found ${leads.length} leads in database matching the bounced emails:`);
  leads.forEach(lead => {
    console.log(`- Company: "${lead.empresa}" | Email: ${lead.email} | Status: ${lead.status} | DB Website: ${lead.website}`);
  });
}

run();
