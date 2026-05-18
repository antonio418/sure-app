async function test() {
  const r = await fetch('http://localhost:3000/api/dns-check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({domain: 've.abb.com'})
  });
  console.log(await r.json());
}
test();
