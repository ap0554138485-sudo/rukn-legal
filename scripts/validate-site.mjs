import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = readdirSync(root).filter((file) => file.endsWith(".html") && !file.startsWith("google"));
const errors = [];

for (const file of files) {
  const html = readFileSync(resolve(root, file), "utf8");
  const required = [
    ["title", /<title>[^<]+<\/title>/],
    ["meta description", /<meta name="description" content="[^"]+"\s*\/?>/],
    ["canonical", /<link rel="canonical" href="[^"]+"\s*\/?>/],
    ["H1", /<h1[^>]*>[\s\S]*?<\/h1>/],
    ["Analytics", /G-KKGEYHSD29/]
  ];
  for (const [label, pattern] of required) {
    if (!pattern.test(html)) errors.push(`${file}: missing ${label}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith("#")) {
      if (!html.includes(`id="${href.slice(1)}"`)) errors.push(`${file}: missing fragment target ${href}`);
      continue;
    }
    if (/^(https?:|mailto:|tel:|\/)/.test(href)) continue;
    const target = href.split("#")[0].split("?")[0];
    if (target && !existsSync(resolve(root, target))) errors.push(`${file}: broken internal link ${href}`);
    const fragment = href.includes("#") ? href.split("#")[1].split("?")[0] : "";
    if (target && fragment && existsSync(resolve(root, target))) {
      const targetHtml = readFileSync(resolve(root, target), "utf8");
      if (!targetHtml.includes(`id="${fragment}"`)) errors.push(`${file}: missing target ${href}`);
    }
  }
}

const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const sitemapCount = [...sitemap.matchAll(/<loc>/g)].length;
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const file of files) {
  const expected = file === "index.html" ? "https://rukn-legal-vwptio.cranl.net/" : `https://rukn-legal-vwptio.cranl.net/${file}`;
  if (!sitemapLocations.includes(expected)) errors.push(`${file}: not listed in sitemap.xml`);
}

console.log(`Public pages: ${files.length}`);
console.log(`Sitemap URLs: ${sitemapCount}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
