const https = require('https');

const data = JSON.stringify({
  token: 'ANTONIOVIP1_VIP_4XSP',
  email: 'antonio@procdi.com'
});

const options = {
  hostname: 'www.sureforensic.com',
  port: 443,
  path: '/api/validate-token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
