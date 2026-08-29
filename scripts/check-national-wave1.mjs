import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations, pages } from "./generate-national-wave1.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const failures = [];
const warnings = [];
const documents = new Map();
const visible = new Map();
const seen = { title: new Map(), description: new Map(), h1: new Map(), body: new Map() };
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");

function fail(message) { failures.push(message); }
function capture(html, pattern) { return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || ""; }
function text(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, " ").replace(/\s+/g, " ").trim();
}
function shingles(value, size = 5) {
  const words = value.split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) result.add(words.slice(index, index + size).join(" "));
  return result;
}
function jaccard(left, right) {
  let intersection = 0;
  const smaller = left.size < right.size ? left : right;
  const larger = left.size < right.size ? right : left;
  for (const value of smaller) if (larger.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection || 1);
}
function schemaNodes(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

if (pages.length !== 100) fail(`Expected exactly 100 pages, found ${pages.length}.`);
if (new Set(pages.map((page) => page.slug)).size !== 100) fail("Generated slugs are not unique.");
if (new Set(pages.map((page) => page.key)).size !== 100) fail("Guide topics are not unique.");

const coveredRegions = new Set(pages.map((page) => page.location.region));
if (coveredRegions.size !== 13) fail(`Expected all 13 regions, found ${coveredRegions.size}.`);
for (const location of locations) {
  if (!pages.some((page) => page.location.key === location.key)) warnings.push(`Unused location in batch one: ${location.name}.`);
}

for (const page of pages) {
  const path = resolve(root, page.slug);
  if (!existsSync(path)) { fail(`Missing file: ${page.slug}`); continue; }
  const html = readFileSync(path, "utf8");
  documents.set(page.slug, html);
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1 = capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const main = capture(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const plain = text(main);
  visible.set(page.slug, plain);
  const bodyHash = createHash("sha256").update(plain).digest("hex");
  for (const [field, value] of Object.entries({ title, description, h1, body: bodyHash })) {
    if (!value) fail(`${page.slug}: missing ${field}.`);
    else if (seen[field].has(value)) fail(`${page.slug}: duplicate ${field} also used by ${seen[field].get(value)}.`);
    else seen[field].set(value, page.slug);
  }
  const expectedCanonical = `${baseUrl}/${page.slug}`;
  if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) fail(`${page.slug}: incorrect canonical.`);
  if (!html.includes('name="robots" content="index,follow')) fail(`${page.slug}: page is not indexable.`);
  if (!html.includes('data-national-wave="1"')) fail(`${page.slug}: missing wave marker.`);
  if (!html.includes("G-KKGEYHSD29")) fail(`${page.slug}: missing Analytics.`);
  if (!html.includes("دون فرع مزعوم") || !plain.includes("لا يعني وجود مكتب أو فرع")) fail(`${page.slug}: local coverage clarification is incomplete.`);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  if (wordCount < 650) fail(`${page.slug}: content is too short (${wordCount} words).`);
  if (description.length < 100 || description.length > 190) warnings.push(`${page.slug}: description length is ${description.length}.`);
  const schemaBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!schemaBlocks.length) fail(`${page.slug}: missing JSON-LD.`);
  const nodes = [];
  for (const block of schemaBlocks) {
    try { nodes.push(...schemaNodes(JSON.parse(block[1]))); } catch (error) { fail(`${page.slug}: invalid JSON-LD (${error.message}).`); }
  }
  for (const type of ["Article", "Service", "FAQPage", "BreadcrumbList", "WebPage"]) {
    if (!nodes.some((node) => node["@type"] === type)) fail(`${page.slug}: missing ${type} schema.`);
  }
  const sitemapCount = (sitemap.match(new RegExp(expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  if (sitemapCount !== 1) fail(`${page.slug}: appears ${sitemapCount} times in sitemap.`);
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#|\/)/.test(href)) continue;
    const target = href.split("#")[0].split("?")[0];
    if (target && !existsSync(resolve(root, target))) fail(`${page.slug}: broken link ${href}.`);
  }
}

const inbound = new Map(pages.map((page) => [page.slug, new Set()]));
for (const file of readdirSync(root).filter((name) => name.endsWith(".html"))) {
  const html = readFileSync(resolve(root, file), "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const target = match[1].split("#")[0].replace(/^\//, "");
    if (inbound.has(target) && target !== file) inbound.get(target).add(file);
  }
}
for (const page of pages) {
  if ((inbound.get(page.slug)?.size || 0) < 3) fail(`${page.slug}: fewer than 3 inbound internal links.`);
}

let maximumSimilarity = { score: 0, left: "", right: "" };
const shingleCache = new Map(pages.map((page) => [page.slug, shingles(visible.get(page.slug) || "")]));
for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const left = pages[leftIndex];
    const right = pages[rightIndex];
    const score = jaccard(shingleCache.get(left.slug), shingleCache.get(right.slug));
    if (score > maximumSimilarity.score) maximumSimilarity = { score, left: left.slug, right: right.slug };
  }
}
if (maximumSimilarity.score > 0.50) fail(`Similarity is too high: ${(maximumSimilarity.score * 100).toFixed(1)}% between ${maximumSimilarity.left} and ${maximumSimilarity.right}.`);

if (warnings.length) {
  console.warn(`Non-blocking warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error(`National wave-one audit failed (${failures.length}):`);
  for (const failure of failures.slice(0, 100)) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`National wave-one audit passed: ${pages.length} unique guides across ${coveredRegions.size} regions.`);
console.log(`Maximum five-word-shingle similarity: ${(maximumSimilarity.score * 100).toFixed(1)}% (${maximumSimilarity.left} / ${maximumSimilarity.right}).`);
