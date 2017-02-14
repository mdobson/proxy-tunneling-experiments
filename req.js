const req = require('request');
const fs = require('fs');
const opts = {
  key: fs.readFileSync('./server.key.pem'),
  cert: fs.readFileSync('./server.cert.pem'),
  ca: fs.readFileSync('./ca-chain.cert.pem'),
  passphrase: 'foobar'
}

var r = req({
  key: opts.key,
  cert: opts.cert,
  ca: opts.ca,
  passphrase: opts.passphrase,
  rejectUnauthorized: false,
  proxy:'http://localhost:9000',
  tunnel: true,
  method:'POST',
  url:'http://localhost:8080/',
  headers: {
    'X-Proxy-Server': 'http://localhost:9000'
  },
  json: {
    foo: 'bar'      
  }
}, function(err, res, body) {
  if(err) {
    return console.log(err);
  }
  console.log(res.statusCode);
  console.log(res.headers);
  console.log(body);
})

