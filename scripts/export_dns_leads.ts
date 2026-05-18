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

async function exportDnsLeads() {
  console.log("Fetching dns_leads...");
  const { data: leads, error } = await supabase.from('dns_leads').select('*');
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }
  
  if (!leads || leads.length === 0) {
    console.log("No leads found.");
    return;
  }
  
  const headers = Object.keys(leads[0]).join(',');
  const rows = leads.map(lead => {
    return Object.values(lead).map(val => {
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',');
  });
  
  const csvContent = [headers, ...rows].join('\n');
  const outputPath = path.resolve('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'dns_leads_antiguos.csv');
  
  fs.writeFileSync(outputPath, csvContent, 'utf-8');
  console.log("SUCCESS! File saved to:", outputPath);
}

exportDnsLeads();
