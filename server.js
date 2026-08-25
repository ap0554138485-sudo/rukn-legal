const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const port = process.env.PORT || 3000;
const root = __dirname;
const rootPath = path.resolve(root);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const compressible = new Set(['.html', '.css', '.js', '.xml', '.txt', '.json', '.svg']);
const longCache = new Set(['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico']);
const publicFiles = new Set(['favicon.ico', 'robots.txt', 'sitemap.xml']);
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com",
  "img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com",
  'upgrade-insecure-requests'
].join('; ');

function cacheControl(filePath, ext) {
  const fileName = path.basename(filePath || '');
  if (/^(?:styles|script|logo)-[a-z0-9]+\.(?:css|js|png|jpe?g|svg)$/i.test(fileName)) {
    return 'public, max-age=31536000, immutable';
  }
  if (fileName === 'sitemap.xml' || fileName === 'robots.txt') {
    return 'public, max-age=0, must-revalidate';
  }
  return longCache.has(ext)
    ? 'public, max-age=86400, stale-while-revalidate=604800'
    : 'public, max-age=300, must-revalidate';
}

function responseHeaders(ext, encoding, filePath, stat) {
  const headers = {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Cache-Control': cacheControl(filePath, ext),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': contentSecurityPolicy,
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0'
  };

  if (encoding) {
    headers['Content-Encoding'] = encoding;
    headers.Vary = 'Accept-Encoding';
  }

  if (stat) {
    headers.ETag = `W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
    headers['Last-Modified'] = stat.mtime.toUTCString();
  }

  return headers;
}

function sendFile(req, res, filePath, statusCode = 200, stat) {
  const ext = path.extname(filePath).toLowerCase();
  const accepted = String(req.headers['accept-encoding'] || '');
  let encoding = '';

  if (compressible.has(ext) && accepted.includes('br')) {
    encoding = 'br';
  } else if (compressible.has(ext) && accepted.includes('gzip')) {
    encoding = 'gzip';
  }

  const headers = responseHeaders(ext, encoding, filePath, stat);
  if (statusCode === 200 && stat && req.headers['if-none-match'] === headers.ETag) {
    res.writeHead(304, headers);
    return res.end();
  }
  res.writeHead(statusCode, headers);
  if (req.method === 'HEAD') return res.end();

  const stream = fs.createReadStream(filePath);
  let output = stream;
  if (encoding === 'br') output = stream.pipe(zlib.createBrotliCompress());
  if (encoding === 'gzip') output = stream.pipe(zlib.createGzip());
  output.pipe(res);
}

function isPublicFile(relativePath) {
  if (!relativePath || relativePath.includes('/') || relativePath.includes('\\')) return false;
  if (/^[a-z0-9-]+\.html$/i.test(relativePath)) return true;
  if (/^styles(?:-[a-z0-9]+)?\.css$/i.test(relativePath)) return true;
  if (/^script(?:-[a-z0-9]+)?\.js$/i.test(relativePath)) return true;
  if (/^logo(?:-[a-z0-9]+)*\.(?:png|jpe?g|svg)$/i.test(relativePath)) return true;
  return publicFiles.has(relativePath.toLowerCase());
}

function sendNotFound(req, res) {
  const notFoundPath = path.resolve(root, '404.html');
  fs.stat(notFoundPath, (error, stat) => {
    if (!error && stat.isFile()) return sendFile(req, res, notFoundPath, 404, stat);
    res.writeHead(404, responseHeaders('.txt'));
    return res.end('Not Found');
  });
}

http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { ...responseHeaders('.txt'), Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  let pathname;

  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, responseHeaders('.txt'));
    return res.end('Bad Request');
  }

  if (pathname === '/') pathname = '/index.html';

  const relativePath = pathname.replace(/^\/+/, '');
  if (!isPublicFile(relativePath)) return sendNotFound(req, res);

  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(rootPath + path.sep)) {
    res.writeHead(403, responseHeaders('.txt'));
    return res.end('Forbidden');
  }

  fs.stat(filePath, (error, stat) => {
    if (!error && stat.isFile()) return sendFile(req, res, filePath, 200, stat);
    return sendNotFound(req, res);
  });
}).listen(port, '0.0.0.0', () => {
  console.log('Rukn Legal running');
});
