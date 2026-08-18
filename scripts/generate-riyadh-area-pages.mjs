import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";

const sectors = [
  {
    slug: "legal-services-north-riyadh.html",
    name: "شمال الرياض",
    short: "الشمال",
    symbol: "ش",
    neighborhoods: ["الملقا", "حطين", "الياسمين", "النرجس", "العارض", "القيروان", "الصحافة", "العقيق", "الربيع", "النفل", "النخيل", "الغدير"],
    description: "خدمات قانونية في شمال الرياض تشمل الملقا وحطين والياسمين والنرجس والعارض والقيروان والصحافة والعقيق والربيع والنفل والنخيل والغدير.",
    intro: "صفحة قطاعية لتنظيم طلبات الخدمات القانونية من أحياء شمال الرياض. اختر الحي لفتح صفحته المستقلة، ثم حدّد هل احتياجك استشارة أو عقدًا أو قضية أسرية أو تجارية أو عقارية أو تنفيذًا.",
    contextTitle: "طلبات الأفراد والمنشآت في أحياء شمال الرياض",
    context: "قد يبدأ الطلب من عقد شراء أو إيجار أو مقاولة، أو من علاقة تجارية أو وظيفية، أو من مسألة أسرية أو مطالبة مالية. لا يحدد اسم الحي وحده التخصص؛ الذي يحدد المسار هو موضوع الطلب والوثيقة الأساسية والمرحلة والجهة الحالية.",
    routes: [
      ["العقود والمقاولات", "مراجعة نطاق العمل والدفعات والمدد والضمانات والفسخ والتعويض قبل التوقيع أو عند ظهور نزاع.", "contracts-lawyer-tabuk.html"],
      ["العقار والإيجار", "ترتيب مستندات البيع والإيجار والملكية والوساطة والمقاولة والعيوب قبل تحديد نوع المطالبة.", "real-estate-lawyer-tabuk.html"],
      ["الشركات والمطالبات", "طلبات المنشآت والشركاء والعملاء والموردين، مع فصل التفاوض عن الدعوى وعن التنفيذ.", "commercial-lawyer-tabuk.html"],
      ["الأسرة والمواريث", "تنظيم طلبات الطلاق والفسخ والنفقة والحضانة والزيارة والتركات بحسب صفة مقدم الطلب.", "family-lawyer-tabuk.html"]
    ],
    prep: ["اسم الحي داخل شمال الرياض", "موضوع الطلب والنتيجة المطلوبة", "صفة مقدم الطلب دون بيانات الطرف الآخر", "المرحلة والجهة وأقرب موعد", "المستند الأساسي المتوفر فقط"],
    faqs: [
      ["هل تشمل الخدمة جميع أحياء شمال الرياض المذكورة؟", "نعم، يشمل الاستقبال الإلكتروني الملقا وحطين والياسمين والنرجس والعارض والقيروان والصحافة والعقيق والربيع والنفل والنخيل والغدير، وأي موقع قريب داخل القطاع."],
      ["هل توجد صفحة مستقلة لكل حي؟", "نعم، لكل حي في شمال الرياض صفحة مستقلة بعنوان ومحتوى وتركيز وأسئلة وروابط خاصة به، وتبقى هذه الصفحة بوابة القطاع."],
      ["ما المعلومات اللازمة لطلب عقاري؟", "اذكر الحي، ونوع العقار أو العلاقة، والمستند المتوفر، وطبيعة الخلاف أو الخدمة، والمرحلة الحالية دون إرسال بيانات حساسة في البداية."]
    ]
  },
  {
    slug: "legal-services-east-riyadh.html",
    name: "شرق الرياض",
    short: "الشرق",
    symbol: "ق",
    neighborhoods: ["قرطبة", "غرناطة", "اليرموك", "المونسية", "إشبيلية", "الرمال", "الروضة", "الحمراء", "الخليج", "القدس", "النهضة", "الريان", "الروابي"],
    description: "خدمات قانونية في شرق الرياض تشمل قرطبة وغرناطة واليرموك والمونسية وإشبيلية والرمال والروضة والحمراء والخليج والقدس والنهضة والريان والروابي.",
    intro: "دليل خدمات قانونية لأحياء شرق الرياض يربط الموقع بصفحة الحي والمسار التخصصي الصحيح. اذكر الحي ونوع الموضوع ومرحلته، ثم انتقل إلى الدليل المستقل الأقرب لطلبك.",
    contextTitle: "من تحديد الحي إلى تحديد الإجراء القانوني",
    context: "قد تكون الخدمة وقائية مثل مراجعة عقد، أو نزاعية مثل مطالبة أو دعوى، أو لاحقة للحكم مثل التنفيذ. تفصل الصفحة بين هذه المراحل وتوضح أن استقبال الطلب الأولي متاح من جميع الأحياء الثلاثة عشر دون ادعاء وجود مكتب في كل حي.",
    routes: [
      ["القضايا والمذكرات", "تحديد المحكمة والمرحلة والطلبات والمواعيد قبل إعداد مذكرة أو رد أو لائحة مرتبطة بوقائع الملف.", "lawyer-tabuk.html"],
      ["القضايا العمالية", "الأجور والمستحقات وإنهاء العلاقة والتسوية والدعوى، مع ترتيب العقد والإشعارات وكشوف الأجور.", "labor-lawyer-tabuk.html"],
      ["المطالبات والتنفيذ", "التمييز بين مطالبة تحتاج حكمًا وبين سند قابل للتنفيذ، ومراجعة ما تم في الطلب القائم.", "execution-lawyer-tabuk.html"],
      ["الأعمال والعقود", "دعم المنشآت والأفراد في الاتفاقيات والمطالبات التجارية والالتزامات والدفعات والتفاوض.", "commercial-lawyer-tabuk.html"]
    ],
    prep: ["حدّد الحي داخل شرق الرياض", "اكتب نوع القضية بكلمتين", "وضّح هل الموضوع قبل الدعوى أم أثناءها أم بعد الحكم", "اذكر أقرب جلسة أو نهاية مدة", "لا ترسل كلمات مرور أو أصول مستندات"],
    faqs: [
      ["ما أحياء شرق الرياض التي يغطيها الدليل؟", "يغطي قرطبة وغرناطة واليرموك والمونسية وإشبيلية والرمال والروضة والحمراء والخليج والقدس والنهضة والريان والروابي، إضافة إلى المواقع القريبة داخل القطاع."],
      ["كيف أعرف أن طلبي تنفيذ وليس مطالبة؟", "إذا كان لديك حكم أو سند تنفيذي فقد يكون مسار التنفيذ مناسبًا، أما إذا كنت تحتاج إثبات الحق أولًا فقد يلزم مسار مطالبة أو دعوى؛ ويتحدد ذلك بعد مراجعة المستند."],
      ["هل أرسل كل مستندات القضية في البداية؟", "لا. ابدأ بنوع الطلب والمرحلة والحي والموعد، ثم تُطلب المستندات اللازمة فقط بعد اتضاح نطاق المراجعة والقناة المناسبة."]
    ]
  },
  {
    slug: "legal-services-central-riyadh.html",
    name: "وسط الرياض",
    short: "الوسط",
    symbol: "و",
    neighborhoods: ["العليا", "السليمانية", "الملز", "المربع", "الديرة"],
    description: "خدمات قانونية في وسط الرياض تشمل العليا والسليمانية والملز والمربع والديرة للأفراد والمنشآت في العقود والأعمال والعمل والقضايا والتنفيذ.",
    intro: "صفحة تجمع الاحتياجات القانونية في أحياء وسط الرياض ضمن مسار واضح للأفراد والمنشآت. حدّد العليا أو السليمانية أو الملز أو المربع أو الديرة، ثم وضّح نوع الخدمة والمرحلة والموعد المهم.",
    contextTitle: "مسارات قانونية للأعمال والأفراد في وسط الرياض",
    context: "تتطلب الطلبات المرتبطة بالأعمال والعقود والعمل والمطالبات دقة في تحديد الصفة والوثيقة والمدة. كما تحتاج مسائل الأفراد والقضايا إلى فصل الوقائع عن الطلبات. تجمع الصفحة نقاط البداية وتربطها بالأدلة التخصصية المناسبة.",
    routes: [
      ["الشركات والشركاء", "مراجعة العلاقة بين الشركاء والقرارات والالتزامات والمطالبات التجارية قبل تحديد التفاوض أو الدعوى.", "commercial-lawyer-tabuk.html"],
      ["العقود والاتفاقيات", "صياغة ومراجعة البنود والمدد والدفعات والسرية والإنهاء والتعويض بما يوافق نطاق الاتفاق.", "contracts-lawyer-tabuk.html"],
      ["العمل والمستحقات", "فهم العقد والأجر والإشعارات والإنهاء والتسوية والمهل قبل اختيار الإجراء العمالي المناسب.", "labor-lawyer-tabuk.html"],
      ["القضايا والتنفيذ", "تنظيم الملف بحسب المرحلة: ما قبل الدعوى أو أثناءها أو بعد الحكم أو عند بدء التنفيذ.", "execution-lawyer-tabuk.html"]
    ],
    prep: ["اسم الحي: العليا أو السليمانية أو الملز أو المربع أو الديرة", "صفة الفرد أو المنشأة في الموضوع", "العقد أو الحكم أو الإشعار الأساسي", "الجهة والمرحلة الحالية", "الموعد أو المهلة إن وجدت"],
    faqs: [
      ["هل تشمل التغطية العليا والسليمانية والملز؟", "نعم، تشمل الصفحة العليا والسليمانية والملز والمربع والديرة، ويستقبل الطلب الأولي إلكترونيًا من أي شارع أو موقع داخل هذه الأحياء."],
      ["متى أبدأ بمحامي عقود ومتى بمحامي تجاري؟", "ابدأ بالعقود للصياغة والمراجعة وتفسير البنود، وابدأ بالتجاري عند وجود مطالبة أو نزاع أعمال أو مشكلة بين شركاء أو منشآت."],
      ["هل يعني الدليل وجود فرع في وسط الرياض؟", "لا. الصفحة توضح نطاق استقبال الطلبات إلكترونيًا ولا تدعي وجود مكتب أو فرع فعلي في أي حي من الأحياء المذكورة."]
    ]
  },
  {
    slug: "legal-services-west-riyadh.html",
    name: "غرب الرياض",
    short: "الغرب",
    symbol: "غ",
    neighborhoods: ["ظهرة لبن", "طويق", "العريجاء", "السويدي", "الحزم"],
    description: "خدمات قانونية في غرب الرياض تشمل ظهرة لبن وطويق والعريجاء والسويدي والحزم، مع مسارات للعقار والعقود والأسرة والمطالبات والتنفيذ.",
    intro: "دليل محلي لخدمات غرب الرياض يجمع ظهرة لبن وطويق والعريجاء والسويدي والحزم في صفحة واحدة مفيدة. اذكر الحي وموضوع الطلب ومرحلته لتحديد التخصص والمستندات الأولية.",
    contextTitle: "تنظيم الطلب قبل اختيار المحامي أو الإجراء",
    context: "قد يتشابه اسم المستند بينما تختلف النتيجة المطلوبة: مراجعة عقد قبل التوقيع ليست مطالبة بعد الإخلال، والحكم ليس هو التنفيذ، والاستشارة الأسرية ليست دعوى قائمة. لهذا تبدأ الصفحة بالهدف والمرحلة ثم الموقع داخل غرب الرياض.",
    routes: [
      ["العقار والمقاولات", "مراجعة البيع والإيجار والملكية والمقاولة والدفعات والعيوب، مع فصل المستندات الفنية عن القانونية.", "real-estate-lawyer-tabuk.html"],
      ["العقود والالتزامات", "تحديد نطاق العمل والمدة والمقابل والضمان والإنهاء، ومراجعة أثر كل بند قبل اعتماده.", "contracts-lawyer-tabuk.html"],
      ["الأسرة والتركات", "تنظيم الصفة والوقائع والطلبات في مسائل الطلاق والفسخ والنفقة والحضانة والزيارة والمواريث.", "family-lawyer-tabuk.html"],
      ["المطالبات المالية", "فهم سبب الدين ومستنده واستحقاقه والمراسلات السابقة قبل تحديد الإنذار أو الدعوى أو التنفيذ.", "execution-lawyer-tabuk.html"]
    ],
    prep: ["حدّد الحي في غرب الرياض", "اشرح النتيجة المطلوبة لا اسم المستند فقط", "اذكر المستند والمرحلة الحالية", "دوّن أقرب موعد أو مهلة", "احتفظ بالبيانات الحساسة حتى تُطلب"],
    faqs: [
      ["ما الأحياء المشمولة في غرب الرياض؟", "تشمل الصفحة ظهرة لبن وطويق والعريجاء والسويدي والحزم، وأي شارع أو مخطط داخل هذه الأحياء أو قريب منها في القطاع الغربي."],
      ["كيف أبدأ مطالبة مرتبطة بعقد مقاولة؟", "اذكر موقع المشروع، ونطاق العقد، والدفعات، وما تم تنفيذه، والإشعارات المتبادلة، والنتيجة المطلوبة، ثم تحدد المستندات اللازمة للمراجعة."],
      ["هل التقييم الأولي يتطلب حضورًا؟", "يمكن بدء تنظيم الطلب إلكترونيًا، ثم تتحدد الحاجة إلى الحضور أو الوكالة أو أي إجراء آخر بحسب نوع الملف وإمكان تقديم الخدمة."]
    ]
  },
  {
    slug: "legal-services-south-riyadh.html",
    name: "جنوب الرياض",
    short: "الجنوب",
    symbol: "ج",
    neighborhoods: ["نمار", "الشفا", "بدر", "العزيزية", "الدار البيضاء"],
    description: "خدمات قانونية في جنوب الرياض تشمل نمار والشفا وبدر والعزيزية والدار البيضاء للأفراد والمنشآت في الأسرة والعمل والعقود والمطالبات والقضايا.",
    intro: "صفحة خدمات قانونية لجنوب الرياض تربط أحياء نمار والشفا وبدر والعزيزية والدار البيضاء بالمسار القانوني الأنسب. ابدأ بنوع القضية والمرحلة والحي، ثم جهّز الحد الأدنى من المعلومات.",
    contextTitle: "طلبات أسرية وعمالية ومالية في جنوب الرياض",
    context: "تحتاج قضايا الأسرة والعمل والمطالبات إلى ترتيب زمني للوقائع والوثائق والمواعيد، بينما تحتاج العقود إلى قراءة الالتزامات قبل اقتراح الإجراء. توضح الصفحة الفرق وتوفر نقطة دخول واحدة للأحياء الخمسة.",
    routes: [
      ["الأحوال الشخصية", "الطلاق والفسخ والنفقة والحضانة والزيارة والمواريث، مع تحديد صفة مقدم الطلب والمرحلة.", "family-lawyer-tabuk.html"],
      ["القضايا العمالية", "الأجور والمستحقات والعقد والإنهاء والتسوية، وترتيب الإشعارات وكشوف الأجر والمهل.", "labor-lawyer-tabuk.html"],
      ["المطالبات والتنفيذ", "قراءة الحكم أو السند أو الفاتورة والمراسلات لتحديد ما إذا كان المطلوب دعوى أو تنفيذًا.", "execution-lawyer-tabuk.html"],
      ["القضايا الجنائية", "تنظيم الطلب عند وجود بلاغ أو تحقيق أو نيابة أو محاكمة أو اعتراض، مع مراعاة المواعيد والخصوصية.", "criminal-lawyer-tabuk.html"]
    ],
    prep: ["اسم الحي في جنوب الرياض", "نوع القضية والصفة فيها", "التسلسل المختصر للوقائع", "الجهة والمرحلة والموعد", "المستندات الأساسية دون معلومات الدخول"],
    faqs: [
      ["هل تشمل الصفحة نمار والشفا وبدر؟", "نعم، تشمل نمار والشفا وبدر والعزيزية والدار البيضاء، ويشمل استقبال الطلب أي شارع أو مخطط داخل هذه الأحياء."],
      ["ما الذي أرسله في قضية عمالية؟", "ابدأ بالعقد أو وصف العلاقة، وتاريخ البداية والنهاية، والأجر، والمستحقات محل الطلب، والإشعارات، ومرحلة التسوية أو الدعوى إن وجدت."],
      ["هل يمكن بدء طلب أسري دون إرسال وثائق حساسة؟", "نعم. ابدأ بنوع الطلب وصفتك والمرحلة والموعد بصورة عامة، ثم تُطلب الوثائق اللازمة فقط عبر القناة المناسبة."]
    ]
  }
];

const neighborhoodSlugs = {
  "الملقا": "legal-services-riyadh-al-malqa.html", "حطين": "legal-services-riyadh-hittin.html", "الياسمين": "legal-services-riyadh-al-yasmin.html", "النرجس": "legal-services-riyadh-al-narjis.html", "العارض": "legal-services-riyadh-al-arid.html", "القيروان": "legal-services-riyadh-al-qirawan.html", "الصحافة": "legal-services-riyadh-al-sahafah.html", "العقيق": "legal-services-riyadh-al-aqiq.html", "الربيع": "legal-services-riyadh-al-rabi.html", "النفل": "legal-services-riyadh-al-nafl.html", "النخيل": "legal-services-riyadh-al-nakheel.html", "الغدير": "legal-services-riyadh-al-ghadir.html",
  "قرطبة": "legal-services-riyadh-qurtubah.html", "غرناطة": "legal-services-riyadh-gharnatah.html", "اليرموك": "legal-services-riyadh-al-yarmouk.html", "المونسية": "legal-services-riyadh-al-munsiyah.html", "إشبيلية": "legal-services-riyadh-ishbiliyah.html", "الرمال": "legal-services-riyadh-al-rimal.html", "الروضة": "legal-services-riyadh-al-rawdah.html", "الحمراء": "legal-services-riyadh-al-hamra.html", "الخليج": "legal-services-riyadh-al-khaleej.html", "القدس": "legal-services-riyadh-al-quds.html", "النهضة": "legal-services-riyadh-al-nahdah.html", "الريان": "legal-services-riyadh-al-rayyan.html", "الروابي": "legal-services-riyadh-al-rawabi.html",
  "العليا": "legal-services-riyadh-al-olaya.html", "السليمانية": "legal-services-riyadh-al-sulaymaniyah.html", "الملز": "legal-services-riyadh-al-malaz.html", "المربع": "legal-services-riyadh-al-murabba.html", "الديرة": "legal-services-riyadh-al-dirah.html",
  "ظهرة لبن": "legal-services-riyadh-dhahrat-laban.html", "طويق": "legal-services-riyadh-tuwaiq.html", "العريجاء": "legal-services-riyadh-al-uraija.html", "السويدي": "legal-services-riyadh-al-suwaidi.html", "الحزم": "legal-services-riyadh-al-hazm.html",
  "نمار": "legal-services-riyadh-namar.html", "الشفا": "legal-services-riyadh-al-shifa.html", "بدر": "legal-services-riyadh-badr.html", "العزيزية": "legal-services-riyadh-al-aziziyah.html", "الدار البيضاء": "legal-services-riyadh-al-dar-al-baida.html",
};

const servicePages = [
  ["محامي في الرياض", "lawyer-riyadh.html", "توجيه الطلب واختيار التخصص بحسب موضوع القضية ومرحلتها."],
  ["محامي جنائي في الرياض", "criminal-lawyer-riyadh.html", "للبلاغ والتحقيق والمحاكمة والاعتراض والحق الخاص."],
  ["محامي أحوال شخصية", "family-lawyer-riyadh.html", "للطلاق والفسخ والنفقة والحضانة والزيارة والمواريث."],
  ["محامي تجاري في الرياض", "commercial-lawyer-riyadh.html", "للشركات والشركاء والموردين والمنازعات التجارية."],
  ["محامي عمالي في الرياض", "labor-lawyer-riyadh.html", "لعقود العمل والأجور والإنهاء والمستحقات والتسوية."],
  ["محامي تنفيذ في الرياض", "execution-lawyer-riyadh.html", "للأحكام والسندات وطلبات التنفيذ ومنازعاتها."],
  ["محامي عقود في الرياض", "contracts-lawyer-riyadh.html", "لصياغة العقود ومراجعتها والتعديل والإنهاء والإخلال."],
  ["محامي عقاري في الرياض", "real-estate-lawyer-riyadh.html", "للبيع والإيجار والمقاولات والملكية والمطالبات."],
];

const logo = `<div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div>`;
const analytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;

function header(status, message, servicesHref = "#services", coverageHref = "#coverage") {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">${status}</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
  <header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية">${logo}<div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="legal-services-riyadh.html">دليل الرياض</a><a href="${servicesHref}">الخدمات</a><a href="${coverageHref}">الأحياء</a><a href="#faq">الأسئلة الشائعة</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(message) {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>استقبال طلبات الخدمات القانونية إلكترونيًا من أحياء الرياض ومختلف مناطق المملكة.</p></div><div><b>دليل الرياض</b><a href="legal-services-riyadh.html">جميع قطاعات الرياض</a>${sectors.map(sector=>`<a href="${sector.slug}">${sector.name}</a>`).join("")}</div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:ap0554138485@icloud.com">ap0554138485@icloud.com</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer><a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="script.js"></script>`;
}

function neighborhoodArea(name) {
  return {"@type":"Place",name:`حي ${name}، الرياض`,containedInPlace:{"@type":"City",name:"الرياض"}};
}

function renderSector(sector) {
  const url = `${baseUrl}/${sector.slug}`;
  const message = `السلام عليكم، أرغب في خدمة قانونية في ${sector.name}. الحي ونوع الطلب: `;
  const schema = {"@context":"https://schema.org","@graph":[
    {"@type":"Service","@id":`${url}#service`,name:`خدمات قانونية في ${sector.name}`,serviceType:`استقبال وتوجيه طلبات الخدمات القانونية في ${sector.name}`,url,provider:{"@type":"Organization","@id":`${baseUrl}/#organization`,name:"رُكن الأنظمة القانونية",url:`${baseUrl}/`,telephone:phone},areaServed:[{"@type":"City",name:"الرياض"},...sector.neighborhoods.map(neighborhoodArea)]},
    {"@type":"ItemList","@id":`${url}#neighborhoods`,name:`أحياء ${sector.name}`,numberOfItems:sector.neighborhoods.length,itemListElement:sector.neighborhoods.map((name,index)=>({"@type":"ListItem",position:index+1,name:`حي ${name}`,url:`${baseUrl}/${neighborhoodSlugs[name]}`}))},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"خدمات قانونية في الرياض",item:`${baseUrl}/legal-services-riyadh.html`},{"@type":"ListItem",position:3,name:sector.name,item:url}]},
    {"@type":"FAQPage",mainEntity:sector.faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
  ]};
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head>${analytics}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><title>خدمات قانونية في ${sector.name} | رُكن الأنظمة القانونية</title><meta name="description" content="${sector.description}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="خدمات قانونية في ${sector.name}"><meta property="og:description" content="${sector.description}"><meta property="og:url" content="${url}"><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" href="styles.css"></head><body>
  ${header(`خدمات قانونية من جميع أحياء ${sector.name}`, message)}
  <main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="legal-services-riyadh.html">الرياض</a><span aria-hidden="true">/</span><span>${sector.name}</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">دليل قطاع ${sector.short}</span><h1>خدمات قانونية في<br><span>${sector.name}</span></h1><p>${sector.intro}</p><div class="hero-actions"><a class="btn primary" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ الطلب عبر واتساب</a><a class="btn secondary" href="#coverage">اختر الحي</a></div><div class="trust-row"><div><b>${sector.neighborhoods.length} حيًا</b><span>داخل القطاع</span></div><div><b>مسارات متعددة</b><span>أفراد ومنشآت</span></div><div><b>استقبال إلكتروني</b><span>دون ادعاء فروع</span></div></div></div><aside class="service-hero-aside" aria-label="دليل ${sector.name}"><span class="service-badge">${sector.name}</span><div class="service-symbol" aria-hidden="true">${sector.symbol}</div><h2>ابدأ من نوع الطلب</h2><p>اسم الحي يحدد النطاق، وموضوع القضية يحدد التخصص.</p><ul class="service-hero-points"><li>حدّد الحي</li><li>حدّد الخدمة والمرحلة</li><li>اذكر أقرب موعد</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#coverage">الأحياء</a><a href="#services">الخدمات</a><a href="#context">اختيار المسار</a><a href="#prepare">تجهيز الطلب</a><a href="#faq">الأسئلة الشائعة</a></nav></div>
  <section class="section" id="coverage"><div class="container"><div class="section-head"><span class="eyebrow">صفحات أحياء مستقلة</span><h2>أحياء ${sector.name} المشمولة</h2><p>اختر الحي لفتح صفحته المستقلة، وتشمل التغطية الإلكترونية أي شارع أو مخطط داخله.</p></div><div class="locality-panel"><ul class="location-list">${sector.neighborhoods.map(name=>`<li><a href="${neighborhoodSlugs[name]}">خدمات قانونية في حي ${name}</a></li>`).join("")}</ul><p class="coverage-disclaimer">التغطية تعني استقبال الطلب إلكترونيًا من هذه المواقع، ولا تعني وجود فرع فعلي في كل حي.</p></div></div></section>
  <section class="section alt" id="services"><div class="container"><div class="section-head"><span class="eyebrow">مسارات قانونية</span><h2>اختر الخدمة بحسب جوهر الطلب</h2><p>تختلف متطلبات العقد عن القضية، وتختلف الدعوى عن التنفيذ؛ اختر المسار الأقرب للنتيجة التي تريدها.</p></div><div class="specialty-grid">${sector.routes.map(([title,text],index)=>`<article class="specialty-card" data-number="0${index+1}"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><div class="related-services">${servicePages.map(([name,slug])=>`<a href="${slug}">${name}</a>`).join("")}</div></div></section>
  <section class="section" id="context"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">فهم الطلب</span><h2>${sector.contextTitle}</h2><p>${sector.context}</p></div><div class="locality-panel"><h3>الخطوة الصحيحة قبل التواصل</h3><p>ابدأ بطلب استشارة أولية إذا كنت تحتاج فهم الخيارات، أو اذكر أن لديك قضية قائمة إذا كنت تريد تحديد التخصص والإجراء. بعد ذلك اكتب ${sector.name} واسم الحي والمرحلة الحالية في الرسالة.</p><p class="coverage-disclaimer">لا تشارك كلمات مرور أو بيانات بنكية أو أصول مستندات في الرسالة الأولى.</p></div></div></section>
  <section class="section alt" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">رسالة أولى واضحة</span><h2>جهّز طلبك من ${sector.name}</h2><p>خمس معلومات تكفي لتوجيه الطلب دون سرد الملف كاملًا.</p></div><ol class="document-list">${sector.prep.map(item=>`<li>${item}</li>`).join("")}</ol></div></section>
  <section class="section"><div class="container"><div class="section-head"><span class="eyebrow">بقية الرياض</span><h2>استكشف قطاعات مدينة الرياض</h2><p>دليل واحد يربط الأحياء الأربعين بخمس صفحات قطاعية واضحة.</p></div><div class="related-services"><a href="legal-services-riyadh.html">دليل الرياض</a>${sectors.map(item=>`<a href="${item.slug}"${item.slug===sector.slug?' aria-current="page"':''}>${item.name}</a>`).join("")}</div></div></section>
  <section class="section alt" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">إجابات مباشرة</span><h2>أسئلة عن الخدمات القانونية في ${sector.name}</h2></div>${sector.faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></section>
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">ابدأ الآن</span><h2>اذكر الحي ونوع الطلب</h2><p>سنستخدمهما لتحديد المسار القانوني الأقرب وإمكان تقديم الخدمة.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ عبر واتساب</a></div></div></section></main>${footer(message)}</body></html>`;
}

function renderHub() {
  const slug = "legal-services-riyadh.html";
  const url = `${baseUrl}/${slug}`;
  const message = "السلام عليكم، أرغب في خدمة قانونية في الرياض. الحي ونوع الطلب: ";
  const allNeighborhoods = sectors.flatMap(sector => sector.neighborhoods);
  const faqs = [
    ["ما أحياء الرياض التي يغطيها الدليل؟", "يغطي الدليل أربعين حيًا موزعة على شمال الرياض وشرقها ووسطها وغربها وجنوبها، مع شمول أي شارع أو مخطط داخل الأحياء المذكورة."],
    ["هل لكل حي من الأحياء الأربعين صفحة مستقلة؟", "نعم، لكل حي رابط مستقل وعنوان ووصف وتركيز قانوني وحالة عملية وأسئلة خاصة به، مع إبقاء صفحات القطاعات لتسهيل التصفح."],
    ["هل توجد فروع لرُكن الأنظمة القانونية في جميع أحياء الرياض؟", "لا. يوضح الدليل نطاق استقبال الطلبات إلكترونيًا ولا يدعي وجود فرع فعلي في أي حي. تتحدد طريقة تقديم الخدمة بعد المراجعة الأولية."],
    ["كيف أختار القطاع والخدمة؟", "اختر أولًا القطاع الذي يقع فيه الحي، ثم حدّد جوهر الطلب: استشارة أو قضية أو عقد أو أسرة أو عمل أو تجارة أو عقار أو تنفيذ."]
  ];
  const schema = {"@context":"https://schema.org","@graph":[
    {"@type":"Service","@id":`${url}#service`,name:"خدمات قانونية في الرياض",serviceType:"دليل استقبال وتوجيه طلبات الخدمات القانونية في أحياء الرياض",url,provider:{"@type":"Organization","@id":`${baseUrl}/#organization`,name:"رُكن الأنظمة القانونية",url:`${baseUrl}/`,telephone:phone},areaServed:[{"@type":"City",name:"الرياض"},...allNeighborhoods.map(neighborhoodArea)]},
    {"@type":"ItemList","@id":`${url}#sectors`,name:"قطاعات وأحياء الرياض",numberOfItems:sectors.length,itemListElement:sectors.map((sector,index)=>({"@type":"ListItem",position:index+1,name:sector.name,url:`${baseUrl}/${sector.slug}`}))},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"خدمات قانونية في الرياض",item:url}]},
    {"@type":"FAQPage",mainEntity:faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
  ]};
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head>${analytics}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><title>خدمات قانونية في الرياض | دليل 40 حيًا</title><meta name="description" content="دليل خدمات قانونية في الرياض يربط 40 صفحة حي مستقلة عبر شمال وشرق ووسط وغرب وجنوب المدينة، مع مسارات للعقود والقضايا والأسرة والعمل والتجارة والعقار والتنفيذ."><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="خدمات قانونية في الرياض | 40 صفحة حي مستقلة"><meta property="og:description" content="اختر قطاع الرياض ثم افتح صفحة الحي المستقلة وانتقل إلى المسار القانوني المناسب."><meta property="og:url" content="${url}"><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" href="styles.css"></head><body>
  ${header("دليل الخدمات القانونية في 40 حيًا بمدينة الرياض", message, "#services", "#sectors")}
  <main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>خدمات قانونية في الرياض</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">5 قطاعات • 40 صفحة حي</span><h1>خدمات قانونية في الرياض<br><span>دليل الأحياء والقطاعات</span></h1><p>ابدأ من موقعك داخل الرياض، ثم افتح صفحة الحي المستقلة واختر المسار القانوني بحسب نوع الطلب ومرحلته. لكل حي عنوان ومحتوى وحالة عملية وأسئلة وروابط خاصة به.</p><div class="hero-actions"><a class="btn primary" href="#sectors">اختر قطاعك</a><a class="btn secondary" href="#all-neighborhoods">اختر الحي</a></div><div class="trust-row"><div><b>40 صفحة</b><span>رابط لكل حي</span></div><div><b>5 قطاعات</b><span>هيكل قابل للتصفح</span></div><div><b>لا فروع وهمية</b><span>استقبال إلكتروني</span></div></div></div><aside class="service-hero-aside" aria-label="دليل أحياء الرياض"><span class="service-badge">مدينة الرياض</span><div class="service-symbol" aria-hidden="true">40</div><h2>من الحي إلى التخصص</h2><p>اختر القطاع والحي، ثم حدد موضوع القضية ومرحلتها.</p><ul class="service-hero-points"><li>شمال وشرق الرياض</li><li>وسط وغرب الرياض</li><li>جنوب الرياض</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#sectors">القطاعات</a><a href="#all-neighborhoods">الأحياء الأربعون</a><a href="#services">الخدمات</a><a href="#method">طريقة التغطية</a><a href="#faq">الأسئلة الشائعة</a></nav></div>
  <section class="section" id="sectors"><div class="container"><div class="section-head"><span class="eyebrow">اختر موقعك</span><h2>قطاعات الخدمات القانونية في الرياض</h2><p>لكل قطاع صفحة مستقلة تعرض أحياءه وسياقه ومساراته وأسئلته، مع روابط واضحة إلى بقية المدينة.</p></div><div class="specialty-grid">${sectors.map((sector,index)=>`<article class="specialty-card" data-number="0${index+1}"><h3><a href="${sector.slug}">${sector.name}</a></h3><p>${sector.neighborhoods.join("، ")}.</p></article>`).join("")}</div></div></section>
  <section class="section alt" id="all-neighborhoods"><div class="container"><div class="section-head"><span class="eyebrow">40 رابطًا مستقلًا</span><h2>صفحات أحياء الرياض الأربعين</h2><p>اختر اسم الحي لفتح صفحته المنفصلة، وتشمل التغطية أي شارع أو مخطط داخله.</p></div><div class="locality-panels"><article class="locality-panel"><h3>شمال ووسط الرياض</h3><ul class="location-list">${[...sectors[0].neighborhoods,...sectors[2].neighborhoods].map(name=>`<li><a href="${neighborhoodSlugs[name]}">حي ${name}</a></li>`).join("")}</ul></article><article class="locality-panel"><h3>شرق وغرب وجنوب الرياض</h3><ul class="location-list">${[...sectors[1].neighborhoods,...sectors[3].neighborhoods,...sectors[4].neighborhoods].map(name=>`<li><a href="${neighborhoodSlugs[name]}">حي ${name}</a></li>`).join("")}</ul></article></div><p class="coverage-disclaimer">التغطية تعني استقبال الطلبات إلكترونيًا من هذه الأحياء، ولا تعني وجود فرع أو مكتب فعلي في كل حي.</p></div></section>
  <section class="section" id="services"><div class="container"><div class="section-head"><span class="eyebrow">ثماني صفحات تخصصية</span><h2>اختر التخصص القانوني المناسب في الرياض</h2><p>الموقع يحدد النطاق الجغرافي، بينما يحدد موضوع الطلب الخدمة والمستندات المطلوبة. افتح الصفحة الأقرب لطلبك.</p></div><div class="specialty-grid">${servicePages.map(([name,slug,text],index)=>`<article class="specialty-card" data-number="${String(index+1).padStart(2,"0")}"><h3><a href="${slug}">${name}</a></h3><p>${text}</p></article>`).join("")}</div></div></section>
  <section class="section alt" id="method"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">هيكل واضح للزائر</span><h2>من مدينة الرياض إلى صفحة الحي</h2><p>تربط هذه الصفحة المدينة بخمس صفحات قطاعية، ثم تربط كل صفحة قطاع بصفحات أحيائه المستقلة. تختلف صفحات الأحياء في التركيز القانوني والحالة العملية وقائمة التجهيز والأسئلة، مع روابط واضحة للعودة إلى القطاع والمدينة.</p></div><ol class="document-list"><li>اختر قطاع الرياض الذي يقع فيه الحي</li><li>افتح صفحة الحي المستقلة</li><li>حدّد نوع القضية أو الخدمة المطلوبة</li><li>اذكر المرحلة والجهة وأقرب موعد</li><li>ابدأ بملخص دون بيانات شديدة الحساسية</li></ol></div></section>
  <section class="section" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة التغطية</span><h2>أسئلة عن الخدمات القانونية في الرياض</h2></div>${faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></section>
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">ابدأ من الحي</span><h2>اذكر حي الرياض ونوع الطلب</h2><p>سنستخدمهما لتوجيه الطلب إلى المسار الأقرب وإيضاح الخطوة التالية.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ عبر واتساب</a></div></div></section></main>${footer(message)}</body></html>`;
}

writeFileSync(resolve(root, "legal-services-riyadh.html"), renderHub(), "utf8");
for (const sector of sectors) writeFileSync(resolve(root, sector.slug), renderSector(sector), "utf8");
console.log(`Generated ${sectors.length + 1} Riyadh pages covering ${sectors.reduce((sum, sector)=>sum+sector.neighborhoods.length,0)} neighborhoods.`);
