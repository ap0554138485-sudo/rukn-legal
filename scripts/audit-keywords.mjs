import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = readdirSync(root).filter((file) => file.endsWith(".html") && !file.startsWith("google")).sort();
const errors = [];
const warnings = [];
const targets = new Map();

function capture(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";
}

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function targetFor(file, title) {
  if (file === "en.html") return null;
  if (file === "index.html") return "محامي وخدمات واستشارات قانونية في السعودية";
  if (file === "articles.html") return "مقالات وإرشادات قانونية";
  if (file === "legal-services-dammam.html") return "خدمات قانونية في الدمام";
  if (file === "legal-consultation-tabuk.html") return "استشارات قانونية في تبوك";
  if (file === "tabuk-region-lawyers.html") return "محامي في منطقة تبوك";
  return title
    .split("|")[0]
    .trim()
    .replace(/ لجميع القضايا$/, "")
    .replace(/ ومدن المنطقة$/, "");
}

for (const file of files) {
  const html = readFileSync(resolve(root, file), "utf8");
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const h1 = capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const robots = capture(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  if (/\bnoindex\b/i.test(robots)) continue;
  const target = targetFor(file, title);
  if (!target) continue;
  const normalizedTarget = normalize(target);

  for (const [label, value] of [["title", title], ["H1", h1], ["description", description]]) {
    if (!normalize(value).includes(normalizedTarget)) {
      errors.push(`${file}: target phrase "${target}" missing from ${label}`);
    }
  }
  if (title.length > 65) errors.push(`${file}: title is too long (${title.length} characters)`);
  if (title.length < 24) warnings.push(`${file}: short title (${title.length} characters)`);
  if (description.length < 100 || description.length > 170) {
    warnings.push(`${file}: description length ${description.length} is outside the preferred 100-170 range`);
  }
  if (targets.has(normalizedTarget)) {
    errors.push(`${file}: target phrase duplicates ${targets.get(normalizedTarget)} (${target})`);
  } else {
    targets.set(normalizedTarget, file);
  }

  if (file === "lawyer-tabuk.html") {
    const priorityPhrase = normalize("أفضل محامي في تبوك");
    const normalizedHtml = normalize(html.replace(/<[^>]+>/g, " "));
    if (!normalize(title).includes(priorityPhrase)) {
      errors.push(`${file}: priority phrase "أفضل محامي في تبوك" missing from title`);
    }
    if (!normalizedHtml.includes(priorityPhrase)) {
      errors.push(`${file}: priority phrase "أفضل محامي في تبوك" missing from visible content`);
    }
    if (!html.includes('id="best-lawyer"')) {
      errors.push(`${file}: missing dedicated best-lawyer decision section`);
    }
    if (!html.includes("najiz.sa/applications/lawyers/LawyersInquire")) {
      errors.push(`${file}: missing official lawyer-license verification link`);
    }
  }
}

console.log(`Keyword targets audited: ${targets.size}`);
console.log(`Warnings: ${warnings.length}`);
if (warnings.length) console.log(warnings.join("\n"));
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
