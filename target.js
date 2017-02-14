const http = require('http');
const https = require('https');
const zlib = require('zlib');
const fs = require('fs');

const opts = {
  key: fs.readFileSync('./server.key.pem'),
  cert: fs.readFileSync('./server.cert.pem'),
  ca: fs.readFileSync('./ca-chain.cert.pem'),
  passphrase: 'foobar',
  rejectUnauthorized: false
}

var srv = http.createServer((req, res) => {
  console.log(req.headers);
  console.log('here');
  if(req.headers['content-encoding'] && req.headers['content-encoding'] == 'gzip') {
    console.log('unzipping');
    const gunzip = zlib.createGunzip();


    res.writeHead(200, 'LUL LUL LUL');
    req.pipe(gunzip).pipe(res); 
  } else {
    var b = [];
    req.on('data', (d) => {
      b += d; 
    });

    req.on('end', () => {
      console.log('finished writing: ', b.length);
      var headers = {};
      Object.keys(req.headers).forEach((h) => {
        if(h.indexOf('X-') > -1 || h.indexOf('x-') >-1) {
          headers[h] = req.headers[h]; 
        } 
      });
      console.log(b.toString());
      if(b.length < 100 && b.length > 0) {
        res.setHeader('content-length', b.length);
        res.writeHead(200, headers);
        res.end(b.toString() + '\n\n'); 
      } else {
        res.setHeader('content-length', 5);
        res.writeHead(200, headers);
        res.end('Hello');
      }
      
    }); 
  }
});

//srv.on('connection', (socket) => {
//  console.log('Socket connection from proxy?');
//});

srv.on('connect', () => {
  console.log('connected!');
});

srv.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' + 
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');
  socket.on('data', (d) => {
    console.log('Received:', d.toString());
  });
  socket.pipe(socket);
});

/*
srv.on('checkContinue', (req, res) => {
  console.log('continued');
  res.writeContinue();

  var b = [];
  req.on('data', (d) => {
    b += d; 
  });

  req.on('end', () => {
    console.log('finished writing: ', b.length);
    if(b.length < 1000) {
      console.log('buf: ', b.toString());
    }
    res.writeHead(200);
    res.end('Success at continuing!\n');
  });
});
*/

srv.listen(8080);
