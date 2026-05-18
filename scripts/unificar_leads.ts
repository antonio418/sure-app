import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportUnified() {
  console.log("Fetching leads_campaign...");
  const { data: newLeads } = await supabase.from('leads_campaign').select('email, empresa, nombre_contacto, sector');
  
  console.log("Fetching dns_leads...");
  const { data: oldLeads } = await supabase.from('dns_leads').select('email, domain');
  
  const allLeads = [];
  const seenEmails = new Set();
  
  // Procesar nuevos
  if (newLeads) {
    for (const lead of newLeads) {
      if (lead.email && !seenEmails.has(lead.email.toLowerCase())) {
        seenEmails.add(lead.email.toLowerCase());
        allLeads.push({
          email: lead.email,
          empresa: lead.empresa || '',
          contacto: lead.nombre_contacto || '',
          origen: 'ALFREDO (Nuevo)'
        });
      }
    }
  }
  
  // Procesar viejos
  if (oldLeads) {
    for (const lead of oldLeads) {
      if (lead.email && !seenEmails.has(lead.email.toLowerCase())) {
        seenEmails.add(lead.email.toLowerCase());
        allLeads.push({
          email: lead.email,
          empresa: lead.domain || '',
          contacto: '',
          origen: 'LEGACY (Viejo)'
        });
      }
    }
  }
  
  const headers = "Email,Empresa,Contacto,Origen";
  const rows = allLeads.map(lead => `"${lead.email}","${lead.empresa}","${lead.contacto}","${lead.origen}"`);
  
  const csvContent = [headers, ...rows].join('\n');
  const outputPath = path.resolve('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'SURE_TODOS_LOS_LEADS_UNIFICADOS.csv');
  
  fs.writeFileSync(outputPath, csvContent, 'utf-8');
  console.log(`SUCCESS! Combined ${allLeads.length} unique leads.`);
  console.log("File saved to:", outputPath);
}

exportUnified();
