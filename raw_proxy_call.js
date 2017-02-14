const http = require('http');
const https = require('https');
const fs = require('fs');

const tlsOpts = {
  key: fs.readFileSync('./server.key.pem'),
  cert: fs.readFileSync('./server.cert.pem'),
  ca: fs.readFileSync('./ca-chain.cert.pem'),
  passphrase: 'foobar'
}

function httpProxy() {
  var opts = {
    path: 'http://localhost:8080',
    host: 'localhost',
    port: 9000,
    method: 'GET',
    headers: {
      'x-foo': 'bar'
    }
  }

  http.request(opts, (res) => {
    console.log(res.statusCode);
  }).end();
}

function connectProxy() {
  var opts = {
    path: 'localhost:8080',
    host: 'localhost',
    port: 9000,
    method: 'CONNECT',
  }


  var req = http.request(opts);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('Connected to proxy: ', res.statusCode);
    const requestLine = [
      'POST / HTTP/1.1\r\n',
      'Host: localhost:8080\r\n',
      'Connection: close\r\n',
      'Content-Length: 7\r\n',
      'X-Foo: Bar\r\n',
      '\r\n',
      'foo=bar',
      '\r\n'
    ];
    socket.write(requestLine.join(''));

    socket.on('data', (chunk) => {
      console.log('CHUNK');
      console.log(chunk.toString('ascii'));
      console.log('CHUNK');
    });

    socket.on('end', () => {
    });
  });
}

function postJSON() {
  var opts = {
    path: 'localhost:8080',
    host: 'localhost',
    port: 9000,
    method: 'CONNECT',
  }

  Object.keys(tlsOpts).forEach((k) => {
    const v = tlsOpts[k];
    opts[k] = v;
  });
  var req = https.request(opts);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('Connected to proxy: ', res.statusCode);
    var data = JSON.stringify({foo: 'bar'})
    const requestLine = [
      'POST / HTTP/1.1\r\n',
      'Host: localhost:8080\r\n',
      'Connection: close\r\n',
      'Content-Length: '+data.length+'\r\n',
      'Content-Type: application/json\r\n',
      'X-Foo: Bar\r\n',
      '\r\n',
      data,
      '\r\n'
    ];
    socket.write(requestLine.join(''));

    socket.on('data', (chunk) => {
      console.log('CHUNK');
      console.log(chunk.toString('ascii'));
      console.log('CHUNK');
    });

    socket.on('end', () => {
    });
  });
}

postJSON();
