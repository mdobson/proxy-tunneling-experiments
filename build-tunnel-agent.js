const url = require('url');
const TunnelAgent = require('tunnel-agent');

module.exports = (proxyConfig, agentOptions, proxy, proxyHeaders) => {
  proxyHeaders = proxyHeaders || {};
  const parsedProxyUrl = url.parse(proxyConfig.proxy); 

  const tunnelOpts = createTunnelAgentOptions(parsedProxyUrl, agentOptions);
  const tunnelAgentFunction =  getTunnelFunction(proxy.parsedUrl.protocol, parsedProxyUrl.protocol);
  return tunnelAgentFunction(tunnelOpts);
}

const createTunnelAgentOptions = (parsedProxyUrl, agentOptions) => {

  var tunnelOpts = {
    proxy: {
      host: parsedProxyUrl.hostname,
      port: parsedProxyUrl.port,
      headers: {
        host: agentOptions.host + ':' + agentOptions.port
      } 
    },
    ca: agentOptions.ca,
    cert: agentOptions.cert,
    key: agentOptions.key,
    passphrase: agentOptions.passphrase,
    pfx: agentOptions.pfx,
    ciphers: agentOptions.ciphers,
    rejectUnauthorized: agentOptions.rejectUnauthorized,
    secureOptions: agentOptions.secureOptions,
    secureProtocol: agentOptions.secureProtocol
  };   

  return tunnelOpts;
}


const getTunnelFunction = (targetProtocol, proxyProtocol) => {
  var functionName = '';

  if(targetProtocol.indexOf('https') > -1) {
    functionName += 'https';
  } else {
    functionName += 'http';
  }

  functionName += 'Over';

  if(proxyProtocol.indexOf('https') > -1) {
    functionName += 'Https';
  } else {
    functionName += 'Http';
  }

  return TunnelAgent[functionName];
}

module.exports.createTunnelAgentOptions = createTunnelAgentOptions;
module.exports.getTunnelFunction = getTunnelFunction;
