const http = require('http');
const request = require('request');
const fs = require('fs');
const util = require('util');
const url = require('url');
const net = require('net');
const tls = require('tls');



http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  var r = request({
    url: req.url,
    method: req.method,
    headers: req.headers,
  });

  req.pipe(r).pipe(res);
}).listen(9000);
