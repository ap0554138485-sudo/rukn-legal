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

function responseHeaders(ext, encoding) {
  const headers = {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Cache-Control': longCache.has(ext)
      ? 'public, max-age=86400, stale-while-revalidate=604800'
      : 'public, max-age=300, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  if (encoding) {
    headers['Content-Encoding'] = encoding;
    headers.Vary = 'Accept-Encoding';
  }

  return headers;
}

function sendFile(req, res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const accepted = String(req.headers['accept-encoding'] || '');
  const stream = fs.createReadStream(filePath);
  let encoding = '';
  let output = stream;

  if (compressible.has(ext) && accepted.includes('br')) {
    encoding = 'br';
    output = stream.pipe(zlib.createBrotliCompress());
  } else if (compressible.has(ext) && accepted.includes('gzip')) {
    encoding = 'gzip';
    output = stream.pipe(zlib.createGzip());
  }

  res.writeHead(statusCode, responseHeaders(ext, encoding));
  output.pipe(res);
}

http.createServer((req, res) => {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad Request');
  }

  if (pathname === '/') pathname = '/index.html';

  const relativePath = pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(rootPath + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (error, stat) => {
    if (!error && stat.isFile()) return sendFile(req, res, filePath);

    const notFoundPath = path.resolve(root, '404.html');
    fs.stat(notFoundPath, (notFoundError, notFoundStat) => {
      if (!notFoundError && notFoundStat.isFile()) return sendFile(req, res, notFoundPath, 404);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    });
  });
}).listen(port, '0.0.0.0', () => {
  console.log('Rukn Legal running');
});
