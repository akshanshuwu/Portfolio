const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5177,
  path: '/models/lanfeust.glb',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    // Only read the first 100 bytes to see what we're getting
    if (data.length > 100) {
      req.abort();
    }
  });
  
  res.on('end', () => {
    console.log('Response body (first 100 bytes):', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();