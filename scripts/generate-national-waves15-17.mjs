import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { renderExpansionPage } from "./generate-national-waves10-14.mjs";
import { families } from "./national-waves10-14-data.mjs";
import { stages } from "./national-waves15-17-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDate = "2026-09-10";
const displayDate = "10 سبتمبر 2026";
const matters = families.flatMap((item) => item.matters.map((matter) => ({ ...matter, family: item })));
const stageTitle = {
  "intake-readiness": "جاهزية مطالبة",
  "conflict-screening": "تعارض المصالح في",
  "version-control": "نسخة المستند في",
  "translation-review": "ترجمة مستندات",
  "calculation-reconciliation": "مطابقة حساب",
  "privacy-redaction": "حجب بيانات",
  "service-proof": "إثبات تبليغ",
  "negotiation-record": "سجل تفاوض",
  "order-compliance": "تنفيذ قرار",
  "file-handover": "تسليم ملف"
};
const matterTitle = {
  "municipal-penalty": "مخالفة بلدية",
  "workplace-investigation": "تحقيق وظيفي"
};

export const pages = stages.flatMap((stage, stageIndex) =>
  matters.map((matter, matterIndex) => {
    const globalIndex = stageIndex * matters.length + matterIndex;
    const batch = 15 + Math.floor(globalIndex / 100);
    const index = globalIndex % 100;
    const location = locations[(globalIndex * 7 + 23) % locations.length];
    return {
      category: matter.family,
      location,
      stage,
      matter,
      batch,
      index,
      key: `expansion-advanced-${stage.key}-${matter.key}`,
      title: `${stageTitle[stage.key]} ${matterTitle[matter.key] || matter.title}`,
      slug: `saudi-guide-w${batch}-${stage.key}-${matter.key}-${location.key}.html`,
      situation: `${matter.situation} ${stage.scenario}`,
      objective: `${stage.deliverable}؛ والنتيجة الخاصة بالموضوع هي ${matter.outcome}.`,
      coreDocument: `${stage.document} مع ${matter.document}`,
      proof: `${matter.evidence}، وسجل يبين النسخة والمصدر والتاريخ والمسؤول عن كل قرار في المرحلة`,
      pivot: `${stage.question} عند معالجة ${matter.title}؟`,
      boundary: `لا يُحسم ${matter.title} من اسم المرحلة أو المدينة؛ يجب فحص ${matter.risk}، ثم إبقاء ${stage.label.trim()} داخل الوقائع والطلب والمستند المثبت`
    };
  })
);

export function generateNationalExpansion(batch) {
  if (!Number.isInteger(batch) || batch < 15 || batch > 17) throw new Error("Choose a batch from 15 through 17.");
  const selected = pages.filter((page) => page.batch === batch);
  const expected = batch === 17 ? 50 : 100;
  if (selected.length !== expected) throw new Error(`Batch ${batch} contains ${selected.length} pages; expected ${expected}.`);
  for (const page of selected) {
    const html = renderExpansionPage(page, {
      allPages: pages,
      contentDate,
      displayDate,
      rolloutTotal: 17
    });
    writeFileSync(resolve(root, page.slug), html, "utf8");
  }
  console.log(`Generated national batch ${batch}: ${selected.length} reviewed legal-stage pages.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateNationalExpansion(Number(process.argv[2]));
}
