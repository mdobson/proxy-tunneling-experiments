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
  console.log('HTTP proxy happening for: ', req.url);
  //console.log(req.url, req.method, req.headers);
  var r = request({
    url: req.url,
    method: req.method,
    headers: req.headers,
  });

  req.pipe(r).pipe(res);

})
.on('connect', (req, cltSocket, head) => {
  console.log('Connect fired');

  var proto, netLib;
  if(req.url.indexOf('443') > -1) {
    proto = 'https';
    netLib = tls;
  } else {  
    proto = 'http';
    netLib = net;
  }

  const connectionCb = () => {
    console.log('Connection established.');
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
    if(targetUrl.hostname == 'localhost') {
      console.log('Connecting to localhost over TLS.');
      try {
        targetConnection = netLib.connect(opts, targetUrl.port, targetUrl.hostname, connectionCb);
      } catch(e) {
        console.log('Error connecting.');
        console.log(e);
      }
    } else {
      console.log('Connecting to '+ targetUrl.hostname + ' over TLS.');
      try {
        targetConnection = netLib.connect(targetUrl.port, targetUrl.hostname, connectionCb);
      } catch(e) {
        console.log('Error connecting.');
        console.log(e);
      }
    }
  }
}).listen(9000, '0.0.0.0');
