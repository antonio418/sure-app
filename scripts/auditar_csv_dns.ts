import * as fs from 'fs';
import * as path from 'path';
import * as dns from 'dns/promises';

// Forzar el uso de DNS de Google y Cloudflare para evitar que el proveedor de internet local bloquee las peticiones TXT
dns.setServers(['8.8.8.8', '1.1.1.1']);
// Correos gratuitos que no deben ser auditados ni inyectados (no son B2B válidos para SURE)
const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'zoho.com', 'protonmail.com', 'live.com',
  'msn.com', 'ymail.com'
]);

async function checkDomainVulnerability(domain: string): Promise<{ isVulnerable: boolean, reason: string }> {
  try {
    // 0. Check Si el dominio está muerto (Sin correos y sin web)
    let hasMx = false;
    let hasA = false;
    
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) hasMx = true;
    } catch (e) {}

    try {
      const aRecords = await dns.resolve4(domain);
      if (aRecords && aRecords.length > 0) hasA = true;
    } catch (e) {}

    if (!hasMx && !hasA) {
      return { isVulnerable: false, reason: 'Dominio Inactivo' };
    }

    // 1. Check DMARC
    let dmarcPolicy = 'none';
    let hasDmarc = false;
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
      const dmarcString = dmarcRecords.flat().join('');
      if (dmarcString.includes('v=DMARC1')) {
        hasDmarc = true;
        if (dmarcString.includes('p=reject')) dmarcPolicy = 'reject';
        else if (dmarcString.includes('p=quarantine')) dmarcPolicy = 'quarantine';
      }
    } catch (e) {
      // No DMARC record found
    }

    // 2. Check SPF
    let hasSpf = false;
    try {
      const txtRecords = await dns.resolveTxt(domain);
      const spfString = txtRecords.flat().find(r => r.includes('v=spf1'));
      if (spfString) {
        hasSpf = true;
      }
    } catch (e) {
      // No TXT records found
    }

    // Determine Vulnerability
    if (!hasDmarc) return { isVulnerable: true, reason: 'No DMARC' };
    if (dmarcPolicy === 'none') return { isVulnerable: true, reason: 'DMARC p=none (Spoofable)' };
    if (!hasSpf) return { isVulnerable: true, reason: 'No SPF' };

    return { isVulnerable: false, reason: 'SEGURO' };

  } catch (error) {
    // Si el dominio no resuelve en absoluto (ej. NXDOMAIN), asumimos que el correo rebotará
    return { isVulnerable: false, reason: 'Dominio Inactivo / NXDOMAIN' };
  }
}

async function runAudit() {
  const inputPath = path.resolve('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'SURE_TODOS_LOS_LEADS_UNIFICADOS.csv');
  const outputPath = path.resolve('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'SURE_LEADS_VULNERABLES_CONFIRMADOS.csv');
  
  if (!fs.existsSync(inputPath)) {
      console.error("No se encontró el archivo:", inputPath);
      return;
  }

  const csvContent = fs.readFileSync(inputPath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].trim();
  
  // Extraer y agrupar por dominios
  const contactsByDomain: Record<string, any[]> = {};
  let totalContacts = 0;
  let skippedFree = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Expresión regular robusta para parsear CSV con o sin comillas
    const columns = [];
    let inQuotes = false;
    let col = '';
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(col);
        col = '';
      } else {
        col += char;
      }
    }
    columns.push(col);

    if (columns.length < 2) continue;

    const email = columns[0].trim().toLowerCase();
    const empresa = columns[1].trim();
    const contacto = columns.length > 2 ? columns[2].trim() : '';
    const origen = columns.length > 3 ? columns[3].trim() : '';

    if (!email || !email.includes('@')) continue;

    const domain = email.split('@')[1];
    
    if (FREE_EMAIL_PROVIDERS.has(domain)) {
      skippedFree++;
      continue;
    }

    if (!contactsByDomain[domain]) {
      contactsByDomain[domain] = [];
    }
    
    contactsByDomain[domain].push({ email, empresa, contacto, origen });
    totalContacts++;
  }

  const uniqueDomains = Object.keys(contactsByDomain);
  console.log(`\n=== INICIANDO FRANCOTIRADOR DNS ===`);
  console.log(`Contactos totales en CSV: ${lines.length - 1}`);
  console.log(`Contactos B2B válidos: ${totalContacts}`);
  console.log(`Correos gratuitos descartados (Gmail/Hotmail): ${skippedFree}`);
  console.log(`Dominios ÚNICOS a auditar: ${uniqueDomains.length}\n`);

  const vulnerableDomains = new Set<string>();
  const secureDomains = new Set<string>();
  const deadDomains = new Set<string>();

  // Limitar concurrencia a 20 para no saturar el resolver de Windows
  const CONCURRENCY = 20;
  let processed = 0;

  for (let i = 0; i < uniqueDomains.length; i += CONCURRENCY) {
    const batch = uniqueDomains.slice(i, i + CONCURRENCY);
    
    const promises = batch.map(async (domain) => {
      const result = await checkDomainVulnerability(domain);
      if (result.reason === 'SEGURO') {
        secureDomains.add(domain);
      } else if (result.reason.includes('Inactivo')) {
        deadDomains.add(domain);
      } else {
        vulnerableDomains.add(domain);
      }
    });

    await Promise.all(promises);
    processed += batch.length;
    
    // Mostrar progreso en la misma línea
    process.stdout.write(`\rAuditando dominios... [${processed}/${uniqueDomains.length}] - Vulnerables detectados: ${vulnerableDomains.size} `);
  }

  console.log(`\n\n=== RESULTADOS DE LA AUDITORÍA ===`);
  console.log(`Dominios Seguros (Descartados): ${secureDomains.size}`);
  console.log(`Dominios Inactivos/Caídos (Descartados): ${deadDomains.size}`);
  console.log(`Dominios VULNERABLES (Presas Confirmadas): ${vulnerableDomains.size}`);

  // Reconstruir la lista final solo con contactos de dominios vulnerables
  const finalLeads = [];
  for (const domain of vulnerableDomains) {
    finalLeads.push(...contactsByDomain[domain]);
  }

  console.log(`\nContactos finales que recibirán correo: ${finalLeads.length} (Te ahorraste ${totalContacts - finalLeads.length} correos inútiles)`);

  // Guardar nuevo CSV
  const finalRows = finalLeads.map(lead => `"${lead.email}","${lead.empresa}","${lead.contacto}","${lead.origen}"`);
  const finalCsvContent = [headers, ...finalRows].join('\n');
  
  fs.writeFileSync(outputPath, finalCsvContent, 'utf-8');
  console.log(`\n¡LISTO! Archivo guardado en:`);
  console.log(outputPath);
  console.log(`\nUsa el script 'inyectar_leads.ts' apuntando a ESTE nuevo archivo para cargar solo a las presas confirmadas.`);
}

runAudit();
