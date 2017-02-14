const url = require('url');
const qs = require('querystring');


module.exports = function(proxy, requestOpts, proxyOpts) {
  const parsedQuery = url.parse(requestOpts.path);
  var urlFormatOpts = {
    protocol: proxy.parsedUrl.protocol,
    hostname: requestOpts.host,
    pathname: parsedQuery.pathname,
    search: parsedQuery.search,
    hash: parsedQuery.hash,
    port: requestOpts.port
  } 

  const parsedHttpProxyUrl = url.parse(proxyOpts.proxy);
  const newPath = url.format(urlFormatOpts);

  var newOpts = {
    method: requestOpts.method,
    host: parsedHttpProxyUrl.hostname,
    port: parsedHttpProxyUrl.port,
    path: newPath,
    headers: requestOpts.headers
  }

  return newOpts;
}
