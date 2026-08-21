import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const releaseDate = "2026-08-21";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const assetVersion = "20260821b";
const stylesheetFile = `styles-${assetVersion}.css`;
const fontStylesheet = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap";

const regions = [
  ["منطقة الرياض", "الرياض، الخرج، الدرعية، الدوادمي، المجمعة ووادي الدواسر", "legal-services-riyadh.html", "دليل خدمات وأحياء الرياض"],
  ["منطقة مكة المكرمة", "مكة المكرمة، جدة، الطائف، رابغ، القنفذة والليث", "legal-services-jeddah.html", "دليل الخدمات القانونية في جدة"],
  ["المنطقة الشرقية", "الدمام، الخبر، الظهران، الأحساء، الجبيل، القطيف وحفر الباطن", "legal-services-dammam.html", "دليل الخدمات القانونية في الدمام"],
  ["منطقة تبوك", "تبوك، ضباء، الوجه، أملج، تيماء، حقل والبدع", "tabuk-region-lawyers.html", "دليل منطقة تبوك ومحافظاتها"],
  ["منطقة المدينة المنورة", "المدينة المنورة، ينبع، العلا، بدر وخيبر", "#start", "بدء طلب من المنطقة"],
  ["منطقة القصيم", "بريدة، عنيزة، الرس، البكيرية والمذنب", "#start", "بدء طلب من المنطقة"],
  ["منطقة عسير", "أبها، خميس مشيط، بيشة، محايل والنماص", "#start", "بدء طلب من المنطقة"],
  ["منطقة حائل", "حائل، بقعاء، الشنان والغزالة", "#start", "بدء طلب من المنطقة"],
  ["منطقة الحدود الشمالية", "عرعر، رفحاء، طريف والعويقيلة", "#start", "بدء طلب من المنطقة"],
  ["منطقة جازان", "جازان، صبيا، أبو عريش، صامطة وبيش", "#start", "بدء طلب من المنطقة"],
  ["منطقة نجران", "نجران، شرورة، حبونا وبدر الجنوب", "#start", "بدء طلب من المنطقة"],
  ["منطقة الباحة", "الباحة، بلجرشي، المندق والمخواة", "#start", "بدء طلب من المنطقة"],
  ["منطقة الجوف", "سكاكا، القريات، دومة الجندل وطبرجل", "#start", "بدء طلب من المنطقة"]
];

const services = [
  ["القضايا والاستشارات", "فهم الوقائع والصفة والجهة والمرحلة قبل اختيار المسار."],
  ["الأحوال الشخصية", "الطلاق والفسخ والنفقة والحضانة والزيارة والتركات."],
  ["القضايا التجارية", "المطالبات التجارية ومنازعات الشركاء والشركات."],
  ["القضايا العمالية", "الأجور والمستحقات وإنهاء العلاقة العمالية."],
  ["التنفيذ والمطالبات", "السند التنفيذي وطلبات التنفيذ والاعتراضات المرتبطة به."],
  ["العقود والاتفاقيات", "الصياغة والمراجعة وتحديد الالتزامات والمخاطر."],
  ["القضايا الجنائية", "البلاغات والتحقيق والنيابة والمحاكم الجزائية."],
  ["العقار والمقاولات", "العقود العقارية ومنازعات المقاولات والدفعات والتسليم."]
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": value })}</script>`;
}

function gaTag() {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;
}

function fontLinks() {
  return `<!-- site-fonts:start --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="${fontStylesheet}"><link rel="stylesheet" href="${fontStylesheet}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${fontStylesheet}"></noscript><!-- site-fonts:end -->`;
}

function accessibilityOverrides() {
  return `<!-- accessibility-contrast:start --><style>:root{--muted:#536360}.brand span{color:#695f4e}.article-grid article>span{color:#715731}.footer p,.site-footer p{color:rgba(255,255,255,.72)}.footer a{color:rgba(255,255,255,.74)}.copyright{color:rgba(255,255,255,.68)}</style><!-- accessibility-contrast:end -->`;
}

function header() {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">استقبال إلكتروني من جميع مناطق المملكة</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
  <header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية"><div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="site-directory.html">دليل الصفحات</a><a href="about.html">عن الموقع</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent("السلام عليكم، أرغب في طلب خدمة قانونية. المنطقة ونوع الطلب: ")}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(message = "خدمات واستشارات قانونية للأفراد والمنشآت في مختلف مناطق المملكة.") {
  return `<footer class="footer" aria-label="معلومات الموقع"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>${message}</p></div><div><b>أدلة مهمة</b><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="site-directory.html">دليل جميع الصفحات</a><a href="articles.html">المقالات والإرشادات</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer>`;
}

function shell({ file, title, description, robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1", body, schema = [] }) {
  const canonical = `${baseUrl}/${file}`;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  ${gaTag()}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="${robots}">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ar" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:site_name" content="رُكن الأنظمة القانونية">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${schema.length ? jsonLd(schema) : ""}
  ${fontLinks()}
  <link rel="stylesheet" href="${stylesheetFile}">
  ${accessibilityOverrides()}
</head>
<body>
  ${header()}
  ${body}
  ${footer()}
  <a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent("السلام عليكم، أرغب في طلب خدمة قانونية. المنطقة ونوع الطلب: ")}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a>
  <script src="script.js"></script>
</body>
</html>`;
}

function nationalGuide() {
  const file = "saudi-regions-guide.html";
  const title = "دليل الخدمات القانونية في مناطق السعودية | رُكن الأنظمة";
  const description = "دليل الخدمات القانونية في مناطق السعودية يوضح اختيار الخدمة وتجهيز الطلب وبدء التواصل إلكترونيًا من المناطق الثلاث عشرة دون ادعاء وجود فروع محلية.";
  const regionCards = regions.map(([name, cities, href, label], index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${name}</h3><p>${cities}.</p><a href="${href}">${label}</a></article>`).join("");
  const serviceCards = services.map(([name, text], index) => `<article class="specialty-card" data-number="${String(index + 1).padStart(2, "0")}"><h3>${name}</h3><p>${text}</p></article>`).join("");
  const faqs = [
    ["هل يستقبل الموقع طلبات من جميع مناطق السعودية؟", "نعم، يمكن بدء الطلب إلكترونيًا من المناطق الثلاث عشرة. ويعتمد تحديد المسار على نوع المسألة والصفة والمرحلة والمستند، ولا يعني ذكر المنطقة وجود فرع فعلي فيها."],
    ["كيف أختار صفحة الخدمة المناسبة؟", "ابدأ بجوهر الطلب: أسرة أو عمل أو تجارة أو تنفيذ أو عقود أو عقار أو قضية جنائية، ثم اختر دليل المدينة المتاح أو أرسل المنطقة ونوع الطلب في رسالة البداية."],
    ["هل تختلف الأنظمة بسبب المدينة؟", "الأنظمة السعودية واحدة، لكن المدينة قد تكون مهمة لتحديد موقع العقار أو المنشأة أو الواقعة أو الجهة والموعد المرتبط بالطلب."],
    ["ما المعلومات المناسبة لأول تواصل؟", "اذكر المنطقة ونوع الطلب وصفتك والمرحلة الحالية وأقرب موعد والمستند الأساسي، وتجنب كلمات المرور والبيانات البنكية والأصول والمعلومات شديدة الحساسية."]
  ];
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>دليل مناطق السعودية</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">تغطية وطنية واضحة</span><h1>دليل الخدمات القانونية في مناطق السعودية<br><span>من المنطقة إلى المسار المناسب</span></h1><p>صفحة وطنية واحدة تساعدك على تحديد نوع الخدمة وتجهيز الطلب والوصول إلى الأدلة المحلية المتاحة، دون إنشاء صفحات متشابهة لكل مدينة أو ادعاء وجود فروع.</p><div class="hero-actions"><a class="btn primary" href="#regions">اختر منطقتك</a><a class="btn secondary" href="#services">اختر نوع الخدمة</a></div><div class="trust-row"><div><b>13 منطقة</b><span>تغطية المملكة</span></div><div><b>8 مسارات</b><span>قانونية رئيسية</span></div><div><b>استقبال إلكتروني</b><span>دون ادعاء فروع</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">دليل السعودية</span><div class="service-symbol" aria-hidden="true">13</div><h2>ابدأ بثلاث معلومات</h2><ul class="service-hero-points"><li>المنطقة والمدينة</li><li>نوع المسألة والصفة</li><li>المرحلة وأقرب موعد</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#regions">المناطق</a><a href="#services">الخدمات</a><a href="#prepare">تجهيز الطلب</a><a href="#faq">الأسئلة</a></nav></div>
  <section class="section" id="regions"><div class="container"><div class="section-head"><span class="eyebrow">المناطق الإدارية الثلاث عشرة</span><h2>اختر منطقتك ثم حدّد المدينة</h2><p>تساعد المدينة في وصف موقع الطلب، بينما يحدد نوع القضية أو المعاملة الصفحة القانونية الأنسب.</p></div><div class="locality-panels national-region-grid">${regionCards}</div><p class="coverage-disclaimer">التغطية تعني إمكانية بدء الطلب إلكترونيًا، ولا تعني وجود مكتب أو فرع فعلي في كل مدينة أو محافظة.</p></div></section>
  <section class="section alt" id="services"><div class="container"><div class="section-head"><span class="eyebrow">الكلمات مرتبطة بالاحتياج</span><h2>اختر الخدمة بحسب موضوع الطلب</h2><p>تجنب اختيار الصفحة على اسم المدينة فقط؛ الصفحة الأفضل هي التي تطابق الموضوع والمرحلة والمستند.</p></div><div class="specialty-grid">${serviceCards}</div><div class="related-services national-hubs"><a href="lawyer-tabuk.html">محامي في تبوك</a><a href="lawyer-riyadh.html">محامي في الرياض</a><a href="lawyer-jeddah.html">محامي في جدة</a><a href="lawyer-dammam.html">محامي في الدمام</a><a href="site-directory.html">دليل جميع صفحات الخدمات</a></div></div></section>
  <section class="section" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">ملف أولي منظم</span><h2>ما الذي تجهزه قبل التواصل؟</h2><p>كلما كانت الرسالة الأولى محددة، كان فهم المسار والمتطلبات أسرع. لا ترسل بيانات شديدة الحساسية قبل تحديد قناة الاستلام المناسبة.</p></div><ol class="document-list"><li>اسم المنطقة والمدينة كما يظهران في المستند</li><li>نوع المسألة والنتيجة المطلوبة</li><li>صفة مقدم الطلب والطرف الآخر</li><li>المرحلة الحالية والجهة وأقرب موعد</li><li>المستند الأساسي وتسلسل زمني مختصر</li></ol></div></section>
  <section class="section alt" id="start"><div class="container"><div class="contact-card"><div><span class="eyebrow">بدء طلب من أي منطقة</span><h2>اذكر المنطقة ونوع الخدمة في رسالة واحدة</h2><p>أرسل ملخصًا دون كلمات مرور أو بيانات بنكية أو أصول مستندات.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent("السلام عليكم، أرغب في خدمة قانونية. المنطقة والمدينة: — نوع الطلب ومرحلته: ")}">إرسال الطلب عبر واتساب</a></div></div></section>
  <section class="section" id="faq"><div class="container faq-wrap"><div class="section-head"><span class="eyebrow">أسئلة شائعة</span><h2>أسئلة عن التغطية داخل المملكة</h2></div>${faqs.map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join("")}</div></section></main>`;
  const schema = [
    { "@type": "Service", "@id": `${baseUrl}/${file}#service`, name: "الخدمات القانونية في مناطق السعودية", serviceType: "استقبال وتوجيه طلبات الخدمات والاستشارات القانونية", url: `${baseUrl}/${file}`, provider: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "رُكن الأنظمة القانونية", url: `${baseUrl}/`, telephone: phone }, areaServed: { "@type": "Country", name: "المملكة العربية السعودية" } },
    { "@type": "ItemList", name: "مناطق المملكة العربية السعودية", numberOfItems: regions.length, itemListElement: regions.map(([name], index) => ({ "@type": "ListItem", position: index + 1, name })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "دليل مناطق السعودية", item: `${baseUrl}/${file}` }] },
    { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function aboutPage() {
  const file = "about.html";
  const title = "عن رُكن الأنظمة القانونية | منهج الخدمة والمحتوى";
  const description = "عن رُكن الأنظمة القانونية: تعرّف على نطاق استقبال الطلبات ومنهج إعداد المحتوى والخصوصية والشفافية وكيفية اختيار الخدمة القانونية المناسبة.";
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>عن الموقع</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">وضوح قبل التواصل</span><h1>عن رُكن الأنظمة القانونية<br><span>منهج الخدمة والمحتوى</span></h1><p>موقع إلكتروني عربي أولًا لاستقبال طلبات الخدمات والاستشارات القانونية من الأفراد والمنشآت، وتنظيم المعلومات الأولية قبل تحديد المسار المناسب.</p><div class="hero-actions"><a class="btn primary" href="#method">منهجنا</a><a class="btn secondary" href="saudi-regions-guide.html">نطاق التغطية</a></div></div><aside class="service-hero-aside"><span class="service-badge">الشفافية</span><div class="service-symbol" aria-hidden="true">✓</div><h2>ما الذي نوضحه؟</h2><ul class="service-hero-points"><li>الاستقبال الأولي إلكتروني</li><li>لا توجد نتيجة قانونية مضمونة</li><li>التقييم يعتمد على الوقائع والمستندات</li></ul></aside></div></section><section class="section" id="method"><div class="container"><div class="section-head"><span class="eyebrow">منهج واضح</span><h2>كيف نرتب صفحات الخدمات؟</h2><p>تُبنى الصفحة حول احتياج عملي: نوع المسألة، الصفة، المرحلة، الجهة، المستند والنتيجة المطلوبة، ثم تُربط بالمدينة عندما يكون الموقع ذا صلة فعلية.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>محتوى لخدمة الزائر</h3><p>لا ننشئ صفحة لمجرد تكرار اسم مدينة أو شارع؛ يجب أن تضيف الصفحة مسارًا أو قائمة تجهيز أو حالة مختلفة.</p></article><article class="specialty-card" data-number="02"><h3>مصادر رسمية عند الحاجة</h3><p>المعلومة النظامية القابلة للتغير تحتاج إلى مراجعة المصدر الرسمي قبل الاعتماد عليها في قرار أو إجراء.</p></article><article class="specialty-card" data-number="03"><h3>تحديثات قابلة للقياس</h3><p>نراجع الفهرسة والكلمات والصفحات عبر Search Console وAnalytics، ونقيس طلبات التواصل بدل الاكتفاء بعدد الزيارات.</p></article><article class="specialty-card" data-number="04"><h3>حدود المحتوى العام</h3><p>المحتوى للتوعية والتنظيم ولا يغني عن تقييم الوقائع والمستندات من مختص قبل اتخاذ قرار قانوني.</p></article></div></div></section><section class="section alt"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">الثقة والخصوصية</span><h2>قبل إرسال أي معلومات</h2><p>ابدأ بملخص قصير، ولا ترسل كلمات مرور أو بيانات بنكية أو أصول مستندات أو معلومات شديدة الحساسية في الرسالة الأولى.</p><div class="related-services"><a href="privacy.html">سياسة الخصوصية</a><a href="site-directory.html">دليل الصفحات</a><a href="articles.html">المقالات والإرشادات</a></div></div><ol class="document-list"><li>حدّد نوع الطلب</li><li>اذكر صفتك والمرحلة</li><li>أضف المنطقة والمدينة</li><li>اذكر أقرب موعد</li><li>انتظر تحديد قناة المستندات المناسبة</li></ol></div></section><section class="section"><div class="container"><div class="contact-card"><div><span class="eyebrow">بيانات التواصل</span><h2>تواصل مباشر مع رُكن الأنظمة القانونية</h2><p><a href="tel:${phone}" dir="ltr">${displayPhone}</a> — <a href="mailto:${email}">${email}</a></p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent("السلام عليكم، أرغب في الاستفسار عن خدمة قانونية. ")}">التواصل عبر واتساب</a></div></div></section></main>`;
  const schema = [{ "@type": "AboutPage", "@id": `${baseUrl}/${file}#about`, name: title.split("|")[0].trim(), url: `${baseUrl}/${file}`, about: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "رُكن الأنظمة القانونية" } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "عن الموقع", item: `${baseUrl}/${file}` }] }];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function privacyPage() {
  const file = "privacy.html";
  const title = "سياسة الخصوصية | رُكن الأنظمة القانونية";
  const description = "سياسة الخصوصية في رُكن الأنظمة القانونية توضح بيانات الاستخدام والتواصل وAnalytics والروابط الخارجية وكيفية حماية المعلومات عند بدء طلب قانوني.";
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>سياسة الخصوصية</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">آخر تحديث: 21 أغسطس 2026</span><h1>سياسة الخصوصية<br><span>رُكن الأنظمة القانونية</span></h1><p>توضح هذه السياسة أنواع البيانات التي قد تُجمع عند استخدام الموقع أو التواصل، والغرض منها، والخطوات المناسبة لحماية معلوماتك.</p></div><aside class="service-hero-aside"><span class="service-badge">تنبيه مهم</span><div class="service-symbol" aria-hidden="true">!</div><h2>لا ترسل في البداية</h2><ul class="service-hero-points"><li>كلمات المرور</li><li>البيانات البنكية</li><li>أصول المستندات</li><li>المعلومات شديدة الحساسية</li></ul></aside></div></section><section class="section"><div class="container policy-content"><h2>بيانات الاستخدام</h2><p>يستخدم الموقع Google Analytics لقياس الزيارات والصفحات ومصادر الوصول والتفاعل. قد تعتمد هذه الخدمة على ملفات تعريف الارتباط أو معرّفات تقنية وفق إعدادات Google والمتصفح.</p><h2>بيانات التواصل</h2><p>عند الاتصال أو إرسال بريد أو فتح واتساب، تُرسل المعلومات التي تختار تقديمها إلى قناة التواصل المحددة. استخدم رسالة أولية مختصرة، ولا ترسل معلومات لا يحتاجها التقييم الأولي.</p><h2>الغرض من المعالجة</h2><p>تُستخدم المعلومات لفهم الطلب والرد عليه وتحسين الموقع وقياس جودة صفحات الخدمات. لا يبيع الموقع بيانات التواصل للغير.</p><h2>الخدمات والروابط الخارجية</h2><p>واتساب والبريد وGoogle Analytics خدمات مستقلة لها سياساتها الخاصة. عند الانتقال إليها يخضع استخدامك لإعداداتك وسياسة الجهة المقدمة للخدمة.</p><h2>الاحتفاظ والحماية</h2><p>يُحتفظ بالمعلومات بالقدر اللازم للرد وإدارة الطلب والالتزامات النظامية، مع اتخاذ تدابير معقولة لحمايتها. لا توجد وسيلة إلكترونية تضمن أمانًا مطلقًا.</p><h2>الاستفسار أو طلب التصحيح</h2><p>يمكن التواصل عبر <a href="mailto:${email}">${email}</a> أو <a href="tel:${phone}" dir="ltr">${displayPhone}</a> للاستفسار عن بيانات التواصل أو طلب تصحيحها أو حذفها عندما يكون ذلك ممكنًا نظامًا.</p><div class="related-services"><a href="about.html">عن الموقع ومنهج المحتوى</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a><a href="/">العودة للرئيسية</a></div></div></section></main>`;
  writeFileSync(resolve(root, file), shell({ file, title, description, robots: "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1", body }), "utf8");
}

function notFoundPage() {
  const file = "404.html";
  const title = "الصفحة غير موجودة | رُكن الأنظمة القانونية";
  const description = "الصفحة غير موجودة في موقع رُكن الأنظمة القانونية. استخدم دليل الصفحات أو دليل مناطق السعودية للوصول إلى الخدمة القانونية المناسبة.";
  const body = `<main><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">رمز الخطأ 404</span><h1>الصفحة غير موجودة<br><span>اختر مسارًا صحيحًا</span></h1><p>قد يكون الرابط قديمًا أو غير مكتمل. استخدم دليل الصفحات للوصول إلى الخدمة أو المدينة المناسبة.</p><div class="hero-actions"><a class="btn primary" href="/">الصفحة الرئيسية</a><a class="btn secondary" href="site-directory.html">دليل جميع الصفحات</a></div></div><aside class="service-hero-aside"><span class="service-badge">روابط مفيدة</span><div class="service-symbol" aria-hidden="true">404</div><h2>ابدأ من هنا</h2><ul class="service-hero-points"><li><a href="saudi-regions-guide.html">مناطق السعودية</a></li><li><a href="articles.html">المقالات القانونية</a></li><li><a href="about.html">عن الموقع</a></li></ul></aside></div></section></main>`;
  writeFileSync(resolve(root, file), shell({ file, title, description, robots: "noindex,follow", body }), "utf8");
}

function pageTitle(html, fallback) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s*\|\s*رُ?كن الأنظمة(?: القانونية)?\s*$/i, "").trim() || fallback;
}

function isNoindex(html) {
  return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
}

function categoryFor(file) {
  if (/tabuk|duba|umluj|tayma|haql|al-wajh|al-bad/.test(file)) return "منطقة تبوك";
  if (/riyadh/.test(file)) return "الرياض";
  if (/jeddah/.test(file)) return "جدة";
  if (/dammam/.test(file)) return "الدمام";
  if (/guide|articles/.test(file)) return "المقالات والأدلة";
  return "الصفحات العامة";
}

function directoryPage() {
  const file = "site-directory.html";
  const title = "دليل صفحات رُكن الأنظمة القانونية | الخدمات والمدن";
  const description = "دليل صفحات رُكن الأنظمة القانونية يجمع روابط الخدمات والمدن والأحياء والأدلة العملية في تبوك والرياض وجدة والدمام ومناطق السعودية.";
  const excluded = new Set([file, "404.html", "privacy.html", "googlebffd6cc2130f2272.html"]);
  const groups = new Map();
  for (const pageFile of readdirSync(root).filter((name) => name.endsWith(".html") && !excluded.has(name)).sort()) {
    const html = readFileSync(resolve(root, pageFile), "utf8");
    if (isNoindex(html)) continue;
    const category = categoryFor(pageFile);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push({ file: pageFile, title: pageTitle(html, pageFile) });
  }
  const order = ["الصفحات العامة", "منطقة تبوك", "الرياض", "جدة", "الدمام", "المقالات والأدلة"];
  const sections = order.filter((key) => groups.has(key)).map((key) => `<section class="directory-group" data-location-group><h2>${key}</h2><div class="related-services directory-links">${groups.get(key).map((item) => `<a data-location-item href="${item.file}">${escapeHtml(item.title)}</a>`).join("")}</div></section>`).join("");
  const total = [...groups.values()].reduce((sum, items) => sum + items.length, 0);
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>دليل الصفحات</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">روابط قابلة للتصفح</span><h1>دليل صفحات رُكن الأنظمة القانونية<br><span>الخدمات والمدن والأدلة</span></h1><p>دليل بشري يساعد الزائر ومحركات البحث على الوصول إلى الصفحات المهمة ضمن بنية واضحة، بدل الاعتماد على صفحات معزولة أو روابط غير مباشرة.</p><div class="hero-actions"><a class="btn primary" href="#directory">تصفح الدليل</a><a class="btn secondary" href="saudi-regions-guide.html">مناطق السعودية</a></div><div class="trust-row"><div><b>${total} رابطًا</b><span>مفهرسًا في الدليل</span></div><div><b>4 مدن</b><span>بأدلة موسعة</span></div><div><b>13 منطقة</b><span>في الدليل الوطني</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">بحث داخل الدليل</span><div class="service-symbol" aria-hidden="true">⌕</div><label for="locationDirectorySearch">اكتب اسم الخدمة أو المدينة</label><input id="locationDirectorySearch" class="directory-search" data-directory-type="pages" type="search" placeholder="مثال: عقود، تبوك، الرياض"><p id="locationDirectoryCount">${total} صفحة ظاهرة</p></aside></div></section><section class="section" id="directory"><div class="container directory-page">${sections}<p id="locationDirectoryEmpty" class="coverage-disclaimer" hidden>لا توجد صفحة مطابقة. جرّب كلمة أقصر أو انتقل إلى دليل مناطق السعودية.</p></div></section></main>`;
  const schema = [{ "@type": "CollectionPage", "@id": `${baseUrl}/${file}#directory`, name: title.split("|")[0].trim(), description, url: `${baseUrl}/${file}`, isPartOf: { "@id": `${baseUrl}/#website` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "دليل الصفحات", item: `${baseUrl}/${file}` }] }];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function sitewideTrustBlock(language) {
  if (language === "en") {
    return `<!-- sitewide-trust:start --><div class="container footer-trust-links" aria-label="Trust and policy links"><a href="about.html">About and content method</a><a href="saudi-regions-guide.html">Saudi coverage</a><a href="site-directory.html">All pages</a><a href="privacy.html">Privacy</a></div><!-- sitewide-trust:end -->`;
  }
  return `<!-- sitewide-trust:start --><div class="container footer-trust-links" aria-label="روابط الثقة والسياسات"><a href="about.html">عن الموقع ومنهج المحتوى</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a><a href="site-directory.html">دليل جميع الصفحات</a><a href="privacy.html">سياسة الخصوصية</a></div><!-- sitewide-trust:end -->`;
}

function enhanceHtml(file) {
  const path = resolve(root, file);
  let html = readFileSync(path, "utf8");
  const original = html;
  const language = html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1]?.toLowerCase().startsWith("en") ? "en" : "ar";
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]?.trim();

  html = html
    .replace(/href="styles(?:-[a-z0-9]+)?\.css(?:\?v=[^"]*)?"/gi, `href="${stylesheetFile}"`)
    .replace(/src="script\.js(?:\?v=[^"]*)?"/gi, `src="script.js?v=${assetVersion}"`);

  const fonts = fontLinks();
  if (/<!-- site-fonts:start -->[\s\S]*?<!-- site-fonts:end -->/i.test(html)) {
    html = html.replace(/<!-- site-fonts:start -->[\s\S]*?<!-- site-fonts:end -->/i, fonts);
  } else {
    html = html.replace(/(<link\s+rel="stylesheet"\s+href="styles(?:-[a-z0-9]+)?\.css[^"]*"\s*\/?>)/i, `${fonts}\n  $1`);
  }

  const contrast = accessibilityOverrides();
  if (/<!-- accessibility-contrast:start -->[\s\S]*?<!-- accessibility-contrast:end -->/i.test(html)) {
    html = html.replace(/<!-- accessibility-contrast:start -->[\s\S]*?<!-- accessibility-contrast:end -->/i, contrast);
  } else {
    html = html.replace(/(<link\s+rel="stylesheet"\s+href="styles(?:-[a-z0-9]+)?\.css[^"]*"\s*\/?>)/i, `$1\n  ${contrast}`);
  }

  if (title && description && canonical) {
    if (/<meta\s+name="author"/i.test(html)) {
      html = html.replace(/<meta\s+name="author"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="author" content="رُكن الأنظمة القانونية">`);
    } else {
      html = html.replace(/(<meta\s+name="description"\s+content="[^"]+"\s*\/?\s*>)/i, `$1\n  <meta name="author" content="رُكن الأنظمة القانونية">`);
    }
    const schema = `<script type="application/ld+json" data-sitewide-schema>${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: language === "en" ? "en" : "ar-SA", isPartOf: { "@id": `${baseUrl}/#website` }, publisher: { "@id": `${baseUrl}/#organization` }, dateModified: releaseDate })}</script>`;
    if (/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/i, schema);
    } else {
      html = html.replace(/<\/head>/i, `  ${schema}\n</head>`);
    }
  }

  const trust = sitewideTrustBlock(language);
  if (/<!-- sitewide-trust:start -->[\s\S]*?<!-- sitewide-trust:end -->/i.test(html)) {
    html = html.replace(/<!-- sitewide-trust:start -->[\s\S]*?<!-- sitewide-trust:end -->/i, trust);
  } else if (/<\/footer>/i.test(html)) {
    html = html.replace(/<\/footer>/i, `${trust}</footer>`);
  } else {
    html = html.replace(/<\/body>/i, `${trust}</body>`);
  }

  if (html !== original) writeFileSync(path, html, "utf8");
}

function canonicalFor(file, html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || (file === "index.html" ? `${baseUrl}/` : `${baseUrl}/${file}`);
}

function updateSitemap() {
  const excluded = new Set(["googlebffd6cc2130f2272.html"]);
  const pages = readdirSync(root).filter((file) => file.endsWith(".html") && !excluded.has(file)).map((file) => ({ file, html: readFileSync(resolve(root, file), "utf8") })).filter(({ html }) => !isNoindex(html));
  pages.sort((a, b) => (a.file === "index.html" ? -1 : b.file === "index.html" ? 1 : a.file.localeCompare(b.file)));
  const entries = pages.map(({ file, html }) => {
    const canonical = canonicalFor(file, html);
    const alternates = file === "index.html" || file === "en.html" ? `\n    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/" />\n    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en.html" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />` : "";
    return `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${releaseDate}</lastmod>${alternates}\n  </url>`;
  });
  writeFileSync(resolve(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`, "utf8");
}

function generate() {
  nationalGuide();
  aboutPage();
  privacyPage();
  notFoundPage();
  directoryPage();

  const htmlFiles = readdirSync(root).filter((file) => file.endsWith(".html") && !file.startsWith("google"));
  for (const file of htmlFiles) enhanceHtml(file);

  // Regenerate once more so the directory includes the final set of indexable pages.
  directoryPage();
  enhanceHtml("site-directory.html");
  updateSitemap();
  writeFileSync(resolve(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`, "utf8");
  console.log(`Generated national SEO pages and enhanced ${htmlFiles.length} public HTML files.`);
}

generate();
