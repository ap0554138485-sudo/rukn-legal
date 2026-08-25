import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generatedPages, generatedSlugs, intents, localities } from "./generate-eastern-province-pages.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const failures = [];
const warnings = [];

function fail(message) { failures.push(message); }
function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:amp|quot|#39|lt|gt|nbsp);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function capture(html, pattern) { return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || ""; }
function shingles(value, size = 5) {
  const words = value.split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) result.add(words.slice(index, index + size).join(" "));
  return result;
}
function jaccard(left, right) {
  let common = 0;
  for (const item of left) if (right.has(item)) common += 1;
  return common / (left.size + right.size - common || 1);
}

if (localities.length !== 20) fail(`عدد المواقع ${localities.length} بدل 20.`);
if (intents.length !== 24) fail(`عدد المسارات ${intents.length} بدل 24.`);
if (generatedPages.length !== 500) fail(`عدد الصفحات ${generatedPages.length} بدل 500.`);
if (new Set(generatedSlugs).size !== 500) fail("أسماء ملفات الصفحات الجديدة ليست فريدة.");

const kindCounts = generatedPages.reduce((counts, page) => ({ ...counts, [page.kind]: (counts[page.kind] || 0) + 1 }), {});
if (kindCounts.region !== 1 || kindCounts.city !== 19 || kindCounts.service !== 480) fail(`توزيع الصفحات غير صحيح: ${JSON.stringify(kindCounts)}.`);

const seen = { title: new Map(), description: new Map(), h1: new Map(), body: new Map() };
const documents = new Map();
const visible = new Map();
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");

for (const page of generatedPages) {
  const path = resolve(root, page.slug);
  if (!existsSync(path)) { fail(`ملف مفقود: ${page.slug}`); continue; }
  const html = readFileSync(path, "utf8");
  documents.set(page.slug, html);
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1 = capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const main = capture(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const plain = text(main);
  visible.set(page.slug, plain);
  const fingerprint = createHash("sha256").update(plain).digest("hex");
  const fields = { title, description, h1, body: fingerprint };
  for (const [name, value] of Object.entries(fields)) {
    if (!value) fail(`${page.slug}: ${name} مفقود.`);
    else if (seen[name].has(value)) fail(`${page.slug}: ${name} مطابق تمامًا لـ ${seen[name].get(value)}.`);
    else seen[name].set(value, page.slug);
  }
  const expectedCanonical = `${baseUrl}/${page.slug}`;
  if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) fail(`${page.slug}: canonical غير صحيح.`);
  if (!html.includes('name="robots" content="index,follow')) fail(`${page.slug}: الصفحة ليست مهيأة للفهرسة.`);
  if (!html.includes('G-KKGEYHSD29')) fail(`${page.slug}: Analytics مفقود.`);
  if (!html.includes(`data-eastern-page="${page.kind}"`)) fail(`${page.slug}: علامة نوع الصفحة مفقودة.`);
  const hasCoverageClarification = plain.includes("دون فرع مزعوم") && /(?:لا يعني وجود (?:مكتب أو )?فرع|لا يدعي الدليل وجود فرع|لا تدعي وجود مكتب أو فرع)/.test(plain);
  if (!hasCoverageClarification) fail(`${page.slug}: توضيح التغطية الإلكترونية غير مكتمل.`);
  if (plain.split(/\s+/).length < (page.kind === "service" ? 540 : 320)) fail(`${page.slug}: المحتوى قصير (${plain.split(/\s+/).length} كلمة).`);
  if (description.length < 90 || description.length > 190) warnings.push(`${page.slug}: طول الوصف ${description.length}.`);
  const schemaBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!schemaBlocks.length) fail(`${page.slug}: البيانات المنظمة مفقودة.`);
  for (const block of schemaBlocks) {
    try { JSON.parse(block[1]); } catch { fail(`${page.slug}: JSON-LD غير صالح.`); }
  }
  const urlCount = (sitemap.match(new RegExp(expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  if (urlCount !== 1) fail(`${page.slug}: ظهر ${urlCount} مرة في sitemap.`);
}

const inbound = new Map(generatedSlugs.map((slug) => [slug, new Set()]));
for (const [source, html] of documents) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const target = match[1].split("#")[0].replace(/^\//, "");
    if (inbound.has(target) && target !== source) inbound.get(target).add(source);
  }
}
for (const page of generatedPages) {
  const minimum = page.kind === "region" ? 0 : page.kind === "city" ? 1 : 2;
  if ((inbound.get(page.slug)?.size || 0) < minimum) fail(`${page.slug}: روابط واردة أقل من ${minimum}.`);
}

let maximumSimilarity = { score: 0, left: "", right: "" };
const servicePages = generatedPages.filter((page) => page.kind === "service");
const shingleCache = new Map(servicePages.map((page) => [page.slug, shingles(visible.get(page.slug) || "")]));
const comparisonGroups = [
  ...localities.map((_, localityIndex) => servicePages.slice(localityIndex * intents.length, (localityIndex + 1) * intents.length)),
  ...intents.map((_, intentIndex) => localities.map((__, localityIndex) => servicePages[localityIndex * intents.length + intentIndex]))
];
for (const group of comparisonGroups) {
  for (let leftIndex = 0; leftIndex < group.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < group.length; rightIndex += 1) {
      const left = group[leftIndex];
      const right = group[rightIndex];
      const score = jaccard(shingleCache.get(left.slug), shingleCache.get(right.slug));
      if (score > maximumSimilarity.score) maximumSimilarity = { score, left: left.slug, right: right.slug };
    }
  }
}
if (maximumSimilarity.score > 0.55) fail(`تشابه مرتفع ${(maximumSimilarity.score * 100).toFixed(1)}% بين ${maximumSimilarity.left} و${maximumSimilarity.right}.`);

if (warnings.length) {
  console.warn(`تحذيرات غير مانعة (${warnings.length}):`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error(`فشل تدقيق الشرقية (${failures.length}):`);
  for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`نجح تدقيق 500 صفحة: ${kindCounts.service} خدمة + ${kindCounts.city} دليل موقع + ${kindCounts.region} دليل إقليمي.`);
console.log(`أعلى تشابه مقاس بخماسيات الكلمات: ${(maximumSimilarity.score * 100).toFixed(1)}% (${maximumSimilarity.left} / ${maximumSimilarity.right}).`);
