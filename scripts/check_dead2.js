const dns = require('dns').promises;
dns.setServers(['8.8.8.8']);

async function check() {
  try {
    const a = await dns.resolve4('ve.abb.com');
    console.log('A:', a);
  } catch(e) { console.log('A error:', e.code); }
  
  try {
    const ns = await dns.resolveNs('ve.abb.com');
    console.log('NS:', ns);
  } catch(e) { console.log('NS error:', e.code); }
}
check();
