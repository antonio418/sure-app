const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, email_1_content')
    .eq('project_id', projectId);

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  const rawJsonLeads = leads.filter(lead => {
    return lead.email_1_content && lead.email_1_content.trim().startsWith('{');
  });

  console.log(`Diagnosing ${rawJsonLeads.length} leads:`);
  
  rawJsonLeads.forEach(lead => {
    console.log(`\n========================================`);
    console.log(`Company: ${lead.empresa} (${lead.email})`);
    console.log(`========================================`);
    
    const textToParse = lead.email_1_content;
    try {
      JSON.parse(textToParse);
      console.log("SUCCESS: This text actually parses fine!");
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
      
      // Extract position from error message if possible
      const posMatch = err.message.match(/at position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const startPos = Math.max(0, pos - 50);
        const endPos = Math.min(textToParse.length, pos + 50);
        console.log(`\nContext around position ${pos}:`);
        console.log(`------------------------------------`);
        console.log(textToParse.substring(startPos, endPos));
        console.log(`------------------------------------`);
        // Print character codes around position
        const snippet = textToParse.substring(pos - 5, pos + 5);
        console.log(`Char codes around position: ${snippet.split('').map(c => `${c}:${c.charCodeAt(0)}`).join(' | ')}`);
      }
      
      console.log(`Length of string: ${textToParse.length}`);
      
      // Check if there are unescaped control characters or weird line endings
      const hasUnescapedNewlines = /[^\\][\r\n]/.test(textToParse);
      console.log(`Has unescaped newlines: ${hasUnescapedNewlines}`);
      
      // Print the last 100 characters in character codes
      const endPart = textToParse.substring(textToParse.length - 100);
      console.log(`Last 100 chars: ${JSON.stringify(endPart)}`);
      
      // Let's see what happens if we fix potential issues:
      // 1. Try stripping extra closing braces
      let cleaned = textToParse.trim();
      if (cleaned.endsWith('}}')) {
        cleaned = cleaned.substring(0, cleaned.length - 1);
        try {
          JSON.parse(cleaned);
          console.log("FIXED: Parsing succeeded after stripping one closing brace!");
          return;
        } catch (e2) {
          console.log(`Still failed after stripping brace: ${e2.message}`);
        }
      }
    }
  });
}

run();
