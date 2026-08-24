import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const origin = "https://rukn-legal-vwptio.cranl.net";
const expected = { dammam: 40, riyadh: 30, tabuk: 20, national: 10 };
const errors = [];
const pages = [];

function capture(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, " ")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shingles(text, width = 5) {
  const words = text.split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let index = 0; index <= words.length - width; index += 1) set.add(words.slice(index, index + width).join(" "));
  return set;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection || 1);
}

for (const file of readdirSync(root).filter((name) => name.endsWith(".html"))) {
  const html = readFileSync(resolve(root, file), "utf8");
  const family = capture(html, /<meta\s+name="page-family"\s+content="notary-([^"]+)"/i);
  if (!family) continue;
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1 = capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const canonical = capture(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const text = visibleText(html);
  if (!(family in expected)) errors.push(`${file}: unknown notary family ${family}`);
  if (description.length < 100 || description.length > 170) errors.push(`${file}: description length ${description.length}`);
  if (!h1 || !title.startsWith(h1.split(" ").slice(0, 2).join(" "))) errors.push(`${file}: title and H1 are not aligned`);
  if (canonical !== `${origin}/${file}`) errors.push(`${file}: incorrect canonical`);
  if (!html.includes("https://mwathiq.sa/MowathiqenSearch/MowathiqenSearchIndex")) errors.push(`${file}: missing official notary search link`);
  if (!html.includes("ليس منصة الموثق الحكومية")) errors.push(`${file}: missing licensing disclaimer`);
  if (/نحن\s+موثقون|موثق\s+تابع\s+لنا|فرع\s+موثق\s+تابع/i.test(text)) errors.push(`${file}: contains an unverified licensing claim`);
  if (text.split(/\s+/).length < 500) errors.push(`${file}: thin content`);
  pages.push({ file, family, title, description, text, shingles: shingles(text) });
}

for (const [family, count] of Object.entries(expected)) {
  const actual = pages.filter((page) => page.family === family).length;
  if (actual !== count) errors.push(`notary-${family}: expected ${count} pages, found ${actual}`);
}

for (const field of ["title", "description"]) {
  const seen = new Map();
  for (const page of pages) {
    if (seen.has(page[field])) errors.push(`${page.file}: duplicate ${field} with ${seen.get(page[field])}`);
    else seen.set(page[field], page.file);
  }
}

let closest = { score: 0, left: "", right: "" };
for (let left = 0; left < pages.length; left += 1) {
  for (let right = left + 1; right < pages.length; right += 1) {
    const score = jaccard(pages[left].shingles, pages[right].shingles);
    if (score > closest.score) closest = { score, left: pages[left].file, right: pages[right].file };
  }
}
if (closest.score > 0.75) errors.push(`near-duplicate pages: ${closest.left} and ${closest.right} (${closest.score.toFixed(3)})`);

console.log(`Notary pages: ${pages.length}`);
for (const family of Object.keys(expected)) console.log(`  ${family}: ${pages.filter((page) => page.family === family).length}`);
console.log(`Closest five-word-shingle similarity: ${closest.score.toFixed(3)} (${closest.left} / ${closest.right})`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
