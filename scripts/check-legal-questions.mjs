// Quality gate for the legal-questions library (ask-*.html).
// Compares the unique content block of every page with every other page using five-word shingles
// and fails if any pair shares more than the allowed share of its shingles.
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const maxSimilarity = 0.3;
const minWords = 250;
const errors = [];

function normalize(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .normalize("NFKD")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const pages = readdirSync(root).filter((file) => /^ask-.+\.html$/.test(file)).sort().map((file) => {
  const html = readFileSync(resolve(root, file), "utf8");
  const block = html.match(/<!-- q-content:start -->([\s\S]*?)<!-- q-content:end -->/)?.[1];
  if (!block) errors.push(`${file}: missing q-content block`);
  const words = normalize(block || "").split(" ").filter(Boolean);
  if (words.length < minWords) errors.push(`${file}: only ${words.length} words of unique content (min ${minWords})`);
  const shingles = new Set();
  for (let index = 0; index + 5 <= words.length; index += 1) shingles.add(words.slice(index, index + 5).join(" "));
  return { file, words: words.length, shingles };
});

const owners = new Map();
pages.forEach((page, pageIndex) => {
  for (const shingle of page.shingles) {
    if (!owners.has(shingle)) owners.set(shingle, []);
    owners.get(shingle).push(pageIndex);
  }
});
const overlaps = new Map();
for (const list of owners.values()) {
  if (list.length < 2 || list.length > 60) continue; // very common phrases are template-level, not duplication
  for (let left = 0; left < list.length; left += 1) {
    for (let right = left + 1; right < list.length; right += 1) {
      const key = list[left] * 100000 + list[right];
      overlaps.set(key, (overlaps.get(key) || 0) + 1);
    }
  }
}
let worst = { score: 0, pair: "" };
for (const [key, shared] of overlaps) {
  const left = pages[Math.floor(key / 100000)];
  const right = pages[key % 100000];
  const score = shared / Math.min(left.shingles.size, right.shingles.size);
  if (score > worst.score) worst = { score, pair: `${left.file} ↔ ${right.file}` };
  if (score > maxSimilarity) errors.push(`${left.file} ↔ ${right.file}: ${(score * 100).toFixed(1)}% shared five-word shingles`);
}

const wordCounts = pages.map((page) => page.words).sort((a, b) => a - b);
console.log(`Legal-question pages: ${pages.length}`);
if (pages.length) console.log(`Unique-content words: min ${wordCounts[0]}, median ${wordCounts[Math.floor(wordCounts.length / 2)]}`);
console.log(`Highest pairwise similarity: ${(worst.score * 100).toFixed(1)}% (${worst.pair || "n/a"})`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.slice(0, 80).join("\n"));
  process.exitCode = 1;
}
