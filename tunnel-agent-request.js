const https = require('https');
const fs = require('fs');
const TunnelAgent = require('tunnel-agent');

const opts = {
  key: fs.readFileSync('./server.key.pem'),
  cert: fs.readFileSync('./server.cert.pem'),
  ca: fs.readFileSync('./ca-chain.cert.pem'),
  passphrase: 'foobar'
}

var tunnelOpts = {
  proxy: {
    host: 'localhost',
    port: 9000,
    headers: { host: 'localhost:8080' } 
  },
  key: opts.key,
  cert: opts.cert,
  ca: opts.ca,
  passphrase: opts.passphrase,
  rejectUnauthorized: false
 
}

var agent = TunnelAgent.httpsOverHttp(tunnelOpts);

var requestOpts = {
  agent: agent,
  key: opts.key,
  cert: opts.cert,
  ca: opts.ca,
  passphrase: opts.passphrase,
  rejectUnauthorized: false,
  host: 'localhost',
  port: 8080,
  method: 'GET',
  path: '/'
}

https.request(requestOpts, (res) => {
  console.log(res.statusCode);
})
.on('error', (err) => {
  console.log('Error with request:', err);
})
.end();
