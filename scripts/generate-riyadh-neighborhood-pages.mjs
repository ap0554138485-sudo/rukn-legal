import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const riyadhServiceSlugs = [
  "lawyer-riyadh.html",
  "criminal-lawyer-riyadh.html",
  "family-lawyer-riyadh.html",
  "commercial-lawyer-riyadh.html",
  "labor-lawyer-riyadh.html",
  "execution-lawyer-riyadh.html",
  "contracts-lawyer-riyadh.html",
  "real-estate-lawyer-riyadh.html",
];

const topics = {
  contracts: {
    label: "العقود والاتفاقيات",
    short: "العقود",
    intro: "قراءة نطاق الالتزام والمدة والمقابل والضمان والإنهاء قبل اعتماد الصياغة أو بدء المطالبة.",
    cards: [
      ["فحص بنود العقد", "تحديد الأطراف والصفة ونطاق العمل والمقابل والمدة والضمانات والبنود التي تحتاج توضيحًا."],
      ["التعديل والإنهاء", "مراجعة أثر التعديل أو التجديد أو الفسخ، وربطه بالمراسلات والتنفيذ الفعلي للاتفاق."],
      ["إدارة الإخلال", "ترتيب الإشعارات والدفعات والالتزامات غير المنفذة قبل اختيار التفاوض أو المطالبة."],
      ["صياغة واضحة", "تحويل التفاهم التجاري أو الشخصي إلى التزامات قابلة للفهم والقياس دون وعود بنتيجة."],
    ],
    docs: ["نسخة العقد وجميع ملاحقه", "العروض والمراسلات السابقة للتوقيع", "جدول الدفعات وما تم تنفيذه", "الإشعارات أو طلبات التعديل", "النتيجة المطلوبة والموعد المهم"],
  },
  realEstate: {
    label: "العقار والإيجار والمقاولات",
    short: "العقار",
    intro: "جمع مستند الملكية والعقد ووصف العقار والدفعات والتسليم لمعرفة طبيعة الحق والإجراء المناسب.",
    cards: [
      ["البيع والشراء", "مراجعة الصفة ووصف الأصل والمقابل والتسليم والضمانات والمستندات المرتبطة بالتصرف."],
      ["الإيجار والانتفاع", "قراءة المدة والأجرة والصيانة والاستخدام والإخلاء والمطالبات المتبادلة."],
      ["المقاولات والتسليم", "ربط نطاق الأعمال والمواصفات والتغييرات والدفعات ومحاضر الاستلام بالمطالبة."],
      ["الملكية والمطالبات", "ترتيب الصك أو المستند المتاح والعقود والمراسلات قبل تحديد الطلب المالي أو العيني."],
    ],
    docs: ["الصك أو مستند الملكية المتاح", "عقد البيع أو الإيجار أو المقاولة", "المخططات أو وصف الوحدة", "الدفعات ومحاضر التسليم", "المراسلات والإشعارات المرتبطة بالنزاع"],
  },
  commercial: {
    label: "الأعمال والمنازعات التجارية",
    short: "التجارة",
    intro: "تحديد صفة المنشأة أو الشريك، وأصل الالتزام، والفواتير والمراسلات والمرحلة الحالية قبل اختيار المسار.",
    cards: [
      ["علاقات الشركاء", "مراجعة الصفة والقرارات والاتفاقات والحقوق محل الخلاف قبل اقتراح الإجراء."],
      ["الموردون والعملاء", "تنظيم الطلبات والفواتير والتسليم والاعتراضات والمراسلات في تسلسل زمني واضح."],
      ["العقود التجارية", "قراءة نطاق التوريد أو الخدمة والدفعات والجزاءات والإنهاء والتسوية."],
      ["التفاوض أو الدعوى", "فصل ما يمكن معالجته بالمراسلة والتسوية عما يحتاج إلى مطالبة أو إجراء قضائي."],
    ],
    docs: ["السجل أو ما يوضح صفة المنشأة", "العقد والطلبات والفواتير", "إثباتات التسليم أو الإنجاز", "مراسلات الاعتراض والمطالبة", "المبلغ أو الالتزام والنتيجة المطلوبة"],
  },
  labor: {
    label: "العمل والمستحقات العمالية",
    short: "العمل",
    intro: "ترتيب عقد العمل والأجر والإشعارات وتاريخ انتهاء العلاقة والمستحقات والمرحلة الحالية في ملف واحد.",
    cards: [
      ["العقد والأجر", "مراجعة طبيعة العلاقة والأجر والمزايا والمدة والمهام وما يثبت التنفيذ."],
      ["إنهاء العلاقة", "فهم سبب وتاريخ الإنهاء والإشعار وآثاره دون افتراض صحة موقف أي طرف."],
      ["المستحقات", "حصر الأجور أو الإجازات أو المكافآت أو التعويضات المطلوبة وربطها بالمستند."],
      ["التسوية والدعوى", "تحديد ما تم في التسوية الودية ومواعيد الدعوى والطلبات والمرفقات اللازمة."],
    ],
    docs: ["عقد العمل أو وصف العلاقة", "مسيرات أو تحويلات الأجر", "الإشعارات والقرارات", "حصر المستحقات المطالب بها", "ما يوضح مرحلة التسوية أو الدعوى"],
  },
  family: {
    label: "الأحوال الشخصية والأسرة",
    short: "الأسرة",
    intro: "تحديد صفة مقدم الطلب، ونوع المسألة الأسرية، وتسلسل الوقائع، والطلب المحدد، وأقرب موعد قائم.",
    cards: [
      ["الفرقة الزوجية", "تنظيم الوقائع والطلبات في مسائل الطلاق أو الفسخ أو ما يتصل بإنهاء العلاقة."],
      ["النفقة والحضانة", "فصل طلب النفقة عن الحضانة والزيارة وربط كل طلب بالوقائع والمستندات المناسبة."],
      ["التركات والمواريث", "تحديد صفة الورثة والأصول والمستندات والخلاف قبل اقتراح خطوة قانونية."],
      ["التنفيذ الأسري", "قراءة الحكم أو السند وما نُفذ منه وما بقي، مع مراعاة الخصوصية والمواعيد."],
    ],
    docs: ["ما يوضح الصفة الأسرية", "الحكم أو المحضر إن وجد", "تسلسل مختصر للوقائع", "المراسلات اللازمة فقط", "الطلب المحدد والموعد القادم"],
  },
  execution: {
    label: "التنفيذ والمطالبات المالية",
    short: "التنفيذ",
    intro: "التمييز بين حق يحتاج إلى إثبات وسند جاهز للتنفيذ، ثم مراجعة المبلغ والإجراءات وما تم سداده.",
    cards: [
      ["فحص السند", "تحديد نوع الحكم أو السند وأطرافه ومبلغه وما إذا كان نهائيًا أو قابلًا للإجراء."],
      ["طلب التنفيذ", "ترتيب البيانات الأساسية وما تم تقديمه والقرارات والإشعارات الظاهرة في الطلب."],
      ["منازعات التنفيذ", "فهم سبب الاعتراض أو الإشكال وربطه بالسداد أو الصفة أو نطاق السند."],
      ["التسوية والوفاء", "توثيق المقترحات والمدفوعات والرصيد وآلية الإقفال دون إغفال أثر السند."],
    ],
    docs: ["الحكم أو السند التنفيذي", "رقم الطلب ومرحلته دون بيانات دخول", "كشف المبلغ والمدفوعات", "القرارات والإشعارات الحالية", "الطلب النهائي وأقرب مهلة"],
  },
  criminal: {
    label: "القضايا الجنائية والاعتراضات",
    short: "الجنائي",
    intro: "تحديد ما إذا كان الملف في البلاغ أو التحقيق أو المحاكمة أو الاعتراض، مع حماية الخصوصية ومراعاة المواعيد.",
    cards: [
      ["البلاغ والتحقيق", "تحديد صفة صاحب الطلب والجهة والمرحلة والموعد دون نشر تفاصيل حساسة في الرسالة الأولى."],
      ["الدفاع والمذكرات", "ترتيب الوقائع والأدلة والطلبات والردود وفق المستندات الفعلية للملف."],
      ["الحق الخاص", "فصل الجانب الجزائي عن المطالبة الخاصة وتحديد ما صدر وما بقي من طلبات."],
      ["الاعتراض", "مراجعة الحكم وتاريخ التبليغ والأسباب المحتملة والمهلة قبل إعداد أي لائحة."],
    ],
    docs: ["ما يوضح الصفة في القضية", "المحضر أو القرار أو الحكم المتاح", "التسلسل الزمني المختصر", "موعد التحقيق أو الجلسة أو نهاية المهلة", "الطلب دون إرسال أدلة حساسة علنًا"],
  },
  objections: {
    label: "المذكرات واللوائح والاعتراض",
    short: "المذكرات",
    intro: "قراءة الطلبات والدفوع والمستندات وقرار الجهة والمهلة قبل صياغة مذكرة مرتبطة بوقائع الملف.",
    cards: [
      ["تحليل الحكم", "تحديد منطوق الحكم وأسبابه وطلبات الأطراف وتاريخ التبليغ قبل بحث الاعتراض."],
      ["بناء المذكرة", "تنظيم الوقائع والطلبات والأسانيد والمرفقات في ترتيب يخدم الغرض المحدد."],
      ["الردود والدفوع", "التمييز بين الرد على واقعة والاعتراض على مستند والدفع المرتبط بالإجراء."],
      ["إدارة المهلة", "تثبيت تاريخ البداية والنهاية والجهة وطريقة التقديم لتجنب العمل على افتراض زمني."],
    ],
    docs: ["صحيفة الدعوى والطلبات", "المذكرات المتبادلة", "المستندات الجوهرية فقط", "الحكم أو القرار وتاريخ التبليغ", "المهلة والنتيجة المطلوبة من المذكرة"],
  },
  claims: {
    label: "الديون والمطالبات المالية",
    short: "المطالبات",
    intro: "تحديد سبب الدين ومقداره واستحقاقه والمستند المؤيد والمطالبة السابقة قبل تحديد الإنذار أو الدعوى أو التنفيذ.",
    cards: [
      ["أصل المديونية", "تحديد العقد أو الفاتورة أو الإقرار أو التعامل الذي نشأ عنه المبلغ المطلوب."],
      ["الاستحقاق والسداد", "إعداد كشف واضح للمبلغ وتواريخه وما تم دفعه أو الاعتراض عليه."],
      ["المطالبة السابقة", "جمع الإنذارات والمراسلات والردود ومحاولات التسوية في خط زمني واحد."],
      ["الدعوى أو التنفيذ", "معرفة هل يوجد سند تنفيذي أم يلزم إثبات الحق أولًا أمام الجهة المختصة."],
    ],
    docs: ["العقد أو الفاتورة أو الإقرار", "كشف المبلغ وتاريخ استحقاقه", "إثباتات الدفع الجزئي", "المراسلات والإنذارات", "صفة الأطراف والنتيجة المطلوبة"],
  },
  inheritance: {
    label: "التركات والمواريث",
    short: "المواريث",
    intro: "حصر صفة الورثة والأصول والالتزامات والمستندات والإجراءات السابقة قبل مناقشة القسمة أو المطالبة.",
    cards: [
      ["حصر الأطراف", "تحديد الورثة وصفة مقدم الطلب وما يتوفر من مستندات دون إغفال أي طرف ذي صلة."],
      ["حصر التركة", "جمع الأصول والحقوق والديون والمستندات في قائمة قابلة للمراجعة."],
      ["القسمة والاتفاق", "تمييز ما تم الاتفاق عليه عما بقي محل خلاف وتوثيق العروض والمراسلات."],
      ["النزاع والتنفيذ", "فهم الأحكام أو الإجراءات السابقة وما يحتاج إلى مطالبة أو قسمة أو تنفيذ."],
    ],
    docs: ["مستندات إثبات الصفة المتاحة", "قائمة أولية بالأصول والديون", "الصكوك والعقود ذات الصلة", "الاتفاقات أو الأحكام السابقة", "موضع الخلاف والنتيجة المطلوبة"],
  },
};

const neighborhoods = [
  ["الملقا", "al-malqa", "north", "العقار", "العقود", "مراجعة عقد شراء وحدة مع جدول دفعات وتسليم وضمانات قبل اتخاذ قرار التوقيع.", "ابدأ بتحديد العقار وصفة الأطراف، ثم ضع الصك أو الوصف والعقد والدفعات في ملف واحد."],
  ["حطين", "hittin", "north", "التجارة", "العقود", "اتفاقية تشغيل بين منشأة ومقدم خدمة اختلف الطرفان في نطاقها ومؤشرات الإنجاز.", "افصل ما كُتب في العقد عما نُفذ فعليًا، وأرفق التعديلات والفواتير والمراسلات بترتيبها."],
  ["الياسمين", "al-yasmin", "north", "الأسرة", "المواريث", "طلب أسري يجمع نفقة وحضانة مع حكم سابق يحتاج إلى ترتيب دقيق للطلبات.", "اكتب طلبًا مستقلًا لكل مسألة، وحدد الصفة والمرحلة وأقرب جلسة دون مشاركة تفاصيل حساسة."],
  ["النرجس", "al-narjis", "north", "العقار", "المطالبات", "خلاف مقاولة على أعمال إضافية وتأخر وتسليم ودفعات لم يُحسم وصفها في المراسلات.", "اجمع العقد والمواصفات وطلبات التغيير ومحاضر الاستلام قبل حساب المبلغ محل الخلاف."],
  ["العارض", "al-arid", "north", "العقود", "التنفيذ", "سند مرتبط باتفاق تسوية يحتاج إلى معرفة ما نُفذ منه وما بقي مستحقًا.", "قارن نص التسوية بالسداد الفعلي والحكم أو السند، ثم وضح المرحلة الحالية في التنفيذ."],
  ["القيروان", "al-qirawan", "north", "التجارة", "المطالبات", "مستحقات مورد تتوزع بين أوامر شراء وفواتير وتسليمات واعتراضات متعددة.", "أنشئ كشفًا زمنيًا يربط كل طلب بفاتورته وإثبات تسليمه والدفعة أو الاعتراض المقابل."],
  ["الصحافة", "al-sahafah", "north", "المذكرات", "التجارة", "نزاع أعمال وصل إلى حكم أولي ويحتاج إلى تحليل المنطوق والأسباب والطلبات السابقة.", "ثبّت تاريخ التبليغ أولًا، ثم قارن الحكم بصحيفة الدعوى والمذكرات والمستندات الجوهرية."],
  ["العقيق", "al-aqiq", "north", "العقار", "المواريث", "عقار ضمن تركة تتداخل فيه الملكية والانتفاع والقسمة ومصروفات سابقة.", "افصل مستندات الملكية عن إثبات الصفة وعن الحسابات، وحدد الجزء المتفق عليه ومحل النزاع."],
  ["الربيع", "al-rabi", "north", "العمل", "العقود", "علاقة عمل تتضمن التزام سرية أو عدم منافسة مع خلاف على الإنهاء والمستحقات.", "ضع عقد العمل وملحقاته والإشعارات وكشف المستحقات، وحدد البند الذي يحتاج تفسيرًا."],
  ["النفل", "al-nafl", "north", "المطالبات", "التنفيذ", "مطالبة مالية لها إقرار أو حكم مع دفعات جزئية لم تظهر في رصيد موحد.", "جهز كشفًا بالمبلغ الأصلي وكل دفعة وتاريخها، ثم أرفق السند وما تم في الطلب التنفيذي."],
  ["النخيل", "al-nakheel", "north", "التجارة", "العمل", "منشأة تريد تنظيم إنهاء علاقة موظف مع مطالبات متبادلة وسجلات أداء وإشعارات.", "افصل ملف الأداء عن حساب المستحقات، وثبّت التسلسل الزمني للقرارات والتبليغات."],
  ["الغدير", "al-ghadir", "north", "العقود", "المذكرات", "اتفاقية خدمات نشأ عنها نزاع ثم مذكرات تحتاج إلى ربط كل دفع ببند ومستند.", "ابدأ بجدول: الالتزام، البند، واقعة التنفيذ، المستند، ثم صغ الطلب بناءً على هذا الربط."],

  ["قرطبة", "qurtubah", "east", "العقار", "العقود", "عقد إيجار تجاري يجمع التجهيز والصيانة وفترة السماح والتسليم النهائي.", "حدد حالة العقار عند البداية، والتزامات كل طرف، ومحاضر الاستلام، وأثر أي تعديل لاحق."],
  ["غرناطة", "gharnatah", "east", "التجارة", "التنفيذ", "حكم تجاري انتقل للتنفيذ بينما توجد دفعات أو تسوية لاحقة تحتاج إلى توثيق.", "اجمع الحكم وطلب التنفيذ والتسوية وإثباتات الدفع، ولا تعتمد على رصيد غير موثق."],
  ["اليرموك", "al-yarmouk", "east", "الأسرة", "المذكرات", "قضية حضانة أو زيارة قائمة تحتاج مذكرة تركز على الطلبات والوقائع ذات الصلة.", "حدد الحكم السابق والطلب الحالي والوقائع الجديدة والموعد، وتجنب السرد غير المرتبط بالطلب."],
  ["المونسية", "al-munsiyah", "east", "العقار", "التنفيذ", "حكم أو اتفاق مرتبط بعقار لم يكتمل تنفيذه أو تسليمه وفق ما يفهمه أحد الأطراف.", "قارن منطوق السند بما تم على الواقع، وحدد بدقة الجزء المنفذ والجزء المتبقي."],
  ["إشبيلية", "ishbiliyah", "east", "العمل", "المطالبات", "موظف أو منشأة يختلفان في الأجر المتغير والعمولات ونهاية العلاقة.", "اجمع العقد وسياسة العمولة وكشوف الأداء والتحويلات، ثم احسب كل بند على حدة."],
  ["الرمال", "al-rimal", "east", "العقار", "التجارة", "مشروع مقاولة أو توريد عقاري يتداخل فيه نطاق الأعمال مع الفواتير والتغييرات.", "اربط كل تغيير بموافقته وكلفته وتاريخ تنفيذه ومحضر الاستلام أو الاعتراض المقابل."],
  ["الروضة", "al-rawdah", "east", "الأسرة", "المطالبات", "مطالبات أسرية مالية تحتاج إلى فصل النفقة الجارية عن المبالغ السابقة والتنفيذ.", "أنشئ كشفًا زمنيًا للطلبات والأحكام والمدفوعات، وحدد أي مبلغ محل خلاف وسببه."],
  ["الحمراء", "al-hamra", "east", "التجارة", "المذكرات", "دعوى بين شركاء أو منشآت وصلت إلى مرحلة رد أو اعتراض مع مستندات كثيرة.", "صنف المستندات بحسب كل واقعة وطلب، ولا تكرر المرفقات التي لا تغير النتيجة المطلوبة."],
  ["الخليج", "al-khaleej", "east", "العمل", "التنفيذ", "حكم عمالي أو محضر تسوية يحتاج إلى متابعة المبلغ وما تم الوفاء به.", "طابق منطوق السند مع كشف المستحقات والمدفوعات، ثم دوّن الإجراء الحالي وموعده."],
  ["القدس", "al-quds", "east", "العقود", "المطالبات", "خدمة أو توريد توقف قبل الإكمال ونشأ خلاف على العربون والدفعات والأعمال المنجزة.", "حدد نقطة التوقف وسببها، ثم قارن نسبة الإنجاز بنص العقد والفواتير والإشعارات."],
  ["النهضة", "al-nahdah", "east", "الجنائي", "المذكرات", "ملف جزائي في مرحلة حكم أو اعتراض يتطلب حماية الخصوصية وضبط المهلة.", "ابدأ بالحكم وتاريخ التبليغ والطلبات السابقة، ولا ترسل أدلة حساسة قبل تحديد قناة آمنة."],
  ["الريان", "al-rayyan", "east", "المواريث", "العقار", "تركة تشمل عقارات وعقود انتفاع أو إيجار ومصروفات تحتاج إلى حصر منفصل.", "أنشئ قائمة بكل أصل ودخله والتزاماته ومستنده، ثم حدد موضع الاتفاق والخلاف بين الأطراف."],
  ["الروابي", "al-rawabi", "east", "المطالبات", "الأسرة", "مبلغ مرتبط بعلاقة أسرية أو اتفاق سابق يحتاج إلى تمييزه عن النفقة أو التركة.", "حدد أساس كل مبلغ ومستنده وصفة الأطراف، وافصل الطلبات الأسرية عن الدين المستقل."],

  ["العليا", "al-olaya", "central", "التجارة", "العقود", "اتفاق مساهمين أو شراكة يحتاج إلى مراجعة الإدارة والقرارات والخروج وتسوية الحقوق.", "اجمع التأسيس والاتفاقات والقرارات والحسابات، وحدد المسألة المطلوب حسمها قبل الصياغة."],
  ["السليمانية", "al-sulaymaniyah", "central", "العقود", "العمل", "عقد خدمات مهنية أو عمل مرن يختلط فيه نطاق المهام بالمقابل والملكية الفكرية.", "وضح طبيعة العلاقة الفعلية، ثم راجع نطاق العمل والدفعات والسرية والإنهاء كل بند بمفرده."],
  ["الملز", "al-malaz", "central", "العمل", "المذكرات", "نزاع عمالي قائم يحتاج إلى رد منظم على مطالبة أو مستند مع موعد جلسة محدد.", "جهز جدولًا للوقائع والعقد والأجر والإنهاء، ثم اربط كل رد بالمستند الذي يؤيده."],
  ["المربع", "al-murabba", "central", "المذكرات", "التنفيذ", "قرار أو حكم يحتاج إلى فهم الفرق بين الاعتراض على الأصل والإشكال في التنفيذ.", "ثبّت المرحلة والمهلة، وافصل أسباب الاعتراض على الحكم عن الوقائع التي نشأت أثناء التنفيذ."],
  ["الديرة", "al-dirah", "central", "المواريث", "المذكرات", "نزاع تركة وصل إلى دعوى أو حكم ويحتاج إلى ترتيب الصفة والأصول والطلبات.", "ابدأ بمستند الصفة وقائمة الأصول، ثم طابق الحكم أو المذكرة مع الجزء المتنازع عليه فقط."],

  ["ظهرة لبن", "dhahrat-laban", "west", "العقار", "المطالبات", "خلاف بيع أو مقاولة يتضمن عربونًا ودفعات وأعمالًا أو تسليمًا مختلفًا عليه.", "اجمع العقد وكشف الدفع ووصف ما نُفذ ومحاضر التسليم، ثم حدد المبلغ والطلب بدقة."],
  ["طويق", "tuwaiq", "west", "العقار", "العقود", "اتفاق بناء أو ترميم يحتاج إلى ضبط المواصفات والتغييرات والمدة وآلية الاستلام.", "حوّل المواصفات والدفعات والمراحل إلى جدول، وحدد طريقة اعتماد أي تغيير قبل تنفيذه."],
  ["العريجاء", "al-uraija", "west", "الأسرة", "المواريث", "مسألة أسرية تتقاطع مع تركة أو ملكية مشتركة وتحتاج إلى فصل الصفات والطلبات.", "قسّم الملف إلى صفة أسرية، وأصل مالي، وطلب قائم، ثم اجمع مستندات كل جزء منفصلة."],
  ["السويدي", "al-suwaidi", "west", "العمل", "المطالبات", "مستحقات عمالية تشمل أجورًا أو إجازات أو مكافأة مع دفعات غير مكتملة.", "أعد كشفًا لكل نوع مستحق وتاريخه وما دُفع منه، واربط الحساب بالعقد والتحويلات."],
  ["نمار", "namar", "south", "الأسرة", "التنفيذ", "حكم نفقة أو حضانة أو زيارة يحتاج إلى تحديد ما تم تنفيذه وما بقي محل طلب.", "ضع الحكم والمحاضر والمدفوعات والوقائع اللاحقة بترتيبها، وحدد الطلب التنفيذي الحالي."],
  ["الشفا", "al-shifa", "south", "العمل", "الجنائي", "واقعة في بيئة العمل قد تتضمن مسارًا عماليًا وآخر جزائيًا ولا ينبغي خلطهما.", "افصل حق العمل ومستنداته عن البلاغ أو التحقيق، وحدد الجهة والمرحلة لكل مسار."],
  ["بدر", "badr", "south", "المطالبات", "التنفيذ", "دين مثبت بمستندات ومدفوعات جزئية يحتاج إلى تحديد الرصيد والمسار الصحيح.", "وحّد الفواتير والإقرار والمدفوعات في كشف واحد، ثم تحقق هل يلزم إثبات الحق أم التنفيذ."],
  ["العزيزية", "al-aziziyah", "south", "التجارة", "العمل", "منشأة تواجه خلافًا مع عامل أو متعاقد وتحتاج إلى تحديد طبيعة العلاقة أولًا.", "قارن العقد بطريقة العمل والدفع والإشراف الفعلي، ثم اختر المستندات والإجراء وفق الوصف الصحيح."],
  ["الدار البيضاء", "al-dar-al-baida", "south", "الأسرة", "المذكرات", "قضية أسرية قائمة تحتاج إلى لائحة أو رد يركز على الطلب الحالي والمستند المؤثر.", "اكتب الوقائع المرتبطة بالطلب فقط، وثبّت الحكم السابق والموعد والمستندات الجوهرية."],
  ["الحزم", "al-hazm", "west", "العقار", "التنفيذ", "سند أو حكم عقاري يحتاج إلى مطابقة منطوقه بالتسليم أو الإخلاء أو المبلغ المنفذ.", "قارن المطلوب في السند بالواقع الحالي، وارفق ما يثبت التسليم أو الدفع أو الامتناع."],
];

const topicKeys = {
  "العقود": "contracts", "العقار": "realEstate", "التجارة": "commercial", "العمل": "labor", "الأسرة": "family",
  "التنفيذ": "execution", "الجنائي": "criminal", "المذكرات": "objections", "المطالبات": "claims", "المواريث": "inheritance",
};

const sectorInfo = {
  north: ["شمال الرياض", "legal-services-north-riyadh.html"],
  east: ["شرق الرياض", "legal-services-east-riyadh.html"],
  central: ["وسط الرياض", "legal-services-central-riyadh.html"],
  west: ["غرب الرياض", "legal-services-west-riyadh.html"],
  south: ["جنوب الرياض", "legal-services-south-riyadh.html"],
};

const pages = neighborhoods.map(([name, rawSlug, sector, primaryLabel, secondaryLabel, scenario, firstStep], index) => ({
  name,
  slug: `legal-services-riyadh-${rawSlug}.html`,
  sector,
  primary: topics[topicKeys[primaryLabel]],
  secondary: topics[topicKeys[secondaryLabel]],
  scenario,
  firstStep,
  index,
}));

const logo = `<div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div>`;
const analytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;

function header(page, message) {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">دليل مستقل لحي ${page.name} بمدينة الرياض</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
  <header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية">${logo}<div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="legal-services-riyadh.html">دليل الرياض</a><a href="#services">المسارات</a><a href="#scenario">حالة عملية</a><a href="#faq">الأسئلة</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(message) {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>استقبال طلبات الخدمات القانونية إلكترونيًا من أحياء الرياض ومختلف مناطق المملكة.</p></div><div><b>دليل الرياض</b><a href="legal-services-riyadh.html">أحياء الرياض الأربعون</a><a href="legal-services-north-riyadh.html">شمال الرياض</a><a href="legal-services-east-riyadh.html">شرق الرياض</a><a href="legal-services-central-riyadh.html">وسط الرياض</a><a href="legal-services-west-riyadh.html">غرب الرياض</a><a href="legal-services-south-riyadh.html">جنوب الرياض</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer><a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="script.js"></script>`;
}

function nearbyPages(page) {
  const sameSector = pages.filter((item) => item.sector === page.sector);
  const position = sameSector.findIndex((item) => item.slug === page.slug);
  return [1, 2, 3].map((offset) => sameSector[(position + offset) % sameSector.length]);
}

function pageVariant(page) {
  const variants = [
    ["ابدأ من المستند لا من اسم القضية", "المستند الأساسي والمرحلة الحالية يكشفان المسار أسرع من وصف عام للمشكلة."],
    ["رتّب الوقائع قبل طلب الإجراء", "التسلسل الزمني يوضح ما حدث، بينما يحدد الطلب النتيجة التي تريد الوصول إليها."],
    ["افصل الوقاية عن النزاع", "مراجعة ما قبل التوقيع تختلف عن المطالبة بعد الإخلال، وكل مرحلة تحتاج مستندات مختلفة."],
    ["حدّد الصفة والمرحلة والمهلة", "هذه العناصر الثلاثة تمنع خلط الاستشارة الأولية بقضية قائمة أو تنفيذ بعد الحكم."],
    ["اجعل الرسالة الأولى قابلة للتوجيه", "اسم الحي ونوع الموضوع وأقرب موعد والمستند الأساسي تكفي كبداية منظمة."],
  ];
  return variants[page.index % variants.length];
}

function render(page) {
  const url = `${baseUrl}/${page.slug}`;
  const [sectorName, sectorSlug] = sectorInfo[page.sector];
  const near = nearbyPages(page);
  const [methodTitle, methodText] = pageVariant(page);
  const message = `السلام عليكم، أرغب في خدمة قانونية من حي ${page.name} بالرياض. نوع الطلب ومرحلته: `;
  const title = `خدمات قانونية في حي ${page.name} بالرياض | ${page.primary.short} و${page.secondary.short}`;
  const description = `خدمات قانونية في حي ${page.name} بالرياض تشمل ${page.primary.short} و${page.secondary.short}، مع خطوات عملية لتجهيز الطلب واستقبال إلكتروني من الحي دون ادعاء وجود فرع.`;
  const faqs = [
    [`ما نقطة البداية لطلب ${page.primary.short} من حي ${page.name}؟`, `${page.firstStep} ويمكن بدء الاستقبال إلكترونيًا بذكر الحي والمرحلة والموعد المهم.`],
    [`متى يكون مسار ${page.secondary.short} هو الأنسب؟`, `${page.secondary.intro} ويتحدد الاختيار النهائي بعد الاطلاع على الصفة والمستند والنتيجة المطلوبة.`],
    [`هل تشمل الخدمة كل شارع داخل حي ${page.name}؟`, `نعم، يشمل استقبال الطلب الإلكتروني أي شارع أو مخطط داخل حي ${page.name}، لكن ذكر الحي لا يعني وجود مكتب أو فرع فعلي فيه.`],
    [`ما الذي لا ينبغي إرساله في الرسالة الأولى؟`, `لا ترسل كلمات مرور أو بيانات بنكية أو أصول مستندات أو تفاصيل شديدة الحساسية. ابدأ بملخص، ثم استخدم قناة الاستلام التي تُحدد بعد المراجعة الأولية.`],
  ];
  const schema = {"@context":"https://schema.org","@graph":[
    {"@type":"Service","@id":`${url}#service`,name:`خدمات قانونية في حي ${page.name} بالرياض`,serviceType:`${page.primary.label} و${page.secondary.label} في حي ${page.name}`,url,provider:{"@type":"Organization","@id":`${baseUrl}/#organization`,name:"رُكن الأنظمة القانونية",url:`${baseUrl}/`,telephone:phone},areaServed:{"@type":"Place",name:`حي ${page.name}، الرياض`,containedInPlace:{"@type":"City",name:"الرياض"}}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"دليل الرياض",item:`${baseUrl}/legal-services-riyadh.html`},{"@type":"ListItem",position:3,name:sectorName,item:`${baseUrl}/${sectorSlug}`},{"@type":"ListItem",position:4,name:`حي ${page.name}`,item:url}]},
    {"@type":"FAQPage",mainEntity:faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
  ]};
  const mainCards = page.primary.cards.map(([heading, body], index) => `<article class="specialty-card" data-number="0${index + 1}"><h3>${heading}</h3><p>${body}</p></article>`).join("");
  const secondaryCards = page.secondary.cards.slice(0, 2).map(([heading, body], index) => `<article class="specialty-card" data-number="0${index + 5}"><h3>${heading}</h3><p>${body}</p></article>`).join("");
  const docs = [...page.primary.docs.slice(0, 3), ...page.secondary.docs.slice(0, 2), `اسم الشارع داخل حي ${page.name} إن كان مؤثرًا في الطلب`];
  const alternateSection = page.index % 2 === 0
    ? `<section class="section alt" id="scenario"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">مثال تنظيمي خاص بالصفحة</span><h2>حالة عملية من نوع الطلب المستهدف في ${page.name}</h2><p>${page.scenario}</p><p>${page.firstStep}</p></div><div class="locality-panel"><h3>${methodTitle}</h3><p>${methodText}</p><p class="coverage-disclaimer">المثال للتوضيح العام ولا يمثل تقييمًا لقضية بعينها أو وعدًا بنتيجة.</p></div></div></section>`
    : `<section class="section alt" id="scenario"><div class="container"><div class="section-head"><span class="eyebrow">سيناريو إرشادي لحي ${page.name}</span><h2>${methodTitle}</h2><p>${page.scenario}</p></div><div class="locality-panels"><article class="locality-panel"><h3>الخطوة الأولى</h3><p>${page.firstStep}</p></article><article class="locality-panel"><h3>لماذا هذا الترتيب؟</h3><p>${methodText}</p><p class="coverage-disclaimer">الحالة افتراضية للتنظيم ولا تعد استشارة مخصصة.</p></article></div></div></section>`;

  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head>${analytics}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script><link rel="stylesheet" href="styles.css"></head><body>
  ${header(page, message)}<main><div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="legal-services-riyadh.html">دليل الرياض</a><span aria-hidden="true">/</span><a href="${sectorSlug}">${sectorName}</a><span aria-hidden="true">/</span><span>حي ${page.name}</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">صفحة حي مستقلة • ${sectorName}</span><h1>خدمات قانونية في حي ${page.name} بالرياض<br><span>${page.primary.short} و${page.secondary.short}</span></h1><p>دليل محلي مستقل يركز على ${page.primary.label} و${page.secondary.label}. تبدأ الخدمة بتحديد الموضوع والصفة والمرحلة والمستند الأساسي، ثم يتحدد نطاق العمل وإمكان تقديمه بعد المراجعة الأولية.</p><div class="hero-actions"><a class="btn primary" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ من حي ${page.name}</a><a class="btn secondary" href="#prepare">جهّز الطلب</a></div><div class="trust-row"><div><b>حي ${page.name}</b><span>رابط مستقل</span></div><div><b>${page.primary.short}</b><span>مسار أساسي</span></div><div><b>${page.secondary.short}</b><span>مسار مكمل</span></div></div></div><aside class="service-hero-aside" aria-label="دليل حي ${page.name}"><span class="service-badge">${page.primary.label}</span><div class="service-symbol" aria-hidden="true">${String(page.index + 1).padStart(2,"0")}</div><h2>${methodTitle}</h2><p>${methodText}</p><ul class="service-hero-points"><li>الحي والشارع</li><li>نوع الطلب والصفة</li><li>المرحلة والموعد</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#services">المسار الأساسي</a><a href="#scenario">الحالة العملية</a><a href="#prepare">التجهيز</a><a href="#nearby">أحياء قريبة</a><a href="#faq">الأسئلة</a></nav></div>
  <section class="section" id="services"><div class="container"><div class="section-head"><span class="eyebrow">التركيز الأول في حي ${page.name}</span><h2>${page.primary.label}</h2><p>${page.primary.intro}</p></div><div class="specialty-grid">${mainCards}${secondaryCards}</div><p class="service-legal-note">أضيف مسار ${page.secondary.label} لأنه يعالج جانبًا مكملًا في هذه الصفحة، بينما تُحدّد الخدمة الفعلية بعد مراجعة موضوع الطلب.</p></div></section>
  ${alternateSection}
  <section class="section" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">قائمة خاصة بمساري الصفحة</span><h2>ماذا تجهز قبل التواصل من حي ${page.name}؟</h2><p>لا يلزم إرسال الملف كاملًا. ابدأ بالعناصر التي تثبت الصفة والمرحلة وتشرح النتيجة المطلوبة، ثم تُطلب بقية المستندات عند الحاجة.</p></div><ol class="document-list">${docs.map((item)=>`<li>${item}</li>`).join("")}</ol></div></section>
  <section class="section alt" id="nearby"><div class="container"><div class="section-head"><span class="eyebrow">روابط جغرافية مستقلة</span><h2>أحياء أخرى في ${sectorName}</h2><p>يمكنك الانتقال إلى صفحة الحي الصحيحة إذا كان موقع الطلب خارج حي ${page.name}. لكل حي رابط وعنوان ومحتوى ومسارات منفصلة.</p></div><div class="related-services"><a href="${sectorSlug}">دليل ${sectorName}</a>${near.map((item)=>`<a href="${item.slug}">خدمات قانونية في حي ${item.name}</a>`).join("")}</div><p class="coverage-disclaimer">يستقبل الموقع الطلبات إلكترونيًا من أي شارع داخل الحي. هذا النطاق لا يعني وجود فرع أو مكتب فعلي في حي ${page.name} أو الأحياء المرتبطة.</p></div></section>
  <section class="section" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">إجابات خاصة بالحي والمسارين</span><h2>أسئلة عن الخدمات القانونية في حي ${page.name}</h2></div>${faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></section>
  <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">استقبال إلكتروني من ${page.name}</span><h2>اذكر الحي والشارع ونوع الطلب</h2><p>أرسل ملخصًا قصيرًا والمرحلة وأقرب موعد دون بيانات شديدة الحساسية.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">إرسال الطلب عبر واتساب</a></div></div></section></main>${footer(message)}</body></html>`;
}

for (const page of pages) writeFileSync(resolve(root, page.slug), render(page), "utf8");

function updateSitemap() {
  const sitemapPath = resolve(root, "sitemap.xml");
  let sitemap = readFileSync(sitemapPath, "utf8");
  const serviceEntries = riyadhServiceSlugs.map((slug) => `  <url>\n    <loc>${baseUrl}/${slug}</loc>\n    <lastmod>2026-08-18</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
  const neighborhoodEntries = pages.map((page) => `  <url>\n    <loc>${baseUrl}/${page.slug}</loc>\n    <lastmod>2026-08-18</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
  for (const entry of [...serviceEntries, ...neighborhoodEntries]) {
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const escaped = location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\s*<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>`);
    sitemap = pattern.test(sitemap)
      ? sitemap.replace(pattern, `\n${entry}`)
      : sitemap.replace("</urlset>", `${entry}\n</urlset>`);
  }
  writeFileSync(sitemapPath, sitemap, "utf8");
}

updateSitemap();
console.log(`Generated ${pages.length} independent Riyadh neighborhood pages.`);
