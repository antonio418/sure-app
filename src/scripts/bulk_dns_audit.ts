import { createClient } from '@supabase/supabase-js';
import dns from 'dns/promises';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env.local file
dotenv.config({ path: path.resolve('./.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Force DNS servers to avoid local ISP blocks
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function checkDomain(domain: string) {
  try {
    let hasSPF = false;
    let hasDMARC = false;
    let issues = [];

    // Check MX Records
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords.length === 0) issues.push("No MX records found");
    } catch {
      issues.push("CRITICAL: No MX records (Cannot receive email)");
    }

    // Check SPF Records
    try {
      const txtRecords = await dns.resolveTxt(domain);
      const spfRecords = txtRecords.filter(record => record.join('').includes('v=spf1'));
      if (spfRecords.length > 0) {
        hasSPF = true;
      } else {
        issues.push("CRITICAL: Missing SPF record");
      }
    } catch {
      issues.push("CRITICAL: Could not resolve TXT records for SPF");
    }

    // Check DMARC Records
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
      const dmarc = dmarcRecords.filter(record => record.join('').includes('v=DMARC1'));
      if (dmarc.length > 0) {
        hasDMARC = true;
      } else {
        issues.push("CRITICAL: Missing DMARC record");
      }
    } catch {
      issues.push("CRITICAL: Missing DMARC record");
    }

    if (issues.length > 0) {
      return { status: 'failed', reason: issues.join(' | ') };
    }
    
    return { status: 'passed', reason: 'All Clear' };

  } catch (error) {
    return { status: 'failed', reason: 'General DNS Lookup Failure' };
  }
}

async function runBulkAudit() {
  console.log("🚀 Starting SURE-DNS Bulk Auditing Engine...");

  let pendingRemaining = true;
  let batchCount = 1;

  while (pendingRemaining) {
    // Fetch 100 pending leads at a time
    const { data: leads, error } = await supabase
      .from('dns_leads')
      .select('id, domain')
      .eq('dns_status', 'pending')
      .limit(100);

    if (error) {
      console.error("❌ Error fetching leads:", error.message);
      return;
    }

    if (!leads || leads.length === 0) {
      console.log("✅ All domains have been fully audited.");
      pendingRemaining = false;
      break;
    }

    console.log(`\n📦 Starting Batch ${batchCount}... Found ${leads.length} pending domains.`);

    for (const lead of leads) {
      console.log(`   -> Checking ${lead.domain}...`);
      const result = await checkDomain(lead.domain);

      const { error: updateError } = await supabase
        .from('dns_leads')
        .update({
          dns_status: result.status,
          failure_reason: result.reason,
          last_audited_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (updateError) {
        console.error(`   ❌ Failed to update DB for ${lead.domain}:`, updateError.message);
      } else {
        const icon = result.status === 'passed' ? '✅' : '⚠️';
        console.log(`   ${icon} Status: ${result.status.toUpperCase()}`);
      }

      // Artificial delay to prevent spamming DNS servers (rate limiting)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    batchCount++;
  }

  console.log("🎉 Complete bulk audit finished successfully!");
}

runBulkAudit();
