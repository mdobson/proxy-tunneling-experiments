const http = require('http');



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

connectProxy();
