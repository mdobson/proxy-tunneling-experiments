const http = require('http');
const request = require('request');
const fs = require('fs');

http.createServer((req, res) => {
  const r = request({
    url: 'https://localhost:8080/',
    method: req.method,
    headers: req.headers,
    key: fs.readFileSync('./server.key.pem'),
    cert: fs.readFileSync('./server.cert.pem'),
    ca: fs.readFileSync('./ca-chain.cert.pem'),
    passphrase: 'foobar'
  }).on('error', (err) => {
    if(err) {
      return console.log('Err:', err);
    } 
  }).on('response', (response) => {
    res.statusMessage = response.statusMessage;
  });

  req.pipe(r);
  r.pipe(res);


}).listen(9091);

function startPipe(req, res, proxyRes) {
  res.statusCode = proxyRes.statusCode;
  res.statusMessage = proxyRes.statusMessage;
  req.pipe(res);
}
