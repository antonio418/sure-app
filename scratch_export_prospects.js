const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function exportToCSV() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  const { data, error } = await supabase.from('leads_campaign')
    .select('empresa, nombre_contacto, email, telefono, cargo, status')
    .eq('project_id', projectId);
  
  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  // Construct CSV content
  const headers = ['Clinic Name', 'Contact Person', 'Email', 'Phone', 'Website', 'Status', 'Date Emailed', 'Call Result', 'Meeting Date'];
  const rows = data.map(lead => [
    `"${lead.empresa || ''}"`,
    `"${lead.nombre_contacto || ''}"`,
    `"${lead.email || ''}"`,
    `"${lead.telefono || ''}"`,
    `"${lead.cargo || ''}"`,
    `"${lead.status || ''}"`,
    '', '', '' // Empty columns for tracking calls/meetings in Excel
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const outputPath = 'c:\\Users\\anton_mn7up\\Downloads\\Lista_Prospeccion_Marija_Kaunas.csv';
  
  fs.writeFileSync(outputPath, '\ufeff' + csvContent, 'utf-8'); // Adding BOM for Excel compatibility with accents
  console.log(`Successfully exported ${data.length} leads to ${outputPath}`);
}

exportToCSV();
