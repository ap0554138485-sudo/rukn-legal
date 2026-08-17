import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = readdirSync(root).filter((file) => /^legal-services-riyadh-(?!north|east|central|west|south\.html)[a-z].*\.html$/.test(file));
const errors = [];
const values = { title: new Map(), description: new Map(), canonical: new Map(), h1: new Map() };
const pages = [];

function plainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/[\s،.:؛!?؟()«»]+/g, " ")
    .trim();
}

function capture(html, pattern) {
  return (html.match(pattern)?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function shingles(text) {
  const words = text.split(" ").filter((word) => word.length > 2);
  const set = new Set();
  for (let index = 0; index < words.length - 4; index += 1) set.add(words.slice(index, index + 5).join(" "));
  return set;
}

function similarity(first, second) {
  let shared = 0;
  for (const item of first) if (second.has(item)) shared += 1;
  return shared / (first.size + second.size - shared);
}

for (const file of files) {
  const html = readFileSync(resolve(root, file), "utf8");
  const main = capture(html, /<main>([\s\S]*?)<\/main>/i);
  const fields = {
    title: capture(html, /<title>([\s\S]*?)<\/title>/i),
    description: capture(html, /<meta name="description" content="([^"]+)"/i),
    canonical: capture(html, /<link rel="canonical" href="([^"]+)"/i),
    h1: capture(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
  };
  for (const [name, value] of Object.entries(fields)) {
    if (!value) errors.push(`${file}: missing ${name}`);
    if (values[name].has(value)) errors.push(`${file}: duplicate ${name} with ${values[name].get(value)}`);
    values[name].set(value, file);
  }
  const words = plainText(main).split(" ").filter(Boolean).length;
  if (words < 430) errors.push(`${file}: only ${words} visible words`);
  const faqCount = (html.match(/<details>/g) || []).length;
  if (faqCount !== 4) errors.push(`${file}: expected 4 FAQs, found ${faqCount}`);
  if (!/لا (?:يعني|تعني) وجود فرع أو مكتب فعلي/.test(html)) errors.push(`${file}: missing physical-branch disclaimer`);
  pages.push({ file, words, shingles: shingles(plainText(main)) });
}

let closest = { score: 0, first: "", second: "" };
for (let first = 0; first < pages.length; first += 1) {
  for (let second = first + 1; second < pages.length; second += 1) {
    const score = similarity(pages[first].shingles, pages[second].shingles);
    if (score > closest.score) closest = { score, first: pages[first].file, second: pages[second].file };
    if (score >= 0.62) errors.push(`${pages[first].file} and ${pages[second].file}: similarity ${(score * 100).toFixed(1)}%`);
  }
}

if (files.length !== 40) errors.push(`expected 40 neighborhood pages, found ${files.length}`);

console.log(`Neighborhood pages: ${files.length}`);
console.log(`Visible words: ${Math.min(...pages.map((page) => page.words))}-${Math.max(...pages.map((page) => page.words))}`);
console.log(`Closest pair: ${(closest.score * 100).toFixed(1)}% (${closest.first}, ${closest.second})`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
