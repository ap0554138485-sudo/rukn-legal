import { readFileSync, readdirSync, writeFileSync as nativeWriteFileSync } from "node:fs";
import { resolve } from "node:path";
import { locations as nationalLocations } from "./generate-national-wave1.mjs";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const releaseDate = "2026-09-07";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const assetVersion = "20260830a";
const scriptVersion = "20260830c";
const stylesheetVersion = "20260907a";
const stylesheetFile = `styles-${assetVersion}.css?v=${stylesheetVersion}`;
const scriptFile = `script-${assetVersion}.js?v=${scriptVersion}`;
const logoFile = "logo-128-20260824.png";
const whatsappMessage = "السلام عليكم، أرغب في طلب خدمة قانونية. نوع المسألة، المدينة، والمرحلة الحالية: ";
const whatsappUrl = `https://wa.me/966506142113?text=${encodeURIComponent(whatsappMessage)}`;
const relatedLinkLimit = 10;

const regionHubs = new Map([
  ["منطقة الرياض", { key: "riyadh-region", label: "منطقة الرياض", file: "legal-services-riyadh.html" }],
  ["منطقة مكة المكرمة", { key: "makkah-region", label: "منطقة مكة المكرمة", file: "makkah-region-legal-services.html" }],
  ["المنطقة الشرقية", { key: "eastern", label: "المنطقة الشرقية", file: "eastern-province-legal-services.html" }],
  ["منطقة تبوك", { key: "tabuk", label: "منطقة تبوك", file: "tabuk-region-lawyers.html" }],
  ["منطقة المدينة المنورة", { key: "medina-region", label: "منطقة المدينة المنورة", file: "medina-region-legal-services.html" }],
  ["منطقة القصيم", { key: "qassim-region", label: "منطقة القصيم", file: "qassim-region-legal-services.html" }],
  ["منطقة عسير", { key: "asir-region", label: "منطقة عسير", file: "asir-region-legal-services.html" }],
  ["منطقة حائل", { key: "hail-region", label: "منطقة حائل", file: "hail-region-legal-services.html" }],
  ["منطقة الحدود الشمالية", { key: "northern-borders-region", label: "منطقة الحدود الشمالية", file: "northern-borders-region-legal-services.html" }],
  ["منطقة جازان", { key: "jazan-region", label: "منطقة جازان", file: "jazan-region-legal-services.html" }],
  ["منطقة نجران", { key: "najran-region", label: "منطقة نجران", file: "najran-region-legal-services.html" }],
  ["منطقة الباحة", { key: "al-baha-region", label: "منطقة الباحة", file: "al-baha-region-legal-services.html" }],
  ["منطقة الجوف", { key: "al-jouf-region", label: "منطقة الجوف", file: "al-jouf-region-legal-services.html" }]
]);

const locationRegions = new Map(nationalLocations.map((location) => [location.key, location.region]));

const officialSources = {
  laws: ["هيئة الخبراء — الأنظمة السعودية", "https://www.boe.gov.sa/ar/Pages/default.aspx"],
  najiz: ["منصة ناجز — الخدمات العدلية", "https://najiz.sa/applications/landing"],
  labor: ["وزارة الموارد البشرية والتنمية الاجتماعية", "https://www.hrsd.gov.sa/"],
  commerce: ["وزارة التجارة", "https://mc.gov.sa/ar/Pages/default.aspx"],
  business: ["المركز السعودي للأعمال", "https://business.sa/"],
  intellectualProperty: ["الهيئة السعودية للملكية الفكرية — العلامات التجارية", "https://www.saip.gov.sa/ar/services/trademarks"],
  tax: ["هيئة الزكاة والضريبة والجمارك", "https://zatca.gov.sa/ar/Pages/default.aspx"],
  municipality: ["منصة بلدي", "https://balady.gov.sa/"],
  arbitration: ["المركز السعودي للتحكيم التجاري", "https://sadr.org/"],
  data: ["الهيئة السعودية للبيانات والذكاء الاصطناعي", "https://sdaia.gov.sa/" ]
};

function writeFileSync(path, data, encoding) {
  const normalizedData = typeof data === "string"
    ? data.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n")
    : data;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      nativeWriteFileSync(path, normalizedData, encoding);
      return;
    } catch (error) {
      if (attempt === 7 || !["UNKNOWN", "EBUSY", "EPERM"].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 75 * (attempt + 1));
    }
  }
}

function pageContactUrl(title, language = "ar") {
  const topic = String(title || "")
    .split("|")[0]
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
  const message = language === "en"
    ? `Hello, I came from the "${topic || "Legal Systems Corner"}" page and would like to request a legal service. Matter type, city, and current stage: `
    : `السلام عليكم، وصلت من صفحة «${topic || "رُكن الأنظمة القانونية"}» وأرغب في طلب خدمة قانونية. نوع المسألة، المدينة، والمرحلة الحالية: `;
  return `https://wa.me/966506142113?text=${encodeURIComponent(message)}`;
}

const regions = [
  ["منطقة الرياض", "الرياض، الخرج، الدرعية، الدوادمي، المجمعة ووادي الدواسر", "legal-services-riyadh.html", "دليل خدمات وأحياء الرياض"],
  ["منطقة مكة المكرمة", "مكة المكرمة، جدة، الطائف، رابغ، القنفذة والليث", "makkah-region-legal-services.html", "دليل منطقة مكة المكرمة"],
  ["المنطقة الشرقية", "الدمام، الخبر، الظهران، الأحساء، الجبيل، القطيف وحفر الباطن", "eastern-province-legal-services.html", "دليل المنطقة الشرقية الكامل"],
  ["منطقة تبوك", "تبوك، ضباء، الوجه، أملج، تيماء، حقل والبدع", "tabuk-region-lawyers.html", "دليل منطقة تبوك ومحافظاتها"],
  ["منطقة المدينة المنورة", "المدينة المنورة، ينبع، العلا، بدر وخيبر", "medina-region-legal-services.html", "دليل منطقة المدينة المنورة"],
  ["منطقة القصيم", "بريدة، عنيزة، الرس، البكيرية والمذنب", "qassim-region-legal-services.html", "دليل منطقة القصيم"],
  ["منطقة عسير", "أبها، خميس مشيط، بيشة، محايل والنماص", "asir-region-legal-services.html", "دليل منطقة عسير"],
  ["منطقة حائل", "حائل، بقعاء، الشنان والغزالة", "hail-region-legal-services.html", "دليل منطقة حائل"],
  ["منطقة الحدود الشمالية", "عرعر، رفحاء، طريف والعويقيلة", "northern-borders-region-legal-services.html", "دليل منطقة الحدود الشمالية"],
  ["منطقة جازان", "جازان، صبيا، أبو عريش، صامطة وبيش", "jazan-region-legal-services.html", "دليل منطقة جازان"],
  ["منطقة نجران", "نجران، شرورة، حبونا وبدر الجنوب", "najran-region-legal-services.html", "دليل منطقة نجران"],
  ["منطقة الباحة", "الباحة، بلجرشي، المندق والمخواة", "al-baha-region-legal-services.html", "دليل منطقة الباحة"],
  ["منطقة الجوف", "سكاكا، القريات، دومة الجندل وطبرجل", "al-jouf-region-legal-services.html", "دليل منطقة الجوف"]
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

function decodeHtml(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function textContent(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": value })}</script>`;
}

function schemaTypeIncludes(node, type) {
  const value = node?.["@type"];
  return value === type || (Array.isArray(value) && value.includes(type));
}

function normalizeStructuredData(html, canonical, file) {
  const region = regionProfileFor(file, html);
  return html.replace(/<script\s+type="application\/ld\+json"(?![^>]*data-sitewide-schema)([^>]*)>([\s\S]*?)<\/script>/gi, (block, attributes, payload) => {
    try {
      const value = JSON.parse(payload);
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (node["@type"] === "مدينة") node["@type"] = "City";
        if (node["@type"] === "محافظة") node["@type"] = "AdministrativeArea";
        if (schemaTypeIncludes(node, "WebPage") && (!node.url || node.url === canonical)) {
          node.author = { "@id": `${baseUrl}/#organization` };
          node.publisher = { "@id": `${baseUrl}/#organization` };
          node.dateModified = releaseDate;
        }
        if (schemaTypeIncludes(node, "Article") && (!node.mainEntityOfPage?.["@id"] || node.mainEntityOfPage["@id"] === `${canonical}#webpage`)) {
          node.author = { "@id": `${baseUrl}/#organization` };
          node.publisher = { "@id": `${baseUrl}/#organization` };
          node.dateModified = releaseDate;
        }
        if (region && /^saudi-guide-w\d+-/i.test(file) && schemaTypeIncludes(node, "BreadcrumbList") && Array.isArray(node.itemListElement)) {
          const regionUrl = `${baseUrl}/${region.file}`;
          if (!node.itemListElement.some((item) => item?.item === regionUrl)) {
            const current = node.itemListElement.at(-1);
            const parents = node.itemListElement.slice(0, -1);
            node.itemListElement = [
              ...parents,
              { "@type": "ListItem", position: parents.length + 1, name: region.label, item: regionUrl },
              { ...current, position: parents.length + 2 }
            ];
          }
        }
        Object.values(node).forEach(visit);
      };
      visit(value);
      return `<script type="application/ld+json"${attributes}>${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`;
    } catch {
      return block;
    }
  });
}

function regionProfileFor(file, html = "") {
  for (const profile of regionHubs.values()) {
    if (file === profile.file) return profile;
  }
  if (/^eastern-/i.test(file)) return regionHubs.get("المنطقة الشرقية");
  const location = nationalLocations.find((item) => file.endsWith(`-${item.key}.html`));
  if (location) return regionHubs.get(location.region) || null;
  for (const [regionName, profile] of regionHubs) {
    if (html.includes(`"name":"${regionName}"`) || html.includes(`• ${regionName}`)) return profile;
  }
  return null;
}

function sourceKeysFor(file, html) {
  const title = pageTitle(html, file);
  const topic = html.match(/data-guide-topic="([^"]+)"/i)?.[1] || "";
  const subject = `${file} ${title} ${topic}`.toLowerCase();
  const keys = ["laws"];
  const add = (...items) => items.forEach((item) => { if (!keys.includes(item)) keys.push(item); });
  if (/labor|work|employee|employment|wage|termination|عمال|موظف|أجور|عمل/.test(subject)) add("labor", "najiz");
  if (/trademark|copyright|patent|intellectual|علامة|ملكية فكرية/.test(subject)) add("intellectualProperty", "commerce");
  if (/company|commercial|commerce|partner|franchise|corporate|supply|شركة|تجار|شريك|امتياز|توريد/.test(subject)) add("commerce", "business");
  if (/arbitration|تحكيم/.test(subject)) add("arbitration", "laws");
  if (/zakat|tax|vat|customs|ضريب|زكاة|جمارك/.test(subject)) add("tax", "laws");
  if (/municipal|balady|بلدي|مخالفة بلدية/.test(subject)) add("municipality", "laws");
  if (/data|privacy|cyber|leak|بيانات|خصوصية|تسرب/.test(subject)) add("data", "laws");
  if (/court|claim|lawsuit|appeal|objection|judgment|execution|criminal|family|divorce|custody|inherit|notary|محكم|دعوى|قض|تنفيذ|اعتراض|استئناف|جنائي|طلاق|حضانة|تركة|توثيق/.test(subject)) add("najiz");
  if (keys.length === 1) add("najiz");
  return keys.slice(0, 3);
}

function officialSourcesBlock(file, html, language) {
  const excluded = new Set(["index.html", "en.html", "404.html", "privacy.html", "about.html", "editorial-policy.html", "official-sources.html", "site-directory.html"]);
  if (language === "en" || isNoindex(html) || excluded.has(file)) return "";
  const currentTitle = pageTitle(html, file).split("|")[0].trim();
  const links = sourceKeysFor(file, html)
    .map((key) => officialSources[key])
    .filter(Boolean)
    .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener external">${escapeHtml(label)}</a>`)
    .join("");
  return `<!-- official-sources:start --><section class="section official-sources-panel" data-official-sources><div class="container source-review-card"><div><span class="eyebrow">تحقق قبل اتخاذ الإجراء</span><h2>مصادر رسمية مرتبطة بـ${escapeHtml(currentTitle)}</h2><p>راجع النص أو الخدمة في مصدرها الرسمي، وتحقق من النسخة النافذة والمهلة قبل الاعتماد عليها. الروابط التالية للمراجعة العامة ولا تعني أن إجراءً واحدًا يناسب كل ملف.</p></div><div class="official-source-links">${links}<a href="official-sources.html">دليل جميع المصادر الرسمية</a><a href="editorial-policy.html">سياسة التحرير والتحديث</a></div></div></section><!-- official-sources:end -->`;
}

function gaTag() {
  return `<!-- site-analytics:start --><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');(()=>{let loaded=false;const load=()=>{if(loaded)return;loaded=true;const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29';document.head.appendChild(script)};['pointerdown','keydown','touchstart','scroll'].forEach(name=>window.addEventListener(name,load,{once:true,passive:true}));window.addEventListener('load',()=>window.setTimeout(load,6000),{once:true})})();</script><!-- site-analytics:end -->`;
}

function searchAppearanceTags() {
  return `<!-- site-search-appearance:start --><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/${logoFile}"><meta name="theme-color" content="#102a29"><meta name="color-scheme" content="light"><meta name="format-detection" content="telephone=no"><!-- site-search-appearance:end -->`;
}

function fontLinks() {
  return `<!-- site-fonts:start --><!-- Fast system fonts; no render-blocking external font request. --><!-- site-fonts:end -->`;
}

function accessibilityOverrides() {
  return `<!-- accessibility-contrast:start --><style>:root{--muted:#536360}.brand span{color:#695f4e}.article-grid article>span{color:#715731}.footer p,.site-footer p{color:rgba(255,255,255,.72)}.footer a{color:rgba(255,255,255,.74)}.copyright{color:rgba(255,255,255,.68)}</style><!-- accessibility-contrast:end -->`;
}

function header() {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">استقبال إلكتروني من جميع مناطق المملكة</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
  <header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية"><div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="notary-services-saudi.html">خدمات الموثق</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="site-directory.html">دليل الصفحات</a><a href="about.html">عن الموقع</a></nav><div class="nav-actions"><a class="header-cta" href="${whatsappUrl}" target="_blank" rel="noopener">واتساب مباشر</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function floatingContactLink(language, title) {
  const isEnglish = language === "en";
  const label = isEnglish ? "WhatsApp" : "واتساب مباشر";
  return `<a class="whatsapp-float whatsapp-float--labelled" href="${pageContactUrl(title, language)}" target="_blank" rel="noopener" aria-label="${label}"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg><span>${label}</span></a>`;
}

function footer(message = "خدمات واستشارات قانونية للأفراد والمنشآت في مختلف مناطق المملكة.") {
  return `<footer class="footer" aria-label="معلومات الموقع"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>${message}</p></div><div><b>أدلة مهمة</b><a href="notary-services-saudi.html">خدمات الموثق والتوثيق</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="official-sources.html">المصادر الرسمية</a><a href="editorial-policy.html">سياسة التحرير</a><a href="articles.html">المقالات والإرشادات</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer>`;
}

function shell({ file, title, description, robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1", body, schema = [] }) {
  const canonical = `${baseUrl}/${file}`;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  ${gaTag()}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${searchAppearanceTags()}
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
  ${floatingContactLink("ar")}
  <script src="${scriptFile}" defer></script>
</body>
</html>`;
}

function nationalGuide() {
  const file = "saudi-regions-guide.html";
  const title = "دليل الخدمات القانونية في مناطق السعودية | رُكن الأنظمة";
  const description = "دليل الخدمات القانونية في مناطق السعودية يوضح اختيار الخدمة وتجهيز الطلب وبدء التواصل إلكترونيًا من المناطق الثلاث عشرة دون ادعاء وجود فروع محلية.";
  const regionCards = regions.map(([name, cities, href, label], index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${name}</h3><p>${cities}.</p><a href="${href}">${label}</a></article>`).join("");
  const serviceCards = services.map(([name, text], index) => `<article class="specialty-card" data-number="${String(index + 1).padStart(2, "0")}"><h3>${name}</h3><p>${text}</p></article>`).join("");
  const waveGuides = readdirSync(root)
    .filter((name) => /^saudi-guide-w\d+-.+\.html$/i.test(name))
    .sort()
    .map((name) => ({ name, title: pageTitle(readFileSync(resolve(root, name), "utf8"), name) }));
  const waveGuideLinks = waveGuides.map((guide) => `<a href="${guide.name}">${escapeHtml(guide.title)}</a>`).join("");
  const faqs = [
    ["هل يستقبل الموقع طلبات من جميع مناطق السعودية؟", "نعم، يمكن بدء الطلب إلكترونيًا من المناطق الثلاث عشرة. ويعتمد تحديد المسار على نوع المسألة والصفة والمرحلة والمستند، ولا يعني ذكر المنطقة وجود فرع فعلي فيها."],
    ["كيف أختار صفحة الخدمة المناسبة؟", "ابدأ بجوهر الطلب: أسرة أو عمل أو تجارة أو تنفيذ أو عقود أو عقار أو قضية جنائية، ثم اختر دليل المدينة المتاح أو أرسل المنطقة ونوع الطلب في رسالة البداية."],
    ["هل تختلف الأنظمة بسبب المدينة؟", "الأنظمة السعودية واحدة، لكن المدينة قد تكون مهمة لتحديد موقع العقار أو المنشأة أو الواقعة أو الجهة والموعد المرتبط بالطلب."],
    ["ما المعلومات المناسبة لأول تواصل؟", "اذكر المنطقة ونوع الطلب وصفتك والمرحلة الحالية وأقرب موعد والمستند الأساسي، وتجنب كلمات المرور والبيانات البنكية والأصول والمعلومات شديدة الحساسية."]
  ];
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>دليل مناطق السعودية</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">تغطية وطنية واضحة</span><h1>دليل الخدمات القانونية في مناطق السعودية<br><span>من المنطقة إلى المسار المناسب</span></h1><p>صفحة وطنية واحدة تساعدك على تحديد نوع الخدمة وتجهيز الطلب والوصول إلى الأدلة المحلية المتاحة، دون إنشاء صفحات متشابهة لكل مدينة أو ادعاء وجود فروع.</p><div class="hero-actions"><a class="btn primary" href="#regions">اختر منطقتك</a><a class="btn secondary" href="#services">اختر نوع الخدمة</a></div><div class="trust-row"><div><b>13 منطقة</b><span>تغطية المملكة</span></div><div><b>8 مسارات</b><span>قانونية رئيسية</span></div><div><b>استقبال إلكتروني</b><span>دون ادعاء فروع</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">دليل السعودية</span><div class="service-symbol" aria-hidden="true">13</div><h2>ابدأ بثلاث معلومات</h2><ul class="service-hero-points"><li>المنطقة والمدينة</li><li>نوع المسألة والصفة</li><li>المرحلة وأقرب موعد</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#regions">المناطق</a><a href="#services">الخدمات</a>${waveGuides.length ? '<a href="#national-guides">الأدلة الوطنية</a>' : ""}<a href="#prepare">تجهيز الطلب</a><a href="#faq">الأسئلة</a></nav></div>
  <section class="section" id="regions"><div class="container"><div class="section-head"><span class="eyebrow">المناطق الإدارية الثلاث عشرة</span><h2>اختر منطقتك ثم حدّد المدينة</h2><p>تساعد المدينة في وصف موقع الطلب، بينما يحدد نوع القضية أو المعاملة الصفحة القانونية الأنسب.</p></div><div class="locality-panels national-region-grid">${regionCards}</div><p class="coverage-disclaimer">التغطية تعني إمكانية بدء الطلب إلكترونيًا، ولا تعني وجود مكتب أو فرع فعلي في كل مدينة أو محافظة.</p></div></section>
  <section class="section alt" id="services"><div class="container"><div class="section-head"><span class="eyebrow">الكلمات مرتبطة بالاحتياج</span><h2>اختر الخدمة بحسب موضوع الطلب</h2><p>تجنب اختيار الصفحة على اسم المدينة فقط؛ الصفحة الأفضل هي التي تطابق الموضوع والمرحلة والمستند.</p></div><div class="specialty-grid">${serviceCards}</div><div class="related-services national-hubs"><a href="lawyer-tabuk.html">محامي في تبوك</a><a href="lawyer-riyadh.html">محامي في الرياض</a><a href="lawyer-jeddah.html">محامي في جدة</a><a href="lawyer-dammam.html">محامي في الدمام</a><a href="site-directory.html">دليل جميع صفحات الخدمات</a></div></div></section>
  ${waveGuides.length ? `<section class="section" id="national-guides"><div class="container"><div class="section-head"><span class="eyebrow">${waveGuides.length} موضوعًا وطنيًا مختلفًا</span><h2>أدلة عملية حسب المشكلة والمستند والمرحلة</h2><p>كل رابط يعالج مسألة قانونية مستقلة؛ اختر المشكلة المطابقة لطلبك، ولا تعتمد على اسم المدينة وحده.</p></div><div class="related-services directory-links">${waveGuideLinks}</div></div></section>` : ""}
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

function editorialPolicyPage() {
  const file = "editorial-policy.html";
  const title = "سياسة تحرير المحتوى القانوني | رُكن الأنظمة";
  const description = "سياسة تحرير المحتوى القانوني في رُكن الأنظمة: هدف المحتوى، طريقة الإعداد والتحديث، استخدام القوالب والأتمتة، مراجعة المصادر الرسمية، وتصحيح الأخطاء.";
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="about.html">عن الموقع</a><span aria-hidden="true">/</span><span>سياسة التحرير</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">منهج معلن وقابل للمراجعة</span><h1>سياسة تحرير المحتوى القانوني<br><span>من يكتب؟ كيف؟ ولماذا؟</span></h1><p>تنشر رُكن الأنظمة القانونية محتوى عامًا يساعد القارئ على فهم نوع المسألة وترتيب الوقائع والمستندات والأسئلة قبل طلب تقييم مهني. لا يُقدَّم المحتوى بوصفه فتوى أو رأيًا قانونيًا خاصًا بواقعة بعينها.</p></div><aside class="service-hero-aside"><span class="service-badge">آخر مراجعة</span><div class="service-symbol" aria-hidden="true">✓</div><h2>7 سبتمبر 2026</h2><ul class="service-hero-points"><li>مصادر رسمية</li><li>تاريخ تحديث حقيقي</li><li>تصحيح معلن</li></ul></aside></div></section><section class="section"><div class="container policy-content"><h2>المسؤول عن النشر</h2><p>تتولى رُكن الأنظمة القانونية إدارة الموقع ونشر محتواه، وتظهر وسيلة التواصل في كل صفحة. لا ننسب مراجعة قانونية إلى محامٍ أو خبير بالاسم ما لم تُنجز تلك المراجعة ويُذكر صاحبها وصفته بوضوح.</p><h2>كيف يُعد المحتوى؟</h2><p>تُبنى الصفحة من سؤال عملي أو مرحلة أو مستند يحتاجه الزائر. قد تُستخدم قوالب وأدوات برمجية لتنظيم البنية والروابط والبيانات الوصفية وفحوص التشابه، لكن لا يجوز أن تكون المدينة وحدها هي القيمة المختلفة بين صفحتين. يجب أن تتناول كل صفحة مشكلة أو قرارًا أو وثيقة أو مرحلة مستقلة.</p><h2>المصادر والتحقق</h2><p>عند ذكر نظام أو خدمة أو جهة أو مهلة قابلة للتغير، يكون المرجع الأول هو المصدر الحكومي أو الجهة الرسمية المختصة. وعلى القارئ التحقق من النص النافذ وحالة الخدمة وقت اتخاذ الإجراء؛ فالصفحة قد تشرح طريقة تنظيم الملف ولا تنقل جميع الاستثناءات النظامية.</p><h2>التحديث والتواريخ</h2><p>لا نغيّر تاريخ التحديث لمجرد إظهار الصفحة حديثة. يُحدّث التاريخ عند تغيير المحتوى أو المراجع أو البنية التي تساعد المستخدم ومحركات البحث على فهم الصفحة. تُراجع الروابط الرسمية والصفحات المحورية دوريًا.</p><h2>التصحيح والاستجابة</h2><p>إذا وجدت خطأً واقعيًا أو رابطًا رسميًا متوقفًا، أرسل عنوان الصفحة ووصف الملاحظة إلى <a href="mailto:${email}">${email}</a>. نراجع الملاحظة ونصحح المحتوى أو نضيف توضيحًا عند الحاجة.</p><h2>حدود التغطية الجغرافية</h2><p>ذكر مدينة أو منطقة يصف صلة الطلب بالموقع ولا يعني وجود فرع فعلي. الاستقبال الأولي إلكتروني من مناطق المملكة، ويجب التحقق من مقدم الخدمة والترخيص ونطاق العمل قبل التعاقد.</p><div class="related-services"><a href="official-sources.html">دليل المصادر الرسمية</a><a href="about.html">عن الموقع ومنهج الخدمة</a><a href="privacy.html">سياسة الخصوصية</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a></div></div></section></main>`;
  const schema = [{ "@type": "WebPage", "@id": `${baseUrl}/${file}#policy`, name: title.split("|")[0].trim(), description, url: `${baseUrl}/${file}`, dateModified: releaseDate, publisher: { "@id": `${baseUrl}/#organization` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "عن الموقع", item: `${baseUrl}/about.html` }, { "@type": "ListItem", position: 3, name: "سياسة التحرير", item: `${baseUrl}/${file}` }] }];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function officialSourcesPage() {
  const file = "official-sources.html";
  const title = "المصادر القانونية والرسمية | رُكن الأنظمة";
  const description = "المصادر القانونية والرسمية للتحقق من الأنظمة والخدمات العدلية والعمالية والتجارية والضريبية والملكية الفكرية والبلدية في السعودية.";
  const sourceCards = [
    [officialSources.laws, "للبحث في الأنظمة واللوائح السعودية ومتابعة النصوص الرسمية."],
    [officialSources.najiz, "للخدمات العدلية الإلكترونية ومسارات القضاء والتنفيذ والتوثيق."],
    [officialSources.labor, "للأنظمة والخدمات والأدلة المرتبطة بعلاقات العمل والتسوية الودية."],
    [officialSources.commerce, "للأنظمة والخدمات والأدلة المرتبطة بالتجارة والمنشآت."],
    [officialSources.business, "لبدء ومعرفة إجراءات الأعمال والخدمات الحكومية المجمعة للمنشآت."],
    [officialSources.intellectualProperty, "للخدمات والأدلة المرتبطة بالعلامات وحقوق الملكية الفكرية."],
    [officialSources.tax, "للزكاة والضرائب والجمارك والأدلة والخدمات المرتبطة بها."],
    [officialSources.municipality, "للخدمات والتراخيص والمخالفات البلدية."],
    [officialSources.arbitration, "لخدمات وقواعد التحكيم المؤسسي التجاري."],
    [officialSources.data, "للمراجع الرسمية المرتبطة بالبيانات والحوكمة الرقمية."]
  ].map(([[label, href], copy], index) => `<article class="source-card" data-number="${String(index + 1).padStart(2, "0")}"><h2><a href="${href}" target="_blank" rel="noopener external">${escapeHtml(label)}</a></h2><p>${escapeHtml(copy)}</p><span>رابط خارجي رسمي أو مؤسسي</span></article>`).join("");
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>المصادر الرسمية</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">ابدأ من الجهة المختصة</span><h1>المصادر القانونية والرسمية<br><span>في المملكة العربية السعودية</span></h1><p>استخدم هذا الدليل للتحقق من النصوص والخدمات في مصدرها. لا تعتمد على ملخص منشور عندما تحتاج نسخة نافذة أو مهلة أو متطلبًا يتغير بحسب نوع الطلب.</p><div class="hero-actions"><a class="btn primary" href="#sources">عرض المصادر</a><a class="btn secondary" href="editorial-policy.html">سياسة التحرير</a></div></div><aside class="service-hero-aside"><span class="service-badge">طريقة الاستخدام</span><div class="service-symbol" aria-hidden="true">↗</div><h2>تحقق من ثلاثة أمور</h2><ul class="service-hero-points"><li>اسم الجهة المختصة</li><li>النسخة أو الخدمة الحالية</li><li>تاريخ النفاذ أو المهلة</li></ul></aside></div></section><section class="section" id="sources"><div class="container"><div class="section-head"><span class="eyebrow">روابط تحقق مباشرة</span><h2>جهات ومصادر بحسب نوع المسألة</h2><p>كل رابط يفتح موقع الجهة في نافذة جديدة. قد تتغير مسارات الخدمات؛ استخدم بحث الجهة إذا تغير الرابط الداخلي.</p></div><div class="source-grid">${sourceCards}</div></div></section><section class="section alt"><div class="container policy-content"><h2>كيف تستخدم المصدر؟</h2><ol><li>طابق اسم النظام أو الخدمة مع نوع طلبك وصفة الأطراف.</li><li>تحقق من تاريخ النص والقرارات أو التحديثات اللاحقة.</li><li>احفظ رابط الصفحة أو رقم الوثيقة وتاريخ الاطلاع ضمن ملفك.</li><li>لا تستنتج المهلة أو الاختصاص من عنوان مختصر؛ راجع النص والوقائع.</li></ol><div class="related-services"><a href="editorial-policy.html">سياسة تحرير المحتوى</a><a href="articles.html">المقالات والإرشادات</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a></div></div></section></main>`;
  const schema = [{ "@type": "CollectionPage", "@id": `${baseUrl}/${file}#sources`, name: title.split("|")[0].trim(), description, url: `${baseUrl}/${file}`, dateModified: releaseDate, publisher: { "@id": `${baseUrl}/#organization` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "المصادر الرسمية", item: `${baseUrl}/${file}` }] }];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function privacyPage() {
  const file = "privacy.html";
  const title = "سياسة الخصوصية | رُكن الأنظمة القانونية";
  const description = "سياسة الخصوصية في رُكن الأنظمة القانونية توضح بيانات الاستخدام والتواصل وAnalytics والروابط الخارجية وكيفية حماية المعلومات عند بدء طلب قانوني.";
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>سياسة الخصوصية</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">آخر تحديث: 30 أغسطس 2026</span><h1>سياسة الخصوصية<br><span>رُكن الأنظمة القانونية</span></h1><p>توضح هذه السياسة أنواع البيانات التي قد تُجمع عند استخدام الموقع أو التواصل، والغرض منها، والخطوات المناسبة لحماية معلوماتك.</p></div><aside class="service-hero-aside"><span class="service-badge">تنبيه مهم</span><div class="service-symbol" aria-hidden="true">!</div><h2>لا ترسل في البداية</h2><ul class="service-hero-points"><li>كلمات المرور</li><li>البيانات البنكية</li><li>أصول المستندات</li><li>المعلومات شديدة الحساسية</li></ul></aside></div></section><section class="section"><div class="container policy-content"><h2>بيانات الاستخدام</h2><p>يستخدم الموقع Google Analytics لقياس الزيارات والصفحات ومصادر الوصول والتفاعل. قد تعتمد هذه الخدمة على ملفات تعريف الارتباط أو معرّفات تقنية وفق إعدادات Google والمتصفح.</p><h2>بيانات التواصل</h2><p>عند الاتصال أو إرسال بريد أو فتح واتساب، تُرسل المعلومات التي تختار تقديمها إلى قناة التواصل المحددة. استخدم رسالة أولية مختصرة، ولا ترسل معلومات لا يحتاجها التقييم الأولي.</p><h2>الغرض من المعالجة</h2><p>تُستخدم المعلومات لفهم الطلب والرد عليه وتحسين الموقع وقياس جودة صفحات الخدمات. لا يبيع الموقع بيانات التواصل للغير.</p><h2>الخدمات والروابط الخارجية</h2><p>واتساب والبريد وGoogle Analytics خدمات مستقلة لها سياساتها الخاصة. عند الانتقال إليها يخضع استخدامك لإعداداتك وسياسة الجهة المقدمة للخدمة.</p><h2>الاحتفاظ والحماية</h2><p>يُحتفظ بالمعلومات بالقدر اللازم للرد وإدارة الطلب والالتزامات النظامية، مع اتخاذ تدابير معقولة لحمايتها. لا توجد وسيلة إلكترونية تضمن أمانًا مطلقًا.</p><h2>الاستفسار أو طلب التصحيح</h2><p>يمكن التواصل عبر <a href="mailto:${email}">${email}</a> أو <a href="tel:${phone}" dir="ltr">${displayPhone}</a> للاستفسار عن بيانات التواصل أو طلب تصحيحها أو حذفها عندما يكون ذلك ممكنًا نظامًا.</p><div class="related-services"><a href="about.html">عن الموقع ومنهج المحتوى</a><a href="saudi-regions-guide.html">دليل مناطق السعودية</a><a href="/">العودة للرئيسية</a></div></div></section></main>`;
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
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  return title.replace(/\s*\|\s*رُ?كن الأنظمة(?: القانونية)?\s*$/i, "").trim() || fallback;
}

function isNoindex(html) {
  return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
}

function categoryFor(file) {
  if (/^eastern-/.test(file)) return "المنطقة الشرقية";
  if (/tabuk|duba|umluj|tayma|haql|al-wajh|al-bad/.test(file)) return "منطقة تبوك";
  if (/riyadh/.test(file)) return "الرياض";
  if (/jeddah/.test(file)) return "جدة";
  if (/dammam/.test(file)) return "الدمام";
  if (/notary|notarization/.test(file)) return "خدمات التوثيق";
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
  const order = ["الصفحات العامة", "خدمات التوثيق", "منطقة تبوك", "الرياض", "جدة", "المنطقة الشرقية", "الدمام", "المقالات والأدلة"];
  const sections = order.filter((key) => groups.has(key)).map((key) => `<section class="directory-group" data-location-group><h2>${key}</h2><div class="related-services directory-links">${groups.get(key).map((item) => `<a data-location-item href="${item.file}">${escapeHtml(item.title)}</a>`).join("")}</div></section>`).join("");
  const total = [...groups.values()].reduce((sum, items) => sum + items.length, 0);
  const body = `<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>دليل الصفحات</span></div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">روابط قابلة للتصفح</span><h1>دليل صفحات رُكن الأنظمة القانونية<br><span>الخدمات والمدن والأدلة</span></h1><p>دليل بشري يساعد الزائر ومحركات البحث على الوصول إلى الصفحات المهمة ضمن بنية واضحة، بدل الاعتماد على صفحات معزولة أو روابط غير مباشرة.</p><div class="hero-actions"><a class="btn primary" href="#directory">تصفح الدليل</a><a class="btn secondary" href="saudi-regions-guide.html">مناطق السعودية</a></div><div class="trust-row"><div><b>${total} رابطًا</b><span>مفهرسًا في الدليل</span></div><div><b>4 مدن</b><span>بأدلة موسعة</span></div><div><b>13 منطقة</b><span>في الدليل الوطني</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">بحث داخل الدليل</span><div class="service-symbol" aria-hidden="true">⌕</div><label for="locationDirectorySearch">اكتب اسم الخدمة أو المدينة</label><input id="locationDirectorySearch" class="directory-search" data-directory-type="pages" type="search" placeholder="مثال: عقود، تبوك، الرياض"><p id="locationDirectoryCount">${total} صفحة ظاهرة</p></aside></div></section><section class="section" id="directory"><div class="container directory-page">${sections}<p id="locationDirectoryEmpty" class="coverage-disclaimer" hidden>لا توجد صفحة مطابقة. جرّب كلمة أقصر أو انتقل إلى دليل مناطق السعودية.</p></div></section></main>`;
  const schema = [{ "@type": "CollectionPage", "@id": `${baseUrl}/${file}#directory`, name: title.split("|")[0].trim(), description, url: `${baseUrl}/${file}`, isPartOf: { "@id": `${baseUrl}/#website` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "دليل الصفحات", item: `${baseUrl}/${file}` }] }];
  writeFileSync(resolve(root, file), shell({ file, title, description, body, schema }), "utf8");
}

function sitewideTrustBlock(language) {
  if (language === "en") {
    return `<!-- sitewide-trust:start --><div class="container footer-trust-links" aria-label="Trust and policy links"><a href="/" hreflang="ar" lang="ar">العربية</a><a href="notary-services-saudi.html">Notary guides</a><a href="about.html">About</a><a href="editorial-policy.html">Editorial policy</a><a href="official-sources.html">Official sources</a><a href="saudi-regions-guide.html">Saudi coverage</a><a href="privacy.html">Privacy</a></div><!-- sitewide-trust:end -->`;
  }
  const regionLinks = regions.map(([name, , href]) => `<a href="${href}">${name.replace(/^منطقة\s+/, "")}</a>`).join("");
  return `<!-- sitewide-trust:start --><div class="container footer-trust-links" aria-label="روابط الثقة والسياسات"><a href="en.html" hreflang="en" lang="en">English</a><a href="notary-services-saudi.html">دليل خدمات الموثق</a><a href="about.html">عن الموقع</a><a href="editorial-policy.html">سياسة التحرير</a><a href="official-sources.html">المصادر الرسمية</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="privacy.html">سياسة الخصوصية</a></div><nav class="container footer-region-directory" aria-label="مناطق السعودية"><strong>انتقل مباشرة إلى منطقتك</strong><div>${regionLinks}</div></nav><!-- sitewide-trust:end -->`;
}

function contentAccountabilityBlock(language) {
  if (language === "en") {
    return `<!-- content-accountability:start --><aside class="content-accountability" data-content-accountability aria-label="Content information"><div class="container content-accountability-inner"><div><strong>Published and maintained by Legal Systems Corner</strong><span>General information to help organize an initial request; it does not replace a professional review of the facts and documents.</span></div><div class="content-accountability-meta"><time datetime="${releaseDate}">Content updated 7 September 2026</time><a href="editorial-policy.html">Editorial policy</a><a href="official-sources.html">Official sources</a></div></div></aside><!-- content-accountability:end -->`;
  }
  return `<!-- content-accountability:start --><aside class="content-accountability" data-content-accountability aria-label="معلومات المحتوى"><div class="container content-accountability-inner"><div><strong>النشر والتحديث: رُكن الأنظمة القانونية</strong><span>محتوى عام لتنظيم الطلب الأولي، ولا يغني عن تقييم الوقائع والمستندات من مختص.</span></div><div class="content-accountability-meta"><time datetime="${releaseDate}">تحديث المحتوى: 7 سبتمبر 2026</time><a href="editorial-policy.html">سياسة التحرير</a><a href="official-sources.html">المصادر الرسمية</a></div></div></aside><!-- content-accountability:end -->`;
}

function conversionPanelBlock(language, title) {
  const contactUrl = pageContactUrl(title, language);
  if (language === "en") {
    return `<!-- conversion-panel:start --><section class="conversion-panel" data-conversion-panel aria-labelledby="sitewide-contact-title"><div class="container conversion-panel-card"><div class="conversion-panel-copy"><span class="eyebrow">Direct contact — no account required</span><h2 id="sitewide-contact-title">Start with three short details</h2><p>Send the matter type, city, and current stage. The page topic is included automatically so your request starts in the right context.</p><ul class="conversion-facts" aria-label="Contact information"><li>Electronic initial intake</li><li>WhatsApp or phone</li><li>No guaranteed legal outcome</li></ul></div><div class="conversion-panel-actions"><a class="primary-btn conversion-whatsapp" href="${contactUrl}" target="_blank" rel="noopener">Contact on WhatsApp</a><a class="secondary-btn conversion-call" href="tel:${phone}">Call ${displayPhone}</a><a class="conversion-method" href="about.html">How requests are handled</a></div></div></section><!-- conversion-panel:end -->`;
  }
  return `<!-- conversion-panel:start --><section class="conversion-panel" data-conversion-panel aria-labelledby="sitewide-contact-title"><div class="container conversion-panel-card"><div class="conversion-panel-copy"><span class="eyebrow">تواصل مباشر بلا تسجيل</span><h2 id="sitewide-contact-title">ابدأ بملخص من ثلاث معلومات</h2><p>أرسل نوع المسألة، المدينة، والمرحلة الحالية. سيُضاف موضوع الصفحة تلقائيًا لبدء الطلب في سياقه الصحيح.</p><ul class="conversion-facts" aria-label="معلومات التواصل"><li>استقبال أولي إلكتروني</li><li>واتساب أو اتصال مباشر</li><li>لا توجد نتيجة قانونية مضمونة</li></ul></div><div class="conversion-panel-actions"><a class="primary-btn conversion-whatsapp" href="${contactUrl}" target="_blank" rel="noopener">ابدأ عبر واتساب</a><a class="secondary-btn conversion-call" href="tel:${phone}" dir="ltr">اتصل ${displayPhone}</a><a class="conversion-method" href="about.html">كيف نتعامل مع الطلب؟</a></div></div></section><!-- conversion-panel:end -->`;
}

function breadcrumbSchema(file, html, canonical, language) {
  const htmlWithoutSitewideSchema = html.replace(/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/i, "");
  if (file === "index.html" || file === "en.html" || isNoindex(html) || /"BreadcrumbList"/i.test(htmlWithoutSitewideSchema)) return null;
  const breadcrumbHtml = html.match(/<div[^>]*class="[^"]*\bbreadcrumb\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
  if (!breadcrumbHtml) return null;
  const labels = [...breadcrumbHtml.matchAll(/<span(?:\s[^>]*)?>([\s\S]*?)<\/span>/gi)]
    .map((match) => textContent(match[1]))
    .filter((label) => label && label !== "/");
  const currentLabel = labels.at(-1);
  if (!currentLabel) return null;
  const homeLabel = language === "en" ? "Home" : "الرئيسية";
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: currentLabel, item: canonical }
    ]
  };
}

function locationProfile(file) {
  const hub = [...regionHubs.values()].find((profile) => profile.file === file);
  if (hub) return { key: hub.key, label: hub.label, hubFile: hub.file };
  if (/^eastern-/i.test(file)) return { key: "eastern", label: "المنطقة الشرقية" };
  if (/riyadh/i.test(file)) return { key: "riyadh", label: "الرياض" };
  if (/dammam/i.test(file)) return { key: "dammam", label: "الدمام" };
  if (/jeddah/i.test(file)) return { key: "jeddah", label: "جدة" };
  if (/tabuk|duba|umluj|tayma|haql|al-wajh|al-bad/i.test(file)) return { key: "tabuk", label: "منطقة تبوك" };
  const regional = regionProfileFor(file);
  if (regional) return { key: regional.key, label: regional.label, hubFile: regional.file };
  return { key: "national", label: "السعودية" };
}

function isNotaryPage(file, html) {
  return /notary|notarization/i.test(file) || /<meta\s+name="page-family"\s+content="notary-/i.test(html);
}

function clusterFor(file, html) {
  const location = locationProfile(file);
  return `${isNotaryPage(file, html) ? "notary" : "legal"}-${location.key}`;
}

function legalIntentCards(locationKey) {
  const cards = {
    eastern: [
      ["دليل المنطقة الشرقية", "eastern-province-legal-services.html", "اختر المدينة أو المحافظة ثم المسار القانوني الأقرب لمرحلة الطلب."],
      ["مراجعة عقد قبل التوقيع", "eastern-dammam-contract-risk-review.html", "رتّب البنود والضمانات والإنهاء قبل إنشاء التزام جديد."],
      ["مراجعة طلب تنفيذ", "eastern-khobar-enforcement-application.html", "طابق السند والرصيد وبيانات الأطراف قبل تقديم الطلب."],
      ["تنظيم نزاع تجاري", "eastern-jubail-supplier-dispute.html", "افصل التوريد والجودة والتأخير والدفعات في ملف واضح."]
    ],
    tabuk: [
      ["أفضل محامي في تبوك: معايير الاختيار", "lawyer-tabuk.html", "قارن التخصص والترخيص ونطاق العمل قبل اختيار المحامي المناسب لنوع القضية."],
      ["محامي قضايا مخدرات في تبوك", "drug-cases-lawyer-tabuk.html", "ابدأ من الصفة ومرحلة الضبط أو التحقيق أو المحاكمة وأقرب موعد."],
      ["محامي عقود في تبوك", "contracts-lawyer-tabuk.html", "لفحص الالتزامات والدفعات والإنهاء والضمانات قبل التوقيع أو عند النزاع."],
      ["محامي تنفيذ في تبوك", "execution-lawyer-tabuk.html", "لتحديد السند وصفة طالب التنفيذ أو المنفذ ضده والإجراء الأخير."],
      ["استشارة قانونية في تبوك", "legal-consultation-tabuk.html", "لفهم الصفة والمرحلة والخيارات قبل رفع الدعوى أو الرد عليها."],
      ["توكيل محامي ومتابعة القضية", "appoint-lawyer-tabuk.html", "لتحديد نطاق الوكالة والتمثيل والمتابعة والمواعيد المهمة."]
    ],
    dammam: [
      ["استشارة قانونية قبل اتخاذ الإجراء", "legal-consultation-dammam.html", "لفهم الموقف والمستند والجهة والمدة قبل بدء الإجراء."],
      ["توكيل محامي ومتابعة القضية", "lawyer-dammam.html", "لتحديد القضية ونطاق التمثيل والخطوات والمواعيد القادمة."],
      ["اعتراض أو استئناف على حكم", "appeals-lawyer-dammam.html", "لمراجعة الحكم وأسبابه والمدة والمستندات المؤثرة."],
      ["مراجعة عقد أو مطالبة مالية", "contracts-lawyer-dammam.html", "لفحص العقد والالتزام والإخلال والمطالبة المناسبة."]
    ],
    riyadh: [
      ["استشارة قانونية قبل اتخاذ الإجراء", "lawyer-riyadh.html", "لفهم الصفة والمرحلة والخيارات قبل رفع الدعوى أو الرد عليها."],
      ["توكيل محامي ومتابعة قضية", "legal-services-riyadh.html", "لاختيار التخصص المناسب وترتيب المستندات والمواعيد."],
      ["تنفيذ حكم أو سند", "execution-lawyer-riyadh.html", "لتحديد السند التنفيذي والطلبات والعوائق والإجراء التالي."],
      ["مراجعة عقد أو اتفاقية", "contracts-lawyer-riyadh.html", "لفحص الالتزامات والدفعات والضمانات والإنهاء قبل التوقيع أو المطالبة."]
    ],
    jeddah: [
      ["استشارة قانونية قبل اتخاذ الإجراء", "lawyer-jeddah.html", "لفهم الوقائع والصفة والمرحلة قبل اختيار مسار القضية."],
      ["توكيل محامي ومتابعة قضية", "legal-services-jeddah.html", "لاختيار التخصص وترتيب المستندات والإجراءات والمواعيد."],
      ["تنفيذ حكم أو مطالبة", "execution-lawyer-jeddah.html", "لتحديد السند والمبلغ والعائق والطلب التنفيذي المناسب."],
      ["مراجعة عقد أو اتفاقية", "contracts-lawyer-jeddah.html", "لفحص الالتزامات والمقابل والضمان والإنهاء قبل التوقيع أو النزاع."]
    ],
    national: [
      ["ابدأ بطلب استشارة قانونية", "/#contact", "حدّد نوع المسألة والمدينة والمرحلة والمستند الأساسي."],
      ["اختر دليل مدينتك", "saudi-regions-guide.html", "انتقل إلى المدينة أو المنطقة الأقرب إلى موقع الطلب."],
      ["تعرّف على موضوعك القانوني", "articles.html", "اقرأ الأدلة العملية قبل إرسال ملخص الطلب."],
      ["تصفح جميع الخدمات المنشورة", "site-directory.html", "استخدم الدليل للوصول إلى صفحة التخصص أو المدينة المناسبة."]
    ]
  };
  if (cards[locationKey]) return cards[locationKey];
  const region = [...regionHubs.values()].find((profile) => profile.key === locationKey);
  if (region) {
    return [
      [`دليل ${region.label}`, region.file, "ابدأ من الدليل الإقليمي ثم اختر المشكلة والمرحلة الأقرب إلى طلبك."],
      ["اقرأ الأدلة القانونية العملية", "articles.html", "افهم المستندات والأسئلة والخطوات الأولية قبل التواصل."],
      ["تحقق من الجهة أو النظام الرسمي", "official-sources.html", "ارجع إلى المصدر الرسمي للنص أو الخدمة أو المتطلب الحالي."],
      ["ابدأ بطلب استشارة قانونية", "/#contact", "أرسل نوع المسألة والمدينة والمرحلة والمستند الأساسي."]
    ];
  }
  return cards.national;
}

function notaryIntentCards(locationKey) {
  const city = ["dammam", "riyadh", "tabuk"].includes(locationKey) ? locationKey : null;
  const cityRequest = city ? `request-notary-${city}.html` : "notary-services-saudi.html";
  const licensePage = city ? `verify-notary-license-${city}.html` : "notary-services-saudi.html";
  const powerOfAttorneyPage = city ? `power-of-attorney-notary-${city}.html` : "power-of-attorney-notarization-saudi.html";
  const realEstatePage = city ? `real-estate-transfer-notary-${city}.html` : "real-estate-transfer-notarization-saudi.html";
  return [
    ["البحث عن موثق مرخص", licensePage, "تحقق من الترخيص والنطاق المتاح عبر المنصة الرسمية قبل إرسال المستندات."],
    ["طلب موثق وتحديد نوع المعاملة", cityRequest, "حدّد المدينة ونوع التوثيق وصفة الأطراف والموعد المطلوب."],
    ["توثيق وكالة أو فسخ وكالة", powerOfAttorneyPage, "راجع بيانات الموكل والوكيل والصلاحيات قبل إصدار الوكالة أو فسخها."],
    ["توثيق نقل ملكية عقار", realEstatePage, "جهّز بيانات العقار والأطراف والمقابل والمتطلبات المرتبطة بالتصرف."]
  ];
}

function cornerstoneFiles(locationKey, notary) {
  if (notary) {
    const city = ["dammam", "riyadh", "tabuk"].includes(locationKey) ? locationKey : null;
    return [
      "notary-services-saudi.html",
      city ? `request-notary-${city}.html` : "power-of-attorney-notarization-saudi.html",
      city ? `verify-notary-license-${city}.html` : "real-estate-transfer-notarization-saudi.html",
      city ? `power-of-attorney-notary-${city}.html` : "marriage-contract-notarization-saudi.html",
      city ? `real-estate-transfer-notary-${city}.html` : "company-contract-notarization-saudi.html"
    ];
  }

  const pages = {
    tabuk: [
      "lawyer-tabuk.html",
      "tabuk-region-lawyers.html",
      "legal-consultation-tabuk.html",
      "appoint-lawyer-tabuk.html",
      "contracts-lawyer-tabuk.html",
      "execution-lawyer-tabuk.html",
      "criminal-lawyer-tabuk.html",
      "drug-cases-lawyer-tabuk.html"
    ],
    riyadh: [
      "lawyer-riyadh.html",
      "legal-services-riyadh.html",
      "contracts-lawyer-riyadh.html",
      "execution-lawyer-riyadh.html",
      "criminal-lawyer-riyadh.html",
      "family-lawyer-riyadh.html"
    ],
    jeddah: [
      "lawyer-jeddah.html",
      "legal-services-jeddah.html",
      "contracts-lawyer-jeddah.html",
      "execution-lawyer-jeddah.html",
      "criminal-lawyer-jeddah.html",
      "family-lawyer-jeddah.html"
    ],
    dammam: [
      "lawyer-dammam.html",
      "legal-services-dammam.html",
      "contracts-lawyer-dammam.html",
      "execution-lawyer-dammam.html",
      "criminal-lawyer-dammam.html",
      "family-lawyer-dammam.html"
    ],
    eastern: [
      "eastern-province-legal-services.html",
      "lawyer-dammam.html",
      "eastern-dammam-contract-risk-review.html",
      "eastern-khobar-enforcement-application.html",
      "eastern-jubail-supplier-dispute.html"
    ],
    national: [
      "index.html",
      "saudi-regions-guide.html",
      "lawyer-tabuk.html",
      "lawyer-riyadh.html",
      "lawyer-jeddah.html",
      "lawyer-dammam.html",
      "articles.html",
      "site-directory.html"
    ]
  };
  if (pages[locationKey]) return pages[locationKey];
  const region = [...regionHubs.values()].find((profile) => profile.key === locationKey);
  return region ? [region.file, "saudi-regions-guide.html", "articles.html", "official-sources.html", "editorial-policy.html"] : pages.national;
}

function regionDiscoveryBlock(file, catalog) {
  const region = [...regionHubs.values()].find((profile) => profile.file === file);
  if (!region) return "";
  const candidates = catalog
    .filter((page) => /^saudi-guide-w\d+-/i.test(page.file) && regionProfileFor(page.file, page.html)?.file === file)
    .sort((left, right) => {
      const leftWave = Number(left.file.match(/^saudi-guide-w(\d+)-/i)?.[1] || 0);
      const rightWave = Number(right.file.match(/^saudi-guide-w(\d+)-/i)?.[1] || 0);
      return leftWave - rightWave || left.title.localeCompare(right.title, "ar");
    });
  if (!candidates.length) return "";
  const limit = Math.min(24, candidates.length);
  const selected = Array.from({ length: limit }, (_, index) => candidates[Math.floor(index * candidates.length / limit)]);
  const links = selected.map((page) => `<a href="${page.file}">${escapeHtml(page.title.split("|")[0].trim())}</a>`).join("");
  return `<!-- regional-discovery:start --><section class="section regional-discovery" data-regional-discovery><div class="container"><div class="section-head"><span class="eyebrow">مسارات ذات أولوية للفهرسة</span><h2>أدلة قانونية عملية في ${escapeHtml(region.label)}</h2><p>روابط منتقاة من مراحل وموضوعات مختلفة لتسهيل وصول الزائر ومحركات البحث إلى الأدلة الأعمق، دون إنشاء صفحة لمجرد تكرار اسم المدينة.</p></div><div class="related-services directory-links">${links}</div></div></section><!-- regional-discovery:end -->`;
}

function addRegionToVisibleBreadcrumb(file, html) {
  if (!/^saudi-guide-w\d+-/i.test(file)) return html;
  const region = regionProfileFor(file, html);
  if (!region) return html;
  return html.replace(/(<div[^>]*class="[^"]*\bbreadcrumb\b[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/i, (block, open, content, close) => {
    if (content.includes(`href="${region.file}"`)) return block;
    const next = content.replace(/(<a\s+href="saudi-regions-guide\.html"[^>]*>[\s\S]*?<\/a>)/i, `$1<span aria-hidden="true">/</span><a href="${region.file}">${escapeHtml(region.label)}</a>`);
    return `${open}${next}${close}`;
  });
}

function clientIntentBlock(file, html, catalog) {
  if (isNoindex(html) || /<html[^>]*\slang="en/i.test(html)) return "";
  const location = locationProfile(file);
  const notary = isNotaryPage(file, html);
  const currentTitle = pageTitle(html, file).split("|")[0].trim();
  const catalogFiles = new Set(catalog.map((page) => page.file));
  const cards = (notary ? notaryIntentCards(location.key) : legalIntentCards(location.key))
    .filter(([, href]) => {
      const target = href === "/#contact" ? "index.html" : href.split("#")[0];
      return target !== file && catalogFiles.has(target);
    })
    .map(([label, href, copy]) => `<article class="intent-card"><h3><a href="${href}">${label}</a></h3><p>${copy}</p></article>`)
    .join("");

  const cluster = clusterFor(file, html);
  const clusterPages = catalog.filter((page) => page.cluster === cluster).sort((a, b) => a.file.localeCompare(b.file));
  const currentIndex = clusterPages.findIndex((page) => page.file === file);
  const related = [];
  const pageByFile = new Map(catalog.map((page) => [page.file, page]));
  for (const cornerstoneFile of cornerstoneFiles(location.key, notary)) {
    const candidate = pageByFile.get(cornerstoneFile);
    if (candidate && candidate.file !== file && !related.some((item) => item.file === candidate.file)) related.push(candidate);
    if (related.length >= relatedLinkLimit) break;
  }
  for (let offset = 1; offset < clusterPages.length && related.length < relatedLinkLimit; offset += 1) {
    const candidate = clusterPages[(currentIndex + offset) % clusterPages.length];
    if (candidate && !related.some((item) => item.file === candidate.file)) related.push(candidate);
  }
  const relatedLinks = related.map((page) => `<a href="${page.file === "index.html" ? "/" : page.file}">${escapeHtml(page.title.split("|")[0].trim())}</a>`).join("");
  const heading = notary ? "ما خدمة التوثيق التي تحتاجها الآن؟" : "هل تحتاج استشارة قانونية أم توكيل محامي؟";
  const intro = notary
    ? `ابدأ من نوع المعاملة، ثم تحقق من الموثق المرخص والمتطلبات الرسمية. هذه المسارات تساعدك على الانتقال من ${escapeHtml(currentTitle)} إلى الإجراء الأقرب لطلبك.`
    : `حدّد هدفك أولًا: استشارة لفهم الموقف، توكيل لمتابعة قضية، إعداد اعتراض أو مذكرة، أو مراجعة عقد ومطالبة. اختر المسار الأقرب إلى ${escapeHtml(currentTitle)}.`;
  const relatedHeading = notary ? `صفحات التوثيق الأساسية في ${location.label}` : `الصفحات القانونية الأساسية في ${location.label}`;
  return `<!-- client-intent:start --><section class="section client-intent-section" data-client-intent><div class="container"><div class="section-head"><span class="eyebrow">اختر حسب هدفك</span><h2>${heading}</h2><p>${intro}</p></div><div class="intent-grid">${cards}</div>${relatedLinks ? `<div class="topic-links" data-topic-links><strong>${relatedHeading}</strong><div class="related-services">${relatedLinks}</div></div>` : ""}</div></section><!-- client-intent:end -->`;
}

function updateJsonLdServiceName(html, previousName, nextName) {
  return html.replace(/(<script\s+type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi, (block, open, json, close) => {
    try {
      const value = JSON.parse(json);
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (node["@type"] === "Service" && node.name === previousName) node.name = nextName;
        Object.values(node).forEach(visit);
      };
      visit(value);
      return `${open}${JSON.stringify(value)}${close}`;
    } catch {
      return block;
    }
  });
}

function optimizeLocalServiceMetadata(file) {
  if (!/^legal-services-(?:riyadh|dammam)-.+\.html$/i.test(file)) return;
  const path = resolve(root, file);
  let html = readFileSync(path, "utf8");
  const original = html;
  const previousTitle = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
  const previousName = previousTitle.split("|")[0].trim();
  if (!previousName.startsWith("خدمات قانونية")) return;
  const nextName = previousName.replace(/^خدمات قانونية/, "محامي وخدمات قانونية");
  const nextDescription = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() || "")
    .replace(/^خدمات قانونية/, "محامي وخدمات قانونية");
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(nextName)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]+"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(nextDescription)}">`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]+"\s*\/?\s*>/i, `<meta property="og:title" content="${escapeHtml(nextName)}">`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]+"\s*\/?\s*>/i, `<meta property="og:description" content="${escapeHtml(nextDescription)}">`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]+"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapeHtml(nextName)}">`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]+"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapeHtml(nextDescription)}">`)
    .replace(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/i, (match, open, content, close) => `${open}${content.replace(/^\s*خدمات قانونية/, "محامي وخدمات قانونية")}${close}`);
  html = updateJsonLdServiceName(html, previousName, nextName);
  if (html !== original) writeFileSync(path, html, "utf8");
}

function enhanceHtml(file, catalog = []) {
  const path = resolve(root, file);
  let html = readFileSync(path, "utf8");
  const original = html;
  const language = html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1]?.toLowerCase().startsWith("en") ? "en" : "ar";
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
  const description = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() || "");
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]?.trim();

  if (canonical) html = normalizeStructuredData(html, canonical, file);
  html = addRegionToVisibleBreadcrumb(file, html);

  const analytics = gaTag();
  if (/<!-- site-analytics:start -->[\s\S]*?<!-- site-analytics:end -->/i.test(html)) {
    html = html.replace(/<!-- site-analytics:start -->[\s\S]*?<!-- site-analytics:end -->/i, analytics);
  } else {
    html = html.replace(/<script\s+async\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-KKGEYHSD29"><\/script>\s*<script>[\s\S]*?gtag\(\s*['"]config['"]\s*,\s*['"]G-KKGEYHSD29['"]\s*\);?[\s\S]*?<\/script>/i, analytics);
  }

  html = html
    .replace(/(<a\s+class="brand"\s+href="[^"]+")\s+aria-label="[^"]*"/gi, "$1")
    .replace(/href="index\.html(#[^"]*)?"/gi, (match, hash = "") => `href="/${hash}"`)
    .replace(/href="styles(?:-[a-z0-9]+)?\.css(?:\?v=[^"]*)?"/gi, `href="${stylesheetFile}"`)
    .replace(/<script\s+src="script(?:-[a-z0-9]+)?\.js(?:\?v=[^"]*)?"(?:\s+defer)?\s*><\/script>/gi, `<script src="${scriptFile}" defer></script>`)
    .replace(/<link\s+rel="(?:icon|apple-touch-icon)"\s+href="[^"]+"\s*\/?\s*>/gi, "")
    .replace(/<meta\s+name="theme-color"\s+content="[^"]+"\s*\/?\s*>/gi, "");

  const searchAppearance = searchAppearanceTags();
  if (/<!-- site-search-appearance:start -->[\s\S]*?<!-- site-search-appearance:end -->/i.test(html)) {
    html = html.replace(/<!-- site-search-appearance:start -->[\s\S]*?<!-- site-search-appearance:end -->/i, searchAppearance);
  } else {
    html = html.replace(/(<meta\s+name="viewport"[^>]*>)/i, `$1\n  ${searchAppearance}`);
  }

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
  html = html.replace(/(<!-- accessibility-contrast:end -->)\s*<style>:root\{--muted:#536360\}[\s\S]*?<\/style>/i, "$1");

  html = html.replace(/<main\b([^>]*)>/i, (match, attributes) => {
    let nextAttributes = attributes;
    if (!/\bid\s*=/i.test(nextAttributes)) nextAttributes += ` id="main-content"`;
    if (!/\btabindex\s*=/i.test(nextAttributes)) nextAttributes += ` tabindex="-1"`;
    return `<main${nextAttributes}>`;
  });
  const mainId = html.match(/<main\b[^>]*\bid="([^"]+)"/i)?.[1] || "main-content";
  const skipLabel = language === "en" ? "Skip to main content" : "تجاوز إلى المحتوى الرئيسي";
  const accessibilityNavigation = `<!-- accessibility-navigation:start --><a class="skip-link" href="#${escapeHtml(mainId)}">${skipLabel}</a><!-- accessibility-navigation:end -->`;
  if (/<!-- accessibility-navigation:start -->[\s\S]*?<!-- accessibility-navigation:end -->/i.test(html)) {
    html = html.replace(/<!-- accessibility-navigation:start -->[\s\S]*?<!-- accessibility-navigation:end -->/i, accessibilityNavigation);
  } else {
    html = html.replace(/(<body\b[^>]*>)/i, `$1\n  ${accessibilityNavigation}`);
  }

  const floatingContact = floatingContactLink(language, title);
  if (/<a\b[^>]*class="[^"]*\bwhatsapp-float\b[^"]*"[^>]*>[\s\S]*?<\/a>/i.test(html)) {
    html = html.replace(/<a\b[^>]*class="[^"]*\bwhatsapp-float\b[^"]*"[^>]*>[\s\S]*?<\/a>/i, floatingContact);
  } else {
    html = html.replace(/(<script\s+src="script(?:-[a-z0-9]+)?\.js[^>]*><\/script>)/i, `${floatingContact}\n  $1`);
  }

  if (title && description && canonical) {
    if (/<meta\s+name="author"/i.test(html)) {
      html = html.replace(/<meta\s+name="author"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="author" content="رُكن الأنظمة القانونية">`);
    } else {
      html = html.replace(/(<meta\s+name="description"\s+content="[^"]+"\s*\/?\s*>)/i, `$1\n  <meta name="author" content="رُكن الأنظمة القانونية">`);
    }
    const pageSchema = { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: language === "en" ? "en" : "ar-SA", isPartOf: { "@id": `${baseUrl}/#website` }, author: { "@id": `${baseUrl}/#organization` }, publisher: { "@id": `${baseUrl}/#organization` }, dateModified: releaseDate };
    const breadcrumb = breadcrumbSchema(file, html, canonical, language);
    if (breadcrumb) pageSchema.breadcrumb = { "@id": breadcrumb["@id"] };
    const schemaPayload = breadcrumb
      ? { "@context": "https://schema.org", "@graph": [pageSchema, breadcrumb] }
      : { "@context": "https://schema.org", ...pageSchema };
    const schema = `<script type="application/ld+json" data-sitewide-schema>${JSON.stringify(schemaPayload)}</script>`;
    const htmlWithoutSitewideSchema = html.replace(/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/gi, "");
    if (/"@type"\s*:\s*"WebPage"/i.test(htmlWithoutSitewideSchema)) {
      html = htmlWithoutSitewideSchema;
    } else if (/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(/<script\s+type="application\/ld\+json"\s+data-sitewide-schema>[\s\S]*?<\/script>/i, schema);
    } else {
      html = html.replace(/<\/head>/i, `  ${schema}\n</head>`);
    }
  }

  const regionalDiscovery = regionDiscoveryBlock(file, catalog);
  if (regionalDiscovery) {
    if (/<!-- regional-discovery:start -->[\s\S]*?<!-- regional-discovery:end -->/i.test(html)) {
      html = html.replace(/<!-- regional-discovery:start -->[\s\S]*?<!-- regional-discovery:end -->/i, regionalDiscovery);
    } else if (/<!-- client-intent:start -->/i.test(html)) {
      html = html.replace(/<!-- client-intent:start -->/i, `${regionalDiscovery}\n<!-- client-intent:start -->`);
    } else {
      html = html.replace(/<\/main>/i, `${regionalDiscovery}\n</main>`);
    }
  } else {
    html = html.replace(/\s*<!-- regional-discovery:start -->[\s\S]*?<!-- regional-discovery:end -->/i, "");
  }

  const sources = officialSourcesBlock(file, html, language);
  if (sources) {
    if (/<!-- official-sources:start -->[\s\S]*?<!-- official-sources:end -->/i.test(html)) {
      html = html.replace(/<!-- official-sources:start -->[\s\S]*?<!-- official-sources:end -->/i, sources);
    } else if (/<!-- client-intent:start -->/i.test(html)) {
      html = html.replace(/<!-- client-intent:start -->/i, `${sources}\n<!-- client-intent:start -->`);
    } else {
      html = html.replace(/<\/main>/i, `${sources}\n</main>`);
    }
  } else {
    html = html.replace(/\s*<!-- official-sources:start -->[\s\S]*?<!-- official-sources:end -->/i, "");
  }

  const clientIntent = clientIntentBlock(file, html, catalog);
  if (clientIntent) {
    if (/<!-- client-intent:start -->[\s\S]*?<!-- client-intent:end -->/i.test(html)) {
      html = html.replace(/<!-- client-intent:start -->[\s\S]*?<!-- client-intent:end -->/i, clientIntent);
    } else {
      html = html.replace(/<\/main>/i, `${clientIntent}\n</main>`);
    }
  }

  if (!isNoindex(html)) {
    const conversionPanel = conversionPanelBlock(language, title);
    if (/<!-- conversion-panel:start -->[\s\S]*?<!-- conversion-panel:end -->/i.test(html)) {
      html = html.replace(/<!-- conversion-panel:start -->[\s\S]*?<!-- conversion-panel:end -->/i, conversionPanel);
    } else {
      html = html.replace(/<\/main>/i, `${conversionPanel}\n</main>`);
    }
  } else {
    html = html.replace(/\s*<!-- conversion-panel:start -->[\s\S]*?<!-- conversion-panel:end -->/i, "");
  }

  const accountability = contentAccountabilityBlock(language);
  if (/<!-- content-accountability:start -->[\s\S]*?<!-- content-accountability:end -->\s*(?=<footer\b)/i.test(html)) {
    html = html.replace(/<!-- content-accountability:start -->[\s\S]*?<!-- content-accountability:end -->\s*(?=<footer\b)/i, `${accountability}\n  `);
  } else if (/<\/main>\s*(?=<footer\b)/i.test(html)) {
    html = html.replace(/<\/main>\s*(?=<footer\b)/i, `</main>\n${accountability}\n  `);
  }

  const trust = sitewideTrustBlock(language);
  if (/<!-- sitewide-trust:start -->[\s\S]*?<!-- sitewide-trust:end -->\s*(?=<\/footer>)/i.test(html)) {
    html = html.replace(/<!-- sitewide-trust:start -->[\s\S]*?<!-- sitewide-trust:end -->\s*(?=<\/footer>)/i, `${trust}\n`);
  } else if (/<\/footer>/i.test(html)) {
    html = html.replace(/<\/footer>/i, `${trust}\n</footer>`);
  } else {
    html = html.replace(/<\/body>/i, `${trust}\n</body>`);
  }
  html = html
    .replace(/(?:<div\b[^>]*class="[^"]*\bfooter-trust-links\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*)+(?=<!-- sitewide-trust:start -->)/gi, "")
    .replace(/(?:<nav\b[^>]*class="[^"]*\bfooter-region-directory\b[^"]*"[^>]*>[\s\S]*?<\/nav>\s*)+(?=<!-- sitewide-trust:start -->)/gi, "");

  if (html !== original) writeFileSync(path, html, "utf8");
}

function canonicalFor(file, html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || (file === "index.html" ? `${baseUrl}/` : `${baseUrl}/${file}`);
}

function sitemapUrlEntry({ file, html }) {
  const canonical = canonicalFor(file, html);
  const alternates = file === "index.html" || file === "en.html" ? `\n    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/" />\n    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en.html" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />` : "";
  return `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${releaseDate}</lastmod>${alternates}\n  </url>`;
}

function updateSitemaps() {
  const excluded = new Set(["googlebffd6cc2130f2272.html"]);
  const pages = readdirSync(root).filter((file) => file.endsWith(".html") && !excluded.has(file)).map((file) => ({ file, html: readFileSync(resolve(root, file), "utf8") })).filter(({ html }) => !isNoindex(html));
  pages.sort((a, b) => (a.file === "index.html" ? -1 : b.file === "index.html" ? 1 : a.file.localeCompare(b.file)));
  const groups = new Map([["sitemap-core.xml", []]]);
  for (const page of pages) {
    const wave = page.file.match(/^saudi-guide-w(\d+)-/i)?.[1];
    const sitemapFile = wave ? `sitemap-national-w${wave}.xml` : "sitemap-core.xml";
    if (!groups.has(sitemapFile)) groups.set(sitemapFile, []);
    groups.get(sitemapFile).push(page);
  }

  const sitemapFiles = [...groups.keys()].sort((a, b) => {
    if (a === "sitemap-core.xml") return -1;
    if (b === "sitemap-core.xml") return 1;
    return Number(a.match(/w(\d+)/)?.[1] || 0) - Number(b.match(/w(\d+)/)?.[1] || 0);
  });
  for (const sitemapFile of sitemapFiles) {
    const entries = groups.get(sitemapFile).map(sitemapUrlEntry);
    writeFileSync(resolve(root, sitemapFile), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`, "utf8");
  }

  const indexEntries = sitemapFiles.map((sitemapFile) => `  <sitemap>\n    <loc>${baseUrl}/${sitemapFile}</loc>\n    <lastmod>${releaseDate}</lastmod>\n  </sitemap>`);
  writeFileSync(resolve(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries.join("\n")}\n</sitemapindex>\n`, "utf8");
}

function syncVersionedAssets() {
  writeFileSync(resolve(root, `script-${assetVersion}.js`), readFileSync(resolve(root, "script.js"), "utf8"), "utf8");
  writeFileSync(resolve(root, `styles-${assetVersion}.css`), readFileSync(resolve(root, "styles-20260821b.css"), "utf8"), "utf8");
}

function normalizeGeneratedOutput() {
  const generatedFiles = readdirSync(root).filter((file) =>
    file.endsWith(".html")
    || file.endsWith(".xml")
    || file === "robots.txt"
    || file === `script-${assetVersion}.js`
    || file === `styles-${assetVersion}.css`
  );
  for (const file of generatedFiles) {
    const path = resolve(root, file);
    const original = readFileSync(path, "utf8");
    const normalized = original.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n");
    if (normalized !== original) writeFileSync(path, normalized, "utf8");
  }
}

function generate() {
  syncVersionedAssets();
  nationalGuide();
  aboutPage();
  editorialPolicyPage();
  officialSourcesPage();
  privacyPage();
  notFoundPage();
  directoryPage();

  const htmlFiles = readdirSync(root).filter((file) => file.endsWith(".html") && !file.startsWith("google"));
  for (const file of htmlFiles) optimizeLocalServiceMetadata(file);
  const catalog = htmlFiles
    .map((file) => {
      const html = readFileSync(resolve(root, file), "utf8");
      return { file, html, title: pageTitle(html, file), cluster: clusterFor(file, html) };
    })
    .filter((page) => !isNoindex(page.html));
  for (const file of htmlFiles) enhanceHtml(file, catalog);

  // Regenerate once more so the directory includes the final set of indexable pages.
  directoryPage();
  const finalDirectoryHtml = readFileSync(resolve(root, "site-directory.html"), "utf8");
  const finalCatalog = catalog.map((page) => page.file === "site-directory.html"
    ? { ...page, html: finalDirectoryHtml, title: pageTitle(finalDirectoryHtml, page.file), cluster: clusterFor(page.file, finalDirectoryHtml) }
    : page);
  enhanceHtml("site-directory.html", finalCatalog);
  updateSitemaps();
  writeFileSync(resolve(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`, "utf8");
  normalizeGeneratedOutput();
  console.log(`Generated national SEO pages and enhanced ${htmlFiles.length} public HTML files.`);
}

generate();
