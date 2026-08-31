import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locations } from "./generate-national-wave1.mjs";
import { renderNationalPage } from "./generate-national-wave8.mjs";
import { categories } from "./national-wave9-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDate = "2026-08-31";
const displayDate = "31 أغسطس 2026";

export const pages = categories.flatMap((category, categoryIndex) =>
  category.topics.map((item, topicIndex) => {
    const index = categoryIndex * 10 + topicIndex;
    const location = locations[(index * 7 + 31) % locations.length];
    return {
      ...item,
      category,
      location,
      index,
      key: `${category.key}-${item.key}`,
      slug: `saudi-guide-w9-arbitration-${item.key}-${location.key}.html`
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

const methodVariants = [
  (page) => `ابدأ بمصفوفة ولاية من ثلاثة أعمدة لهذا الموضوع: العبارة التي تمنح السلطة، الطلب الذي يريد الطرف حسمه، والنتيجة التي يستطيع المحكم إصدارها. في ${page.title} لا يكفي وضع علامة قبول أو رفض؛ اكتب أين وردت العبارة في ${page.coreDocument} وما النسخة التي قرأها الطرفان. بعد ذلك أنشئ خطًا زمنيًا يبدأ بأول إخطار وينتهي بالقرار المتوقع: ${page.objective}. أضف لكل تاريخ دليل وصول لا تاريخ تحرير فقط، ثم اختبر سؤال ${page.pivot} على كل طلب مستقل. إذا تغيرت الوقائع بعد افتتاح الملف، أضف طبقة زمنية جديدة ولا تمح الموقف الذي بُني عليه الأمر السابق. بهذه الطريقة يظهر سبب اختلاف القرار اللاحق دون أن يبدو كتصحيح غير معلن.`,
  (page) => `استخدم في هذه المسألة سجل ترشيح وقرار منفصلين. سجل الترشيح يذكر من اقترح الاسم أو الإجراء، متى وصل، وما الشروط التي كان يجب تحققها. أما سجل القرار فيشرح لماذا اختير المسار في ضوء ${page.situation}. عند معالجة ${page.title} يراجع المحكم الصلاحية والمهلة والصفة قبل تقييم الملاءمة، ثم يثبت المرجع في ${page.coreDocument}. لا تجمع القبول بالمهمة والإفصاح وتحديد الأتعاب في رسالة واحدة مبهمة؛ لكل خطوة أثر مختلف وفرصة مستقلة للتعليق. اختم السجل بنتيجة قابلة للفحص: ${page.objective}، مع بيان من تسلمها وما الموعد الذي يبدأ بعدها.`,
  (page) => `ابنِ ورقة تعارض خاصة بموضوع ${page.title} تبدأ بالأسماء القانونية للأطراف وتمتد إلى المالكين والمستشارين والخبراء والشهود. ضع أمام كل اسم نتيجة البحث وتاريخه، ثم اربط أي واقعة بسؤال ${page.pivot}. لا تستخدم وصفًا عامًا مثل «علاقة سابقة»؛ اذكر نوعها ومدتها وانتهائها وحدود المعلومات المتبادلة. إذا ظهرت معلومة جديدة بعد قبول المهمة، تحفظ النسخة الأولى ويصدر تحديث مستقل. المرجع الإجرائي هو ${page.coreDocument}، والمخرج المطلوب ${page.objective}. يجب أن يستطيع طرف لم يشارك في الاتصالات معرفة ما أُفصح، ومتى، وما التعليق الذي قدم، ومن أصدر القرار.`,
  (page) => `حوّل إدارة هذا الملف إلى لوحة مواعيد لا قائمة أمنيات. لكل خطوة في ${page.title} حدد مدخلًا واضحًا، والطرف المسؤول، ووقت التسليم، والقرار التالي إذا لم تصل المادة. تبدأ اللوحة من ${page.coreDocument} وتتعامل مع الحالة التالية كما وردت لا كما يُتوقع أن تتطور: ${page.situation}. اترك مساحة للطلبات العاجلة لكن لا تسمح لها بإزاحة حق الرد دون تسبيب. عند تعديل الموعد، سجل صاحب الطلب وسببه وموقف الخصم وأثره على موعد الحكم. النتيجة التشغيلية ${page.objective} يجب أن تظهر في أمر إجرائي مرقم يستطيع الجميع الرجوع إليه بدل البحث في رسائل متفرقة.`,
  (page) => `أنشئ خريطة إثبات تربط كل واقعة في ${page.title} بمصدر أصلي وشاهد أو خبير ووجه اعتراض محتمل. تبدأ الخريطة من ${page.coreDocument} ثم تميز بين وجود المستند وصحة محتواه ووزنه في النتيجة. في الحالة الراهنة — ${page.situation} — لا يعالج النقص بعدد مرفقات أكبر، بل بتحديد السؤال الذي لا يملك جوابًا موثقًا. اختبر ${page.pivot}، ثم سجل ما إذا كان الدليل مباشرًا أو منقولًا أو استنتاجيًا. المخرج ${page.objective} ينبغي أن يوضح المواد المقبولة والمواد المستبعدة وسبب كل قرار وفرصة الطرفين لمناقشته.`,
  (page) => `افصل طلب التدبير في ${page.title} إلى أربع طبقات: الحق الظاهر دون حسم نهائي، الخطر القريب، التناسب، والضمان أو المراجعة. وثق كل طبقة بمادة مستقلة من ${page.coreDocument} ولا تجعل الاستعجال بديلًا عن الاختصاص. لأن الواقعة هي ${page.situation}، حدد الضرر المتوقع بالوقت والقيمة أو الأثر بدل العبارات العامة. اسأل ${page.pivot}، ثم صغ التدبير بأسماء وأصول ومدد واضحة وحدد وقت انتهائه أو مراجعته. الهدف ${page.objective} لا يكتمل بإصدار الورقة؛ يلزم سجل تبليغ وامتثال وما إذا تغيرت الظروف التي بُني عليها القرار.`,
  (page) => `رتب العناصر العابرة للحدود في بطاقة مستقلة لهذه القضية: المقر، القانون، اللغة، المؤسسة، عناوين التبليغ، مواقع البيانات، وبلدان التنفيذ المتوقعة. في ${page.title} قد تؤدي كلمة واحدة في ${page.coreDocument} وظيفة مختلفة عن مكان انعقاد الجلسة أو جنسية طرف. دوّن النسخة المعتمدة من القواعد وتاريخ نفاذها، ثم اختبر سؤال ${page.pivot}. إذا احتاجت المادة إلى ترجمة، تحفظ اللغة الأصلية ويثبت المترجم ومحل الخلاف. المخرج ${page.objective} يجب أن يشرح أي قاعدة استُخدمت ولماذا، كي لا يتحول الملف الدولي إلى خليط من إجراءات مأخوذة من مصادر غير متوافقة.`,
  (page) => `قبل الجلسة في موضوع ${page.title} وزع الوقت بحسب المسائل لا بحسب عدد الملفات. اكتب لكل شاهد أو خبير الواقعة التي سيعالجها، والوثيقة التي ستعرض عليه، وحدود الأسئلة. تربط الخطة ${page.coreDocument} بالحالة العملية: ${page.situation}. أثناء الجلسة تسجل الاعتراضات والقرارات الفورية وأي تعهد بإكمال مستند، ثم يرسل ملخص قرارات لا ملخص مرافعات. بعد الجلسة اختبر ${page.pivot} على السجل المكتمل فقط. الوصول إلى ${page.objective} يتطلب قرارًا بإقفال المرحلة يبين ما قُبل وما بقي معلقًا وما لا يجوز إضافته دون إعادة فتح رسمية.`,
  (page) => `راجع مسودة القرار في ${page.title} بثلاث قراءات منفصلة. القراءة الأولى تطابق كل طلب ودفع جوهري بالنتيجة. الثانية تعيد تنفيذ الأرقام والتواريخ والأسماء من ${page.coreDocument}. الثالثة تقرأ المنطوق وحده وتسأل هل يفهم المنفذ من يفعل ماذا ومتى وبأي مبلغ. لا تضف أثناء التدقيق سببًا لم يُتح للأطراف مناقشته. الحالة التي عالجتها الهيئة هي ${page.situation}، والسؤال الحاكم ${page.pivot}. النتيجة ${page.objective} تُحفظ مع سجل النسخ والتوقيع والتبليغ حتى يمكن تمييز الحكم الأصلي عن أي تصحيح أو تفسير لاحق.`,
  (page) => `جهز لهذه المسألة ملف ما بعد الحكم منذ بداية المداولة. ضع فيه نسخة اتفاق التحكيم، وسجل التشكيل، والتبليغات، والأوامر التي تثبت فرص الدفاع، ثم ${page.coreDocument}. في ${page.title} لا يعاد وزن القضية كلها؛ تُحدد النقطة التي قد تؤثر على الحجية أو التنفيذ وتُربط بمكانها في السجل. ابدأ من الواقعة ${page.situation} واختبر سؤال ${page.pivot} دون تحويله إلى طلب موضوعي جديد. المخرج ${page.objective} يجب أن يتضمن تقويم المواعيد، والنسخ المصدقة أو المترجمة، وحالة أي طلب تصحيح أو بطلان أو وقف، والجهة المسؤولة عن كل خطوة.`
];

const methodQuadruples = [];
for (let first = 0; first < methodVariants.length - 3; first += 1) {
  for (let second = first + 1; second < methodVariants.length - 2; second += 1) {
    for (let third = second + 1; third < methodVariants.length - 1; third += 1) {
      for (let fourth = third + 1; fourth < methodVariants.length; fourth += 1) {
        methodQuadruples.push([first, second, third, fourth]);
      }
    }
  }
}

function arbitrationNotebook(page) {
  const workflow = page.category.workflow;
  const documents = page.category.documents;
  const cards = [
    ["حدود مهمة المحكم", `في ملف ${page.title} يبدأ المحكم من السؤال: ${page.pivot} ويثبت في أمر مستقل ما يدخل في ولايته وما يبقى خارجها. تُقرأ الطلبات مع اتفاق التحكيم والقواعد المعتمدة، ولا يُفترض اختصاص لمجرد أن الإجراء أكثر سرعة أو أن الوقائع مترابطة اقتصاديًا.`],
    ["الواقعة التي تحتاج إثباتًا", `${page.situation} لذلك تُفصل الواقعة المتنازع عليها عن الرأي القانوني، ويُطلب من كل طرف تحديد المصدر والتاريخ وصاحب المستند. المرجع الأول هو ${page.coreDocument}، ثم تُراجع النسخة والمرفقات وسلامة التبليغ قبل وزن أثرها.`],
    ["قرار إجرائي قابل للمراجعة", `المخرج العملي هو ${page.objective}. يجب أن يذكر القرار طلب الطرفين، والمواد التي اطلعت عليها الهيئة، والسبب المختصر، والنتيجة، والموعد التالي. بهذه الصياغة يستطيع محكم بديل أو محكمة تنفيذ فهم المسار دون الاعتماد على شرح شفهي لاحق.`],
    ["المساواة وحق العرض", `قبل حسم ${page.title} يسجل المحكم الفرصة التي حصل عليها كل طرف للرد على الوقائع والوثائق المؤثرة. لا تعني المساواة تطابق عدد الصفحات أو الدقائق دائمًا، لكنها تقتضي فرصة واقعية ومتناسبة مع أثر المسألة على الحكم أو التدبير.`],
    ["سلسلة الوثيقة", `الدليل المحوري هو ${page.proof}. يوضع بجواره اسم من قدمه، وتاريخ وصوله، وأي ترجمة أو حجب أو تحويل تقني، والاعتراضات الواردة عليه. إذا كانت النسخة ناقصة فلا يملأ المحكم الفراغ من الذاكرة أو من مراسلة لم تتح للطرف الآخر مناقشتها.`],
    ["بوابة الحياد", `عند التعامل مع ${page.title} يراجع كل عضو في الهيئة أسماء الأطراف والمستشارين والشهود والخبراء والجهات المرتبطة. أي علاقة جديدة تُفصح كتابة في وقتها، ثم تحفظ تعليقات الأطراف والقرار المتخذ دون تحويل الإفصاح وحده إلى إقرار بعدم الحياد.`],
    ["المدة والنسخة الحاكمة", `يربط المحكم كل موعد في هذا الموضوع بحدث بداية مثبت: استلام إشعار، صدور أمر، إقفال مرافعة أو تسليم حكم. ويحدد النسخة الحاكمة من ${page.coreDocument}، لأن استخدام نسخة معدلة أو تاريخ تقريبي قد يغيّر الولاية أو المهلة أو نطاق الطلب.`],
    ["القرار الذي لا يتجاوزه الحكم", `${page.boundary}. عند صياغة النتيجة يطابق المحكم كل طلب بمنطوق واضح ويبين ما رُفض أو قُبل أو بقي لمرحلة لاحقة. لا توضع أسباب جديدة لم يناقشها الأطراف إذا كان من شأنها تغيير نتيجة النزاع.`],
    ["المستندات المساندة", `تُراجع مع الوثيقة الأساسية: ${documents.join("، ")}. لا تكفي كثرة المرفقات؛ المطلوب فهرس يوضح وظيفة كل مستند والواقعة التي يثبتها ومكان الإشارة إليه في المذكرة أو المحضر.`],
    ["خطة الإقفال", `يمر الملف على المحطات التالية: ${workflow.join("، ")}. عند نهاية كل محطة تُكتب حالة «مكتمل» أو «معلق» وسببها والمسؤول والموعد. يظل محتوى الصفحة عامًا للتنظيم ولا يقرر نتيجة قضية بعينها ولا يغني عن مراجعة نظام التحكيم والقواعد والاتفاق المطبق.`]
  ];
  const ordered = [...cards.slice(page.index % cards.length), ...cards.slice(0, page.index % cards.length)];
  const [methodIndex, contextIndex, recordIndex, verificationIndex] = methodQuadruples[(page.index * 47) % methodQuadruples.length];
  const method = methodVariants[methodIndex](page);
  const contextMethod = methodVariants[contextIndex](page);
  const recordMethod = methodVariants[recordIndex](page);
  const verificationMethod = methodVariants[verificationIndex](page);
  const regionalMemo = `عند ربط ${page.location.name} بموضوع ${page.title}، يسجل المحكم وظيفة المكان بدقة: هل تقع فيه المنشأة أو المشروع أو الأصل أو الشاهد أو جهة التبليغ؟ لا تكفي عبارة «النزاع في ${page.location.name}» لتحديد المقر القانوني أو المحكمة المساندة. في واقعة ${page.situation} تُستخرج صلة ${page.location.name} من ${page.coreDocument} لا من العنوان التسويقي. وإذا كانت الجلسة في ${page.location.name} بينما المقر مختلف، يثبت الأمر الإجرائي الفرق بين الترتيب اللوجستي والأثر القانوني. عند انتقال دليل من ${page.location.region} إلى منصة خارجية، تسجل النسخة والصلاحيات والحجب ووقت الرفع. وإذا كان شاهد ${page.title} موجودًا في ${page.location.name}، تحدد الدعوة التوقيت واللغة والقناة وإثبات الوصول دون افتراض حضور شخصي. لتحقيق ${page.objective} تُربط كل خطوة محلية بقرار الهيئة وسجل القضية. ويبقى سؤال ${page.pivot} ظاهرًا في صفحة المتابعة حتى لا يتحول اسم المدينة إلى بديل عن إثبات الاختصاص أو الواقعة. لا يعني استقبال الطلب إلكترونيًا من ${page.location.region} وجود مكتب أو فرع في ${page.location.name}، ولا يغير ذلك واجب مراجعة اتفاق التحكيم والقواعد والمواعيد الخاصة بالقضية.`;
  const localDecisionMemo = `في مراجعة ${page.title} في ${page.location.name}، تُكتب هوية الأطراف كما تظهر في ${page.coreDocument}. وعند فحص ${page.title} في ${page.location.name}، تُفصل مدينة المقر عن مدينة الجلسة ومكان تنفيذ الالتزام. وفي سجل ${page.title} في ${page.location.name}، يوثق كل تبليغ بقناته ومستلمه وتوقيته. أما دليل ${page.title} في ${page.location.name}، فيحفظ بأصله وبياناته قبل الترجمة أو الحجب. ويُقاس موعد ${page.title} في ${page.location.name} من حدث مثبت لا من تاريخ تقريبي. وعند سماع طرف بشأن ${page.title} في ${page.location.name}، تُتاح للخصم فرصة تناسب أثر المادة على القرار. ويظل هدف ${page.title} في ${page.location.name} هو ${page.objective}. ثم يُختبر قرار ${page.title} في ${page.location.name} بالسؤال: ${page.pivot} وأخيرًا يبين سجل ${page.title} في ${page.location.name} ما اكتمل وما بقي ومن يملك الخطوة التالية.`;
  return `<section class="section arbitration-notebook" id="arbitrator-notebook"><div class="container"><div class="section-head"><span class="eyebrow">دفتر عمل للمحكم وهيئة التحكيم</span><h2>عشر نقاط خاصة بـ${escapeHtml(page.title)}</h2><p>هذه النقاط تربط القرار الإجرائي بالمستند والمهلة وحق الدفاع، وتساعد على تكوين سجل تحكيم واضح قبل الحكم أو طلب التنفيذ.</p></div><div class="locality-panels">${ordered.map(([title, body], index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("")}<article class="locality-panel arbitration-method" data-number="11"><h3>طريقة معالجة مخصصة لهذه المسألة</h3><p>${escapeHtml(method)}</p></article><article class="locality-panel arbitration-method" data-number="12"><h3>اختبار ثانٍ بحسب مرحلة القضية</h3><p>${escapeHtml(contextMethod)}</p></article><article class="locality-panel arbitration-method" data-number="13"><h3>مراجعة سجل الإجراء قبل الإقفال</h3><p>${escapeHtml(recordMethod)}</p></article><article class="locality-panel arbitration-method" data-number="14"><h3>تحقق مستقل من قابلية التتبع</h3><p>${escapeHtml(verificationMethod)}</p></article><article class="locality-panel arbitration-method" data-number="15"><h3>مذكرة صلة المنطقة بملف التحكيم</h3><p>${escapeHtml(regionalMemo)}</p><p>${escapeHtml(localDecisionMemo)}</p></article></div></div></section>`;
}

function renderWave9(page) {
  let html = renderNationalPage(page, { allPages: pages, contentDate });
  html = html
    .replace('data-national-wave="8"', 'data-national-wave="9"')
    .replaceAll("الدفعة الوطنية الثامنة", "الدفعة الوطنية التاسعة")
    .replaceAll("الدفعة 8 من 10", "الدفعة 9 من 10")
    .replaceAll("29 أغسطس 2026", displayDate)
    .replaceAll("أربع خانات قبل أي إجراء", "قرار المحكم يبدأ من ملف مضبوط")
    .replaceAll("خمس محطات لها ناتج", "خمس محطات لإدارة التحكيم")
    .replaceAll("حزمة أدلة ذات سلسلة واضحة", "سجل أدلة صالح للمناقشة")
    .replaceAll("ست بوابات قبل الإرسال", "بوابات المحكم قبل إصدار القرار")
    .replaceAll("الموقع عنصر واقعي لا صفحة مكررة", "صلة المنطقة بوقائع النزاع")
    .replaceAll("أسئلة وأجوبة قبل التواصل", "أسئلة للمحكم والأطراف قبل الإجراء");
  return html.replace(
    '<section class="section alt" id="faq">',
    `${arbitrationNotebook(page)}<section class="section alt" id="faq">`
  );
}

export function generateNationalWave9() {
  if (pages.length !== 100) throw new Error(`Expected 100 pages, found ${pages.length}.`);
  if (new Set(pages.map((page) => page.slug)).size !== 100) throw new Error("Duplicate batch-nine slug.");
  if (new Set(pages.map((page) => page.title)).size !== 100) throw new Error("Duplicate batch-nine title.");
  if (new Set(pages.map((page) => page.location.region)).size !== 13) throw new Error("Batch nine must cover all 13 regions.");
  for (const page of pages) writeFileSync(resolve(root, page.slug), renderWave9(page), "utf8");

  const rolloutPath = resolve(root, "national-seo-rollout.json");
  const rollout = JSON.parse(readFileSync(rolloutPath, "utf8"));
  if (!rollout.completedBatches.includes(8)) throw new Error("Batch 8 is not recorded as complete.");
  rollout.completedBatches = [...new Set([...rollout.completedBatches, 9])].sort((left, right) => left - right);
  rollout.updated = contentDate;
  rollout.publishedPages = rollout.completedBatches.length * rollout.pagesPerDay;
  rollout.remainingPages = Math.max(0, rollout.targetPages - rollout.publishedPages);
  rollout.nextBatch = rollout.remainingPages > 0 ? 10 : null;
  writeFileSync(rolloutPath, `${JSON.stringify(rollout, null, 2)}\n`, "utf8");
  console.log("Generated 100 original arbitration guides for national batch 9.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateNationalWave9();
