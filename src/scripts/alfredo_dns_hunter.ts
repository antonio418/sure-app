import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve('./.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("❌ Missing required API keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// The System Prompt for Alfredo
const ALFREDO_HUNT_PROMPT = `
You are Agent Alfredo, an elite B2B Lead Generation Specialist.
I will give you a corporate domain name. This domain has critically failed a DNS security audit (DMARC/SPF failure).

YOUR MISSION:
Find the CURRENT decision-maker at this company who would care about email security and domain spoofing. 
Target Personas (in order of priority):
1. IT Director / Chief Information Officer (CIO) / Chief Information Security Officer (CISO)
2. Chief Executive Officer (CEO)
3. Owner / Founder / General Manager

OUTPUT FORMAT:
You MUST respond ONLY with a valid JSON object. No markdown, no explanations, no other text.
If you cannot find a specific person, invent a realistic generic contact (e.g. "IT Department", "it@domain.com").

{
  "name": "Full Name",
  "title": "Job Title",
  "email": "best_guess_email@domain.com",
  "company_name": "Name of the Company"
}
`;

async function huntExecutive(domain: string) {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `DOMAIN TO SEARCH: ${domain}`,
      config: {
        systemInstruction: ALFREDO_HUNT_PROMPT,
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const responseText = result.text;
    if (!responseText) throw new Error("Empty response");
    
    return JSON.parse(responseText.trim());

  } catch (error) {
    console.error(`   ❌ Gemini AI failed to hunt ${domain}:`, error);
    // Fallback if AI fails completely
    return {
      name: "IT Director",
      title: "Head of IT",
      email: `it@${domain}`,
      company_name: domain.toUpperCase()
    };
  }
}

async function runHunterEngine() {
  console.log("🕵️‍♂️ Starting Agent Alfredo's DNS Hunter Engine...");

  // Get or Create DNS Pipeline Project
  let { data: projects } = await supabase.from('projects').select('id').eq('name', 'DNS Pipeline');
  let dnsProjectId = null;
  if (!projects || projects.length === 0) {
    const { data: newProject } = await supabase.from('projects').insert([{
      name: 'DNS Pipeline',
      objective: 'Ofrecer nuestros servicios de análisis forense y remediación DNS a empresas con dominios vulnerables o mal configurados (DMARC/SPF failed).',
      originator: 'Alfredo / SURE System'
    }]).select('id').single();
    if (newProject) dnsProjectId = newProject.id;
  } else {
    dnsProjectId = projects[0].id;
  }

  let pendingRemaining = true;
  let batchCount = 1;

  while (pendingRemaining) {
    // 1. Fetch Failed Domains that haven't been sent to Campaign yet
    const { data: leads, error } = await supabase
      .from('dns_leads')
      .select('*')
      .eq('dns_status', 'failed')
      .eq('campaign_sent', false)
      .limit(50); // Process 50 at a time

    if (error) {
      console.error("❌ Error fetching failed domains:", error.message);
      return;
    }

    if (!leads || leads.length === 0) {
      console.log("✅ All failed domains have been processed and loaded into the Drip Campaign.");
      pendingRemaining = false;
      break;
    }

    console.log(`\n📦 Starting Hunt Batch ${batchCount}... Found ${leads.length} targets.`);

    for (const lead of leads) {
      console.log(`   -> Hunting executive for: ${lead.domain}...`);
      
      // 2. Ask Gemini to find the executive
      const executive = await huntExecutive(lead.domain);
      console.log(`      🎯 Found: ${executive.name} (${executive.title}) - ${executive.email}`);

      // 3. Inject into Alfredo's Campaign Leads table
      const { error: injectError } = await supabase
        .from('leads_campaign')
        .insert({
          email: executive.email,
          nombre_contacto: executive.name,
          empresa: executive.company_name,
          sector: `Title: ${executive.title} (DNS Fail: ${lead.failure_reason})`,
          status: 'lead_nuevo',
          project_id: dnsProjectId
        });

      if (injectError) {
        console.error(`      ❌ Failed to inject lead into campaign:`, injectError.message);
        continue; // Skip marking as complete if injection failed
      }

      // 4. Mark as processed in dns_leads
      await supabase
        .from('dns_leads')
        .update({ campaign_sent: true })
        .eq('id', lead.id);

      // Artificial delay to prevent Gemini API rate limits (15 RPM free tier safety)
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    
    batchCount++;
  }

  console.log("🎉 Alfredo has successfully built your Target List!");
}

runHunterEngine();
