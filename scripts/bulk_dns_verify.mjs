import fs from 'fs';
import readline from 'readline';
import dns from 'dns/promises';

// Force public DNS to avoid local cache/ISP blocks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const inputCsv = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\dominios_filtrados.csv.csv';
const outputCsv = 'C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO\\sure-app\\dominios_verificados.csv';

async function checkDNS(domain) {
  let cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace('@', '').split('/')[0].toLowerCase().trim();
  if (!cleanDomain) return { status: 'INVALID', reason: 'Invalid Domain Format' };

  try {
    let hasMx = false;
    let hasSpf = false;
    let hasDmarc = false;

    // Check MX
    try {
      const mx = await dns.resolveMx(cleanDomain);
      if (mx && mx.length > 0) hasMx = true;
    } catch (e) {
      // no mx
    }

    // Check A (to see if domain is totally dead)
    let hasA = false;
    try {
      const a = await dns.resolve4(cleanDomain);
      if (a && a.length > 0) hasA = true;
    } catch(e) {}

    if (!hasMx && !hasA) {
      return { status: 'DEAD', reason: 'No MX and No A records' };
    }

    // Check SPF
    try {
      const txtRecords = await dns.resolveTxt(cleanDomain);
      const spfRecord = txtRecords.flat().find(r => r.startsWith('v=spf1'));
      if (spfRecord) hasSpf = true;
    } catch (e) {}

    // Check DMARC
    try {
      const dmarcDomain = `_dmarc.${cleanDomain}`;
      const dmarcRecords = await dns.resolveTxt(dmarcDomain);
      const dmarcRecord = dmarcRecords.flat().find(r => r.startsWith('v=DMARC1'));
      if (dmarcRecord) hasDmarc = true;
    } catch (e) {}

    if (!hasSpf && !hasDmarc) return { status: 'VULNERABLE', reason: 'Missing SPF and DMARC' };
    if (!hasSpf) return { status: 'VULNERABLE', reason: 'Missing SPF' };
    if (!hasDmarc) return { status: 'VULNERABLE', reason: 'Missing DMARC' };
    
    return { status: 'SECURE', reason: 'Configured Correctly' };

  } catch (error) {
    return { status: 'ERROR', reason: 'DNS Resolution Error' };
  }
}

// Simple CSV parser for this specific format
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) { // Excel in ES usually uses ';' but let's support ',' too
      result.push(current);
      current = '';
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function run() {
  console.log(`🚀 Iniciando auditoría DNS masiva en ${inputCsv}...`);
  
  if (!fs.existsSync(inputCsv)) {
    console.error(`❌ Archivo no encontrado: ${inputCsv}`);
    return;
  }

  const fileStream = fs.createReadStream(inputCsv);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const outStream = fs.createWriteStream(outputCsv);
  
  let header = [];
  let isFirstLine = true;
  let domainIndex = -1;
  let count = 0;
  let vulnerableCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    const cols = parseCsvLine(line);
    
    if (isFirstLine) {
      header = cols;
      // Excel often adds BOM, so we clean the first column name
      const cleanHeader = header.map(h => h.replace(/^\uFEFF/, '').trim().toLowerCase());
      domainIndex = cleanHeader.findIndex(h => h === 'dominio' || h === 'domain');
      
      if (domainIndex === -1) {
         // Fallback to first column if not found
         domainIndex = 0;
      }
      
      outStream.write(`${cols.join(',')},DNS_STATUS,DNS_REASON\n`);
      isFirstLine = false;
      continue;
    }

    const domain = cols[domainIndex];
    if (!domain) continue;

    count++;
    process.stdout.write(`\r🔍 Escaneando (${count}): ${domain.padEnd(30)}`);

    const result = await checkDNS(domain);
    
    if (result.status === 'VULNERABLE') vulnerableCount++;

    // Format output line safely
    const outLine = cols.map(c => `"${c.replace(/"/g, '""')}"`).join(',');
    outStream.write(`${outLine},"${result.status}","${result.reason}"\n`);
    
    // Add artificial delay to not overwhelm the DNS resolvers or get blocked
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  outStream.end();
  console.log(`\n\n✅ Auditoría finalizada.`);
  console.log(`📊 Total procesados: ${count}`);
  console.log(`🎯 Vulnerables (Listos para Alfredo): ${vulnerableCount}`);
  console.log(`💾 Resultados guardados en: dominios_verificados.csv`);
}

run();
