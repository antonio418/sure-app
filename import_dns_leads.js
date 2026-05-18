require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de entorno de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// El ID del proyecto recién creado
const PROJECT_ID = "93661659-5cc2-42fc-908a-075b740e5fac";

// Modo prueba: si es true, no inserta en DB y solo imprime el primer lead vulnerable
const DRY_RUN = false;

// Función simple para parsear CSV 
function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split(/\r?\n/).filter(l => l.trim() !== '');
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    // Usar regex para no separar comas dentro de comillas
    const line = lines[i];
    const matches = line.match(/(?:\"([^\"]*)\"|([^,]+)|)(?:,|$)/g);
    if (!matches) continue;
    
    // Limpiar matches
    const row = matches.map(m => m.replace(/,$/, '').replace(/^\"|\"$/g, '').trim());
    
    if (row.length >= 6) {
      records.push({
        dominio: row[0],
        empresa: row[1],
        contacto: row[2],
        origen: row[3],
        email: row[4],
        dns_status: row[5],
        dns_reason: row[6]
      });
    }
  }
  return records;
}

function generateEmailContent(dominio, empresa, contacto) {
  const greetingName = contacto && contacto !== '' ? contacto : "Security Team";
  const companyName = empresa && empresa !== '' ? empresa : "your organization";

  const subject = `Critical: Security Vulnerability (DMARC/SPF) found on ${dominio}`;
  const content = `Dear ${greetingName},

During a public domain security audit, we detected that your domain (${dominio}) currently lacks proper DMARC and/or SPF policies.

This configuration leaves ${companyName} highly vulnerable to email spoofing and potential ransomware attacks, as malicious actors can easily impersonate your domain to target your employees and clients.

Using our automated DNS remediation solutions, this vulnerability can be completely resolved in under 10 minutes without any disruption to your current mail flow. 

You can run a free diagnostic test on your domain and review the vulnerabilities here: https://sure.procdi.com/auditoria-dns?domain=${dominio}

Would you be open to a brief call this week to get this secured?

Best regards,

SURE Security Team | Diagnostics Division`;

  return { subject, content };
}

async function run() {
  console.log("Iniciando importación de leads DNS...");
  const records = parseCSV('dominios_verificados.csv');
  console.log(`Leídos ${records.length} registros del CSV.`);

  const vulnerables = records.filter(r => r.dns_status === 'VULNERABLE');
  console.log(`Encontrados ${vulnerables.length} dominios VULNERABLES.`);

  const leadsToInsert = vulnerables.map(r => {
    const { subject, content } = generateEmailContent(r.dominio, r.empresa, r.contacto);
    return {
      project_id: PROJECT_ID,
      empresa: r.empresa || r.dominio,
      nombre_contacto: r.contacto || null,
      email: r.email,
      email_1_subject: subject,
      email_1_content: content,
      resend_status: 'pending',
      status: 'NEW'
    };
  });

  if (DRY_RUN) {
    console.log("\n--- MODO DRY RUN (Sin inserción en DB) ---");
    console.log(`Se insertarían ${leadsToInsert.length} leads.`);
    console.log("Ejemplo del primer lead:");
    console.log(JSON.stringify(leadsToInsert[0], null, 2));
    console.log("\nCambia 'DRY_RUN = false' en el script para ejecutar la importación real.");
    return;
  }

  console.log("Insertando leads en Supabase...");
  
  // Insertar por lotes (batches) para no saturar
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  for (let i = 0; i < leadsToInsert.length; i += BATCH_SIZE) {
    const batch = leadsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('leads_campaign').upsert(batch, { onConflict: 'email' });
    
    if (error) {
      console.error(`Error insertando lote ${i} - ${i + BATCH_SIZE}:`, error);
    } else {
      insertedCount += batch.length;
      console.log(`Insertados ${insertedCount} / ${leadsToInsert.length} leads...`);
    }
  }

  console.log(`\nImportación completada. Total insertados: ${insertedCount}`);
}

run();
