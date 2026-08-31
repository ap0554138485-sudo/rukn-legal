import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { categories } from "./national-wave8-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const contentDate = "2026-08-29";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const stylesheet = "styles-20260829a.css?v=20260829a";
const scriptFile = "script-20260829a.js?v=20260829a";

const reviewAngles = [
  "ابدأ بورقة العمل لا بالنتيجة: اكتب الحقيقة التي يمكن إثباتها، ثم مصدرها، ثم القرار الذي قد تتأثر به. إذا تعارض مصدران فاحتفظ بكليهما وحدد صاحب كل نسخة وتاريخها بدل اختيار النسخة التي تبدو أنسب.",
  "اجعل تاريخ القطع ظاهرًا في أعلى الملف. المستند الحديث قد يصف وضعًا مختلفًا عن الفترة محل الطلب، لذلك اربط كل مبلغ أو صفة أو ترخيص أو حالة بتاريخها ولا تستخدم لقطة حالية لإثبات ماضٍ غير موثق.",
  "قسّم المسؤوليات إلى إنشاء ومراجعة واعتماد وتنفيذ ومراقبة. وجود اسم شخص في مراسلة لا يثبت أنه صاحب القرار، كما أن الموافقة المبدئية لا تعني اكتمال الشروط السابقة للتنفيذ أو الصرف.",
  "أنشئ قائمة فروق بدل كتابة رواية طويلة. لكل فرق ضع القيمة أو العبارة في المصدر الأول، وما يقابلها في المصدر الثاني، والأثر المتوقع، والمستند المطلوب لحسمه، والشخص المسؤول عن توفيره.",
  "اختبر الملف من منظور شخص لم يحضر الواقعة. هل يستطيع معرفة من فعل ماذا ومتى وبأي صلاحية ومن أي مستند؟ إذا احتاج إلى تفسير شفهي، حوّل التفسير إلى مذكرة مؤرخة تميز المشاهدة عن الاستنتاج.",
  "افصل النسخة الأصلية عن نسخة المشاركة. احفظ الأصل وبياناته، واعمل على نسخة للحجب أو التعليق، وسجل ما حُجب ولماذا ومن وافق. بهذه الطريقة يمكن حماية البيانات دون إضعاف سلسلة الدليل.",
  "رتب الأسئلة بحسب أثرها على القرار: سؤال يوقف الإجراء، ثم سؤال يغير المبلغ أو النطاق، ثم سؤال يحسن العرض فقط. هذا الترتيب يمنع استهلاك الوقت في تفاصيل لا تغير الخطوة التالية.",
  "راجع الأرقام بوحداتها وفتراتها ومصادرها. لا تجمع وزنًا وعددًا، أو مبلغًا شاملًا وآخر قبل الضريبة، أو تاريخ إصدار وآخر استلام، إلا بعد تسمية الفرق ووضع معادلة يستطيع مراجع آخر إعادة تنفيذها.",
  "أغلق كل نقطة بإحدى ثلاث حالات: مثبتة بمرجع، منفية بمرجع، أو معلقة ويُذكر ما يلزم لحسمها. لا تحول النقطة المعلقة إلى حقيقة لمجرد تكرارها في رسائل متعددة مصدرها شخص واحد.",
  "قبل الإرسال، نفّذ مراجعة خصوصية وصلاحية. احذف كلمات المرور والبيانات البنكية وما لا يخدم السؤال، وتأكد أن المستلم مخول وأن قناة المشاركة مناسبة وأن لديك سجلًا بالنسخة التي خرجت ووقت خروجها."
];

const operatingNotes = [
  "إذا كان الموعد قريبًا، أرسل ردًا يحمي المهلة ويصف النقص بوضوح، ثم أكمل المستندات وفق مسار يمكن تتبعه. انتظار الكمال قد يضيع حقًا إجرائيًا مستقلًا.",
  "عند تغير الواقع بعد إنشاء المستند، أضف تحديثًا جديدًا ولا تمحُ النسخة السابقة. الفرق بين النسختين قد يكون هو العنصر الذي يفسر القرار أو المبلغ أو المسؤولية.",
  "لا تسند إلى المدينة وظيفة قانونية لمجرد ورود اسمها. دوّن هل هي موقع أصل أو تنفيذ أو تسليم أو طرف أو جهة، واربط ذلك بالمستند الذي يثبت الصلة.",
  "عند تعدد الأطراف، أنشئ عمودًا لكل صاحب دور: المالك، المشغل، المورد، المستفيد، الناقل، المراجع، وصاحب الاعتماد. هذا يمنع نسبة فعل طرف إلى طرف آخر.",
  "اجعل الإجراء التصحيحي قابلًا للفحص: ما التغيير، من نفذه، متى، على أي نسخة أو أصل، وما الدليل على أن الخطر أو الفرق أُغلق ولم ينتقل إلى موضع آخر؟",
  "إذا احتاج الملف رأيًا فنيًا، صغ السؤال الفني والبيانات المتاحة وحدود المهمة، واترك تفسير الأثر القانوني في مسار منفصل حتى لا تختلط الخبرة بالقرار.",
  "استعمل معرفًا ثابتًا للملف والمستند والدفعة أو الأصل. الأسماء العامة مثل «النسخة النهائية» أو «المهم» تفقد معناها عند وصول تعديل جديد أو انتقال الملف إلى شخص آخر.",
  "وثّق الاستلام مثلما توثق الإرسال. قد يثبت الإرسال محاولة فقط، بينما يحتاج الموعد أو التنفيذ إلى معرفة وصول النسخة الصحيحة إلى الجهة أو الشخص المقصود.",
  "راجع الشروط المرتبطة لا العبارة المنفردة. التعريفات والملاحق والتعديلات وترتيب الأولوية قد تغير معنى بند يبدو واضحًا إذا قُرئ وحده.",
  "اختم الملف بصفحة قرار قصيرة: النتيجة الحالية، حدودها، المراجع، النقاط المفتوحة، المسؤول، الموعد، والخطوة التالية. تبقى المستندات التفصيلية خلفها ولا تختفي."
];

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function rotate(values, offset, count = values.length) {
  return Array.from({ length: Math.min(count, values.length) }, (_, index) => values[(index + offset) % values.length]);
}

function analytics() {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;
}

function header() {
  return `<header class="header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية"><span>رُكن</span><b>الأنظمة القانونية</b></a><nav class="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="saudi-regions-guide.html">مناطق المملكة</a><a href="articles.html">المقالات</a><a href="site-directory.html">دليل الصفحات</a><a href="about.html">عن الموقع</a></nav><a class="nav-cta" href="tel:${phone}" dir="ltr">${displayPhone}</a></div></header>`;
}

function footer() {
  return `<footer class="footer" aria-label="معلومات الموقع"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>محتوى قانوني عام يساعد على ترتيب الطلب، مع استقبال إلكتروني دون ادعاء وجود فروع محلية.</p></div><div><b>الوصول السريع</b><a href="saudi-regions-guide.html">دليل مناطق المملكة</a><a href="site-directory.html">دليل الصفحات</a><a href="about.html">منهج المحتوى</a><a href="privacy.html">الخصوصية</a></div><div><b>التواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div><div class="container footer-trust-links" aria-label="روابط الثقة والسياسات"><a href="en.html" hreflang="en" lang="en">English</a><a href="about.html">عن الموقع ومنهج المحتوى</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a><a href="privacy.html">سياسة الخصوصية</a></div></footer>`;
}

export const pages = categories.flatMap((category, categoryIndex) => category.topics.map((topic, topicIndex) => {
  const index = categoryIndex * 10 + topicIndex;
  const location = locations[(index * 7 + 19) % locations.length];
  return {
    ...topic,
    category,
    location,
    index,
    key: `${category.key}-${topic.key}`,
    slug: `saudi-guide-w8-${topic.key}-${location.key}.html`
  };
}));

export function renderNationalPage(page, options = {}) {
  const pageContentDate = options.contentDate ?? contentDate;
  const allPages = options.allPages ?? pages;
  const { category, location } = page;
  const url = `${baseUrl}/${page.slug}`;
  const documentTitle = `${page.title} في ${location.name} | رُكن الأنظمة`;
  const description = `دليل ${page.title} في ${location.name}: المستندات والقرار والمواعيد والأدلة العملية، مع استقبال إلكتروني من ${location.region} دون فرع محلي.`;
  const message = `السلام عليكم، لدي طلب متعلق بـ${page.title}. المدينة: ${location.name}. المرحلة والموعد الأقرب: `;
  const steps = rotate(category.workflow, page.index % category.workflow.length, 5);
  const evidence = [page.coreDocument, page.proof, ...rotate(category.documents, page.index % category.documents.length, 4)];
  const related = rotate(allPages, page.index + 23, 10).filter((item) => item.slug !== page.slug).slice(0, 8);
  const faq = [
    [`ما أول مستند في ملف ${page.title}؟`, `ابدأ بـ${page.coreDocument}، ثم ضع بجواره مصدره وتاريخه وصاحب النسخة. لا تبدأ من ملخص مكتوب لاحقًا إذا كانت الوثيقة الأصلية متاحة.`],
    ["ما السؤال الذي يحدد اتجاه المراجعة؟", `${page.pivot} اكتب الإجابة المثبتة، وما يعارضها، وما بقي معلقًا، ثم اربط كل جزء بمرجع مستقل.`],
    [`هل وجود اسم ${location.name} يعني وجود فرع محلي؟`, `لا. ذكر ${location.name} يوضح صلة واقعة أو طرف أو أصل بالموقع فقط. استقبال الطلبات إلكتروني من ${location.region} ولا يعني وجود مكتب أو فرع فعلي.`],
    ["هل هذا الدليل يغني عن مراجعة مختص؟", "لا. الصفحة تساعد على تنظيم الملف الأولي ولا تضمن نتيجة. تختلف المعالجة بحسب الوقائع والصفة والمواعيد والنسخ الكاملة من المستندات."]
  ];
  const graph = [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: documentTitle, description, inLanguage: "ar-SA", isPartOf: { "@id": `${baseUrl}/#website` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    { "@type": "Article", "@id": `${url}#article`, headline: documentTitle.split("|")[0].trim(), description, datePublished: pageContentDate, dateModified: pageContentDate, inLanguage: "ar-SA", author: { "@id": `${baseUrl}/#organization` }, publisher: { "@id": `${baseUrl}/#organization` }, mainEntityOfPage: { "@id": `${url}#webpage` }, about: [page.title, category.label, location.name, location.region] },
    { "@type": "Service", "@id": `${url}#service`, name: `تنظيم ملف ${page.title}`, serviceType: category.label, url, provider: { "@id": `${baseUrl}/#organization` }, areaServed: [{ "@type": location.kind, name: location.name }, { "@type": "AdministrativeArea", name: location.region }] },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "مناطق السعودية", item: `${baseUrl}/saudi-regions-guide.html` }, { "@type": "ListItem", position: 3, name: page.title, item: url }] },
    { "@type": "FAQPage", mainEntity: faq.map(([name, answer]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: answer } })) }
  ];
  return `<!doctype html>
<html lang="ar" dir="rtl"><head>${analytics()}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/logo-128-20260824.png"><meta name="theme-color" content="#102a29"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="description" content="${escapeHtml(description)}"><meta name="author" content="رُكن الأنظمة القانونية"><title>${escapeHtml(documentTitle)}</title><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="article"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="${escapeHtml(documentTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(documentTitle)}"><meta name="twitter:description" content="${escapeHtml(description)}"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script><link rel="stylesheet" href="${stylesheet}"><style>:root{--muted:#536360}.brand span{color:#695f4e}.footer p{color:rgba(255,255,255,.72)}.footer a{color:rgba(255,255,255,.74)}.copyright{color:rgba(255,255,255,.68)}</style></head>
<body data-national-wave="8" data-guide-topic="${category.key}">${header()}<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span>/</span><a href="saudi-regions-guide.html">مناطق السعودية</a><span>/</span><span>${escapeHtml(page.title)}</span></div>
<section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">الدفعة الوطنية الثامنة • ${escapeHtml(location.region)}</span><h1>${escapeHtml(page.title)}<br><span>في ${escapeHtml(location.name)}</span></h1><p>${escapeHtml(page.situation)} المخرج المقصود هنا هو: ${escapeHtml(page.objective)}</p><div class="hero-actions"><a class="btn primary" href="#file-map">خريطة الملف</a><a class="btn secondary" href="#evidence">سجل الأدلة</a></div><div class="trust-row"><div><b>موضوع جديد</b><span>${escapeHtml(category.label)}</span></div><div><b>${escapeHtml(location.name)}</b><span>صلة موثقة فقط</span></div><div><b>دون فرع مزعوم</b><span>استقبال إلكتروني</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">الدفعة 8 من 10</span><div class="service-symbol" aria-hidden="true">${String(page.index + 1).padStart(3, "0")}</div><h2>سؤال القرار</h2><p>${escapeHtml(page.pivot)}</p></aside></div></section>
<div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#file-map">خريطة الملف</a><a href="#workflow">المسار</a><a href="#evidence">الأدلة</a><a href="#quality">بوابات الجودة</a><a href="#regional-context">صلة الموقع</a><a href="#faq">الأسئلة</a></nav></div>
<section class="section" id="file-map"><div class="container"><div class="section-head"><span class="eyebrow">أربع خانات قبل أي إجراء</span><h2>حوّل ${escapeHtml(page.title)} إلى ملف قابل للمراجعة</h2><p>${escapeHtml(category.focus)} لا تبدأ برقم أو نتيجة مجردة؛ ابدأ بالواقعة والوثيقة والوقت وصاحب الصلاحية ثم اختبر ما الذي يتغير إذا ثبت كل عنصر أو لم يثبت.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>المشهد</h3><p>${escapeHtml(page.situation)} اكتب الوقائع المحايدة في سطور منفصلة وحدد ما شاهدته مباشرة وما وصل من طرف آخر.</p></article><article class="specialty-card" data-number="02"><h3>المخرج</h3><p>${escapeHtml(page.objective)} اجعل المخرج قرارًا أو سجلًا أو مبلغًا أو مستندًا يمكن معرفة اكتماله.</p></article><article class="specialty-card" data-number="03"><h3>مرجع البداية</h3><p>${escapeHtml(page.coreDocument)}. افحص النسخة والتاريخ والمرفقات ومن أنشأها أو استلمها.</p></article><article class="specialty-card" data-number="04"><h3>الحد الحاكم</h3><p>${escapeHtml(page.boundary)}. سجّل هذا الحد في صفحة القرار حتى لا يتوسع الملف بافتراضات.</p></article></div><div class="coverage-disclaimer"><strong>زاوية المراجعة:</strong> ${escapeHtml(reviewAngles[page.index % reviewAngles.length])}</div></div></section>
<section class="section alt" id="workflow"><div class="container"><div class="section-head"><span class="eyebrow">خمس محطات لها ناتج</span><h2>مسار العمل في ${escapeHtml(category.label)}</h2><p>اكتب تحت كل محطة اسم الناتج ومسؤول الإعداد والمراجع وموعد الإنجاز. إذا لم تنتج المحطة ورقة أو قرارًا أو سجلًا يمكن فحصه، فهي وصف نشاط وليست خطوة مكتملة.</p></div><div class="process-grid">${steps.map((step, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(step)}</h3><p>${index === 0 ? `طبّقها أولًا على ${escapeHtml(page.coreDocument)} وحدد تاريخ القطع.` : index === 1 ? `اختبر السؤال: ${escapeHtml(page.pivot)}` : index === 2 ? `أضف الدليل المباشر: ${escapeHtml(page.proof)}.` : index === 3 ? `قارن الناتج بالهدف: ${escapeHtml(page.objective)}` : `اختم بحالة كل نقطة ومالكها وموعدها وإثبات إغلاقها.`}</p></article>`).join("")}</div><div class="coverage-disclaimer"><strong>ملاحظة تشغيلية:</strong> ${escapeHtml(operatingNotes[page.index % operatingNotes.length])}</div></div></section>
<section class="section" id="evidence"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">حزمة أدلة ذات سلسلة واضحة</span><h2>ماذا تحفظ في هذا الموضوع؟</h2><p>الدليل المحوري هو ${escapeHtml(page.proof)}. لا تضعه في مجلد مجهول؛ سجّل مصدره وتاريخ إنشائه أو استلامه وصاحب النسخة وعلاقته بالسؤال. احتفظ بالأصل كما وصل، وأنشئ نسخة عمل مستقلة للحجب أو التعليق.</p><ul><li>استخدم معرفًا ثابتًا لكل ملف ودفعة أو أصل.</li><li>طابق الأسماء والأرقام والوحدات بين المصادر.</li><li>احفظ الرسالة مع مرفقها لا كل واحد منفصلًا عن سياقه.</li><li>سجل النقص والتعارض بدل ملئه من الذاكرة.</li><li>حدد مستوى الحساسية وقناة المشاركة والمستلم المخول.</li></ul></div><ol class="document-list">${evidence.map((item, index) => `<li><strong>${String(index + 1).padStart(2, "0")}</strong> — ${escapeHtml(item)}. دوّن النسخة والفترة وصاحبها وما تثبته تحديدًا وما لا تستطيع إثباته.</li>`).join("")}</ol></div></section>
<section class="section alt" id="quality"><div class="container"><div class="section-head"><span class="eyebrow">ست بوابات قبل الإرسال</span><h2>اختبار جودة خاص بـ${escapeHtml(page.title)}</h2><p>مرّر الملف على البوابات بالترتيب. ضع نتيجة «اجتاز» أو «معلق» مع المرجع، ولا تستخدم كلمة «مكتمل» إذا بقي مصدر أو صلاحية أو مبلغ أو موعد غير محسوم.</p></div><div class="locality-panels"><article class="locality-panel" data-number="01"><h3>هوية الملف</h3><p>العنوان والأطراف والأصل أو الدفعة والفترة متسقة في ${escapeHtml(page.coreDocument)} وبقية المرفقات.</p></article><article class="locality-panel" data-number="02"><h3>صلاحية القرار</h3><p>صاحب الاعتماد معروف، وحدود تفويضه وقيمة القرار ووقته مثبتة بمصدر لا بمسمى وظيفي فقط.</p></article><article class="locality-panel" data-number="03"><h3>سلامة الدليل</h3><p>${escapeHtml(page.proof)} محفوظ بنسخته المصدرية، وأي تحويل أو حجب أو شرح مسجل في نسخة منفصلة.</p></article><article class="locality-panel" data-number="04"><h3>المعادلة والمدة</h3><p>كل رقم مرتبط بوحدة وفترة ومصدر، وكل موعد مرتبط بحدث بداية وإثبات استلام وآخر إجراء.</p></article><article class="locality-panel" data-number="05"><h3>حدود النتيجة</h3><p>${escapeHtml(page.boundary)}؛ لذلك يذكر القرار ما يغطيه وما يبقى خارج النطاق أو يحتاج تحققًا.</p></article><article class="locality-panel" data-number="06"><h3>إغلاق ومتابعة</h3><p>النتيجة المقصودة — ${escapeHtml(page.objective)} — لها مالك وموعد ومرجع إقفال وخطوة واضحة إذا لم تتحقق.</p></article></div></div></section>
<section class="section" id="regional-context"><div class="container"><div class="section-head"><span class="eyebrow">الموقع عنصر واقعي لا صفحة مكررة</span><h2>كيف تسجل صلة ${escapeHtml(location.name)}؟</h2><p>${escapeHtml(location.context)} في هذا الملف، اكتب إن كانت ${escapeHtml(location.name)} موقع الأصل أو العمل أو الواقعة أو التسليم أو مقر طرف أو جهة، ثم أرفق الوثيقة التي تثبت الصلة. ذكر المدينة لا يغير طبيعة ${escapeHtml(page.title)} ولا يعني وجود مكتب أو فرع فعلي لرُكن الأنظمة في ${escapeHtml(location.name)}؛ استقبال الطلبات إلكتروني من مدن ${escapeHtml(location.region)}.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>العنوان المصدر</h3><p>انسخ الموقع من الصك أو العقد أو الترخيص أو الفاتورة أو القرار، ولا توسع النطاق من الذاكرة.</p></article><article class="specialty-card" data-number="02"><h3>وظيفة المكان</h3><p>افصل مكان التوقيع والتنفيذ والتسليم والأصل والتبليغ؛ قد يكون لكل واحد مدينة وأثر ومستند مختلف.</p></article><article class="specialty-card" data-number="03"><h3>الرسالة الأولى</h3><p>اذكر ${escapeHtml(location.name)} وموضوع ${escapeHtml(page.title)} وصفتك والمرحلة والموعد واسم المستند الأساسي فقط.</p></article><article class="specialty-card" data-number="04"><h3>حماية البيانات</h3><p>لا ترسل كلمات مرور أو رموز تحقق أو بيانات بنكية أو ملفات حساسة كاملة في الرسالة الأولى.</p></article></div></div></section>
<section class="section alt" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة عملية</span><h2>أسئلة وأجوبة قبل التواصل</h2></div>${faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}<span>+</span></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></section>
<section class="section"><div class="container"><div class="section-head"><span class="eyebrow">موضوعات مختلفة من الدفعة الثامنة</span><h2>انتقل حسب القرار أو المستند</h2><p>الروابط التالية تعالج قضايا ومخرجات أخرى فعلًا؛ اختر المشكلة المطابقة لملفك بدل الاعتماد على تشابه اسم المدينة أو القطاع.</p></div><div class="related-services">${related.map((item) => `<a href="${item.slug}">${escapeHtml(item.title)} — ${escapeHtml(item.location.name)}</a>`).join("")}<a href="saudi-regions-guide.html">دليل مناطق المملكة</a><a href="site-directory.html">دليل جميع الصفحات</a></div></div></section>
<section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">رسالة أولى مختصرة</span><h2>أرسل الموضوع والمرحلة والموعد</h2><p>المحتوى عام ولا يضمن نتيجة ولا يستبدل مراجعة الوقائع والمستندات الكاملة من مختص.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">إرسال الطلب عبر واتساب</a></div></div></section></main>
<!-- content-accountability:start --><aside class="content-accountability" data-content-accountability aria-label="معلومات المحتوى"><div class="container content-accountability-inner"><div><strong>النشر والتحديث: رُكن الأنظمة القانونية</strong><span>محتوى عام لتنظيم الطلب الأولي، ولا يغني عن تقييم الوقائع والمستندات من مختص.</span></div><div class="content-accountability-meta"><time datetime="${contentDate}">تحديث المحتوى: 29 أغسطس 2026</time><a href="about.html">منهج إعداد المحتوى</a></div></div></aside><!-- content-accountability:end -->${footer()}<a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="${scriptFile}" defer></script></body></html>`;
}

export function generateNationalWave8() {
  if (pages.length !== 100) throw new Error(`Expected 100 pages, found ${pages.length}.`);
  if (new Set(pages.map((page) => page.slug)).size !== 100) throw new Error("Duplicate batch-eight slug.");
  for (const page of pages) writeFileSync(resolve(root, page.slug), renderNationalPage(page), "utf8");
  const rolloutPath = resolve(root, "national-seo-rollout.json");
  const rollout = JSON.parse(readFileSync(rolloutPath, "utf8"));
  if (!rollout.completedBatches.includes(7)) throw new Error("Batch 7 is not recorded as complete.");
  rollout.completedBatches = [...new Set([...rollout.completedBatches, 8])].sort((left, right) => left - right);
  rollout.updated = contentDate;
  rollout.publishedPages = rollout.completedBatches.length * rollout.pagesPerDay;
  rollout.remainingPages = Math.max(0, rollout.targetPages - rollout.publishedPages);
  rollout.nextBatch = rollout.remainingPages > 0 ? 9 : null;
  writeFileSync(rolloutPath, `${JSON.stringify(rollout, null, 2)}\n`, "utf8");
  console.log("Generated 100 original national guide pages for batch 8.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateNationalWave8();
