import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

// Force Node.js to use Google and Cloudflare DNS to avoid local ISP blocking TXT/MX queries
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace('@', '').split('/')[0].toLowerCase();

    const results: any = {
      domain: cleanDomain,
      mx: [],
      spf: null,
      dmarc: null,
      ns: [],
      a: [],
      aaaa: [],
      issues: [],
      provider: 'Unknown Provider'
    };

    // Check MX Records
    try {
      const mxRecords = await dns.resolveMx(cleanDomain);
      results.mx = mxRecords.sort((a, b) => a.priority - b.priority);
      if (mxRecords.length === 0) {
        results.issues.push('issue_no_mx');
      }
    } catch (e) {
      results.issues.push('issue_mx_resolve');
    }

    // Check TXT Records for SPF
    try {
      const txtRecords = await dns.resolveTxt(cleanDomain);
      const spfRecord = txtRecords.flat().find(r => r.startsWith('v=spf1'));
      if (spfRecord) {
        results.spf = spfRecord;
        if (spfRecord.includes('include:' + cleanDomain)) {
          results.issues.push('issue_spf_loop');
        }
      } else {
        results.issues.push('issue_no_spf');
      }
    } catch (e) {
      results.issues.push('issue_txt_resolve');
    }

    // Check TXT Records for DMARC
    try {
      const dmarcDomain = `_dmarc.${cleanDomain}`;
      const dmarcRecords = await dns.resolveTxt(dmarcDomain);
      const dmarcRecord = dmarcRecords.flat().find(r => r.startsWith('v=DMARC1'));
      if (dmarcRecord) {
        results.dmarc = dmarcRecord;
      } else {
        results.issues.push('issue_no_dmarc');
      }
    } catch (e) {
      results.issues.push('issue_dmarc_resolve');
    }

    // Check NS Records
    try {
      results.ns = await dns.resolveNs(cleanDomain);
    } catch (e) {}

    // Check A Records
    try {
      results.a = await dns.resolve4(cleanDomain);
    } catch (e) {}

    // Check AAAA Records
    try {
      results.aaaa = await dns.resolve6(cleanDomain);
    } catch (e) {}

    // Detect DEAD DOMAIN (no mx and no a)
    let isDead = false;
    if (results.mx.length === 0 && results.a.length === 0) {
        isDead = true;
    }

    // Determine the primary mission based on issues
    let mission = 'mission_all_clear';
    if (isDead) mission = 'mission_dead_domain';
    else if (!results.spf) mission = 'mission_add_spf';
    else if (results.issues.includes('issue_spf_loop')) mission = 'mission_fix_spf_loop';
    else if (results.mx.length === 0) mission = 'mission_add_mx';
    else if (!results.dmarc) mission = 'mission_add_dmarc';

    results.recommendedMission = mission;

    // Detect Provider for "hook" effect
    let provider = 'Unknown Provider';
    const mxString = results.mx.map((m: any) => m.exchange.toLowerCase()).join(' ');
    if (mxString.includes('google.com')) provider = 'Google Workspace';
    else if (mxString.includes('outlook.com') || mxString.includes('protection.outlook.com')) provider = 'Microsoft Office 365';
    else if (mxString.includes('secureserver.net')) provider = 'GoDaddy';
    else if (mxString.includes('hostinger.com')) provider = 'Hostinger';
    else if (mxString.includes('zoho.com')) provider = 'Zoho Mail';
    else if (mxString.includes('titan.email')) provider = 'Titan Mail';
    else if (mxString.includes('namecheap.com')) provider = 'Namecheap';
    else if (mxString.includes('protonmail.ch')) provider = 'ProtonMail';

    // Fallback to NS if no known MX
    if (provider === 'Unknown Provider') {
      try {
        const nsRecords = await dns.resolveNs(cleanDomain);
        const nsString = nsRecords.join(' ').toLowerCase();
        if (nsString.includes('cloudflare.com')) provider = 'Cloudflare';
        else if (nsString.includes('domaincontrol.com')) provider = 'GoDaddy';
        else if (nsString.includes('awsdns')) provider = 'Amazon Route 53';
        else if (nsString.includes('namecheap.com')) provider = 'Namecheap';
        else if (nsString.includes('hostinger.com')) provider = 'Hostinger';
      } catch(e) {}
    }
    results.provider = provider;

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('DNS Check Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
