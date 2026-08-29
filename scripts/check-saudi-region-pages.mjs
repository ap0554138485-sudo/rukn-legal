import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { regions } from "./generate-saudi-region-pages.mjs";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const bodies = new Map();

const text = (html) => html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

for (const region of regions) {
  const path = resolve(root, region.file);
  if (!existsSync(path)) {
    errors.push(`${region.file}: missing generated page`);
    continue;
  }
  const html = readFileSync(path, "utf8");
  const visible = text(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || "";
  const h1 = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const target = `خدمات قانونية في ${region.name}`;
  if (!title.includes(target) || !description.includes(target) || !h1.includes(target)) errors.push(`${region.file}: missing exact regional target in title, description or H1`);
  if (visible.split(/\s+/).length < 520) errors.push(`${region.file}: page has fewer than 520 visible words`);
  if (!html.includes('"FAQPage"') || !html.includes('"Service"') || !html.includes('"ItemList"') || !html.includes('"BreadcrumbList"')) errors.push(`${region.file}: incomplete structured data`);
  if (!html.includes("لا تعني وجود مكتب أو فرع")) errors.push(`${region.file}: missing branch-claim disclaimer`);
  if (!html.includes("استشارة قانونية")) errors.push(`${region.file}: missing consultation search intent`);
  for (const location of region.locations) if (!visible.includes(location)) errors.push(`${region.file}: location missing from visible content (${location})`);
  const mainCopy = [region.profile, region.business, region.property, region.scenario].join(" ");
  if (bodies.has(mainCopy)) errors.push(`${region.file}: unique local copy duplicates ${bodies.get(mainCopy)}`);
  bodies.set(mainCopy, region.file);
}

console.log(`Regional guides checked: ${regions.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exitCode = 1;
}
