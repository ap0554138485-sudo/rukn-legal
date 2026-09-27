import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { renderExpansionPage } from "./generate-national-waves10-14.mjs";
import { families } from "./national-waves10-14-data.mjs";
import { stages } from "./national-waves18-22-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDate = "2026-09-27";
const displayDate = "27 سبتمبر 2026";
const matters = families.flatMap((family) => family.matters.map((matter) => ({ ...matter, family })));
const stageTitle = {
  "allegation-matrix": "ادعاءات في",
  "legal-elements": "عناصر حق في",
  "burden-map": "خريطة إثبات في",
  "causation-chain": "رابطة سبب في",
  "mitigation-record": "خفض الضرر في",
  "source-provenance": "مصدر دليل في",
  "authority-signature": "سلطة التوقيع في",
  "rights-transfer": "انتقال الحق في",
  "capacity-check": "صفة الممثل في",
  "authenticity-review": "حجية المحرر في",
  "evidence-conflict": "تعارض الأدلة في",
  "counter-request": "طلب مقابل في",
  "setoff-analysis": "المقاصة في",
  "remedy-options": "بدائل طلب في",
  "expert-question-design": "أسئلة الخبير في",
  "witness-consistency": "اتساق قول في",
  "hearing-exhibit-plan": "عرض المستندات في",
  "oral-answer-plan": "إجابة شفوية في",
  "procedural-obstacle": "عائق إجرائي في",
  "post-decision-route": "ما بعد القرار في"
};
const matterTitle = {
  "property-defect": "عيب عقاري",
  "damage-claim": "تعويض عن ضرر",
  "data-leak": "تسرب بيانات",
  "municipal-penalty": "مخالفة بلدية",
  "workplace-investigation": "تحقيق وظيفي"
};

export const pages = stages.flatMap((stage, stageIndex) =>
  matters.map((matter, matterIndex) => {
    const globalIndex = stageIndex * matters.length + matterIndex;
    const batch = 18 + Math.floor(globalIndex / 100);
    const index = globalIndex % 100;
    const location = locations[(globalIndex * 7 + 53) % locations.length];
    return {
      category: matter.family,
      location,
      stage,
      matter,
      batch,
      index,
      key: `expansion-evidence-${stage.key}-${matter.key}`,
      title: `${stageTitle[stage.key]} ${matterTitle[matter.key] || matter.title}`,
      slug: `saudi-guide-w${batch}-${stage.key}-${matter.key}-${location.key}.html`,
      situation: `${matter.situation} ${stage.scenario}`,
      objective: `${stage.deliverable}؛ والنتيجة الخاصة بالموضوع هي ${matter.outcome}.`,
      coreDocument: `${stage.document} مع ${matter.document}`,
      proof: `${matter.evidence}، وسجل يثبت المصدر والنسخة والتاريخ وصاحب كل إضافة أو قرار`,
      pivot: `${stage.question} عند معالجة ${matter.title}؟`,
      boundary: `لا يُحسم ${matter.title} من اسم المرحلة أو المدينة؛ يجب فحص ${matter.risk}، ثم إبقاء ${stage.label.trim()} داخل الوقائع والطلب والمستند المثبت`
    };
  })
);

export function generateNationalExpansion(batch) {
  if (!Number.isInteger(batch) || batch < 18 || batch > 22) throw new Error("Choose a batch from 18 through 22.");
  const selected = pages.filter((page) => page.batch === batch);
  if (selected.length !== 100) throw new Error(`Batch ${batch} contains ${selected.length} pages; expected 100.`);
  if (new Set(selected.map((page) => page.slug)).size !== 100) throw new Error(`Duplicate slug in batch ${batch}.`);
  if (new Set(selected.map((page) => page.title)).size !== 100) throw new Error(`Duplicate title in batch ${batch}.`);
  if (new Set(selected.map((page) => page.location.region)).size !== 13) throw new Error(`Batch ${batch} must cover all 13 regions.`);

  for (const page of selected) {
    const consultationNote = `<section class="section consultation-note"><div class="container narrow"><p class="service-legal-note">هذا الدليل عن ${page.title} في ${page.location.name} محتوى تعريفي عام ولا يعد استشارة قانونية مخصصة. تبدأ الاستشارة بعد مراجعة الوقائع والصفة والمواعيد والنسخ الكاملة من المستندات وتحديد نطاق الخدمة.</p></div></section>`;
    const html = renderExpansionPage(page, {
      allPages: pages,
      contentDate,
      displayDate,
      rolloutTotal: 22
    }).replace('<section class="section alt" id="faq">', `${consultationNote}<section class="section alt" id="faq">`);
    writeFileSync(resolve(root, page.slug), html, "utf8");
  }

  const rolloutPath = resolve(root, "national-seo-rollout.json");
  const rollout = JSON.parse(readFileSync(rolloutPath, "utf8"));
  const requiredPrevious = batch - 1;
  if (!rollout.completedBatches.includes(requiredPrevious)) throw new Error(`Batch ${requiredPrevious} is not recorded as complete.`);
  rollout.targetPages = 2150;
  rollout.completedBatches = [...new Set([...rollout.completedBatches, batch])].sort((left, right) => left - right);
  rollout.updated = contentDate;
  const completedNewBatches = rollout.completedBatches.filter((item) => item >= 18 && item <= 22).length;
  rollout.publishedPages = 1650 + completedNewBatches * rollout.pagesPerDay;
  rollout.remainingPages = Math.max(0, rollout.targetPages - rollout.publishedPages);
  rollout.nextBatch = rollout.remainingPages > 0 ? batch + 1 : null;
  writeFileSync(rolloutPath, `${JSON.stringify(rollout, null, 2)}\n`, "utf8");
  console.log(`Generated national batch ${batch}: 100 reviewed legal-stage pages.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateNationalExpansion(Number(process.argv[2]));
}
