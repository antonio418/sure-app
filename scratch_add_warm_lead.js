const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addWarmLead() {
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
  
  const warmLead = {
    project_id: projectId,
    email: 'konsultacija@clinicdpc.lt',
    empresa: 'UAB SB DANTŲ KLINIKA',
    nombre_contacto: 'Neringa Butkevičienė',
    telefono: '+370 632 00005',
    cargo: 'clinicdpc.lt', // Website/cargo field
    status: 'email_1_enviado', // Since we are preparing the email to be sent immediately
    email_1_enviado_at: new Date().toISOString()
  };

  console.log("Adding warm lead to Supabase...");
  const { data, error } = await supabase.from('leads_campaign')
    .upsert(warmLead, { onConflict: 'email', ignoreDuplicates: false })
    .select();

  if (error) {
    console.error("Error inserting warm lead:", error);
    return;
  }

  console.log("Successfully inserted warm lead:", data);

  // Now, let's run the export script to update the CSV file in Downloads
  console.log("Updating CSV tracker file...");
  const { data: allLeads, error: fetchError } = await supabase.from('leads_campaign')
    .select('empresa, nombre_contacto, email, telefono, cargo, status, email_1_enviado_at')
    .eq('project_id', projectId);

  if (fetchError) {
    console.error("Error fetching leads for export:", fetchError);
    return;
  }

  const headers = ['Clinic Name', 'Contact Person', 'Email', 'Phone', 'Website', 'Status', 'Date Emailed', 'Call Result', 'Meeting Date'];
  const rows = allLeads.map(lead => [
    `"${lead.empresa || ''}"`,
    `"${lead.nombre_contacto || ''}"`,
    `"${lead.email || ''}"`,
    `"${lead.telefono || ''}"`,
    `"${lead.cargo || ''}"`,
    `"${lead.status || ''}"`,
    `"${lead.email_1_enviado_at ? new Date(lead.email_1_enviado_at).toLocaleDateString() : ''}"`,
    lead.email === 'konsultacija@clinicdpc.lt' ? '"Llamó - Interesada - Pidió correo"' : '""',
    '""'
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const outputPath = 'c:\\Users\\anton_mn7up\\Downloads\\Lista_Prospeccion_Marija_Kaunas.csv';
  
  fs.writeFileSync(outputPath, '\ufeff' + csvContent, 'utf-8');
  console.log(`Successfully updated CSV tracker file at: ${outputPath}`);
}

addWarmLead();
