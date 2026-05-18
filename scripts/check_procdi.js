const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function check() {
  try {
    const spf = await dns.resolveTxt('procdi.com');
    console.log('SPF procdi:', spf);
  } catch (e) { console.log('SPF procdi error:', e.message); }

  try {
    const dmarc = await dns.resolveTxt('_dmarc.procdi.com');
    console.log('DMARC procdi:', dmarc);
  } catch (e) { console.log('DMARC procdi error:', e.message); }
}
check();
