// Generates the national legal-questions library: one page per distinct legal question (ask-*.html)
// plus the legal-questions.html hub. Question content lives in scripts/legal-questions/data-*.mjs.
// Run `node scripts/generate-legal-questions.mjs`, then `node scripts/check-legal-questions.mjs`
// and `node scripts/generate-national-seo.mjs` before committing.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { categories, hubs, regionHubs, sources } from "./legal-questions/categories.mjs";

const root = resolve(import.meta.dirname, "..");
const dataDir = resolve(import.meta.dirname, "legal-questions");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const releaseDate = "2026-09-30";
const releaseDateArabic = "30 سبتمبر 2026";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const hubFile = "legal-questions.html";

export async function loadQuestions() {
  const files = readdirSync(dataDir).filter((file) => /^data-.+\.mjs$/.test(file)).sort();
  const questions = [];
  for (const file of files) {
    const module = await import(pathToFileURL(resolve(dataDir, file)).href);
    if (!categories[module.category]) throw new Error(`${file}: unknown category ${module.category}`);
    // Optional extra-*.mjs files add detail paragraphs (x) keyed by slug.
    const extraFile = file.replace(/^data-/, "extra-");
    const extra = existsSync(resolve(dataDir, extraFile)) ? (await import(pathToFileURL(resolve(dataDir, extraFile)).href)).default : {};
    for (const slug of Object.keys(extra)) if (!module.default.some((item) => item.s === slug)) throw new Error(`${extraFile}: unknown slug ${slug}`);
    for (const item of module.default) questions.push({ ...item, x: [...(item.x || []), ...(extra[item.s] || [])], category: module.category, file: `ask-${item.s}.html`, dataFile: file });
  }
  return questions;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function titleFor(question) {
  return `${question.q} | رُكن الأنظمة`;
}

function descriptionFor(question) {
  return `${question.q} ${question.d}`;
}

function existingTitles() {
  const titles = new Map();
  for (const file of readdirSync(root).filter((name) => name.endsWith(".html") && !name.startsWith("ask-"))) {
    const title = readFileSync(resolve(root, file), "utf8").match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.split("|")[0].trim();
    if (title) titles.set(title, file);
  }
  return titles;
}

export function validate(questions) {
  const errors = [];
  const slugs = new Set();
  const asked = new Set();
  const siteTitles = existingTitles();
  for (const question of questions) {
    const where = `${question.dataFile}/${question.s}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(question.s)) errors.push(`${where}: invalid slug`);
    if (slugs.has(question.s)) errors.push(`${where}: duplicate slug`);
    slugs.add(question.s);
    if (asked.has(question.q)) errors.push(`${where}: duplicate question`);
    asked.add(question.q);
    if (siteTitles.has(question.q)) errors.push(`${where}: question duplicates the title of ${siteTitles.get(question.q)}`);
    if (titleFor(question).length > 65) errors.push(`${where}: title is ${titleFor(question).length} characters (max 65)`);
    const description = descriptionFor(question);
    if (description.length < 100 || description.length > 170) errors.push(`${where}: description is ${description.length} characters (100-170)`);
    for (const [key, count] of [["st", 4], ["doc", 5], ["m", 4], ["f", 3]]) {
      if (!Array.isArray(question[key]) || question[key].length !== count) errors.push(`${where}: ${key} must have ${count} items`);
    }
    for (const key of question.src || []) if (!sources[key]) errors.push(`${where}: unknown source ${key}`);
    if (!question.i || !question.a) errors.push(`${where}: missing intro or answer`);
    if (question.x && !Array.isArray(question.x)) errors.push(`${where}: x must be an array of paragraphs`);
  }
  for (const category of Object.values(categories)) {
    for (const [href] of category.links) if (!existsSync(resolve(root, href))) errors.push(`missing linked page ${href}`);
  }
  for (const [href] of [...hubs, ...regionHubs]) if (!existsSync(resolve(root, href))) errors.push(`missing linked page ${href}`);
  return errors;
}

function header(whatsapp) {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">أسئلة قانونية بإجابات عملية ومصادر رسمية</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
<header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/"><div class="brand-mark" aria-hidden="true">⚖</div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="${hubFile}">الأسئلة القانونية</a><a href="articles.html">المقالات</a><a href="saudi-regions-guide.html">مناطق المملكة</a><a href="lawyer-tabuk.html">تبوك</a></nav><div class="nav-actions"><a class="header-cta" href="${whatsapp}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer() {
  return `<footer><div class="container footer-grid"><div><a class="brand footer-brand" href="/"><div class="brand-mark" aria-hidden="true">⚖</div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><p>محامون ومستشارون قانونيون للأفراد والمنشآت في مختلف مناطق المملكة. المحتوى المنشور معلومات عامة ولا يغني عن مراجعة الوقائع والمستندات.</p></div><div><h3>روابط سريعة</h3><a href="${hubFile}">الأسئلة القانونية</a><a href="articles.html">المقالات</a><a href="site-directory.html">دليل الصفحات</a><a href="privacy.html">الخصوصية</a></div><div><h3>التواصل</h3><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:ap0554138485@icloud.com">ap0554138485@icloud.com</a></div></div><div class="container footer-bottom"><p>© 2026 رُكن الأنظمة القانونية.</p><p>المعلومات المنشورة لا تمثل وعدًا بنتيجة.</p></div></footer>
<script src="script-20260824b.js?v=20260827b" defer></script>`;
}

function head({ file, title, description, schema, type = "article" }) {
  const canonical = `${baseUrl}/${file}`;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <!-- site-analytics:start --><!-- site-analytics:end -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="author" content="رُكن الأنظمة القانونية" />
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="ar" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:locale" content="ar_SA" />
  <meta property="og:site_name" content="رُكن الأنظمة القانونية" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  ${schema.map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`).join("\n  ")}
  <link rel="stylesheet" href="styles-20260821b.css?v=20260825b" />
</head>`;
}

function whatsappFor(text) {
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

function relatedFor(question, questions) {
  const same = questions.filter((item) => item.category === question.category && item.s !== question.s);
  const index = questions.filter((item) => item.category === question.category).findIndex((item) => item.s === question.s);
  // Rotate through the category so every question receives inbound links from its neighbours.
  const picks = [];
  for (let step = 0; picks.length < Math.min(6, same.length); step += 1) {
    const candidate = same[(index + step * 7) % same.length];
    if (!picks.includes(candidate)) picks.push(candidate);
    if (step > same.length * 7) break;
  }
  return picks;
}

function renderQuestion(question, questions) {
  const category = categories[question.category];
  const canonical = `${baseUrl}/${question.file}`;
  const title = titleFor(question);
  const description = descriptionFor(question);
  const sourceKeys = [...new Set([...(question.src || []), ...category.sources])].slice(0, 4);
  const whatsapp = whatsappFor(`السلام عليكم، قرأت: ${question.q} وأرغب في استشارة قانونية. المدينة: `);
  const related = relatedFor(question, questions);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: question.q,
      description,
      mainEntityOfPage: canonical,
      inLanguage: "ar-SA",
      datePublished: releaseDate,
      dateModified: releaseDate,
      articleSection: category.label,
      author: { "@type": "Organization", name: "رُكن الأنظمة القانونية", url: `${baseUrl}/about.html` },
      publisher: { "@type": "Organization", name: "رُكن الأنظمة القانونية", logo: { "@type": "ImageObject", url: `${baseUrl}/logo-128-20260824.png` } }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [[question.q, question.a], ...question.f].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
    }
  ];
  return `${head({ file: question.file, title, description, schema })}
<body>
${header(whatsapp)}
<main>
  <div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="${hubFile}">الأسئلة القانونية</a><span aria-hidden="true">/</span><a href="${hubFile}#${question.category}">${escapeHtml(category.label)}</a><span aria-hidden="true">/</span><span>${escapeHtml(question.q)}</span></div>
  <!-- q-content:start -->
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">${escapeHtml(category.eyebrow)}</span><h1>${escapeHtml(question.q)}</h1><p>${escapeHtml(question.i)}</p><div class="hero-actions"><a class="btn primary" href="#answer">الإجابة المختصرة</a><a class="btn secondary" href="${whatsapp}">اسأل ${escapeHtml(category.lawyer)}</a></div><div class="trust-row"><div><b>مصادر رسمية</b><span>روابط للتحقق</span></div><div><b>تحديث ${releaseDateArabic}</b><span>مراجعة المحتوى</span></div><div><b>جميع المناطق</b><span>تواصل إلكتروني</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">${escapeHtml(category.label)}</span><div class="service-symbol" aria-hidden="true">؟</div><h2>قبل أن تتخذ الإجراء</h2><ul class="service-hero-points"><li>حدد صفتك في النزاع</li><li>راجع أقرب مهلة نظامية</li><li>اجمع المستند الحاسم</li></ul></aside></div></section>
  <section class="section" id="answer"><div class="container narrow"><div class="section-head"><span class="eyebrow">إجابة مباشرة</span><h2>الخلاصة</h2></div><p class="service-legal-note">${escapeHtml(question.a)}</p>${question.x ? question.x.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") : ""}</div></section>
  <section class="section alt" id="steps"><div class="container"><div class="section-head"><span class="eyebrow">خطوة بخطوة</span><h2>ماذا تفعل عمليًا؟</h2></div><div class="specialty-grid">${question.st.map(([stepTitle, text], index) => `<article class="specialty-card" data-number="${String(index + 1).padStart(2, "0")}"><h3>${escapeHtml(stepTitle)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></div></section>
  <section class="section" id="documents"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">قائمة تجهيز</span><h2>المستندات والمعلومات المطلوبة</h2></div><ol class="document-list">${question.doc.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div></section>
  <section class="section alt" id="mistakes"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">انتبه</span><h2>أخطاء شائعة</h2></div><ol class="document-list">${question.m.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div></section>
  <section class="section" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة مرتبطة</span><h2>أسئلة يطرحها أصحاب هذه الحالة</h2></div>${question.f.map(([faqQuestion, answer]) => `<details><summary>${escapeHtml(faqQuestion)}<span>+</span></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></section>
  <!-- q-content:end -->
  <section class="section alt" id="lawyer"><div class="container"><div class="section-head"><span class="eyebrow">متى تحتاج ${escapeHtml(category.lawyer)}؟</span><h2>استشارة قانونية قبل الخطوة التالية</h2><p>${escapeHtml(category.need)}</p></div><div class="related-services">${category.links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}</div></div></section>
  <section class="section" id="sources"><div class="container"><div class="section-head"><span class="eyebrow">تحقق بنفسك</span><h2>المصادر الرسمية</h2><p>المتطلبات الإلكترونية والنصوص قد تُحدَّث؛ راجع المصدر الرسمي قبل التقديم.</p></div><div class="related-services">${sourceKeys.map((key) => `<a href="${sources[key][1]}" target="_blank" rel="noopener">${escapeHtml(sources[key][0])}</a>`).join("")}</div></div></section>
  <section class="section alt" id="related"><div class="container"><div class="section-head"><span class="eyebrow">${escapeHtml(category.label)}</span><h2>أسئلة قريبة من حالتك</h2></div><div class="related-services directory-links">${related.map((item) => `<a href="${item.file}">${escapeHtml(item.q)}</a>`).join("")}<a href="${hubFile}#${question.category}">كل أسئلة ${escapeHtml(category.label)}</a></div></div></section>
  <section class="section" id="regions"><div class="container"><div class="section-head"><span class="eyebrow">محامي في مدينتك</span><h2>نستقبل طلبك من جميع مناطق المملكة</h2></div><div class="related-services">${hubs.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}${regionHubs.map(([href, label]) => `<a href="${href}">محامي في ${escapeHtml(label)}</a>`).join("")}</div></div></section>
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">استشارة قانونية</span><h2>اعرض حالتك على ${escapeHtml(category.lawyer)}</h2><p>أرسل المدينة وصفتك في النزاع والمرحلة الحالية وأقرب موعد، وسنحدد لك المستندات المطلوبة والخطوة التالية.</p></div><a class="primary-btn" href="${whatsapp}">تواصل عبر واتساب</a></div></div></section>
</main>
${footer()}
</body>
</html>
`;
}

function renderHub(questions) {
  const grouped = Object.entries(categories).map(([key, category]) => [key, category, questions.filter((item) => item.category === key)]).filter(([, , items]) => items.length);
  const title = "أسئلة قانونية شائعة في السعودية | رُكن الأنظمة";
  const description = `أسئلة قانونية شائعة في السعودية بإجابات عملية: ${questions.length} سؤالًا في العمل والأحوال الشخصية والمواريث والجنائي والتجاري والعقار والتنفيذ والتوثيق.`;
  const schema = [{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أسئلة قانونية شائعة في السعودية",
    description,
    url: `${baseUrl}/${hubFile}`,
    inLanguage: "ar-SA",
    hasPart: grouped.map(([, category]) => ({ "@type": "WebPageElement", name: category.label }))
  }];
  const whatsapp = whatsappFor("السلام عليكم، أرغب في استشارة قانونية. المدينة ونوع المسألة: ");
  return `${head({ file: hubFile, title, description, schema, type: "website" })}
<body>
${header(whatsapp)}
<main>
  <div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>الأسئلة القانونية</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">مكتبة الأسئلة القانونية</span><h1>أسئلة قانونية شائعة في السعودية</h1><p>إجابات مختصرة وعملية على أكثر الأسئلة التي يبحث عنها الأفراد والمنشآت قبل التوجه إلى المحكمة أو توكيل محامي، مع الخطوات والمستندات والمصادر الرسمية لكل سؤال.</p><div class="hero-actions"><a class="btn primary" href="#${grouped[0][0]}">تصفح الأسئلة</a><a class="btn secondary" href="${whatsapp}">اطلب استشارة قانونية</a></div></div><aside class="service-hero-aside"><span class="service-badge">${questions.length} سؤالًا</span><div class="service-symbol" aria-hidden="true">؟</div><h2>اختر مجال سؤالك</h2><ul class="service-hero-points">${grouped.slice(0, 4).map(([key, category]) => `<li><a href="#${key}">${escapeHtml(category.label)}</a></li>`).join("")}</ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="مجالات الأسئلة">${grouped.map(([key, category]) => `<a href="#${key}">${escapeHtml(category.label)}</a>`).join("")}</nav></div>
  ${grouped.map(([key, category, items], index) => `<section class="section${index % 2 ? " alt" : ""}" id="${key}"><div class="container"><div class="section-head"><span class="eyebrow">${escapeHtml(category.eyebrow)}</span><h2>${escapeHtml(category.label)}</h2><p>${escapeHtml(category.need)}</p></div><div class="related-services directory-links">${items.map((item) => `<a href="${item.file}">${escapeHtml(item.q)}</a>`).join("")}</div><div class="related-services">${category.links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}</div></div></section>`).join("\n  ")}
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">استشارة قانونية</span><h2>لم تجد سؤالك؟</h2><p>أرسل ملخص حالتك والمدينة والمرحلة الحالية عبر واتساب، وسنوجهك إلى المحامي المختص.</p></div><a class="primary-btn" href="${whatsapp}">تواصل عبر واتساب</a></div></div></section>
</main>
${footer()}
</body>
</html>
`;
}

function updateArticlesIndex(questions) {
  const path = resolve(root, "articles.html");
  let html = readFileSync(path, "utf8");
  const counts = Object.entries(categories).map(([key, category]) => [key, category, questions.filter((item) => item.category === key).length]).filter(([, , count]) => count);
  const block = `<!-- legal-questions:start --><section class="section alt" id="legal-questions"><div class="container"><div class="section-head"><span class="eyebrow">مكتبة الأسئلة القانونية</span><h2><a href="${hubFile}">أسئلة قانونية شائعة في السعودية</a></h2><p>${questions.length} سؤالًا بإجابات عملية ومصادر رسمية، مرتبة حسب مجال المسألة.</p></div><div class="related-services">${counts.map(([key, category, count]) => `<a href="${hubFile}#${key}">${escapeHtml(category.label)} (${count})</a>`).join("")}</div></div></section><!-- legal-questions:end -->`;
  if (/<!-- legal-questions:start -->[\s\S]*?<!-- legal-questions:end -->/.test(html)) {
    html = html.replace(/<!-- legal-questions:start -->[\s\S]*?<!-- legal-questions:end -->/, block);
  } else if (html.includes("<!-- search-answer-articles:start -->")) {
    html = html.replace("<!-- search-answer-articles:start -->", `${block}\n<!-- search-answer-articles:start -->`);
  } else {
    throw new Error("articles.html: no insertion point for the legal-questions block");
  }
  writeFileSync(path, html, "utf8");
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const questions = await loadQuestions();
  const errors = validate(questions);
  if (errors.length) {
    console.error(errors.join("\n"));
    console.error(`${errors.length} validation error(s); nothing written.`);
    process.exit(1);
  }
  for (const question of questions) writeFileSync(resolve(root, question.file), renderQuestion(question, questions), "utf8");
  writeFileSync(resolve(root, hubFile), renderHub(questions), "utf8");
  updateArticlesIndex(questions);
  console.log(`Generated ${questions.length} legal-question pages and ${hubFile}.`);
}
