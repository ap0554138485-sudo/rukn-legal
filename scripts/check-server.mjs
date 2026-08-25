import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const port = 32000 + (process.pid % 1000);
const origin = `http://127.0.0.1:${port}`;
const output = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin, { headers: { "accept-encoding": "identity" } });
      if (response.ok) return;
    } catch {
      // The child process may still be starting.
    }
    await delay(100);
  }
  throw new Error(`server did not start${output.length ? `: ${output.join(" ")}` : ""}`);
}

const server = spawn(process.execPath, ["server.js"], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true
});

server.stdout.on("data", (chunk) => output.push(chunk.toString().trim()));
server.stderr.on("data", (chunk) => output.push(chunk.toString().trim()));

try {
  await waitForServer();

  const home = await fetch(origin, { headers: { "accept-encoding": "identity" } });
  const homeHtml = await home.text();
  assert(home.status === 200, `home returned ${home.status}`);
  assert(homeHtml.includes("رُكن الأنظمة القانونية"), "home content is missing");
  assert(home.headers.get("x-frame-options") === "DENY", "X-Frame-Options is missing");
  assert(home.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options is missing");
  assert(home.headers.get("strict-transport-security")?.includes("max-age=31536000"), "HSTS is missing");
  assert(home.headers.get("permissions-policy")?.includes("geolocation=()"), "Permissions-Policy is missing");
  assert(home.headers.get("etag"), "ETag is missing");
  assert(home.headers.get("last-modified"), "Last-Modified is missing");
  const csp = home.headers.get("content-security-policy") || "";
  assert(csp.includes("frame-ancestors 'none'"), "CSP frame protection is missing");
  assert(csp.includes("https://www.googletagmanager.com"), "CSP blocks Google Analytics scripts");
  assert(!csp.includes("fonts.googleapis.com"), "CSP still permits removed third-party font styles");

  const notModified = await fetch(origin, { headers: { "if-none-match": home.headers.get("etag") } });
  assert(notModified.status === 304, `conditional request returned ${notModified.status}`);

  const head = await fetch(`${origin}/articles.html`, { method: "HEAD" });
  assert(head.status === 200, `HEAD returned ${head.status}`);
  assert((await head.text()).length === 0, "HEAD returned a response body");

  const post = await fetch(origin, { method: "POST" });
  assert(post.status === 405, `POST returned ${post.status}`);
  assert(post.headers.get("allow") === "GET, HEAD", "405 response is missing the Allow header");

  for (const publicPath of ["/sitemap.xml", "/robots.txt", "/styles-20260821b.css", "/script-20260824b.js", "/logo-128-20260824.png"]) {
    const response = await fetch(`${origin}${publicPath}`);
    assert(response.status === 200, `${publicPath} returned ${response.status}`);
  }

  const versionedAsset = await fetch(`${origin}/styles-20260821b.css`);
  assert(versionedAsset.headers.get("cache-control")?.includes("immutable"), "versioned assets are not cached immutably");
  const sitemap = await fetch(`${origin}/sitemap.xml`);
  assert(sitemap.headers.get("cache-control")?.includes("max-age=0"), "sitemap may remain stale in crawler caches");

  for (const privatePath of ["/package.json", "/server.js", "/DEPLOYMENT.md", "/.git/config", "/scripts/generate-notary-pages.mjs"]) {
    const response = await fetch(`${origin}${privatePath}`);
    assert(response.status === 404, `${privatePath} is publicly exposed (${response.status})`);
  }

  const missing = await fetch(`${origin}/page-that-does-not-exist.html`);
  assert(missing.status === 404, `missing page returned ${missing.status}`);
  assert((await missing.text()).includes("noindex"), "custom 404 page is missing its noindex directive");

  const malformed = await fetch(`${origin}/%E0%A4%A`);
  assert(malformed.status === 400, `malformed URL returned ${malformed.status}`);

  console.log("Server checks passed: public files available, private files blocked, security headers active.");
} finally {
  server.kill();
}
