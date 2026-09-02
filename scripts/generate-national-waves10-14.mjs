import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { renderNationalPage } from "./generate-national-wave8.mjs";
import { families, stages } from "./national-waves10-14-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDate = "2026-09-02";
const displayDate = "2 سبتمبر 2026";
const matters = families.flatMap((item) => item.matters.map((matter) => ({ ...matter, family: item })));
const stageTitle = {
  drafting: "صياغة طلب في",
  witness: "إفادة شاهد في",
  "closing-memo": "مذكرة ختام لـ",
  "decision-review": "مراجعة قرار في",
  objection: "اعتراض على"
};
const matterTitle = {
  "property-defect": "عيب عقاري",
  "damage-claim": "تعويض عن ضرر",
  "data-leak": "تسرب بيانات"
};

export const pages = stages.flatMap((stage, stageIndex) =>
  matters.map((matter, matterIndex) => {
    const globalIndex = stageIndex * matters.length + matterIndex;
    const batch = 10 + Math.floor(globalIndex / 100);
    const index = globalIndex % 100;
    const location = locations[(globalIndex * 7 + 37) % locations.length];
    return {
      category: matter.family,
      location,
      stage,
      matter,
      batch,
      index,
      key: `expansion-${stage.key}-${matter.key}`,
      title: `${stageTitle[stage.key] || stage.label} ${matterTitle[matter.key] || matter.title}`,
      slug: `saudi-guide-w${batch}-${stage.key}-${matter.key}-${location.key}.html`,
      situation: `${matter.situation} ${stage.scenario}`,
      objective: `${stage.deliverable}؛ والنتيجة الخاصة بالموضوع هي ${matter.outcome}.`,
      coreDocument: `${stage.document} مع ${matter.document}`,
      proof: `${matter.evidence}، وسجل يبين مصدر كل نسخة وتاريخها وصلتها بالمرحلة`,
      pivot: `${stage.question} في مسألة ${matter.title}؟`,
      boundary: `لا يُحسم ${matter.title} من اسم الإجراء وحده؛ يجب فحص ${matter.risk}، ثم إبقاء ${stage.label.trim()} ضمن الطلب والمرحلة المثبتين`
    };
  })
);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const reviewModes = [
  "اقرأ الملف مرة للصفة ومرة للزمن ومرة للطلب، ولا تجمع القراءات الثلاث في انطباع واحد.",
  "استخدم نسخة مصدرية لا يضاف إليها تعليق، ونسخة عمل يظهر عليها الحجب والملاحظات وتاريخ كل تعديل.",
  "ضع أمام كل رقم وحدته وفترته ومصدره، وأمام كل تاريخ الحدث الذي يمثله وإثبات وصوله.",
  "افصل الوقائع المتفق عليها عن المختلف عليها، ثم اكتب ما يحتاج إثباتًا جديدًا بدل تكرار الموقف.",
  "اختبر الملف من جهة الطرف الآخر: ما المعلومة التي لم تصله وما المستند الذي قد يغير جوابه؟",
  "لا تعتبر كثرة المرفقات اكتمالًا؛ الاكتمال هو وجود مستند يؤدي وظيفة محددة في سؤال محدد.",
  "احفظ سبب كل قرار تحريري: حذف واقعة، دمج مبلغ، تغيير طلب أو تأجيل مستند، حتى يمكن مراجعة النسخة.",
  "اربط الخطوة التالية بمالك وموعد وناتج، ولا تستخدم عبارات متابعة عامة لا تبين من يفعل ماذا.",
  "راجع الأسماء القانونية والمعرفات والصفحات قبل الإرسال، لأن خطأ الهوية يفسد الربط بين الأدلة.",
  "اجعل الملخص دليل طريق إلى الملف لا بديلًا عنه، وأبق المرجع بجوار كل نتيجة أو وصف مؤثر."
];

const stageLexicon = {
  standing: ["هوية صاحب الحق", "سند الوكالة", "حدود التمثيل", "تطابق الأسماء", "صفة الطرف الآخر", "تاريخ نشوء الصفة", "تعارض المصالح", "قرار قبول الصفة"],
  timeline: ["حدث البداية", "وقت الإنشاء", "وقت الإرسال", "إثبات الوصول", "الفجوة الزمنية", "تعارض التاريخ", "الحدث القاطع", "آخر موعد مثبت"],
  "claim-scope": ["الطلب الرئيسي", "الطلب الاحتياطي", "حدود المبلغ", "الفترة المطالب بها", "الواقعة المؤسسة", "الدفع المقابل", "المسألة المستبعدة", "منطوق النتيجة"],
  jurisdiction: ["نوع الجهة", "مرحلة الملف", "صلة المكان", "وصف الطلب", "مسار الإحالة", "سبب عدم القبول", "البديل الإجرائي", "قرار توجيه الطلب"],
  deadline: ["مصدر المدة", "بداية الاحتساب", "إثبات التبليغ", "اليوم الأخير", "توقف المدة", "التمديد المحتمل", "تنبيه المسؤول", "إجراء ما قبل الانتهاء"],
  notice: ["عنوان المستلم", "موضوع الإشعار", "وصف الإخلال", "الطلب المحدد", "مهلة الرد", "قناة الإرسال", "قائمة المرفقات", "إثبات الاستلام"],
  response: ["الادعاء الأصلي", "القبول الجزئي", "الإنكار المحدد", "نقص المعرفة", "المستند المعارض", "الدفع المستقل", "طلب الإيضاح", "خاتمة الجواب"],
  evidence: ["معرف الدليل", "نسخة المصدر", "صاحب الملف", "بيانات الإنشاء", "سلسلة الحفظ", "وجه الاستدلال", "الاعتراض المحتمل", "قرار الإدراج"],
  "document-review": ["اكتمال الصفحات", "صحة الملاحق", "تطابق التوقيع", "النسخة النهائية", "الإحالة الخارجية", "التعديل اللاحق", "موضع العبارة", "نتيجة الفحص"],
  settlement: ["حد العرض", "المقابل المتبادل", "نطاق التنازل", "جدول السداد", "شرط النفاذ", "حالة الإخلال", "سرية التفاوض", "إقفال النزاع"],
  drafting: ["مقدمة الطلب", "وصف الصفة", "ترتيب الوقائع", "ربط المستند", "صياغة السبب", "تحديد المبلغ", "الطلب الختامي", "مراجعة الاتساق"],
  attachments: ["رقم المرفق", "اسم الملف", "عدد الصفحات", "وظيفة المستند", "موضع الإحالة", "جودة القراءة", "كشف التكرار", "نسخة الحزمة"],
  hearing: ["مسائل الجلسة", "ترتيب العرض", "زمن المرافعة", "مستند المواجهة", "سؤال الحسم", "طلب الاستيضاح", "محضر القرار", "خطوة ما بعد الجلسة"],
  witness: ["مصدر المعرفة", "المشاهدة المباشرة", "المعلومة المنقولة", "ذاكرة التاريخ", "صلة المستند", "حدود الإفادة", "سؤال المقابلة", "تثبيت الأقوال"],
  expert: ["سؤال الخبرة", "حدود المهمة", "مواد الفحص", "الافتراض الفني", "طريقة الحساب", "اختبار النتيجة", "نقطة التحفظ", "الجواب التكميلي"],
  "closing-memo": ["المسألة المحسومة", "الواقعة الثابتة", "الدليل الراجح", "الدفع غير المنتج", "الحساب النهائي", "حدود المذكرة", "الطلب المتبقي", "مراجعة الإقفال"],
  "decision-review": ["نسخة القرار", "تاريخ التبليغ", "نطاق الأسباب", "صياغة المنطوق", "مطابقة المبلغ", "خطأ مادي", "حاجة التفسير", "الأثر التالي"],
  objection: ["موضع الاعتراض", "نوع الخطأ", "أثر السبب", "مرجع الواقعة", "المستند المؤيد", "حدود المرحلة", "الطلب البديل", "ترتيب الأسباب"],
  enforcement: ["السند النهائي", "صفة طالب التنفيذ", "بيانات المنفذ ضده", "الرصيد المحدث", "الطلب التنفيذي", "الإجراء المنجز", "العائق القائم", "حالة المتابعة"],
  closure: ["نتيجة الملف", "تسليم الأصول", "الرصيد الأخير", "الموعد اللاحق", "مالك المتابعة", "المسألة المفتوحة", "شرط إعادة الفتح", "محضر الإقفال"]
};

const matterLexicon = {
  "unpaid-wages": ["شهر الاستحقاق", "الأجر الثابت", "البدل الدوري", "العمولة المتغيرة", "التحويل البنكي", "يوم العمل", "الحسم المسجل", "رصيد الأجور"],
  termination: ["سبب النهاية", "تاريخ القرار", "آخر يوم", "مدة الإشعار", "تسليم العهدة", "رصيد الإجازة", "المستحق الختامي", "شهادة الخدمة"],
  "work-injury": ["مكان الإصابة", "وقت الواقعة", "مهمة العمل", "الإبلاغ الأول", "التقرير الطبي", "فترة العلاج", "أثر الإصابة", "العودة للعمل"],
  "sales-commission": ["صفقة البيع", "شرط الاعتماد", "نسبة العمولة", "تاريخ التحصيل", "مرتجع العميل", "إلغاء الصفقة", "فترة التقرير", "صافي العمولة"],
  "workplace-investigation": ["وصف المخالفة", "وقت العلم", "حافظ السجل", "دعوة التحقيق", "إفادة الموظف", "شاهد الواقعة", "السياسة المطبقة", "قرار التحقيق"],
  maintenance: ["الحكم السابق", "الدخل الحالي", "المصروف الدوري", "المصروف الاستثنائي", "الفترة المقارنة", "التحويل المثبت", "التغير الجديد", "مبلغ الطلب"],
  custody: ["الوضع القائم", "سجل الرعاية", "تعليم الطفل", "الرعاية الصحية", "مكان السكن", "جدول المتابعة", "خصوصية الطفل", "طلب الحضانة"],
  visitation: ["يوم الزيارة", "ساعة الاستلام", "موقع التسليم", "إجازة الطفل", "المرافق المسؤول", "وسيلة التواصل", "حالة التعذر", "تعديل الجدول"],
  "estate-assets": ["صفة الوارث", "العقار المسجل", "الحساب المالي", "حصة المنشأة", "الدين القائم", "عائد الأصل", "الأصل المختلف", "قائمة الحصر"],
  "estate-income": ["عقد الأصل", "دفعة الإيجار", "تاريخ التحصيل", "مصروف الحفظ", "الفترة المالية", "دافع المصروف", "صافي العائد", "حصة المستفيد"],
  "supply-contract": ["أمر الشراء", "صنف التوريد", "الكمية المطلوبة", "موعد التسليم", "المواصفة الفنية", "محضر الاستلام", "الاعتراض المسجل", "الرصيد المتبقي"],
  "construction-change": ["النطاق الأصلي", "وصف التغيير", "المخطط المعدل", "سعر الإضافة", "أثر البرنامج", "اعتماد المالك", "تنفيذ الموقع", "قيمة الأمر"],
  "partnership-account": ["رأس المال", "إيداع الشريك", "سحب شخصي", "مصروف النشاط", "إيراد المنشأة", "التزام قائم", "نتيجة الفترة", "رصيد الشريك"],
  "commercial-debt": ["أصل التعامل", "رقم الفاتورة", "إثبات التسليم", "دفعة جزئية", "مرتجع تجاري", "مصادقة الرصيد", "تاريخ الاستحقاق", "صافي الدين"],
  "nda-breach": ["تعريف السر", "مصدر المعلومة", "اسم المستلم", "قناة المشاركة", "وقت الوصول", "صلاحية المستخدم", "نسخة الملف", "أثر الإفصاح"],
  "lease-renewal": ["مدة العقد", "نافذة الإشعار", "الأجرة الجديدة", "استمرار الانتفاع", "دفعة ما بعد النهاية", "قبول المؤجر", "تاريخ التجديد", "الوضع الحالي"],
  "property-defect": ["وصف العيب", "تاريخ الظهور", "حالة الاستلام", "صورة مؤرخة", "رأي الفني", "إشعار المقاول", "إصلاح مؤقت", "تكلفة المعالجة"],
  "promissory-note": ["أصل السند", "اسم المحرر", "المبلغ المكتوب", "تاريخ الاستحقاق", "سبب الإصدار", "دفعة لاحقة", "تعديل السند", "الرصيد الحالي"],
  "money-judgment": ["نسخة الحكم", "المنطوق النهائي", "المبلغ المحكوم", "تاريخ التبليغ", "دفعة منفذة", "بند غير مالي", "رصيد التنفيذ", "حالة الإجراء"],
  "contractor-delay": ["البرنامج الأساسي", "نسبة الإنجاز", "فترة التعطل", "سبب التأخر", "أمر التغيير", "إشعار الموقع", "الأثر الزمني", "موعد الإكمال"],
  "administrative-decision": ["رقم القرار", "تاريخ الصدور", "صاحب الصفة", "طلب سابق", "سبب الجهة", "إثبات العلم", "المهلة القائمة", "نتيجة المراجعة"],
  "municipal-penalty": ["رقم المخالفة", "وصف النشاط", "موقع الضبط", "حالة الترخيص", "وقت الزيارة", "صورة المفتش", "طلب التصحيح", "نتيجة الاعتراض"],
  "financial-fraud": ["رسالة الانتحال", "رقم الحساب", "وقت التحويل", "هوية المرسل", "رابط التواصل", "مبلغ العملية", "بلاغ البنك", "سجل الواقعة"],
  "data-leak": ["نوع البيانات", "حساب المستخدم", "وقت الوصول", "مسار المشاركة", "نسخة التسريب", "نطاق المتأثرين", "إجراء الاحتواء", "سجل الحادثة"],
  "damage-claim": ["حدث الضرر", "الأصل المتأثر", "تاريخ المعاينة", "سبب الخسارة", "فاتورة الإصلاح", "نسبة الاستهلاك", "المبلغ المدفوع", "صافي التعويض"]
};

function stageDeepDive(page) {
  const { stage, matter } = page;
  const stageTerms = stageLexicon[stage.key];
  const matterTerms = matterLexicon[matter.key];
  const terms = [
    ...stageTerms.map((stageTerm, index) => ({ stageTerm, matterTerm: matterTerms[index], pass: "الفحص الأول" })),
    ...stageTerms.map((stageTerm, index) => ({ stageTerm, matterTerm: matterTerms[(index + 3) % matterTerms.length], pass: "إعادة التحقق" })),
    ...stageTerms.map((stageTerm, index) => ({ stageTerm, matterTerm: matterTerms[(index + 5) % matterTerms.length], pass: "اختبار القرار" }))
  ];
  const patterns = [
    ({ stageTerm, matterTerm, pass }) => `يبدأ ${pass} لبند ${stageTerm} من عنصر ${matterTerm} في ${page.title} ومن ${stage.document}، ثم يطبق عمل «${stage.action}» على ${matter.document}. لا تسجل نتيجة عامة؛ اكتب القيمة أو الاسم أو التاريخ الذي يخص ${matterTerm}، ومصدره، وما إذا اعترض عليه طرف. يظل السؤال الحاكم: ${stage.question} في مسألة ${matter.title}؟ وينتهي ${stageTerm} بحالة واضحة ومستند مطلوب ومسؤول وموعد.`,
    ({ stageTerm, matterTerm, pass }) => `يعالج ${pass} لـ${stageTerm} نقطة ${matterTerm} داخل ${page.title}. تُفتح لها خانة في ${stage.document} تتضمن الواقعة ومصدرها وموقف كل طرف وأثرها على ${stage.deliverable}. عند الرجوع إلى ${matter.evidence} تحفظ النسخة كما وصلت، ويحدد موضع ${matterTerm} فيها. إذا لم تكف المادة للإجابة عن «${stage.question}»، يوصف نقص ${stageTerm} ولا يُملأ بافتراض أو ذاكرة.`,
    ({ stageTerm, matterTerm, pass }) => `قبل اعتماد ${stageTerm} في ${pass} الخاص بـ${page.title}، طابق ${matterTerm} مع ${matter.document} ومع التسلسل الخاص بواقعة ${matter.title}. طبق ${stage.action} من دون توسيع الطلب، ثم اختبر ${matter.risk}. توضع نتيجة ${matterTerm} بجوار الدليل، ويكتب ما الذي سيتغير في ${stage.deliverable} إذا ظهرت نسخة أحدث أو رد موثق على ${stageTerm}.`,
    ({ stageTerm, matterTerm, pass }) => `يُراجع ${stageTerm} و${matterTerm} في ${pass} لملف ${page.title}: قراءة لاكتمال البيانات وقراءة لتأثيرهما في ${matter.outcome}. تستخدم القراءة ${stage.document} بوصفه سجل قرار، وتربط ملاحظة ${matterTerm} بـ${matter.evidence}. لا تعني سلامة الشكل صحة المحتوى؛ لذلك تحفظ نتيجة ${stageTerm} وحدودها وسؤال ${stage.question} قبل انتقال الملف.`,
    ({ stageTerm, matterTerm, pass }) => `في مراقبة ${stageTerm} أثناء ${pass} ضمن ${page.title}، اكتب من أعد مادة ${matterTerm} ومن راجعها ومن أرسلها ومن استلمها. يرتبط التسلسل بعمل ${stage.action} وبالمستند ${matter.document}. إذا أدى اختلاف ${matterTerm} أو النسخ أو التواريخ إلى نتيجتين، تعرض النتيجتان وأساسهما. المخرج هو ${stage.deliverable} مع سبب قرار ${stageTerm}.`,
    ({ stageTerm, matterTerm, pass }) => `يُختبر ${stageTerm} و${matterTerm} في ${pass} لصفحة ${page.title} من جهة الطرف الآخر: ما المستند الذي قد يقدمه وما التفسير المختلف؟ تُوضع الإجابة في ${stage.document} مع ${matter.evidence}، ثم يحدد ما يحتاج إتاحة وردًا. يحافظ اختبار ${matterTerm} على نطاق ${stage.label.trim()} ويمنع تحويل ${matter.title} إلى سرد أحادي.`,
    ({ stageTerm, matterTerm, pass }) => `عند إقفال ${stageTerm} في ${pass} لملف ${page.title}، راجع اكتمال ${matterTerm} والنسخة والصفة والتاريخ والمبلغ أو الفعل المطلوب. اربط النتيجة بـ${stage.deliverable} وبالهدف ${matter.outcome}. إذا بقي ${matterTerm} أو ${matter.risk} بلا جواب، يسجل كمسألة مفتوحة، وتحفظ نسخة إقفال ${stageTerm} مع فهرسها ومتابعتها.`,
    ({ stageTerm, matterTerm, pass }) => `تتبع جودة ${stageTerm} في ${pass} لعملية ${page.title} من سؤال ${stage.question} إلى عنصر ${matterTerm} في ${matter.document} ثم إلى ${matter.outcome}. يبين السجل أي معلومة أضيفت إلى ${matterTerm} بعد النسخة الأولى وهل أتيحت فرصة الرد. لا تُستبدل النسخ القديمة؛ يثبت كل إصدار، وتبقى ${stage.action} قابلة للفحص.`
  ];
  return `<section class="section alt stage-deep-dive" id="stage-deep-dive"><div class="container"><div class="section-head"><span class="eyebrow">معيار مختلف للمرحلة والمشكلة</span><h2>أربع وعشرون بوابة لـ${escapeHtml(page.title)}</h2><p>تجمع كل بوابة عنصرًا خاصًا بالمرحلة مع عنصر خاص بالمشكلة، لذلك لا تعتمد قيمة الصفحة على اسم المدينة أو قالب عام.</p></div><div class="locality-panels">${terms.map((term, index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${escapeHtml(`${term.stageTerm} — ${term.matterTerm}`)}</h3><p>${escapeHtml(patterns[index % patterns.length](term))}</p></article>`).join("")}</div></div></section>`;
}

function progressionLinks(page) {
  const progression = pages.filter((candidate) => candidate.matter.key === page.matter.key);
  const position = progression.findIndex((candidate) => candidate.slug === page.slug);
  const links = Array.from({ length: 6 }, (_, offset) => progression[(position + offset + 1) % progression.length]);
  return `<section class="section stage-progression" id="stage-progression"><div class="container"><div class="section-head"><span class="eyebrow">المشكلة نفسها في مراحل أخرى</span><h2>انتقل إلى المرحلة التالية من ${escapeHtml(page.matter.title)}</h2><p>اختر المرحلة التي تطابق وضع الملف الآن؛ اختلاف المدينة لا يغني عن مطابقة الإجراء والمستند والنتيجة المطلوبة.</p></div><div class="related-services">${links.map((item) => `<a href="${item.slug}">${escapeHtml(item.title)} — ${escapeHtml(item.location.name)}</a>`).join("")}</div></div></section>`;
}

function stageWorkbook(page) {
  const { matter, stage, location } = page;
  const cards = [
    ["سؤال المرحلة", `في ${page.title} يكون السؤال التشغيلي هو: ${page.pivot} لا تبدأ بالنتيجة التي يتوقعها طرف؛ اكتب أولًا الوقائع التي يتفق عليها الطرفان، ثم الوقائع التي تحتاج إثباتًا، ثم الأثر الذي قد يتغير إذا ثبتت كل واقعة. المرجع الأول هو ${page.coreDocument}، وتُحفظ بجواره النسخة والتاريخ وصاحبها والغرض من استخدامها.`],
    ["هوية الأطراف والصفة", `ينشئ مراجع ${page.title} جدولًا للأسماء والصفات والممثلين. يطابق الاسم في ${matter.document} مع الاسم في المراسلات والتحويلات والقرار، ويبين من أنشأ المستند ومن استلمه ومن يملك الرد. إذا كانت الصفة محل خلاف فلا تُخفى داخل مقدمة طويلة؛ توضع كسؤال مستقل مع دليلها وحدودها والنتيجة التي تتوقف عليها.`],
    ["الزمن الحاكم", `تُرتب واقعة ${matter.title} من أقدم مصدر إلى أحدث إجراء. يُكتب تاريخ الإنشاء والإرسال والاستلام كل واحد في خانة، لأن ${stage.label.trim()} قد يتأثر بواحد منها دون البقية. الدليل الزمني هو ${matter.evidence}. وإذا تعارض تاريخان، يسجل التعارض ومصدر كل تاريخ وما يلزم لحسمه بدل اختيار الأنسب بلا تفسير.`],
    ["المستند المحوري", `المستند الذي يقود ${page.title} هو ${page.coreDocument}. تُراجع صفحاته وملاحقه وتوقيعاته وأي إحالة إلى نسخة أخرى، ثم تُكتب العبارة المؤثرة في سياقها. لا يُستبدل الأصل بملخص أو صورة شاشة إذا كانت النسخة الكاملة متاحة، ولا تُدمج نسختان مختلفتان في ملف واحد من غير بيان الفروق وتاريخ كل نسخة.`],
    ["سلسلة الدليل", `حزمة الإثبات في ${page.title} تبدأ بـ${page.proof}. لكل ملف معرف ثابت، ومصدر، وتاريخ وصول، وحالة أصل أو نسخة، ووجه استخدام. إذا أُجري حجب لحماية الخصوصية، تبقى النسخة الأصلية في قناة آمنة وتُعرف نسخة العمل بوضوح. وإذا نقل شخص معلومة من آخر، يفصل السجل بين المشاهدة المباشرة والمعلومة المنقولة والاستنتاج.`],
    ["حساب المبلغ أو النتيجة", `النتيجة المقصودة في ${matter.title} هي ${matter.outcome}. لذلك لا يوضع رقم أو وصف نهائي قبل تفكيكه إلى فترة وبند ومصدر وطريقة حساب. أما إذا كان المطلوب فعلًا أو قرارًا، فيكتب من ينفذه ومتى وكيف يثبت اكتماله. الهدف في هذه المرحلة هو ${stage.deliverable}، لا توسيع الملف إلى نتائج لم تُطلب أو لم تُناقش.`],
    ["وجهة النظر المقابلة", `قبل إقفال ${page.title} تُنشأ خانة للجواب المحتمل: ما الواقعة التي قد ينكرها الطرف الآخر؟ ما النسخة المختلفة التي قد يقدمها؟ وما التفسير البديل لـ${matter.document}؟ لا يعني تسجيل الجواب قبوله، لكنه يمنع إعداد ملف أحادي لا يصمد عند أول رد. يُكتب بجوار كل جواب الدليل المؤيد والدليل المعارض وما بقي مجهولًا.`],
    ["الإشعار وحق الرد", `إذا تطلب ${stage.label.trim()} إرسالًا أو تبليغًا، يحدد سجل ${page.title} العنوان والقناة والمرفقات ووقت الوصول ومن استلمها. تُمنح فرصة رد تتناسب مع المادة وأثرها، وتُحفظ الرسالة مع مرفقاتها لا كصورة منفصلة. أي تصحيح لاحق يُرسل كنسخة جديدة واضحة بدل استبدال الرسالة الأولى وكأنها لم توجد.`],
    ["بوابة الخصوصية", `قد يحتوي ملف ${matter.title} على هويات أو حسابات أو بيانات أطفال أو موظفين أو أسرار تجارية. قبل مشاركة مادة ${page.title} يُسأل: هل يحتاج المستلم هذه البيانات كلها؟ تُحجب كلمات المرور والرموز والبيانات البنكية وغير المرتبطة، ولا تُرسل الأصول في الرسالة الأولى. ويُسجل من يملك النسخة الكاملة ومن تلقى النسخة المحجوبة.`],
    ["صلة المكان بالواقعة", `تظهر ${location.name} في ${page.title} بوصفها موقع أصل أو عمل أو واقعة أو طرف أو تبليغ فقط إذا أثبتها مستند. ${location.context} لا يغير اسم المدينة النظام المطبق تلقائيًا ولا يعني وجود مكتب أو فرع لرُكن الأنظمة في ${location.name}. استقبال الطلب إلكتروني من ${location.region}، بينما تُحدد الجهة والمسار من الوقائع والصفة والمرحلة.`],
    ["اختبار الجودة", `يمر ${page.title} بأربع قراءات: اكتمال الهوية، اتساق الزمن، تطابق الطلب مع الدليل، ووضوح الخطوة التالية. ${reviewModes[(page.index + page.batch) % reviewModes.length]} ثم يُسجل الناتج «اجتاز» أو «معلق» مع السبب والمالك والموعد. لا تستخدم كلمة مكتمل إذا بقيت نسخة أو صفحة أو مبلغ أو تاريخ أو صلاحية بلا مصدر.`],
    ["نقطة الإقفال", `يُقفل عمل ${stage.label.trim()} عندما يتحقق ${stage.deliverable}. يُحفظ إصدار نهائي مع فهرسه وإثبات إرساله، ثم تسجل المسائل التي بقيت خارج النطاق. في ${matter.title} يجب أن يوضح سجل الإقفال ما حدث للهدف: ${matter.outcome}، وما إذا كانت هناك مهلة أو متابعة أو أصل مستند يحتاج إلى مسؤول بعد هذه المرحلة.`]
  ];
  const shift = (page.index * 3 + page.batch) % cards.length;
  const ordered = [...cards.slice(shift), ...cards.slice(0, shift)];
  return `<section class="section expansion-workbook" id="stage-workbook"><div class="container"><div class="section-head"><span class="eyebrow">دفتر مرحلة قانونية مستقل</span><h2>اثنتا عشرة مراجعة خاصة بـ${escapeHtml(page.title)}</h2><p>هذا الدفتر يربط المشكلة القانونية بمرحلة محددة ووثيقة وقرار، لذلك لا تعتمد قيمة الصفحة على اسم ${escapeHtml(location.name)} وحده.</p></div><div class="locality-panels">${ordered.map(([title, body], index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("")}</div></div></section>`;
}

export function renderExpansionPage(page) {
  let html = renderNationalPage(page, { allPages: pages, contentDate });
  html = html
    .replace('data-national-wave="8"', `data-national-wave="${page.batch}"`)
    .replaceAll("الدفعة الوطنية الثامنة", `الدفعة الوطنية ${page.batch}`)
    .replaceAll("الدفعة 8 من 10", `الدفعة ${page.batch} من 14`)
    .replaceAll("29 أغسطس 2026", displayDate)
    .replaceAll("موضوعات مختلفة من الدفعة الثامنة", "موضوعات مختلفة من التوسع الوطني")
    .replace('href="#file-map">خريطة الملف</a>', 'href="#stage-deep-dive">بوابات المرحلة</a>')
    .replace('href="#evidence">سجل الأدلة</a>', 'href="#stage-deep-dive">قائمة المراجعة</a>');
  for (const sectionId of ["file-map", "workflow", "evidence", "quality", "regional-context"]) {
    html = html.replace(new RegExp(`<section\\b[^>]*id="${sectionId}"[\\s\\S]*?<\\/section>\\s*`, "i"), "");
  }
  html = html.replace(
    /<div class="service-jump-wrap">[\s\S]*?<\/nav><\/div>/i,
    '<div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#stage-deep-dive">بوابات المرحلة</a><a href="#faq">الأسئلة</a></nav></div>'
  );
  return html.replace('<section class="section alt" id="faq">', `${stageDeepDive(page)}${progressionLinks(page)}<section class="section alt" id="faq">`);
}

export function generateNationalExpansion(batch) {
  if (!Number.isInteger(batch) || batch < 10 || batch > 14) throw new Error("Choose a batch from 10 through 14.");
  const selected = pages.filter((page) => page.batch === batch);
  if (selected.length !== 100) throw new Error(`Expected 100 pages for batch ${batch}, found ${selected.length}.`);
  if (new Set(selected.map((page) => page.slug)).size !== 100) throw new Error(`Duplicate slug in batch ${batch}.`);
  if (new Set(selected.map((page) => page.title)).size !== 100) throw new Error(`Duplicate title in batch ${batch}.`);
  if (new Set(selected.map((page) => page.location.region)).size !== 13) throw new Error(`Batch ${batch} must cover all 13 regions.`);
  for (const page of selected) writeFileSync(resolve(root, page.slug), renderExpansionPage(page), "utf8");

  const rolloutPath = resolve(root, "national-seo-rollout.json");
  const rollout = JSON.parse(readFileSync(rolloutPath, "utf8"));
  const requiredPrevious = batch - 1;
  if (!rollout.completedBatches.includes(requiredPrevious)) throw new Error(`Batch ${requiredPrevious} is not recorded as complete.`);
  rollout.targetPages = 1400;
  rollout.completedBatches = [...new Set([...rollout.completedBatches, batch])].sort((left, right) => left - right);
  rollout.updated = contentDate;
  rollout.publishedPages = rollout.completedBatches.length * rollout.pagesPerDay;
  rollout.remainingPages = Math.max(0, rollout.targetPages - rollout.publishedPages);
  rollout.nextBatch = rollout.remainingPages > 0 ? batch + 1 : null;
  writeFileSync(rolloutPath, `${JSON.stringify(rollout, null, 2)}\n`, "utf8");
  console.log(`Generated 100 distinct legal-stage guides for national batch ${batch}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateNationalExpansion(Number(process.argv[2]));
}
