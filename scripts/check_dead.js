const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function check() {
  try {
    const mx = await dns.resolveMx('ve.abb.com');
    console.log('MX:', mx);
  } catch (e) {
    console.log('MX Error code:', e.code);
  }
}
check();
