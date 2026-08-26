import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const stylesheet = "styles-20260821b.css?v=20260825b";
const script = "script-20260824b.js";

export const regions = [
  {
    file: "makkah-region-legal-services.html",
    name: "منطقة مكة المكرمة",
    short: "مكة المكرمة",
    symbol: "مكة",
    locations: ["مكة المكرمة", "جدة", "الطائف", "رابغ", "القنفذة", "الليث", "خليص", "بحرة", "الجموم", "الكامل", "تربة", "رنية", "ميسان", "أضم", "العرضيات"],
    profile: "تجمع المنطقة بين العاصمة المقدسة وحاضرة جدة ومحافظات ساحلية وجبلية وداخلية. لذلك لا يكفي اسم المنطقة وحده عند تنظيم الملف؛ بل يلزم تثبيت المدينة أو المحافظة، وموقع العقار أو المنشأة أو الواقعة، وعنوان الطرف الآخر كما يظهر في العقد أو التبليغ.",
    business: "في جدة ورابغ وما حولهما تتكرر ملفات التجارة والخدمات والنقل والمقاولات والتوريد، بينما تبرز في مكة والطائف احتياجات المنشآت الخدمية والعقار والإيجار والعمل. عند وجود أكثر من موقع، تُفصل جهة التعاقد عن موقع التنفيذ وعن مكان التسليم حتى لا تختلط الوقائع.",
    property: "الملف العقاري في مكة أو جدة أو الطائف أو المحافظات الساحلية يحتاج وصف الأصل كما هو في الصك أو العقد، وتحديد نوع الانتفاع، وجدول الدفعات، ومحاضر المعاينة والتسليم. اسم الحي أو الطريق مفيد للتعريف، لكنه لا يحل محل بيانات الأصل الرسمية.",
    scenario: "إذا كان العقد موقّعًا في جدة والعمل منفذًا في رابغ والطرف الآخر مقيمًا في مكة، فابدأ بخريطة مواقع مختصرة: مقر كل طرف، موقع التنفيذ، جهة التبليغ، والمدينة المثبتة في المستند. بعدها تُرتب المطالبة زمنيًا بدل افتراض أن مدينة واحدة تحسم كل شيء.",
    documents: ["العقد وملاحقه وأوامر التغيير", "عنوان الأصل أو موقع التنفيذ كما في المستند", "الفواتير وإثبات التسليم أو السداد", "المراسلات مرتبة حسب التاريخ", "بيانات الأطراف والصفة والمدينة", "أي موعد أو تبليغ قائم"],
    links: [["دليل الخدمات القانونية في جدة", "legal-services-jeddah.html"], ["محامي في جدة", "lawyer-jeddah.html"], ["خدمات الموثق في السعودية", "notary-services-saudi.html"]]
  },
  {
    file: "medina-region-legal-services.html",
    name: "منطقة المدينة المنورة",
    short: "المدينة المنورة",
    symbol: "المدينة",
    locations: ["المدينة المنورة", "ينبع", "العلا", "بدر", "خيبر", "مهد الذهب", "الحناكية", "العيص", "وادي الفرع"],
    profile: "تمتد احتياجات المنطقة من مركزها الحضري في المدينة المنورة إلى ينبع الساحلية والعلا ومحافظات ومراكز متباعدة. وتختلف صورة الملف بحسب كونه متعلقًا بخدمة أو عقار أو عمل أو توريد؛ لذا يُذكر الموقع المثبت في المستند مع المدينة التي وقعت فيها العلاقة أو الواقعة.",
    business: "في ينبع تزداد أهمية عقود التشغيل والتوريد والعمل والخدمات، وفي المدينة المنورة تتنوع ملفات المنشآت والعقار والإيجارات والأحوال الشخصية، أما العلا وبقية المحافظات فقد تتداخل فيها الأصول والمشروعات والخدمات الموسمية. التنظيم الصحيح يبدأ بنطاق العقد والمدة والمسؤول عن كل مرحلة.",
    property: "عند ارتباط الطلب بأرض أو مبنى أو إيجار، تُجمع بيانات الأصل والصك أو العقد والمخطط ومحاضر التسليم قبل وصف النزاع. المسافة بين إقامة الأطراف وموقع الأصل لا تغيّر المستند الحاسم، لكنها تجعل بيانات العنوان والتبليغ أكثر أهمية.",
    scenario: "في مطالبة لمورد نفّذ جزءًا من العمل في ينبع بينما صدرت أوامر الشراء من المدينة، يلزم فصل أمر الشراء عن محضر التسليم والفاتورة والاعتراض. يُبنى كشف واحد يبين التاريخ والموقع والقيمة ومن اعتمد كل خطوة.",
    documents: ["العقد أو أمر الشراء", "بيانات الموقع والمدينة في كل مستند", "محاضر الإنجاز والاستلام", "الفواتير والتحويلات", "الإشعارات والاعتراضات", "تسلسل زمني مختصر"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["مقالات وإرشادات قانونية", "articles.html"], ["خدمات الموثق في السعودية", "notary-services-saudi.html"]]
  },
  {
    file: "qassim-region-legal-services.html",
    name: "منطقة القصيم",
    short: "القصيم",
    symbol: "القصيم",
    locations: ["بريدة", "عنيزة", "الرس", "المذنب", "البكيرية", "البدائع", "الأسياح", "النبهانية", "الشماسية", "عيون الجواء", "رياض الخبراء", "ضرية", "عقلة الصقور", "أبانات"],
    profile: "تتوزع المنطقة بين بريدة وعنيزة والرس ومحافظات ذات نشاط تجاري وزراعي وخدمي وعقاري. وقد تكون المنشأة في مدينة، والمستودع أو المزرعة أو الأصل في محافظة أخرى؛ لذلك يُفصل عنوان السجل عن موقع التنفيذ وعن محل الأصل عند إعداد الطلب.",
    business: "في النزاعات التجارية والشراكات العائلية يفيد جمع عقد التأسيس والصلاحيات وقرارات الشركاء وكشف الدفعات، وعدم الاكتفاء بالمحادثات. أما التوريد والنقل فيحتاجان ربط كل فاتورة بإثبات التسليم والاعتراض إن وجد.",
    property: "الملفات التي تتصل بالمزارع أو الأراضي أو المقاولات تحتاج وصفًا رسميًا للأصل، وحدود العمل المتفق عليه، ومَن طلب الإضافات، وما تم دفعه أو استلامه. الصور وحدها لا تكفي من دون تاريخ ومصدر وربط بالعقد أو المحضر.",
    scenario: "عند اختلاف شريكين في عنيزة على حساب منشأة مسجلة في بريدة ولها أصل في الرس، يُنشأ جدول منفصل للحصص والصلاحيات والمساهمات والأصول. هذا يمنع خلط ملكية الحصة بإدارة المنشأة أو ملكية العقار.",
    documents: ["عقد التأسيس أو الشراكة", "السجل والقرارات والصلاحيات", "كشف المساهمات والدفعات", "مستندات الأصل أو المشروع", "الفواتير ومحاضر التسليم", "الرسائل التي تثبت الاعتراض"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["دليل جميع الصفحات", "site-directory.html"], ["مقالات العقود والمطالبات", "articles.html"]]
  },
  {
    file: "asir-region-legal-services.html",
    name: "منطقة عسير",
    short: "عسير",
    symbol: "عسير",
    locations: ["أبها", "خميس مشيط", "بيشة", "محايل عسير", "أحد رفيدة", "النماص", "تنومة", "سراة عبيدة", "ظهران الجنوب", "رجال ألمع", "بارق", "تثليث", "بلقرن", "المجاردة"],
    profile: "تجمع عسير بين أبها وخميس مشيط ومحافظات جبلية وسهلية وداخلية، وقد تتباعد مواقع الأطراف والأصول ومكان تنفيذ الخدمة. لهذا ينبغي كتابة المحافظة والمركز والعنوان المثبت في المستند، لا الاعتماد على الوصف الشفهي للموقع.",
    business: "تتنوع ملفات المنشآت بين الضيافة والتجزئة والمقاولات والنقل والخدمات والعمل. في الأعمال الموسمية أو المتعددة المواقع، تكون المدة، وساعات العمل، وأوامر التشغيل، ومحاضر الاستلام أهم من اسم النشاط العام.",
    property: "المقاولة أو الإيجار أو نزاع الملكية يتطلب مطابقة الصك أو العقد بالموقع الفعلي، وحصر الأعمال الأصلية والإضافية، وتحديد مسؤولية المواد والتصميم والإشراف. كما تُفصل عيوب التنفيذ عن التأخير وعن الرصيد المالي.",
    scenario: "إذا تعاقد مالك في أبها مع مقاول في خميس مشيط لتنفيذ مشروع في النماص، فملف واحد مرتب يضم نطاق العمل والدفعات وطلبات التغيير والصور المؤرخة ومحاضر المعاينة أوضح من تجميع رسائل متفرقة بلا سياق.",
    documents: ["العقد وجدول الكميات", "المخططات والمواصفات", "طلبات التغيير والموافقات", "صور مؤرخة ومحاضر المعاينة", "كشف الدفعات والرصيد", "بيانات موقع المشروع والأطراف"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["مقالات وإرشادات قانونية", "articles.html"], ["خدمات الموثق في السعودية", "notary-services-saudi.html"]]
  },
  {
    file: "hail-region-legal-services.html",
    name: "منطقة حائل",
    short: "حائل",
    symbol: "حائل",
    locations: ["حائل", "بقعاء", "الغزالة", "الشنان", "سميراء", "موقق", "الشملي", "السليمي", "الحائط"],
    profile: "تتركز الخدمات في مدينة حائل وتمتد إلى محافظات ومراكز واسعة، لذلك تؤثر دقة العنوان وموقع الأصل أو العمل وطريقة التبليغ في جودة الملف الأولي. المسافة لا تغيّر جوهر الحق، لكنها تجعل توثيق الموقع والتاريخ ضرورة عملية.",
    business: "في عقود النقل والتوريد والصيانة والخدمات يجب تحديد نقطة التسليم والمسؤول عن النقل وحالة البضاعة أو العمل عند الاستلام. ويُقارن كشف الحساب بالفواتير والتحويلات بدل تقديم مبلغ إجمالي بلا تفصيل.",
    property: "عند التعامل مع أرض أو مزرعة أو مبنى أو مقاولة، تُثبت الصفة ووصف الأصل وحدود الانتفاع والاتفاق على الثمن أو الأجرة. وإذا كانت هناك اتفاقات قديمة أو شفهية، تُجمع القرائن المتاحة مع بيان مصدرها وتاريخها.",
    scenario: "مطالبة ناشئة عن توريد من حائل إلى مشروع في بقعاء تحتاج أمر الشراء، وإثبات التحميل والتسليم، وحالة المواد، والفاتورة، وأي اعتراض لاحق. يُربط كل مستند بواقعة محددة بدل تكرار الرواية العامة.",
    documents: ["أمر الشراء أو العقد", "بيان موقع التسليم", "إثبات النقل والاستلام", "الفواتير وكشف الحساب", "الاعتراضات والمراسلات", "بيانات العنوان والتبليغ"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["دليل جميع الصفحات", "site-directory.html"], ["مقالات المطالبات والعقود", "articles.html"]]
  },
  {
    file: "northern-borders-region-legal-services.html",
    name: "منطقة الحدود الشمالية",
    short: "الحدود الشمالية",
    symbol: "الشمالية",
    locations: ["عرعر", "رفحاء", "طريف", "العويقيلة"],
    profile: "تتوزع المنطقة بين عرعر ورفحاء وطريف والعويقيلة، ومع تباعد المواقع يصبح التفريق بين مقر الطرف وموقع العمل أو الواقعة وعنوان التبليغ خطوة أولى. لا يُفترض الاختصاص من اسم المنطقة فقط؛ بل تُراجع طبيعة الطلب والمستند والجهة والمرحلة.",
    business: "تحتاج ملفات العمل والتشغيل والنقل والتوريد إلى إثبات مباشر للمدة والموقع والتسليم والحضور والأجر أو المقابل. وجود أكثر من موقع للعمل يستدعي جدولًا يوضح أين ومتى نُفذ كل جزء ومن أصدر التكليف.",
    property: "في العقار والإيجار والمقاولات تُراجع بيانات الأصل والعقد والدفعات ومحاضر الحالة. وإذا كان الطرف في محافظة والأصل في أخرى، تُذكر هذه الحقيقة صراحةً بدل ضغطها في عنوان واحد غير دقيق.",
    scenario: "عامل مقره في عرعر وينتقل لمواقع في طريف ورفحاء يحتاج إلى جمع عقد العمل ومسيرات الأجر والتكليفات وسجل الحضور والإشعارات حسب الشهر والموقع، ثم حساب كل مطالبة على فترة واضحة.",
    documents: ["عقد العمل أو التشغيل", "التكليفات ومواقع العمل", "الحضور ومسيرات الأجر", "الإشعارات والقرارات", "حساب المطالبة حسب الفترة", "بيانات كل طرف وعنوانه"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["دليل جميع الصفحات", "site-directory.html"], ["مقالات القضايا العمالية", "articles.html"]]
  },
  {
    file: "jazan-region-legal-services.html",
    name: "منطقة جازان",
    short: "جازان",
    symbol: "جازان",
    locations: ["جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "ضمد", "الدرب", "فرسان", "العارضة", "أحد المسارحة", "العيدابي", "فيفا", "هروب", "الدائر", "الطوال", "الحرث", "الريث"],
    profile: "تضم جازان مدينة ساحلية ومحافظات وجزرًا ومواقع جبلية وحدودية، ولذلك قد يختلف عنوان الطرف عن موقع الأصل أو المشروع أو الواقعة. الصفحة تساعد على ضبط هذه الفروق وربطها بنوع القضية بدل إنتاج وصف عام لا يفيد القرار.",
    business: "تظهر في المنطقة ملفات التجارة والتجزئة والنقل والتوريد والمقاولات والعمل والأنشطة الزراعية والبحرية. ويحتاج كل ملف إلى تعريف الأطراف وصفاتهم ونقطة التسليم والكمية والجودة والاعتراض والتاريخ، خصوصًا عند انتقال البضائع بين محافظات.",
    property: "في الأرض أو المزرعة أو البناء أو الإيجار، تُقدّم بيانات الأصل الرسمية والعقد وحدود الانتفاع ومحاضر المعاينة. أما أسماء القرى والطرق فتُستخدم لتوضيح الموقع ولا تستبدل رقم الصك أو وصف العقد.",
    scenario: "توريد مواد من مدينة جازان إلى مشروع في الدرب مع مورد فرعي في صبيا يتطلب سلسلة مستندية: من طلب، ومن سلّم، ومن استلم، وما الكمية، ومتى ظهر الاعتراض. هذا يفصل مسؤولية كل طرف عن بقية السلسلة.",
    documents: ["عقد التوريد أو المقاولة", "أوامر الشراء والكميات", "إثبات النقل والتسليم", "محاضر فحص الجودة", "الفواتير والدفعات", "الاعتراضات مرتبة زمنيًا"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["مقالات وإرشادات قانونية", "articles.html"], ["خدمات الموثق في السعودية", "notary-services-saudi.html"]]
  },
  {
    file: "najran-region-legal-services.html",
    name: "منطقة نجران",
    short: "نجران",
    symbol: "نجران",
    locations: ["نجران", "شرورة", "حبونا", "بدر الجنوب", "يدمة", "ثار", "خباش"],
    profile: "تمتد المنطقة من مدينة نجران إلى شرورة ومحافظات ومراكز متباعدة. لذلك يفيد تحديد الموقع الكامل كما يرد في العقد أو الصك أو الإشعار، مع فصل مقر المنشأة عن مكان التنفيذ وعن إقامة الطرف إذا اختلفت.",
    business: "في علاقات العمل والمقاولات والنقل والخدمات تُراجع المدة والموقع وسلسلة التكليف والدفعات والتسليم. الملفات التي تعتمد على اتفاق شفهي تحتاج تجميع ما يؤيده من تحويلات ورسائل ومحاضر وصور أصلية دون تعديل.",
    property: "قضايا الأرض والبناء والإيجار والتركات تحتاج بدءًا من الصفة: من يملك، ومن يدير، ومن تعاقد، وما الأصل محل الطلب. ثم تُحصر الحقوق والديون والدفعات قبل القفز إلى نتيجة أو قسمة أو مطالبة.",
    scenario: "إذا أدار أحد الورثة أصلًا في نجران بينما يقيم آخرون في شرورة أو خارج المنطقة، فالمطلوب أولًا حصر الورثة والأصل والعوائد والمصروفات والاتفاقات السابقة، ثم تحديد الطلب بدقة بعيدًا عن الروايات المتفرقة.",
    documents: ["ما يثبت الصفة", "مستندات الأصل أو التركة", "كشف العوائد والمصروفات", "العقود والاتفاقات السابقة", "المراسلات والقرارات", "قائمة الحقوق والديون"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["دليل جميع الصفحات", "site-directory.html"], ["مقالات تنظيم المستندات", "articles.html"]]
  },
  {
    file: "al-baha-region-legal-services.html",
    name: "منطقة الباحة",
    short: "الباحة",
    symbol: "الباحة",
    locations: ["الباحة", "بلجرشي", "المندق", "المخواة", "قلوة", "العقيق", "القرى", "بني حسن", "غامد الزناد", "الحجرة"],
    profile: "تتنوع الباحة بين السراة وتهامة ومحافظات ومراكز مترابطة جغرافيًا، لكن الاسم المتداول للموقع قد يختلف عن البيانات الرسمية في الصك أو العقد. لذلك تُعتمد بيانات المستند مع إضافة الوصف المحلي للتوضيح فقط.",
    business: "تتكرر احتياجات المنشآت الصغيرة والعائلية والضيافة والمقاولات والإيجار والتوظيف. في الشراكة العائلية يجب فصل المساهمة المالية عن الإدارة وعن ملكية الأصل، وتوثيق القرارات والصلاحيات بدل الاعتماد على العرف وحده.",
    property: "الملفات العقارية والإنشائية في المواقع الجبلية تحتاج وصفًا دقيقًا للعمل والوصول والمواصفات والتغييرات ومحاضر المعاينة. وإذا تغير نطاق المشروع، تُحفظ الموافقة على كل تغيير وتكلفته ومدة أثره.",
    scenario: "مشروع بناء في المندق يديره شريكان من الباحة وبلجرشي يحتاج ملفين متكاملين: ملف للشراكة والصلاحيات، وملف للمقاولة والدفعات والتغييرات. دمجهما بلا فصل قد يخفي سبب الخلاف الحقيقي.",
    documents: ["اتفاق الشركاء والصلاحيات", "عقد المقاولة والمواصفات", "طلبات التغيير", "محاضر المعاينة والاستلام", "كشف المساهمات والدفعات", "بيانات الأصل والموقع"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["مقالات العقود والشركات", "articles.html"], ["خدمات الموثق في السعودية", "notary-services-saudi.html"]]
  },
  {
    file: "al-jouf-region-legal-services.html",
    name: "منطقة الجوف",
    short: "الجوف",
    symbol: "الجوف",
    locations: ["سكاكا", "القريات", "دومة الجندل", "طبرجل"],
    profile: "تتوزع الجوف بين سكاكا والقريات ودومة الجندل وطبرجل، وتتداخل فيها أنشطة التجارة والزراعة والنقل والعقار والخدمات. البداية السليمة هي تحديد موقع الأصل أو التنفيذ ونقطة التسليم والمدينة المثبتة في كل مستند.",
    business: "عقود التوريد والنقل والمنتجات الزراعية تحتاج وصف الكمية والمواصفات ووقت التسليم وحالة المنتج وطريقة الاعتراض. كما تُطابق الفاتورة مع الطلب والتسليم والتحويل، لا مع كشف إجمالي غير مفصّل.",
    property: "عند وجود مزرعة أو أرض أو مبنى أو إيجار، تُجمع وثائق الصفة والأصل والعقد والانتفاع والعوائد. إذا تعددت الأصول أو المواسم، يُخصص لكل أصل أو دورة جدول مستقل حتى لا تختلط المبالغ والالتزامات.",
    scenario: "توريد من طبرجل إلى منشأة في سكاكا مع نقل عبر طرف ثالث يحتاج مستندًا لكل حلقة: طلب، تحميل، نقل، استلام، فحص، فاتورة، وسداد. عند ظهور عيب، يثبت توقيت الاعتراض وما إذا كان قبل الاستلام أو بعده.",
    documents: ["أمر الشراء والمواصفات", "سند التحميل والنقل", "إثبات الاستلام والفحص", "الفاتورة والتحويل", "إشعار العيب أو الاعتراض", "بيانات الأطراف والمواقع"],
    links: [["دليل مناطق السعودية", "saudi-regions-guide.html"], ["دليل جميع الصفحات", "site-directory.html"], ["مقالات العقود والمطالبات", "articles.html"]]
  }
];

const services = [
  ["استشارة قانونية أولية", "تحديد الصفة والطلب والمرحلة والمستند الحاسم قبل اختيار الإجراء."],
  ["القضايا التجارية والشركات", "ترتيب العقود والفواتير والصلاحيات والمساهمات والمراسلات في ملف قابل للمراجعة."],
  ["القضايا العمالية", "مطابقة العقد والأجر والحضور والإشعارات والمستحقات مع فترة زمنية واضحة."],
  ["الأحوال الشخصية والتركات", "حماية الخصوصية وحصر الصفة والأحكام السابقة والأصول والحقوق والديون."],
  ["العقود والاتفاقيات", "مراجعة النطاق والمقابل والضمان والمدة والإنهاء والإشعارات قبل التوقيع أو النزاع."],
  ["التنفيذ والمطالبات", "مطابقة الحكم أو السند بالمبلغ والمدفوعات وبيانات الأطراف والإجراءات القائمة."],
  ["العقار والمقاولات", "التحقق من الصفة ووصف الأصل والمواصفات والدفعات والتغييرات والتسليم والعيوب."],
  ["القضايا الجنائية والإدارية", "ضبط الجهة والمرحلة والمهلة والتبليغ والأدلة دون نشر معلومات حساسة."]
];

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const ga = () => `<!-- site-analytics:start --><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');(()=>{let loaded=false;const load=()=>{if(loaded)return;loaded=true;const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29';document.head.appendChild(script)};['pointerdown','keydown','touchstart','scroll'].forEach(name=>window.addEventListener(name,load,{once:true,passive:true}));window.addEventListener('load',()=>window.setTimeout(load,6000),{once:true})})();</script><!-- site-analytics:end -->`;

function header(region) {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">استقبال إلكتروني من ${region.name}</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div><header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/"><div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div><div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="notary-services-saudi.html">خدمات الموثق</a><a href="site-directory.html">دليل الصفحات</a><a href="about.html">عن الموقع</a></nav><div class="nav-actions"><a class="header-cta" href="#start">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(region) {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>استقبال طلبات الخدمات والاستشارات القانونية إلكترونيًا من ${region.name} ومختلف مناطق المملكة.</p></div><div><b>أدلة مهمة</b><a href="saudi-regions-guide.html">مناطق السعودية</a><a href="notary-services-saudi.html">خدمات الموثق</a><a href="site-directory.html">دليل جميع الصفحات</a><a href="about.html">منهج المحتوى</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer>`;
}

function schema(region, title, description, faqs) {
  const url = `${baseUrl}/${region.file}`;
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": "Service", "@id": `${url}#service`, name: title.split("|")[0].trim(), description, url, serviceType: "خدمات واستشارات قانونية", provider: { "@id": `${baseUrl}/#organization` }, areaServed: { "@type": "AdministrativeArea", name: region.name } },
    { "@type": "ItemList", name: `أبرز مدن ومحافظات ${region.name}`, numberOfItems: region.locations.length, itemListElement: region.locations.map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }, { "@type": "ListItem", position: 2, name: "مناطق السعودية", item: `${baseUrl}/saudi-regions-guide.html` }, { "@type": "ListItem", position: 3, name: region.name, item: url }] },
    { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ]})}</script>`;
}

function page(region) {
  const target = `خدمات قانونية في ${region.name}`;
  const title = `${target} | رُكن الأنظمة`;
  const description = `${target} للأفراد والمنشآت: دليل للاستشارة القانونية والعقود والقضايا والعمل والتنفيذ والعقار وتجهيز الطلب من أبرز المدن والمحافظات.`;
  const url = `${baseUrl}/${region.file}`;
  const faqs = [
    [`هل تتوفر استشارة قانونية من ${region.name}؟`, `يمكن بدء طلب استشارة قانونية إلكترونيًا مع ذكر المدينة ونوع المسألة والصفة والمرحلة والمستند الأساسي. لا يعني ذلك وجود فرع فعلي في كل محافظة.`],
    ["هل المدينة وحدها تحدد المسار القانوني؟", "لا. المدينة تساعد في تعريف موقع الطرف أو الأصل أو الواقعة، بينما يعتمد المسار على نوع القضية والصفة والجهة والمرحلة والمهل والمستندات."],
    ["ما المناسب إرساله في التواصل الأول؟", "أرسل ملخصًا قصيرًا والتواريخ المهمة واسم المدينة والمستند الأساسي، ولا ترسل كلمات مرور أو بيانات بنكية أو أصول مستندات أو معلومات شديدة الحساسية."],
    ["هل النتيجة القانونية مضمونة؟", "لا يمكن ضمان نتيجة قبل مراجعة الوقائع والمستندات والأنظمة والإجراءات ذات الصلة. هذه الصفحة للتنظيم والتوعية الأولية."]
  ];
  const serviceCards = services.map(([name, text], index) => `<article class="specialty-card" data-number="${String(index + 1).padStart(2, "0")}"><h3>${name}</h3><p>${text}</p></article>`).join("");
  const locations = region.locations.map((name) => `<li>${name}</li>`).join("");
  const related = [["الدليل الوطني للمناطق", "saudi-regions-guide.html"], ...region.links, ["دليل جميع الصفحات", "site-directory.html"]]
    .filter(([label, href], index, list) => list.findIndex((item) => item[1] === href) === index)
    .map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
  const whatsapp = `https://wa.me/966506142113?text=${encodeURIComponent(`السلام عليكم، أرغب في خدمة قانونية من ${region.name}. المدينة: — نوع الطلب ومرحلته: `)}`;
  const body = `<main><div class="container breadcrumb"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="saudi-regions-guide.html">مناطق السعودية</a><span aria-hidden="true">/</span><span>${region.name}</span></div>
  <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">دليل إقليمي منظم</span><h1>${target}<br><span>استشارة وقضايا وعقود ومطالبات</span></h1><p>${region.profile}</p><div class="hero-actions"><a class="btn primary" href="#services">اختر نوع الخدمة</a><a class="btn secondary" href="#locations">مدن ومحافظات المنطقة</a></div><div class="trust-row"><div><b>${region.locations.length} موقعًا</b><span>ضمن الدليل</span></div><div><b>8 مسارات</b><span>قانونية رئيسية</span></div><div><b>إلكترونيًا</b><span>لبدء الطلب</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">${region.name}</span><div class="service-symbol">${region.symbol}</div><h2>ابدأ بالمعلومة الحاسمة</h2><ul class="service-hero-points"><li>المدينة وموقع الأصل أو الواقعة</li><li>نوع المسألة وصفتك</li><li>المرحلة وأقرب موعد</li></ul></aside></div></section>
  <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#services">الخدمات</a><a href="#local-context">السياق المحلي</a><a href="#locations">المدن والمحافظات</a><a href="#prepare">تجهيز الطلب</a><a href="#faq">الأسئلة</a></nav></div>
  <section class="section" id="services"><div class="container"><div class="section-head"><span class="eyebrow">الاختيار حسب الاحتياج</span><h2>مسارات الخدمات القانونية في ${region.short}</h2><p>الكلمة الأهم ليست اسم المدينة وحده، بل الموضوع والمرحلة والنتيجة المطلوبة. اختر المسار الأقرب ثم جهّز المستند الذي يثبت أصل العلاقة.</p></div><div class="specialty-grid">${serviceCards}</div></div></section>
  <section class="section alt" id="local-context"><div class="container"><div class="section-head"><span class="eyebrow">محتوى محلي غير مكرر</span><h2>ما الذي يميّز تنظيم الطلب في ${region.name}؟</h2><p>الأنظمة السعودية واحدة، لكن مواقع الأطراف والأصول والتنفيذ والتبليغ قد تغيّر طريقة جمع البيانات وتوجيه الملف.</p></div><div class="locality-panels"><article class="locality-panel"><h3>الأعمال والعقود</h3><p>${region.business}</p></article><article class="locality-panel"><h3>العقار والمقاولات</h3><p>${region.property}</p></article><article class="locality-panel" style="grid-column:1/-1"><h3>مثال عملي من المنطقة</h3><p>${region.scenario}</p></article></div></div></section>
  <section class="section" id="locations"><div class="container"><div class="section-head"><span class="eyebrow">النطاق الجغرافي</span><h2>أبرز مدن ومحافظات ${region.name}</h2><p>اختر الاسم المطابق للمستند، ثم أضف المركز أو الحي أو الطريق عند الحاجة. هذه قائمة إرشادية وليست ادعاءً بوجود فرع محلي.</p></div><ul class="location-list">${locations}</ul><p class="coverage-disclaimer">التغطية تعني إمكانية بدء الطلب إلكترونيًا من هذه المواقع، ولا تعني وجود مكتب أو فرع في كل مدينة أو محافظة.</p></div></section>
  <section class="section alt" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">ملف أولي واضح</span><h2>جهّز طلبك قبل الاستشارة القانونية</h2><p>رتّب نسخة قابلة للقراءة واحتفظ بالأصل. لا تعدّل الأدلة الرقمية، ولا ترسل بيانات شديدة الحساسية في الرسالة الأولى.</p></div><ol class="document-list">${region.documents.map((item) => `<li>${item}</li>`).join("")}</ol></div></section>
  <section class="section"><div class="container"><div class="section-head"><span class="eyebrow">انتقال داخلي واضح</span><h2>أدلة مرتبطة بطلبك</h2></div><div class="related-services">${related}</div></div></section>
  <section class="section alt" id="start"><div class="container"><div class="contact-card"><div><span class="eyebrow">بدء طلب من ${region.name}</span><h2>اكتب المدينة ونوع الخدمة والمرحلة</h2><p>أرسل ملخصًا أوليًا فقط، ثم تُحدد قناة المستندات المناسبة بحسب طبيعة الطلب.</p></div><a class="primary-btn" href="${whatsapp}">بدء الطلب عبر واتساب</a></div></div></section>
  <section class="section" id="faq"><div class="container faq-wrap"><div class="section-head"><span class="eyebrow">أسئلة شائعة</span><h2>قبل التواصل من ${region.short}</h2></div>${faqs.map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join("")}</div></section></main>`;
  return `<!doctype html><html lang="ar" dir="rtl"><head>${ga()}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!-- site-search-appearance:start --><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/logo-128-20260824.png"><meta name="theme-color" content="#102a29"><!-- site-search-appearance:end --><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="description" content="${escapeHtml(description)}"><title>${escapeHtml(title)}</title><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}">${schema(region, title, description, faqs)}<!-- site-fonts:start --><!-- Fast system fonts; no render-blocking external font request. --><!-- site-fonts:end --><link rel="stylesheet" href="${stylesheet}"></head><body>${header(region)}${body}${footer(region)}<a class="whatsapp-float" href="${whatsapp}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="${script}" defer></script></body></html>`;
}

export function generateSaudiRegionPages() {
  for (const region of regions) writeFileSync(resolve(root, region.file), page(region), "utf8");
  console.log(`Generated ${regions.length} unique Saudi regional service guides.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) generateSaudiRegionPages();
