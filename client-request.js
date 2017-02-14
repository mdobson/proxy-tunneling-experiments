const http = require('http');
const setupNonTunnelProxy = require('./build-non-tunnel-options.js');
const setupTunnelProxy = require('./build-tunnel-agent.js');

const proxyOpts = {
  parsedUrl: {
    protocol: 'http'           
  }
}
const httpProxyConfig = {
  proxy: 'http://localhost:9000',
  proxy_tunnel: false 
}

const requestOpts = {
  host: 'localhost',
  port: 8080,
  path: '/foo?foo=bar',
  method: 'GET'
}

var newOpts;
if(httpProxyConfig.proxy && !httpProxyConfig.proxy_tunnel) {
  newOpts = setupNonTunnelProxy(proxyOpts, requestOpts, httpProxyConfig);
} else {
  var agent = setupTunnelProxy(httpProxyConfig, requestOpts, proxyOpts);
  newOpts = requestOpts;
  newOpts.agent = agent;
}

http.request(newOpts, (res) => {
  console.log('StatusCode: ', res.statusCode);
}).end();
