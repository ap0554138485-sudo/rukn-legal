import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const origin = "https://rukn-legal-vwptio.cranl.net";
const files = readdirSync(root)
  .filter((file) => file.endsWith(".html") && !file.startsWith("google"))
  .sort();
const fileSet = new Set(files);
const errors = [];
const warnings = [];
const inbound = new Map(files.map((file) => [file, new Set()]));
const pages = new Map();

function matches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1].trim());
}

function textContent(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function schemaNodes(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

function localTarget(href) {
  if (!href || /^(?:#|mailto:|tel:|javascript:)/i.test(href)) return null;
  let value = href;
  if (/^https?:\/\//i.test(value)) {
    let url;
    try {
      url = new URL(value);
    } catch {
      return null;
    }
    if (url.origin !== origin) return null;
    value = url.pathname;
  }
  value = value.split("#")[0].split("?")[0];
  if (!value || value === "/") return "index.html";
  return decodeURIComponent(value.replace(/^\//, ""));
}

for (const file of files) {
  const html = readFileSync(resolve(root, file), "utf8");
  const titles = matches(html, /<title>([\s\S]*?)<\/title>/gi);
  const descriptions = matches(html, /<meta\s+name="description"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const authors = matches(html, /<meta\s+name="author"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const canonicals = matches(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/gi);
  const h1s = matches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(textContent);
  const robots = matches(html, /<meta\s+name="robots"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const ogTitles = matches(html, /<meta\s+property="og:title"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const ogDescriptions = matches(html, /<meta\s+property="og:description"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const ogUrls = matches(html, /<meta\s+property="og:url"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const faviconLinks = matches(html, /<link\s+rel="icon"\s+href="([^"]+)"\s*\/?\s*>/gi);
  const appleTouchIcons = matches(html, /<link\s+rel="apple-touch-icon"\s+href="([^"]+)"\s*\/?\s*>/gi);
  const themeColors = matches(html, /<meta\s+name="theme-color"\s+content="([^"]+)"\s*\/?\s*>/gi);
  const expectedCanonical = file === "index.html" ? `${origin}/` : `${origin}/${file}`;
  const isNoindex = robots.some((value) => /\bnoindex\b/i.test(value));
  const internalTargets = new Set();

  for (const [label, values] of [
    ["title", titles],
    ["meta description", descriptions],
    ["author", authors],
    ["canonical", canonicals],
    ["H1", h1s],
    ["robots", robots],
    ["og:title", ogTitles],
    ["og:description", ogDescriptions],
    ["og:url", ogUrls],
    ["favicon", faviconLinks],
    ["Apple touch icon", appleTouchIcons],
    ["theme color", themeColors]
  ]) {
    if (values.length !== 1) errors.push(`${file}: expected one ${label}, found ${values.length}`);
  }
  if (canonicals[0] && canonicals[0] !== expectedCanonical) {
    errors.push(`${file}: canonical should be ${expectedCanonical}`);
  }
  if (ogUrls[0] && ogUrls[0] !== expectedCanonical) {
    errors.push(`${file}: og:url should be ${expectedCanonical}`);
  }
  if (faviconLinks[0] && faviconLinks[0] !== "/favicon.ico") errors.push(`${file}: favicon should use /favicon.ico`);
  if (appleTouchIcons[0] && appleTouchIcons[0] !== "/logo-128-20260824.png") errors.push(`${file}: Apple touch icon should use /logo-128-20260824.png`);
  if (themeColors[0] && themeColors[0] !== "#102a29") errors.push(`${file}: unexpected theme color ${themeColors[0]}`);
  if (!/G-KKGEYHSD29/.test(html)) errors.push(`${file}: missing Google Analytics tag`);
  if (!/rel="alternate"\s+hreflang="(?:ar|en)"/i.test(html)) errors.push(`${file}: missing language alternate`);
  if (!/rel="alternate"\s+hreflang="x-default"/i.test(html)) errors.push(`${file}: missing x-default alternate`);

  const jsonLdBlocks = matches(html, /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  const parsedJsonLd = [];
  if (!jsonLdBlocks.length) errors.push(`${file}: missing JSON-LD`);
  for (const jsonLd of jsonLdBlocks) {
    try {
      parsedJsonLd.push(JSON.parse(jsonLd));
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
  const structuredNodes = parsedJsonLd.flatMap(schemaNodes);
  if (!structuredNodes.some((node) => node["@type"] === "WebPage")) errors.push(`${file}: missing WebPage structured data`);
  if (file === "index.html") {
    const organization = structuredNodes.find((node) => node["@type"] === "Organization" && node["@id"] === `${origin}/#organization`);
    const logoUrl = typeof organization?.logo === "string" ? organization.logo : organization?.logo?.url || organization?.logo?.contentUrl;
    if (logoUrl !== `${origin}/logo-128-20260824.png`) errors.push(`${file}: Organization logo is missing or incorrect`);
  }
  if (!/data-content-accountability/i.test(html)) errors.push(`${file}: missing visible content accountability block`);
  if (!/<time\s+datetime="2026-08-24"/i.test(html)) errors.push(`${file}: missing current content update date`);
  const hasVisibleBreadcrumb = /class="[^"]*\bbreadcrumb\b/i.test(html);
  if (!isNoindex && hasVisibleBreadcrumb && !structuredNodes.some((node) => node["@type"] === "BreadcrumbList")) {
    errors.push(`${file}: visible breadcrumb is missing BreadcrumbList structured data`);
  }

  for (const href of matches(html, /<a\b[^>]*\shref="([^"]+)"[^>]*>/gi)) {
    const target = localTarget(href);
    if (!target) continue;
    if (!existsSync(resolve(root, target))) {
      errors.push(`${file}: broken internal link ${href}`);
      continue;
    }
    if (!target.endsWith(".html") || !fileSet.has(target)) continue;
    internalTargets.add(target);
    inbound.get(target)?.add(file);
  }

  const words = textContent(html).split(/\s+/).filter(Boolean).length;
  if (words < 180 && !isNoindex) warnings.push(`${file}: only ${words} visible words`);
  pages.set(file, {
    file,
    title: titles[0],
    description: descriptions[0],
    canonical: canonicals[0],
    isNoindex,
    words,
    internalTargets
  });
}

for (const field of ["title", "description", "canonical"]) {
  const seen = new Map();
  for (const page of pages.values()) {
    if (!page[field]) continue;
    if (seen.has(page[field])) {
      errors.push(`${page.file}: duplicate ${field} also used by ${seen.get(page[field])}`);
    } else {
      seen.set(page[field], page.file);
    }
  }
}

const sitemapXml = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const sitemapLocations = matches(sitemapXml, /<loc>([^<]+)<\/loc>/gi);
const sitemapSet = new Set(sitemapLocations);
if (sitemapLocations.length !== sitemapSet.size) errors.push("sitemap.xml: duplicate URL entries");

for (const page of pages.values()) {
  const expected = page.file === "index.html" ? `${origin}/` : `${origin}/${page.file}`;
  if (page.isNoindex && sitemapSet.has(expected)) errors.push(`${page.file}: noindex page listed in sitemap`);
  if (!page.isNoindex && !sitemapSet.has(expected)) errors.push(`${page.file}: indexable page missing from sitemap`);
  if (!page.isNoindex && page.file !== "index.html" && inbound.get(page.file).size === 0) {
    errors.push(`${page.file}: indexable orphan page with no internal links pointing to it`);
  }
  if (!page.isNoindex && page.internalTargets.size === 0) warnings.push(`${page.file}: no outgoing links to another public page`);
}

for (const location of sitemapLocations) {
  const target = localTarget(location);
  if (!target || !fileSet.has(target)) errors.push(`sitemap.xml: URL has no public HTML file (${location})`);
}

const robotsTxt = readFileSync(resolve(root, "robots.txt"), "utf8");
if (!/User-agent:\s*\*/i.test(robotsTxt)) errors.push("robots.txt: missing global user-agent rule");
if (!new RegExp(`Sitemap:\\s*${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`, "i").test(robotsTxt)) {
  errors.push("robots.txt: missing production sitemap URL");
}

for (const asset of ["favicon.ico", "logo-128-20260824.png", "script-20260824b.js"]) {
  if (!existsSync(resolve(root, asset))) errors.push(`${asset}: missing search appearance asset`);
}

const indexable = [...pages.values()].filter((page) => !page.isNoindex);
const noindex = [...pages.values()].filter((page) => page.isNoindex);
const weakest = indexable
  .filter((page) => page.file !== "index.html")
  .map((page) => ({ file: page.file, links: inbound.get(page.file).size, words: page.words }))
  .sort((a, b) => a.links - b.links || a.words - b.words)
  .slice(0, 10);

console.log(`Public content pages: ${pages.size}`);
console.log(`Indexable pages: ${indexable.length}`);
console.log(`Noindex pages: ${noindex.length}${noindex.length ? ` (${noindex.map((page) => basename(page.file)).join(", ")})` : ""}`);
console.log(`Sitemap URLs: ${sitemapLocations.length}`);
console.log("Weakest internal-link coverage:");
for (const page of weakest) console.log(`  ${page.file}: ${page.links} source page(s), ${page.words} words`);
console.log(`Warnings: ${warnings.length}`);
if (warnings.length) console.log(warnings.join("\n"));
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
