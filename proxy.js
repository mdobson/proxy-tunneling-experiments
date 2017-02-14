const https = require('https');
const http = require('http');
const request = require('request');
const fs = require('fs');
const util = require('util');
const url = require('url');
const net = require('net');
const tls = require('tls');

const opts = {
  key: fs.readFileSync('./server.key.pem'),
  cert: fs.readFileSync('./server.cert.pem'),
  ca: fs.readFileSync('./ca-chain.cert.pem'),
  passphrase: 'foobar',
  rejectUnauthorized: false
}

http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  var r = request({
    url: req.url,
    method: req.method,
    headers: req.headers,
  });

  req.pipe(r).pipe(res);

})
.on('connect', (req, cltSocket, head) => {
  console.log('Connect fired');
  console.log(req.url);
  console.log(req.method);
  console.log(req.headers);

  var proto, netLib;
  if(req.url.indexOf('443') > -1) {
    proto = 'https';
    netLib = tls;
  } else {  
    proto = 'http';
    netLib = net;
  }

  const connectionCb = () => {
    console.log('target connection to: ', targetUrl.port, targetUrl.hostname);
    cltSocket.write([
      'HTTP/1.1 200 Connection Established\r\n', 
      'Proxy-agent: Node.js-Proxy\r\n',
      '\r\n'
      ].join(''));

    targetConnection.write(head);
    targetConnection.pipe(cltSocket);
    cltSocket.pipe(targetConnection);
  } 

  var targetUrl = url.parse(util.format('%s://%s', proto, req.url));
  var targetConnection; 
  if(proto == 'http') {
    targetConnection = netLib.connect(targetUrl.port, targetUrl.hostname, connectionCb)
  } else {
    targetConnection = netLib.connect(opts, targetUrl.port, targetUrl.hostname, connectionCb)
  }
}).listen(9000);
