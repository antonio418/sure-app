const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkHtml() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data: leads, error } = await supabase.from('leads_campaign')
    .select('id, empresa, email_1_content, email_2_content')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  console.log(`Checking ${leads.length} leads for Lithuanian words...`);
  for (const lead of leads) {
    const wordsToCheck = ['padeta', 'padėta', 'padeda'];
    
    // Check Email 1
    if (lead.email_1_content) {
      const content = lead.email_1_content;
      const matches = [];
      for (const word of wordsToCheck) {
        if (content.toLowerCase().includes(word)) {
          matches.push(word);
        }
      }
      if (matches.length > 0) {
        console.log(`[Email 1] Lead: ${lead.empresa} matches: ${matches.join(', ')}`);
        const lines = content.split('\n');
        lines.forEach((line, lineIndex) => {
          for (const word of wordsToCheck) {
            if (line.toLowerCase().includes(word)) {
              console.log(`  Line ${lineIndex + 1}: ${line.trim()}`);
            }
          }
        });
      }
    }
    
    // Check Email 2
    if (lead.email_2_content) {
      const content = lead.email_2_content;
      const matches = [];
      for (const word of wordsToCheck) {
        if (content.toLowerCase().includes(word)) {
          matches.push(word);
        }
      }
      if (matches.length > 0) {
        console.log(`[Email 2] Lead: ${lead.empresa} matches: ${matches.join(', ')}`);
        const lines = content.split('\n');
        lines.forEach((line, lineIndex) => {
          for (const word of wordsToCheck) {
            if (line.toLowerCase().includes(word)) {
              console.log(`  Line ${lineIndex + 1}: ${line.trim()}`);
            }
          }
        });
      }
    }
  }
}
checkHtml();
