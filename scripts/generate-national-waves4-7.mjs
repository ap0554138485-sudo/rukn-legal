import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { domains, tasks, reviewAngles } from "./national-waves4-7-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const contentDate = "2026-08-29";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const stylesheet = "styles-20260821b.css?v=20260825b";
const scriptFile = "script-20260824b.js?v=20260827b";

const batchReviewNotes = {
  4: "في هذه المرحلة ثبّت خط الأساس قبل أي مقارنة: النسخة المرجعية، تاريخ القطع، صاحب الصلاحية، حدود النطاق، والمستند الذي أنشأ الالتزام. اكتب ما يدخل في المراجعة وما استُبعد وسبب الاستبعاد، ثم امنع إدخال نسخة أحدث دون تسجيل أثرها على النتيجة السابقة.",
  5: "تعامل مع التغيير أو التسوية كسلسلة فروق قابلة للقياس. افصل الطلب الأصلي عن العرض المعدل، وحدد المقابل والتنازل والشرط والمدة والاعتماد لكل نسخة. لا تدمج الأرقام أو الصيغ قبل إنشاء جدول يبين ما بقي ثابتًا وما تغير ومن وافق عليه.",
  6: "ركز هنا على سلسلة السلطة والاعتماد: من أعد المدخل، ومن راجعه، ومن يملك القرار، ومن نفذه، وما الدليل الذي أغلق المهمة. إذا اجتمعت عدة صفات في شخص واحد فدوّنها منفصلة، واختبر وجود تعارض أو حد مالي أو مدة تفويض قبل الاعتماد.",
  7: "حوّل القرار في هذه المرحلة إلى سجل تنفيذ حي: مهمة محددة، مالك، تبعية، موعد، مخرج، اختبار قبول، ودليل إغلاق. سجّل العوائق والتغيير اللاحق في صف مستقل، ولا تعتبر النسبة أو لون الحالة إنجازًا ما لم يوجد أثر يمكن لمراجع آخر فحصه."
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function rotate(items, seed, count) {
  return Array.from({ length: count }, (_, offset) => items[(seed + offset) % items.length]);
}

export const pages = domains.flatMap((domain, domainIndex) => tasks.map((task, taskIndex) => {
  const index = domainIndex * tasks.length + taskIndex;
  const batch = 4 + ((domainIndex + taskIndex) % 4);
  const location = locations[(index + batch * 3) % locations.length];
  return {
    index, batch, domain, domainIndex, task, taskIndex, location,
    key: `${domain.key}-${task.key}`,
    title: `${task.title} في ${domain.title}`,
    slug: `saudi-guide-w${batch}-${domain.key}-${task.key}-${location.key}.html`
  };
}));

function analytics() {
  return `<!-- site-analytics:start --><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-KKGEYHSD29");(()=>{let loaded=false;const load=()=>{if(loaded)return;loaded=true;const script=document.createElement("script");script.async=true;script.src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29";document.head.appendChild(script)};["pointerdown","keydown","touchstart","scroll"].forEach(name=>window.addEventListener(name,load,{once:true,passive:true}));window.addEventListener("load",()=>window.setTimeout(load,6000),{once:true})})();</script><!-- site-analytics:end -->`;
}

function header(page) {
  const message = `السلام عليكم، لدي طلب عن ${page.title}. المدينة: ${page.location.name}. صفتي والمرحلة وأقرب موعد: `;
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">استقبال الطلبات إلكترونيًا من جميع مناطق المملكة</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div><header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية"><div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="site-directory.html">دليل الصفحات</a><a href="articles.html">المقالات</a><a href="about.html">عن الموقع</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer() {
  return `<footer class="footer" aria-label="معلومات الموقع"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>أدلة عامة لتنظيم الملفات القانونية، مع استقبال إلكتروني دون ادعاء وجود فروع محلية.</p></div><div><b>الوصول السريع</b><a href="saudi-regions-guide.html">دليل مناطق المملكة</a><a href="site-directory.html">دليل الصفحات</a><a href="articles.html">المقالات</a><a href="privacy.html">الخصوصية</a></div><div><b>التواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer>`;
}

function render(page) {
  const { domain, task, location } = page;
  const url = `${baseUrl}/${page.slug}`;
  const documentTitle = page.title;
  const description = `${page.title} في ${location.name}: دليل لتنظيم السؤال والمستند والقرار والأدلة والمواعيد، واستقبال إلكتروني دون فرع محلي.`;
  const message = `السلام عليكم، لدي طلب عن ${page.title}. المدينة: ${location.name}. صفتي والمرحلة وأقرب موعد: `;
  const angleOne = reviewAngles[(page.domainIndex * 3 + page.taskIndex * 7) % reviewAngles.length];
  const angleTwo = reviewAngles[(page.domainIndex * 11 + page.taskIndex * 5 + 3) % reviewAngles.length];
  const angleThree = reviewAngles[(page.domainIndex * 7 + page.taskIndex * 13 + 9) % reviewAngles.length];
  const evidence = [...domain.docs, ...task.evidence, batchReviewNotes[page.batch]];
  const inBatch = pages.filter((item) => item.batch === page.batch);
  const related = rotate(inBatch, page.index + 17, 12).filter((item) => item.slug !== page.slug).slice(0, 8);
  const faqs = [
    [`ما نقطة البداية في ${page.title}؟`, `ابدأ بـ${domain.anchor} ثم اكتب في سطر واحد: ${task.question} بعد ذلك أنشئ ${task.output} ولا ترسل مجموعة مستندات قبل فهرستها.`],
    [`كيف أعرف أن ${task.title} مكتملة؟`, `تكون قابلة للمراجعة عندما يظهر المصدر والنسخة والمسؤول والموعد والمخرج، وعندما يمكن تتبع النتيجة من ${domain.anchor} إلى دليلها دون افتراضات مخفية.`],
    [`هل ذكر ${location.name} يعني وجود فرع محلي؟`, `لا. المدينة تصف صلة الطلب بالواقعة أو الطرف أو الأصل أو التنفيذ. الاستقبال إلكتروني من ${location.region} ولا يعني وجود مكتب أو فرع فعلي لرُكن الأنظمة في ${location.name}.`],
    ["هل هذا الدليل بديل عن مراجعة مختص؟", `لا. المحتوى عام لتنظيم ${page.title} ولا يضمن نتيجة. تختلف المعالجة بحسب الوقائع والصفة والمواعيد والنسخ الكاملة، لذلك يلزم تقييم الملف الفعلي قبل قرار نهائي.`]
  ];
  const graph = [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: documentTitle, description, inLanguage: "ar-SA", isPartOf: { "@id": `${baseUrl}/#website` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    { "@type": "Article", "@id": `${url}#article`, headline: documentTitle.split("|")[0].trim(), description, datePublished: contentDate, dateModified: contentDate, inLanguage: "ar-SA", author: { "@id": `${baseUrl}/#organization` }, publisher: { "@id": `${baseUrl}/#organization` }, mainEntityOfPage: { "@id": `${url}#webpage` }, about: [page.title, domain.title, task.title, location.name] },
    { "@type": "Service", "@id": `${url}#service`, name: `تنظيم ${page.title}`, serviceType: domain.title, url, provider: { "@id": `${baseUrl}/#organization` }, areaServed: { "@type": "AdministrativeArea", name: location.region }, availableChannel: { "@type": "ServiceChannel", serviceUrl: `https://wa.me/966506142113?text=${encodeURIComponent(message)}` } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "مناطق السعودية", item: `${baseUrl}/saudi-regions-guide.html` }, { "@type": "ListItem", position: 3, name: page.title, item: url }] },
    { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ];
  const workflow = task.steps.map((step, index) => {
    const copy = [
      `طبّق البداية على ${domain.anchor}، وحدد النسخة وصاحبها والفترة التي تغطيها.`,
      `اربط هذه المحطة بقرار: ${domain.decision}، ولا تضف واقعة بلا مصدر.`,
      `استخدم ${domain.docs[(page.index + index) % domain.docs.length]} لتثبيت الفروق والاستثناءات.`,
      `سجّل المسؤول والموعد وناتج المحطة داخل ${task.output}.`,
      `راجع الاكتمال بسؤال: ${task.question} ثم دوّن ما بقي مفتوحًا.`
    ][index];
    return `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(step)}</h3><p>${escapeHtml(copy)}</p></article>`;
  }).join("");
  const evidenceItems = evidence.map((item, index) => `<li><strong>${String(index + 1).padStart(2, "0")}</strong> — ${escapeHtml(item)}: راجع المصدر والتاريخ والنسخة وعلاقته بـ${escapeHtml(task.title)}، وسجّل النقص أو التحفظ بدل ملئه بافتراض.</li>`).join("");
  const faqHtml = faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}<span>+</span></summary><p>${escapeHtml(answer)}</p></details>`).join("");
  const relatedHtml = related.map((item) => `<a href="${item.slug}">${escapeHtml(item.title)} — ${escapeHtml(item.location.name)}</a>`).join("");
  const tailoredChecks = [
    `في محطة «${task.steps[0]}» اربط ${domain.docs[0]} بالقرار الآتي: ${domain.decision}.`,
    `داخل ${task.output} اشرح كيف يخدم ${domain.docs[1]} سؤال «${task.question}».`,
    `قارن ${domain.docs[2]} مع ${task.evidence[0]}، وسجّل النسخة والتاريخ وسبب أي فرق ظاهر.`,
    `عند تنفيذ «${task.steps[1]}» اختبر خطر ${domain.risk} ولا تحوله إلى نتيجة قبل توثيقه.`,
    `ضع ${task.evidence[1]} بجوار ${domain.docs[3]} حتى يظهر مسار المعلومة من المصدر إلى المخرج.`,
    `في خطوة «${task.steps[2]}» طبّق قاعدة المجال: ${domain.review}`,
    `قبل «${task.steps[3]}» راجع التحذير الخاص بالمخرج: ${task.caution}`,
    `استخدم ${task.evidence[2]} لإثبات إغلاق النقطة، ولا تجعل تغيير الحالة بديلًا عن الدليل.`,
    `اكتب تحت عنوان ${domain.title} ما يدخل في نطاق ${task.title} وما استبعدته وسبب الاستبعاد.`,
    `اختم ${task.output} بسؤال القرار «${task.question}» وبمالك وموعد لكل إجابة غير مكتملة.`
  ].map((item, index) => `<li><strong>${String(index + 1).padStart(2, "0")}</strong> — ${escapeHtml(item)}</li>`).join("");
  const intersectionMap = [
    `${domain.title} ← ${domain.docs[0]} ← ${task.steps[0]} ← ${task.output}`,
    `${domain.anchor} ← ${task.evidence[0]} ← ${task.steps[1]} ← ${domain.decision}`,
    `${domain.docs[1]} ← ${task.question} ← ${domain.title} ← ${task.evidence[1]}`,
    `${task.title} ← ${domain.docs[2]} ← ${task.steps[2]} ← ${domain.review}`,
    `${domain.risk} ← ${task.steps[3]} ← ${task.evidence[2]} ← ${domain.docs[3]}`,
    `${task.caution} ← ${domain.anchor} ← ${task.steps[4]} ← ${domain.title}`,
    `${domain.docs[3]} ← ${task.output} ← ${domain.decision} ← ${task.evidence[0]}`,
    `${task.steps[1]} ← ${domain.docs[0]} ← ${domain.scene} ← ${task.evidence[2]}`,
    `${domain.review} ← ${task.question} ← ${domain.docs[1]} ← ${task.title}`,
    `${task.evidence[1]} ← ${domain.risk} ← ${task.steps[3]} ← ${domain.anchor}`,
    `${domain.decision} ← ${task.steps[0]} ← ${domain.docs[2]} ← ${task.caution}`,
    `${task.output} ← ${domain.scene} ← ${task.steps[4]} ← ${domain.docs[3]}`
  ].map((item, index) => `<li><strong>${String(index + 1).padStart(2, "0")}</strong> — ${escapeHtml(item)}</li>`).join("");

  return `<!doctype html><html lang="ar" dir="rtl"><head>${analytics()}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!-- site-search-appearance:start --><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/logo-128-20260824.png"><meta name="theme-color" content="#102a29"><!-- site-search-appearance:end --><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="description" content="${escapeHtml(description)}"><meta name="author" content="رُكن الأنظمة القانونية"><title>${escapeHtml(documentTitle)}</title><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="article"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="${escapeHtml(documentTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(documentTitle)}"><meta name="twitter:description" content="${escapeHtml(description)}"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script><!-- site-fonts:start --><!-- Fast system fonts; no render-blocking external font request. --><!-- site-fonts:end --><link rel="stylesheet" href="${stylesheet}"><!-- accessibility-contrast:start --><style>:root{--muted:#536360}.brand span{color:#695f4e}.footer p{color:rgba(255,255,255,.72)}.footer a{color:rgba(255,255,255,.74)}.copyright{color:rgba(255,255,255,.68)}</style><!-- accessibility-contrast:end --></head><body data-national-wave="${page.batch}" data-guide-domain="${domain.key}" data-guide-output="${task.key}">${header(page)}<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="saudi-regions-guide.html">مناطق السعودية</a><span aria-hidden="true">/</span><span>${escapeHtml(page.title)}</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">الدفعة الوطنية ${page.batch} • ${escapeHtml(location.region)}</span><h1>${escapeHtml(page.title)}<br><span>في ${escapeHtml(location.name)}</span></h1><p>${escapeHtml(domain.scene)} وتستخدم هذه الصفحة ${escapeHtml(task.title)} للوصول إلى ملف واضح يمكن مراجعته واتخاذ قرار بشأنه.</p><div class="hero-actions"><a class="btn primary" href="#file-map">خريطة الملف</a><a class="btn secondary" href="#workflow">خطوات العمل</a></div><div class="trust-row"><div><b>${escapeHtml(domain.title)}</b><span>مجال الطلب</span></div><div><b>${escapeHtml(task.title)}</b><span>مخرج مستقل</span></div><div><b>استقبال إلكتروني</b><span>دون فرع مزعوم</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">صفحة ${String(page.index + 301).padStart(3, "0")} من الخطة</span><div class="service-symbol" aria-hidden="true">${String(page.batch).padStart(2, "0")}</div><h2>السؤال الحاسم</h2><p>${escapeHtml(task.question)}</p></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#file-map">خريطة الملف</a><a href="#workflow">المسار</a><a href="#evidence">الأدلة</a><a href="#quality">اختبار الجودة</a><a href="#regional-context">الموقع</a><a href="#faq">الأسئلة</a></nav></div>
  <section class="section" id="file-map"><div class="container"><div class="section-head"><span class="eyebrow">موضوع ومخرج لا صفحة مدينة مكررة</span><h2>خريطة ${escapeHtml(page.title)}</h2><p>${escapeHtml(task.purpose)} في ${escapeHtml(domain.title)} تكون نقطة الارتكاز ${escapeHtml(domain.anchor)}، والنتيجة العملية ${escapeHtml(task.output)}.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>المشهد الذي نراجعه</h3><p>${escapeHtml(domain.scene)} صف ما حدث فعلًا مع الأسماء والصفات والتواريخ، ثم افصل التقييم عن السرد.</p></article><article class="specialty-card" data-number="02"><h3>القرار المطلوب</h3><p>${escapeHtml(domain.decision)} ويُختبر ذلك بسؤال: ${escapeHtml(task.question)}</p></article><article class="specialty-card" data-number="03"><h3>المخرج القابل للتسليم</h3><p>${escapeHtml(task.output)} يجب أن يحمل رقم نسخة وتاريخ إعداد وصاحب مراجعة ونقاطًا مفتوحة.</p></article><article class="specialty-card" data-number="04"><h3>الخطر الخاص بالملف</h3><p>${escapeHtml(domain.risk)} وفي هذا المخرج تحديدًا: ${escapeHtml(task.caution)}</p></article></div><div class="coverage-disclaimer"><strong>زاوية المراجعة:</strong> ${escapeHtml(angleOne)}</div></div></section>
  <section class="section alt" id="workflow"><div class="container"><div class="section-head"><span class="eyebrow">خمس محطات لها مخرجات</span><h2>كيف تنفذ ${escapeHtml(task.title)}؟</h2><p>${escapeHtml(domain.review)} لا تنتقل قبل كتابة المرجع والنتيجة والنقطة التي ما زالت تحتاج تحققًا.</p></div><div class="process-grid">${workflow}</div></div></section>
  <section class="section" id="evidence"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">سجل أدلة قابل للتتبع</span><h2>المستندات التي تخدم هذا المخرج</h2><p>ابدأ بـ${escapeHtml(domain.anchor)} ولا تعدّل النسخة الأصلية. ${escapeHtml(angleTwo)} عند المشاركة، احجب البيانات غير اللازمة مع حفظ السياق ورقم النسخة.</p><ul><li>سمِّ الملف بالتاريخ والنوع والجهة.</li><li>اكتب الواقعة التي يثبتها.</li><li>ثبّت مصدر النسخة ووقت الاستلام.</li><li>اربط التعارض بنقطة تحقق ومسؤول.</li><li>احتفظ بأثر أي تصحيح أو استبدال.</li></ul></div><ol class="document-list">${evidenceItems}</ol></div></section>
  <section class="section" id="tailored-review"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">فحص مخصص لهذا التقاطع</span><h2>${escapeHtml(task.title)} داخل ${escapeHtml(domain.title)}</h2><p>هذه القائمة تخص اجتماع المجال والمخرج في هذه الصفحة، وتمنع تحويل الدليل إلى نموذج عام. نفّذ البنود على النسخة الفعلية وسجّل ما لا ينطبق بدل حذفه بصمت.</p></div><ol class="document-list">${tailoredChecks}</ol></div></section>
  <section class="section alt" id="intersection-map"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">خريطة تقاطع مستقلة</span><h2>من المصدر إلى القرار في هذه الصفحة</h2><p>تُقرأ الأسهم من اليمين إلى اليسار بوصفها مسار تحقق، لا ترتيبًا زمنيًا. كل سطر يجمع عنصرًا من ${escapeHtml(domain.title)} بعنصر من ${escapeHtml(task.title)} حتى يبقى هذا الملف مختلفًا عن الملفات الأخرى.</p></div><ol class="document-list">${intersectionMap}</ol></div></section>
  <section class="section alt" id="quality"><div class="container"><div class="section-head"><span class="eyebrow">اختبار قبل الاعتماد</span><h2>أربع بوابات لجودة ${escapeHtml(page.title)}</h2><p>${escapeHtml(angleThree)} الهدف أن يستطيع مراجع آخر إعادة بناء النتيجة من المصادر نفسها ومعرفة حدودها.</p></div><div class="locality-panels"><article class="locality-panel" data-number="01"><h3>بوابة المصدر</h3><p>هل يمكن العودة من كل نتيجة إلى ${escapeHtml(domain.anchor)} أو مصدر أصلي؟ دوّن الصفحة والبند والنسخة.</p></article><article class="locality-panel" data-number="02"><h3>بوابة الاتساق</h3><p>قارن الأسماء والصفات والتواريخ والمبالغ بين ${escapeHtml(domain.docs[0])} و${escapeHtml(domain.docs[1])}. اشرح الفرق ولا تمح أثره.</p></article><article class="locality-panel" data-number="03"><h3>بوابة القرار</h3><p>هل يجيب ${escapeHtml(task.output)} عن «${escapeHtml(task.question)}»؟ إن لم يفعل فالمخرج يحتاج تضييقًا أو دليلًا.</p></article><article class="locality-panel" data-number="04"><h3>بوابة التسليم</h3><p>أضف مالك النسخة والموعد ونطاق المشاركة والنقاط المفتوحة. ${escapeHtml(task.caution)}</p></article></div></div></section>
  <section class="section" id="regional-context"><div class="container"><div class="section-head"><span class="eyebrow">الموقع معلومة موثقة لا كلمة مكررة</span><h2>كيف تسجل صلة ${escapeHtml(location.name)} بالملف؟</h2><p>${escapeHtml(location.context)} في ${escapeHtml(page.title)} اذكر إن كانت ${escapeHtml(location.name)} موقع الأصل أو العمل أو الواقعة أو مقر طرف، ثم اربط الصلة بمستند. ذكر المدينة لا يغير طبيعة ${escapeHtml(domain.title)} ولا يعني وجود مكتب أو فرع فعلي لرُكن الأنظمة في ${escapeHtml(location.name)}؛ الاستقبال إلكتروني من مدن ${escapeHtml(location.region)}.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>الموقع في الوثيقة</h3><p>انسخ العنوان كما يظهر في المستند الأساسي ولا توسع النطاق من الذاكرة.</p></article><article class="specialty-card" data-number="02"><h3>وظيفة الموقع</h3><p>افصل مكان التوقيع والتنفيذ والتسليم والأصل والتبليغ؛ لكل واحد أثر ومستند.</p></article><article class="specialty-card" data-number="03"><h3>رسالة البداية</h3><p>اذكر ${escapeHtml(location.name)} و${escapeHtml(page.title)} وصفتك والمرحلة وأقرب موعد، دون كلمات مرور أو بيانات بنكية.</p></article><article class="specialty-card" data-number="04"><h3>حدود التغطية</h3><p>الخدمة تستقبل إلكترونيًا من ${escapeHtml(location.region)} ولا يُفهم من الصفحة وجود فرع أو ضمان نتيجة.</p></article></div></div></section>
  <section class="section alt" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة قبل التواصل</span><h2>أسئلة وأجوبة عن هذا الملف</h2></div>${faqHtml}</div></section>
  <section class="section"><div class="container"><div class="section-head"><span class="eyebrow">انتقل بحسب المشكلة والمخرج</span><h2>أدلة مختلفة من الدفعة ${page.batch}</h2><p>كل رابط يعالج مجالًا ومخرجًا مستقلين. اختر الصفحة المطابقة للقرار أو المستند، لا اسم المدينة وحده.</p></div><div class="related-services">${relatedHtml}<a href="saudi-regions-guide.html">دليل مناطق المملكة</a><a href="site-directory.html">دليل جميع الصفحات</a></div></div></section>
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">رسالة أولى آمنة ومختصرة</span><h2>أرسل المجال والمخرج والمرحلة</h2><p>لا ترسل أصول المستندات أو كلمات المرور أو البيانات البنكية في الرسالة الأولى. المحتوى عام ولا يضمن نتيجة.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">إرسال الطلب عبر واتساب</a></div></div></section></main>
  <!-- content-accountability:start --><aside class="content-accountability" data-content-accountability aria-label="معلومات المحتوى"><div class="container content-accountability-inner"><div><strong>النشر والتحديث: رُكن الأنظمة القانونية</strong><span>محتوى عام لتنظيم الطلب الأولي، ولا يغني عن تقييم الوقائع والمستندات من مختص.</span></div><div class="content-accountability-meta"><time datetime="${contentDate}">تحديث المحتوى: 29 أغسطس 2026</time><a href="about.html">منهج إعداد المحتوى</a></div></div></aside><!-- content-accountability:end -->${footer()}<a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="${scriptFile}" defer></script></body></html>`;
}

export function generateNationalBatch(batch) {
  if (![4, 5, 6, 7].includes(batch)) throw new Error("Batch must be 4, 5, 6, or 7.");
  const batchPages = pages.filter((page) => page.batch === batch);
  if (batchPages.length !== 100) throw new Error(`Expected 100 pages for batch ${batch}, found ${batchPages.length}.`);
  if (new Set(batchPages.map((page) => page.slug)).size !== 100) throw new Error(`Duplicate slug in batch ${batch}.`);
  for (const page of batchPages) writeFileSync(resolve(root, page.slug), render(page), "utf8");
  const rolloutPath = resolve(root, "national-seo-rollout.json");
  const rollout = JSON.parse(readFileSync(rolloutPath, "utf8"));
  if (!rollout.completedBatches.includes(batch - 1)) throw new Error(`Batch ${batch - 1} is not recorded as complete.`);
  rollout.completedBatches = [...new Set([...rollout.completedBatches, batch])].sort((left, right) => left - right);
  rollout.updated = contentDate;
  rollout.publishedPages = rollout.completedBatches.length * rollout.pagesPerDay;
  rollout.remainingPages = Math.max(0, rollout.targetPages - rollout.publishedPages);
  rollout.nextBatch = rollout.remainingPages > 0 ? Math.max(...rollout.completedBatches) + 1 : null;
  writeFileSync(rolloutPath, `${JSON.stringify(rollout, null, 2)}\n`, "utf8");
  console.log(`Generated ${batchPages.length} original national guide pages for batch ${batch}.`);
}

const requestedBatch = Number(process.argv[2]);
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateNationalBatch(requestedBatch);
