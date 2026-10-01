// Shared configuration for the national legal-questions library (ask-*.html).
// Each category supplies the eyebrow, the lawyer pages that match the question's intent,
// and a short "when do you need a lawyer" note. Question content lives in the data-*.mjs files.

export const sources = {
  najiz: ["منصة ناجز — الخدمات العدلية الإلكترونية", "https://najiz.sa/applications/landing"],
  moj: ["وزارة العدل", "https://www.moj.gov.sa/ar/Pages/default.aspx"],
  laws: ["هيئة الخبراء بمجلس الوزراء — الأنظمة السعودية", "https://laws.boe.gov.sa/"],
  hrsd: ["وزارة الموارد البشرية والتنمية الاجتماعية", "https://www.hrsd.gov.sa/"],
  qiwa: ["منصة قوى", "https://www.qiwa.sa/"],
  gosi: ["المؤسسة العامة للتأمينات الاجتماعية", "https://www.gosi.gov.sa/"],
  musaned: ["منصة مساند للعمالة المنزلية", "https://musaned.com.sa/"],
  sba: ["الهيئة السعودية للمحامين", "https://sba.gov.sa/"],
  pp: ["النيابة العامة", "https://www.pp.gov.sa/"],
  bog: ["ديوان المظالم", "https://www.bog.gov.sa/"],
  absher: ["منصة أبشر", "https://www.absher.sa/"],
  ejar: ["شبكة إيجار", "https://www.ejar.sa/"],
  rega: ["الهيئة العامة للعقار", "https://rega.gov.sa/"],
  mc: ["وزارة التجارة", "https://mc.gov.sa/ar/Pages/default.aspx"],
  business: ["المركز السعودي للأعمال", "https://business.sa/"],
  saip: ["الهيئة السعودية للملكية الفكرية", "https://www.saip.gov.sa/"],
  sadr: ["المركز السعودي للتحكيم التجاري", "https://sadr.org/"],
  sama: ["البنك المركزي السعودي", "https://www.sama.gov.sa/"],
  ia: ["هيئة التأمين", "https://www.ia.gov.sa/"],
  najm: ["شركة نجم لخدمات التأمين", "https://www.najm.sa/"],
  moh: ["وزارة الصحة", "https://www.moh.gov.sa/"],
  sdaia: ["الهيئة السعودية للبيانات والذكاء الاصطناعي", "https://sdaia.gov.sa/"],
  zatca: ["هيئة الزكاة والضريبة والجمارك", "https://zatca.gov.sa/ar/Pages/default.aspx"],
  balady: ["منصة بلدي", "https://balady.gov.sa/"],
  nazaha: ["هيئة الرقابة ومكافحة الفساد (نزاهة)", "https://www.nazaha.gov.sa/"],
  bankruptcy: ["لجنة الإفلاس", "https://www.bankruptcy.gov.sa/"],
  taradhi: ["منصة تراضي للصلح", "https://taradhi.moj.gov.sa/"]
};

const hubs = [["lawyer-riyadh.html", "محامي في الرياض"], ["lawyer-jeddah.html", "محامي في جدة"], ["lawyer-dammam.html", "محامي في الدمام"], ["lawyer-tabuk.html", "محامي تبوك"]];

export const categories = {
  labor: {
    label: "قضايا العمل والعمال",
    eyebrow: "نظام العمل",
    lawyer: "محامي عمالي",
    need: "إذا كان المبلغ كبيرًا، أو صدر فصل أو بلاغ تغيب، أو اقتربت مدة سماع الدعوى العمالية من نهايتها، فمراجعة محامي عمالي قبل التسوية الودية تمنع أخطاء الحساب والصياغة التي يصعب تداركها لاحقًا.",
    links: [["labor-lawyer-riyadh.html", "محامي عمالي في الرياض"], ["labor-lawyer-jeddah.html", "محامي عمالي في جدة"], ["labor-lawyer-dammam.html", "محامي عمالي في الدمام"], ["labor-lawyer-tabuk.html", "محامي عمالي في تبوك"]],
    sources: ["hrsd", "qiwa", "laws"]
  },
  family: {
    label: "الزواج والطلاق والخلع",
    eyebrow: "الأحوال الشخصية",
    lawyer: "محامي أحوال شخصية",
    need: "قضايا الطلاق والفسخ والخلع تمس الأطفال والمال والسمعة معًا؛ لذلك يفيد تحديد الطلب الصحيح والحقوق المرتبطة به مع محامي أحوال شخصية قبل رفع الدعوى أو التوقيع على أي اتفاق.",
    links: [["family-lawyer-riyadh.html", "محامي أحوال شخصية في الرياض"], ["family-lawyer-jeddah.html", "محامي أحوال شخصية في جدة"], ["family-lawyer-dammam.html", "محامي أحوال شخصية في الدمام"], ["divorce-lawyer-tabuk.html", "محامي طلاق في تبوك"]],
    sources: ["najiz", "laws", "moj"]
  },
  custody: {
    label: "الحضانة والنفقة والزيارة",
    eyebrow: "حقوق الأطفال والأسرة",
    lawyer: "محامي حضانة ونفقة",
    need: "عندما يتعلق النزاع بمصلحة طفل أو بنفقة شهرية أو بتنفيذ حكم زيارة متعثر، فإن تنظيم الطلب والأدلة مع محامي أحوال شخصية يختصر الجلسات ويقلل احتمال رفض الطلب أو تأجيله.",
    links: [["custody-alimony-lawyer-tabuk.html", "محامي نفقة وحضانة في تبوك"], ["family-lawyer-riyadh.html", "محامي أحوال شخصية في الرياض"], ["family-lawyer-jeddah.html", "محامي أحوال شخصية في جدة"], ["family-lawyer-dammam.html", "محامي أحوال شخصية في الدمام"]],
    sources: ["najiz", "laws", "moj"]
  },
  inheritance: {
    label: "المواريث والتركات والوصايا",
    eyebrow: "التركات",
    lawyer: "محامي مواريث",
    need: "إذا تعدد الورثة أو وُجدت شركة أو عقار أو ديون أو خلاف على الوصية، فإن محامي المواريث يساعد في حصر التركة وتقسيمها بطريقة تحفظ حقوق الجميع وتمنع تجميد الأصول سنوات.",
    links: [["inheritance-lawyer-tabuk.html", "محامي مواريث في تبوك"], ["inheritance-lawyer-dammam.html", "محامي مواريث في الدمام"], ["family-lawyer-riyadh.html", "محامي أحوال شخصية في الرياض"], ["family-lawyer-jeddah.html", "محامي أحوال شخصية في جدة"]],
    sources: ["najiz", "moj", "laws"]
  },
  criminal: {
    label: "القضايا الجزائية والتحقيق",
    eyebrow: "القضايا الجنائية",
    lawyer: "محامي جنائي",
    need: "في القضايا الجزائية تكون الساعات الأولى من الاستدعاء أو القبض أو التحقيق حاسمة. حضور محامي جنائي منذ مرحلة التحقيق يحفظ الأقوال والدفوع ويمنع أخطاء يصعب تصحيحها أمام المحكمة.",
    links: [["criminal-lawyer-riyadh.html", "محامي جنائي في الرياض"], ["criminal-lawyer-jeddah.html", "محامي جنائي في جدة"], ["criminal-lawyer-dammam.html", "محامي جنائي في الدمام"], ["criminal-lawyer-tabuk.html", "محامي جنائي في تبوك"]],
    sources: ["pp", "laws", "najiz"]
  },
  cyber: {
    label: "الجرائم المعلوماتية والتشهير والتحرش",
    eyebrow: "الجرائم المعلوماتية",
    lawyer: "محامي جرائم معلوماتية",
    need: "الأدلة الرقمية تختفي بسرعة وقد تتحول الرسالة المحذوفة إلى نقطة ضعف. محامي الجرائم المعلوماتية يساعد في حفظ الدليل وصياغة البلاغ وتحديد الوصف النظامي الصحيح قبل التحقيق.",
    links: [["criminal-lawyer-riyadh.html", "محامي جنائي في الرياض"], ["criminal-lawyer-jeddah.html", "محامي جنائي في جدة"], ["fraud-lawyer-tabuk.html", "محامي احتيال في تبوك"], ["criminal-lawyer-dammam.html", "محامي جنائي في الدمام"]],
    sources: ["pp", "laws", "absher"]
  },
  commercial: {
    label: "الشركات والقضايا التجارية",
    eyebrow: "القانون التجاري",
    lawyer: "محامي تجاري",
    need: "قرارات الشركاء والنزاعات التجارية وتصفية الأعمال تؤثر في رأس المال والمسؤولية الشخصية. مراجعة محامي تجاري قبل القرار أو قبل رفع الدعوى أمام المحكمة التجارية توفر كثيرًا من الوقت والمال.",
    links: [["commercial-lawyer-riyadh.html", "محامي تجاري في الرياض"], ["commercial-lawyer-jeddah.html", "محامي تجاري في جدة"], ["corporate-lawyer-dammam.html", "محامي شركات في الدمام"], ["commercial-lawyer-tabuk.html", "محامي تجاري في تبوك"]],
    sources: ["mc", "business", "laws"]
  },
  contracts: {
    label: "العقود والتعويض والمسؤولية المدنية",
    eyebrow: "العقود والتعويض",
    lawyer: "محامي عقود",
    need: "أغلب نزاعات العقود تبدأ من بند غامض أو إثبات ناقص. صياغة العقد أو مراجعته مع محامي عقود قبل التوقيع، أو تقييم المطالبة بالتعويض قبل رفعها، أقل تكلفة من التقاضي على عقد ضعيف.",
    links: [["contracts-lawyer-riyadh.html", "محامي عقود في الرياض"], ["contracts-lawyer-jeddah.html", "محامي عقود في جدة"], ["contracts-lawyer-dammam.html", "محامي عقود في الدمام"], ["contracts-lawyer-tabuk.html", "محامي عقود في تبوك"]],
    sources: ["laws", "najiz", "moj"]
  },
  debts: {
    label: "الديون والشيكات والتنفيذ",
    eyebrow: "التنفيذ والمطالبات المالية",
    lawyer: "محامي تنفيذ",
    need: "اختيار المسار الصحيح بين الدعوى وطلب التنفيذ المباشر، ومتابعة إجراءات الحجز والإيقاف، يحتاج خبرة عملية. محامي التنفيذ يختصر مدة التحصيل ويمنع إيداع طلب لا يقبله قاضي التنفيذ.",
    links: [["execution-lawyer-riyadh.html", "محامي تنفيذ في الرياض"], ["execution-lawyer-jeddah.html", "محامي تنفيذ في جدة"], ["execution-lawyer-dammam.html", "محامي تنفيذ في الدمام"], ["debt-collection-tabuk.html", "تحصيل ديون في تبوك"]],
    sources: ["najiz", "moj", "laws"]
  },
  realestate: {
    label: "العقار والإيجار",
    eyebrow: "العقار والإيجارات",
    lawyer: "محامي عقاري",
    need: "النزاع على صك أو إيجار أو مقاولة أو بيع على الخارطة يرتبط بمبالغ كبيرة ومدد تنفيذ. محامي عقاري يراجع الصك والعقد ويحدد الجهة المختصة قبل دفع أي مبلغ أو رفع أي طلب.",
    links: [["real-estate-lawyer-riyadh.html", "محامي عقاري في الرياض"], ["real-estate-lawyer-jeddah.html", "محامي عقاري في جدة"], ["real-estate-lawyer-dammam.html", "محامي عقاري في الدمام"], ["real-estate-lawyer-tabuk.html", "محامي عقارات في تبوك"]],
    sources: ["ejar", "rega", "najiz"]
  },
  administrative: {
    label: "القضايا الإدارية والجهات الحكومية",
    eyebrow: "القضاء الإداري",
    lawyer: "محامي إداري",
    need: "مدد التظلم والدعوى الإدارية قصيرة، وقد يسقط الحق بفواتها. محامي إداري يحدد القرار محل الطعن والجهة المختصة ويصوغ التظلم بطريقة تفتح الطريق أمام ديوان المظالم.",
    links: [["administrative-lawyer-tabuk.html", "محامي إداري في تبوك"], ["administrative-lawyer-dammam.html", "محامي إداري في الدمام"], ["lawyer-riyadh.html", "محامي في الرياض"], ["lawyer-jeddah.html", "محامي في جدة"]],
    sources: ["bog", "laws", "nazaha"]
  },
  accidents: {
    label: "الحوادث والتأمين والأخطاء الطبية",
    eyebrow: "التعويضات",
    lawyer: "محامي تعويضات",
    need: "حساب التعويض في الحوادث والأخطاء الطبية ومطالبات التأمين يعتمد على تقارير فنية ومدد محددة. محامي التعويضات يجمع التقارير ويحدد الجهة المختصة قبل قبول أي تسوية منخفضة.",
    links: [["traffic-accident-lawyer-tabuk.html", "محامي حوادث مرورية في تبوك"], ["consumer-lawyer-dammam.html", "محامي حماية مستهلك في الدمام"], ["lawyer-riyadh.html", "محامي في الرياض"], ["lawyer-jeddah.html", "محامي في جدة"]],
    sources: ["najm", "ia", "moh"]
  },
  notary: {
    label: "الوكالات والتوثيق",
    eyebrow: "التوثيق والوكالات",
    lawyer: "موثق مرخص",
    need: "صياغة بنود الوكالة أو الإقرار أو عقد الشركة بشكل صحيح تمنع رفض المعاملة أو إساءة استخدام الصلاحيات. راجع المستند قانونيًا، ثم أتمّ التوثيق عبر ناجز أو لدى موثق مرخص.",
    links: [["notary-services-saudi.html", "خدمات التوثيق في السعودية"], ["power-of-attorney-notarization-saudi.html", "توثيق الوكالات"], ["revoke-power-of-attorney-saudi.html", "فسخ الوكالة"], ["how-to-authorize-lawyer-saudi.html", "توكيل محامي عبر ناجز"]],
    sources: ["najiz", "moj", "sba"]
  },
  courts: {
    label: "المحاكم والإجراءات والمحامين",
    eyebrow: "إجراءات التقاضي",
    lawyer: "محامي ترافع",
    need: "الأخطاء الإجرائية، مثل فوات مدة الاعتراض أو رفع الدعوى أمام محكمة غير مختصة، قد تُسقط حقًا قويًا. التوكيل المبكر لمحامي ترافع يحمي المواعيد ويضمن تقديم الدفوع في وقتها.",
    links: [["appeals-lawyer-dammam.html", "محامي استئناف في الدمام"], ["judgment-appeal-tabuk.html", "الاعتراض على الأحكام في تبوك"], ["lawyer-riyadh.html", "محامي في الرياض"], ["lawyer-jeddah.html", "محامي في جدة"]],
    sources: ["najiz", "moj", "sba"]
  }
};

export { hubs };

export const regionHubs = [
  ["legal-services-riyadh.html", "منطقة الرياض"],
  ["makkah-region-legal-services.html", "منطقة مكة المكرمة"],
  ["medina-region-legal-services.html", "منطقة المدينة المنورة"],
  ["eastern-province-legal-services.html", "المنطقة الشرقية"],
  ["qassim-region-legal-services.html", "منطقة القصيم"],
  ["asir-region-legal-services.html", "منطقة عسير"],
  ["tabuk-region-lawyers.html", "منطقة تبوك"],
  ["hail-region-legal-services.html", "منطقة حائل"],
  ["northern-borders-region-legal-services.html", "منطقة الحدود الشمالية"],
  ["jazan-region-legal-services.html", "منطقة جازان"],
  ["najran-region-legal-services.html", "منطقة نجران"],
  ["al-baha-region-legal-services.html", "منطقة الباحة"],
  ["al-jouf-region-legal-services.html", "منطقة الجوف"]
];
