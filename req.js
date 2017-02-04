const req = require('request');
const fs = require('fs');

req({
  proxy:'http://localhost:9000',
  method:'POST',
  url:'https://mocktarget.apigee.net/',
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
