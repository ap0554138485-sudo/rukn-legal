import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generatedPages, generatedSlugs } from "./generate-dammam-waves.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const errors = [];

if (generatedPages.length !== 60) errors.push(`Expected 60 pages, found ${generatedPages.length}.`);
if (new Set(generatedSlugs).size !== generatedSlugs.length) errors.push("Duplicate Dammam slugs found.");

for (const wave of [1, 2, 3]) {
  const count = generatedPages.filter((page) => page.wave === wave).length;
  if (count !== 20) errors.push(`Wave ${wave}: expected 20 pages, found ${count}.`);
}

const titles = new Map();
const descriptions = new Map();
const h1s = new Map();
const hashes = new Map();

for (const page of generatedPages) {
  const path = resolve(root, page.slug);
  if (!existsSync(path)) {
    errors.push(`${page.slug}: missing file.`);
    continue;
  }
  const html = readFileSync(path, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
  const words = visible.split(" ").filter(Boolean).length;
  const hash = createHash("sha256").update(visible).digest("hex");

  if (!title) errors.push(`${page.slug}: missing title.`);
  if (!description) errors.push(`${page.slug}: missing description.`);
  if (!h1) errors.push(`${page.slug}: missing H1.`);
  if (canonical !== `${baseUrl}/${page.slug}`) errors.push(`${page.slug}: incorrect canonical.`);
  if (!html.includes("G-KKGEYHSD29")) errors.push(`${page.slug}: missing Analytics.`);
  if (!/(?:لا تدعي|لا يدعي|لا يعني|ولا تدعي|دون ادعاء)/.test(html)) errors.push(`${page.slug}: missing no-branch clarification.`);
  if (/noindex/i.test(html)) errors.push(`${page.slug}: unexpectedly noindex.`);
  if (words < 350) errors.push(`${page.slug}: thin page (${words} words).`);

  for (const [label, value, map] of [["title", title, titles], ["description", description, descriptions], ["H1", h1, h1s], ["body", hash, hashes]]) {
    if (!value) continue;
    if (map.has(value)) errors.push(`${page.slug}: duplicate ${label} with ${map.get(value)}.`);
    else map.set(value, page.slug);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${page.slug}: invalid JSON-LD (${error.message}).`);
    }
  }
}

const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
for (const slug of generatedSlugs) {
  const url = `${baseUrl}/${slug}`;
  const count = sitemap.split(`<loc>${url}</loc>`).length - 1;
  if (count !== 1) errors.push(`${slug}: sitemap occurrence is ${count}, expected 1.`);
}

console.log(`Dammam pages: ${generatedPages.length}`);
console.log(`Wave 1: ${generatedPages.filter((page) => page.wave === 1).length}`);
console.log(`Wave 2: ${generatedPages.filter((page) => page.wave === 2).length}`);
console.log(`Wave 3: ${generatedPages.filter((page) => page.wave === 3).length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
