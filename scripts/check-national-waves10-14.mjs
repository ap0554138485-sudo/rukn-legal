import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pages as waveOnePages } from "./generate-national-wave1.mjs";
import { pages as waveTwoPages } from "./generate-national-wave2.mjs";
import { pages as waveThreePages } from "./generate-national-wave3.mjs";
import { pages as wavesFourToSevenPages } from "./generate-national-waves4-7.mjs";
import { pages as waveEightPages } from "./generate-national-wave8.mjs";
import { pages as waveNinePages } from "./generate-national-wave9.mjs";
import { pages as expansionPages } from "./generate-national-waves10-14.mjs";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const batch = Number(process.argv[2]);
if (!Number.isInteger(batch) || batch < 10 || batch > 14) throw new Error("Choose a batch from 10 through 14.");

const pages = expansionPages.filter((page) => page.batch === batch);
const originalPages = [...waveOnePages, ...waveTwoPages, ...waveThreePages, ...wavesFourToSevenPages, ...waveEightPages, ...waveNinePages];
const earlierExpansion = expansionPages.filter((page) => page.batch < batch);
const priorPages = [...originalPages, ...earlierExpansion];
const sitemap = readFileSync(resolve(root, `sitemap-national-w${batch}.xml`), "utf8");
const failures = [];
const warnings = [];
const visible = new Map();
const seen = { title: new Map(), description: new Map(), h1: new Map(), body: new Map() };

function fail(message) { failures.push(message); }
function capture(html, pattern) { return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || ""; }
function text(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function shingles(value, size = 5) {
  const words = value.split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) result.add(words.slice(index, index + size).join(" "));
  return result;
}
function jaccard(left, right) {
  const smaller = left.size < right.size ? left : right;
  const larger = left.size < right.size ? right : left;
  if (smaller.size / Math.max(larger.size, 1) <= 0.5) return 0;
  let intersection = 0;
  for (const value of smaller) if (larger.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection || 1);
}
function schemaNodes(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

if (pages.length !== 100) fail(`Expected exactly 100 pages, found ${pages.length}.`);
if (new Set(pages.map((page) => page.slug)).size !== 100) fail(`Batch ${batch} slugs are not unique.`);
if (new Set(pages.map((page) => page.key)).size !== 100) fail(`Batch ${batch} keys are not unique.`);
if (new Set(pages.map((page) => page.title)).size !== 100) fail(`Batch ${batch} titles are not unique.`);
if (new Set(pages.map((page) => page.matter.key)).size !== 25) fail(`Batch ${batch} must include all 25 legal matters.`);
if (new Set(pages.map((page) => page.stage.key)).size !== 4) fail(`Batch ${batch} must include four distinct legal stages.`);
if (new Set(pages.map((page) => page.location.region)).size !== 13) fail(`Batch ${batch} must cover all 13 regions.`);

const priorKeys = new Set(priorPages.map((page) => page.key));
const priorTitles = new Set(priorPages.map((page) => page.title));
for (const page of pages) {
  if (priorKeys.has(page.key)) fail(`${page.slug}: key duplicates an earlier batch.`);
  if (priorTitles.has(page.title)) fail(`${page.slug}: title duplicates an earlier batch.`);
  const path = resolve(root, page.slug);
  if (!existsSync(path)) {
    fail(`Missing file: ${page.slug}`);
    continue;
  }
  const html = readFileSync(path, "utf8");
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1 = capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const plain = text(capture(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i));
  visible.set(page.slug, plain);
  const bodyHash = createHash("sha256").update(plain).digest("hex");
  for (const [field, value] of Object.entries({ title, description, h1, body: bodyHash })) {
    if (!value) fail(`${page.slug}: missing ${field}.`);
    else if (seen[field].has(value)) fail(`${page.slug}: duplicate ${field} also used by ${seen[field].get(value)}.`);
    else seen[field].set(value, page.slug);
  }
  if (title.length > 65) fail(`${page.slug}: title is too long (${title.length}).`);
  if (description.length < 100 || description.length > 170) warnings.push(`${page.slug}: description length is ${description.length}.`);
  const expectedCanonical = `${baseUrl}/${page.slug}`;
  if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) fail(`${page.slug}: incorrect canonical.`);
  if (!html.includes('name="robots" content="index,follow')) fail(`${page.slug}: page is not indexable.`);
  if (!html.includes(`data-national-wave="${batch}"`)) fail(`${page.slug}: missing batch marker.`);
  if (!html.includes("G-KKGEYHSD29")) fail(`${page.slug}: missing Analytics.`);
  if (!html.includes("دون فرع مزعوم") || !plain.includes("لا يعني وجود مكتب أو فرع")) fail(`${page.slug}: no-branch clarification is incomplete.`);
  if (!html.includes('id="stage-deep-dive"')) fail(`${page.slug}: missing distinct legal-stage review section.`);
  if (!plain.includes(page.title) || !plain.includes(page.matter.title) || !plain.includes(page.stage.label.trim())) fail(`${page.slug}: legal problem and stage are not explicit.`);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  if (wordCount < 1500) fail(`${page.slug}: content is too short (${wordCount} words).`);

  const nodes = [];
  for (const block of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { nodes.push(...schemaNodes(JSON.parse(block[1]))); }
    catch (error) { fail(`${page.slug}: invalid JSON-LD (${error.message}).`); }
  }
  for (const type of ["Article", "Service", "FAQPage", "BreadcrumbList", "WebPage"]) {
    if (!nodes.some((node) => node["@type"] === type)) fail(`${page.slug}: missing ${type} schema.`);
  }

  const escaped = expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sitemapCount = (sitemap.match(new RegExp(escaped, "g")) || []).length;
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
for (const page of pages) if ((inbound.get(page.slug)?.size || 0) < 3) fail(`${page.slug}: fewer than 3 inbound internal links.`);

const currentShingles = new Map(pages.map((page) => [page.slug, shingles(visible.get(page.slug) || "")]));
let maximumWithin = { score: 0, left: "", right: "" };
for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const score = jaccard(currentShingles.get(pages[leftIndex].slug), currentShingles.get(pages[rightIndex].slug));
    if (score > maximumWithin.score) maximumWithin = { score, left: pages[leftIndex].slug, right: pages[rightIndex].slug };
  }
}
if (maximumWithin.score > 0.50) fail(`Within-batch similarity is too high: ${(maximumWithin.score * 100).toFixed(1)}% between ${maximumWithin.left} and ${maximumWithin.right}.`);

const priorShingles = new Map();
for (const prior of priorPages) {
  const path = resolve(root, prior.slug);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, "utf8");
  priorShingles.set(prior.slug, shingles(text(capture(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i))));
}
let maximumCross = { score: 0, left: "", right: "" };
for (const current of pages) {
  for (const prior of priorPages) {
    if (!priorShingles.has(prior.slug)) continue;
    const score = jaccard(currentShingles.get(current.slug), priorShingles.get(prior.slug));
    if (score > maximumCross.score) maximumCross = { score, left: current.slug, right: prior.slug };
  }
}
if (maximumCross.score > 0.50) fail(`Cross-batch similarity is too high: ${(maximumCross.score * 100).toFixed(1)}% between ${maximumCross.left} and ${maximumCross.right}.`);

if (warnings.length) {
  console.warn(`Non-blocking warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error(`National batch ${batch} audit failed (${failures.length}):`);
  for (const failure of failures.slice(0, 180)) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`National batch ${batch} audit passed: ${pages.length} unique legal-stage guides across 13 regions.`);
console.log(`Maximum within-batch similarity: ${(maximumWithin.score * 100).toFixed(1)}% (${maximumWithin.left} / ${maximumWithin.right}).`);
console.log(`Maximum cross-batch similarity: ${(maximumCross.score * 100).toFixed(1)}% (${maximumCross.left} / ${maximumCross.right}).`);
