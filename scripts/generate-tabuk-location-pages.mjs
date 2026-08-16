import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";

const locations = [
  {
    slug: "lawyer-duba.html",
    name: "ضباء",
    symbol: "ض",
    meta: "طلب محامي في ضباء للخدمات والقضايا والعقود والتنفيذ والأحوال الشخصية. استقبال الطلبات إلكترونيًا من مدينة ضباء وشرما والمويلح والمراكز والقرى التابعة.",
    intro: "صفحة محلية لبدء طلب محامٍ في محافظة ضباء، تربط موقعك بنوع القضية ومرحلتها بدل الاكتفاء بعبارة عامة. اذكر هل الطلب متعلق بعقد أو مطالبة أو أسرة أو تنفيذ، ثم حدّد المدينة أو المركز أو الطريق الأقرب.",
    contextTitle: "خدمة قانونية تراعي طبيعة محافظة ضباء",
    context: "يمتد نطاق الطلبات من مدينة ضباء إلى التجمعات الساحلية والمراكز التابعة. لذلك يبدأ التوجيه بسؤالين عمليين: ما موضوع القضية، وأين توجد المعاملة أو الأطراف؟ يساعد ذلك على اختيار المسار المناسب وتحديد المستندات الأولية دون الادعاء بوجود مكتب فعلي في كل موقع.",
    areas: ["مدينة ضباء", "شرما", "المويلح", "الخريبة", "الأحياء والمخططات", "المراكز والقرى التابعة"],
    roads: ["طريق تبوك–ضباء", "طريق ضباء–الوجه", "طريق ضباء–شرما", "الطريق الساحلي", "الطرق المؤدية للمراكز", "جميع شوارع ضباء"],
    matters: [
      ["العقود والأعمال", "صياغة ومراجعة عقود التوريد والخدمات والمقاولات والاتفاقيات التجارية قبل التوقيع أو عند النزاع.", "contracts-lawyer-tabuk.html"],
      ["المطالبات والتنفيذ", "دراسة السند أو الحكم والمرحلة الحالية وتحديد ما يلزم قبل بدء طلب التنفيذ أو الاعتراض عليه.", "execution-lawyer-tabuk.html"],
      ["العقار والإيجار", "طلبات الملكية والإيجار والمقاولات والدفعات والعيوب وما يرتبط بالمستندات الفنية والتعاقدية.", "real-estate-lawyer-tabuk.html"],
      ["الأسرة والمواريث", "الطلاق والفسخ والنفقة والحضانة والزيارة والتركات، مع ترتيب الوقائع والمستندات حسب الطلب.", "family-lawyer-tabuk.html"]
    ],
    prep: ["نوع القضية أو الخدمة المطلوبة", "المرحلة الحالية والجهة التي تنظر الموضوع", "مدينة ضباء أو المركز أو الحي", "أقرب جلسة أو مهلة تعرفها", "ملخص موجز دون بيانات شديدة الحساسية"],
    faqs: [
      ["هل يمكن طلب محامي من شرما أو المويلح؟", "نعم، يستقبل الموقع الطلب الأولي إلكترونيًا من مدينة ضباء وشرما والمويلح والخريبة والمراكز والقرى التابعة، ثم يحدد المسار المناسب بحسب نوع القضية وإمكان تقديم الخدمة."],
      ["هل يلزم الحضور إلى مدينة تبوك لبدء الطلب؟", "لا يلزم ذلك لبدء التقييم الأولي؛ أرسل نوع القضية والمرحلة والموقع، ثم تتضح الحاجة إلى الحضور أو الوكالة أو الإجراء الإلكتروني بحسب الملف."],
      ["ما الفرق بين هذه الصفحة وصفحة محامي تبوك؟", "هذه الصفحة مخصصة للبحث المحلي في محافظة ضباء، بينما صفحة محامي تبوك مخصصة لمدينة تبوك وأحيائها وطرقها." ]
    ]
  },
  {
    slug: "lawyer-al-wajh.html",
    name: "الوجه",
    symbol: "و",
    meta: "محامي في الوجه للخدمات القانونية والقضايا والعقود والعقار والتنفيذ والأحوال الشخصية، مع استقبال الطلبات من جميع أحياء ومراكز وقرى محافظة الوجه.",
    intro: "ابدأ طلب محامٍ في الوجه من صفحة تجمع الموقع ونوع المسألة والمرحلة الإجرائية. سواء كان الطلب عقدًا أو نزاعًا أو حكمًا أو شأنًا أسريًا، يسهّل الملخص المنظم تحديد الصفحة التخصصية والخطوة التالية.",
    contextTitle: "توجيه الطلبات القانونية داخل محافظة الوجه",
    context: "تغطي الصفحة مدينة الوجه وأحياءها ومخططاتها والمراكز والقرى التابعة، مع استقبال إلكتروني أولي. لا يفيد تكرار اسم المدينة وحده؛ الأفضل ذكر صفتك في القضية، والجهة الحالية، والموعد الأقرب، ومكان العقار أو العقد أو الطرف ذي الصلة.",
    areas: ["مدينة الوجه", "الأحياء السكنية", "المخططات الجديدة", "المراكز التابعة", "القرى التابعة", "النطاق الساحلي للمحافظة"],
    roads: ["طريق الوجه–ضباء", "طريق الوجه–أملج", "طريق الوجه–العلا", "الطريق الساحلي", "طرق المراكز والقرى", "جميع شوارع الوجه"],
    matters: [
      ["العقار والمقاولات", "مراجعة عقد الإيجار أو البيع أو المقاولة، وترتيب المطالبات والدفعات والمستندات الفنية ذات الصلة.", "real-estate-lawyer-tabuk.html"],
      ["القضايا والمذكرات", "تحديد نوع المحكمة والمرحلة والطلبات قبل إعداد مذكرة أو لائحة أو رد مرتبط بوقائع الملف.", "lawyer-tabuk.html"],
      ["الأحوال الشخصية", "تنظيم طلبات الطلاق والفسخ والنفقة والحضانة والزيارة والمواريث وفق طبيعة المسألة.", "family-lawyer-tabuk.html"],
      ["التنفيذ والمطالبات", "قراءة الحكم أو السند وتحديد المبلغ والأطراف وما تم اتخاذه في منصة التنفيذ قبل الخطوة التالية.", "execution-lawyer-tabuk.html"]
    ],
    prep: ["اختر التخصص الأقرب لموضوعك", "اذكر هل الموضوع قبل الدعوى أم أثناءها أم بعد الحكم", "حدّد موقعك داخل محافظة الوجه", "أضف أقرب موعد أو رقم معاملة عند الحاجة", "لا ترسل الأصل أو كلمات المرور في الرسالة الأولى"],
    faqs: [
      ["هل تشمل الخدمة جميع أحياء الوجه؟", "نعم، يستقبل الموقع الطلبات الأولية من جميع أحياء ومخططات مدينة الوجه ومن المراكز والقرى التابعة للمحافظة، حتى إذا لم يرد اسم الحي في القائمة."],
      ["كيف أبدأ طلبًا متعلقًا بعقار في الوجه؟", "اذكر نوع العلاقة بالعقار، وموقعه داخل المحافظة، والعقد أو الصك المتاح، والمرحلة الحالية، دون نشر بيانات الأطراف في رسالة عامة."],
      ["هل الصفحة تعني وجود فرع في محافظة الوجه؟", "لا. الصفحة توضح نطاق استقبال الطلبات إلكترونيًا، ولا تمثل ادعاء بوجود مكتب أو فرع فعلي داخل كل حي أو مركز." ]
    ]
  },
  {
    slug: "lawyer-umluj.html",
    name: "أملج",
    symbol: "أ",
    meta: "محامي في أملج للأفراد والمنشآت: عقود وأعمال وعقار وأحوال شخصية وتنفيذ. استقبال الطلبات من جميع أحياء ومراكز وقرى محافظة أملج.",
    intro: "صفحة مخصصة لطلبات المحامين والخدمات القانونية في محافظة أملج. حدّد هل الموضوع شخصي أو تجاري، ثم اذكر المرحلة والموقع داخل المدينة أو المركز حتى ينتقل الطلب إلى الدليل التخصصي الأنسب.",
    contextTitle: "من أحياء أملج إلى المراكز والقرى التابعة",
    context: "تتعدد المسائل القانونية بين معاملات الأفراد واحتياجات الأعمال والعقود والعقار. لهذا تفصل الصفحة بين نوع الخدمة ونطاقها الجغرافي، وتوضح أن بدء الطلب متاح إلكترونيًا من أي حي أو مخطط أو مركز تابع لمحافظة أملج.",
    areas: ["مدينة أملج", "الأحياء السكنية", "المخططات الساحلية", "المراكز التابعة", "القرى التابعة", "أي موقع داخل المحافظة"],
    roads: ["طريق أملج–الوجه", "طريق أملج–ينبع", "الطريق الساحلي", "مداخل مدينة أملج", "طرق المراكز والقرى", "جميع شوارع أملج"],
    matters: [
      ["الشركات والأعمال", "عقود المنشآت والمطالبات التجارية والعلاقات بين الشركاء والعملاء والموردين وتحديد المسار المناسب للنزاع.", "commercial-lawyer-tabuk.html"],
      ["العقود والاتفاقيات", "صياغة البنود ومراجعة الالتزامات والمدد والدفعات والفسخ والضمانات قبل اعتماد الاتفاق.", "contracts-lawyer-tabuk.html"],
      ["العقار والمشروعات", "مسائل البيع والإيجار والمقاولات والمستحقات والعيوب، مع فصل الجانب الفني عن المطالبة القانونية.", "real-estate-lawyer-tabuk.html"],
      ["الأسرة والتركات", "طلبات الأسرة والمواريث من خلال ترتيب صفة مقدم الطلب والوقائع والمستندات والمواعيد ذات الصلة.", "family-lawyer-tabuk.html"]
    ],
    prep: ["اكتب نوع الخدمة في سطر واحد", "حدّد صفتك دون مشاركة بيانات الطرف الآخر", "اذكر الحي أو المركز داخل أملج", "وضّح الإجراء الذي تم حتى الآن", "أرفق لاحقًا المستندات المطلوبة فقط"],
    faqs: [
      ["هل يمكن بدء طلب قانوني من قرى محافظة أملج؟", "نعم، يشمل الاستقبال الإلكتروني مدينة أملج وجميع الأحياء والمخططات والمراكز والقرى التابعة، ثم يراجع نوع الطلب وإمكان تقديم الخدمة."],
      ["ما المعلومات اللازمة لطلب متعلق بعقد؟", "أرسل نوع العقد، وصفة الأطراف، والمرحلة الحالية، والبند محل السؤال، والمدة أو الموعد المهم، دون إرسال بيانات مالية أو كلمات مرور."],
      ["هل أختار محاميًا تجاريًا أم محامي عقود؟", "صفحة العقود أنسب للصياغة والمراجعة والبنود، بينما الصفحة التجارية أنسب للمطالبات ومنازعات الأعمال والشركاء والمنشآت." ]
    ]
  },
  {
    slug: "lawyer-tayma.html",
    name: "تيماء",
    symbol: "ت",
    meta: "محامي في تيماء للقضايا والعقار والمواريث والعقود والمطالبات والتنفيذ، مع استقبال الطلبات من جميع أحياء ومراكز وقرى محافظة تيماء.",
    intro: "لبدء طلب محامٍ في تيماء، اجمع بين موضوع القضية وموقعها ومرحلتها. صُممت الصفحة لطلبات الأفراد والمنشآت داخل المدينة والمراكز والقرى، مع روابط مباشرة إلى أدلة العقار والأسرة والعقود والتنفيذ.",
    contextTitle: "ترتيب الطلب القانوني في محافظة تيماء",
    context: "قد يرتبط الطلب بعقار أو تركة أو عقد أو مطالبة أو إجراء قضائي. يساعد ذكر موقع العقار أو الأطراف داخل تيماء، مع الجهة والموعد والوثيقة الأساسية، على منع الخلط بين الاستشارة الأولية والدعوى والتنفيذ.",
    areas: ["مدينة تيماء", "الأحياء السكنية", "المخططات الزراعية", "المراكز التابعة", "القرى والهجر التابعة", "أي موقع داخل المحافظة"],
    roads: ["طريق تبوك–تيماء", "طريق تيماء–العلا", "طريق تيماء–المدينة", "مداخل مدينة تيماء", "طرق المراكز والهجر", "جميع شوارع تيماء"],
    matters: [
      ["العقار والأراضي", "مراجعة مستندات الملكية والبيع والإيجار والمقاولات، وتحديد طبيعة المطالبة والجهة المختصة وفق الوقائع.", "real-estate-lawyer-tabuk.html"],
      ["المواريث والأسرة", "تنظيم صفة الورثة والمستندات والطلبات المتعلقة بالتركة أو القسمة أو بقية مسائل الأحوال الشخصية.", "family-lawyer-tabuk.html"],
      ["المطالبات والتنفيذ", "التمييز بين مطالبة تحتاج إلى حكم وبين سند قابل للتنفيذ، ومراجعة ما تم اتخاذه في الإجراء الحالي.", "execution-lawyer-tabuk.html"],
      ["العقود والتجارة", "مراجعة الاتفاقيات والدفعات والضمانات ومطالبات الأنشطة والأعمال قبل تحديد التفاوض أو الإجراء القضائي.", "commercial-lawyer-tabuk.html"]
    ],
    prep: ["حدّد إن كان الموضوع عقارًا أو أسرة أو عقدًا أو تنفيذًا", "اذكر موقع الواقعة أو العقار داخل تيماء", "وضّح المستند الأساسي المتوفر", "اذكر الجهة والمرحلة والموعد", "احتفظ بالأصول ولا تشارك معلومات الدخول"],
    faqs: [
      ["هل تغطي الصفحة مراكز وهجر تيماء؟", "نعم، يستقبل الموقع الطلبات الأولية من مدينة تيماء والأحياء والمخططات والمراكز والقرى والهجر التابعة، حتى لو لم يظهر الاسم المحلي للموقع في الصفحة."],
      ["متى أحتاج صفحة المحامي العقاري؟", "إذا كان جوهر الطلب متعلقًا بملكية أو بيع أو إيجار أو مقاولة أو دفعات أو عيوب في عقار، فابدأ بالدليل العقاري ثم اذكر موقع العقار ومستنده الأساسي."],
      ["هل يمكن تقييم مستندات التركة عبر الرسالة الأولى؟", "ابدأ بوصف صفتك ونوع الطلب وعدد الأطراف بصورة عامة، ثم تُطلب المستندات اللازمة عبر القناة المناسبة بعد التقييم الأولي." ]
    ]
  },
  {
    slug: "lawyer-haql.html",
    name: "حقل",
    symbol: "ح",
    meta: "محامي في حقل للقضايا والعقود والأحوال الشخصية والمطالبات والتنفيذ، مع استقبال الطلبات من مدينة حقل والدرة وجميع المراكز والقرى التابعة.",
    intro: "تتيح صفحة محامي حقل بدء الطلب من المدينة أو الدرة أو أي مركز تابع، مع فصل واضح بين نوع القضية ومرحلتها. اكتب ملخصًا موجزًا وموقعك وأقرب موعد لتحديد الدليل القانوني المناسب.",
    contextTitle: "طلبات قانونية من شمال منطقة تبوك",
    context: "الموقع الجغرافي لا يغيّر ضرورة فهم الاختصاص والمرحلة. لذلك تسأل الصفحة عن موضوع الطلب والجهة الحالية والمكان داخل محافظة حقل، ثم توجه إلى مسار العقود أو الأسرة أو المطالبات أو القضايا بحسب الحاجة.",
    areas: ["مدينة حقل", "الدرة", "الأحياء السكنية", "النطاق الساحلي", "المراكز والقرى التابعة", "أي موقع داخل المحافظة"],
    roads: ["طريق حقل–البدع", "طريق حقل–الدرة", "الطريق الساحلي", "مداخل مدينة حقل", "طرق المراكز والقرى", "جميع شوارع حقل"],
    matters: [
      ["القضايا والمذكرات", "ترتيب الوقائع والطلبات والدفوع والمواعيد بحسب المحكمة والمرحلة، مع اختيار التخصص قبل إعداد أي مذكرة.", "lawyer-tabuk.html"],
      ["العقود والأعمال", "مراجعة الاتفاقيات والالتزامات والفسخ والتعويض والدفعات للأفراد والمنشآت قبل التصعيد أو التوقيع.", "contracts-lawyer-tabuk.html"],
      ["الأحوال الشخصية", "طلبات الأسرة والنفقة والحضانة والزيارة والفسخ والطلاق والتركات، وفق صفة مقدم الطلب ووقائع الملف.", "family-lawyer-tabuk.html"],
      ["التنفيذ والمطالبات", "فحص السند أو الحكم والمرحلة الحالية وما إذا كان المطلوب تنفيذًا أو منازعة تنفيذ أو دعوى سابقة للتنفيذ.", "execution-lawyer-tabuk.html"]
    ],
    prep: ["اكتب المجال القانوني الأقرب", "اذكر مدينة حقل أو الدرة أو المركز", "حدد الجهة التي تنظر الموضوع", "أضف أقرب موعد أو مهلة", "شارك الحد الأدنى من البيانات اللازمة"],
    faqs: [
      ["هل يشمل استقبال الطلبات مركز الدرة؟", "نعم، يشمل الاستقبال الإلكتروني مدينة حقل والدرة والأحياء والمراكز والقرى التابعة للمحافظة، مع مراجعة نوع الطلب وإمكان تقديم الخدمة."],
      ["كيف أحدد التخصص القانوني المناسب؟", "ابدأ بالنتيجة المطلوبة: استشارة، عقد، قضية أسرية، مطالبة، حكم أو تنفيذ. وإذا لم تعرف التخصص، اكتب ملخصًا من سطرين والمرحلة الحالية."],
      ["هل توجد رسوم ثابتة لكل طلب؟", "تختلف الأتعاب بحسب نوع الخدمة وحجم المستندات والمرحلة والوقت المطلوب، ولا تحدد قبل مراجعة أولية لنطاق العمل." ]
    ]
  },
  {
    slug: "lawyer-al-bad.html",
    name: "البدع",
    symbol: "ب",
    meta: "محامي في البدع للخدمات القانونية والعقار والعقود والمواريث والمطالبات، مع استقبال الطلبات من البدع ومقنا وجميع المراكز والقرى التابعة.",
    intro: "صفحة محلية لبدء طلب محامٍ في محافظة البدع، من المدينة أو مقنا أو أي مركز وقرية تابعة. يربط الدليل بين موضوع الطلب وموقعه ومرحلته، ثم ينقلك إلى الخدمة التخصصية الأقرب.",
    contextTitle: "تغطية البدع ومقنا والمواقع التابعة",
    context: "يمكن أن يتصل الطلب بعقار أو عقد أو أسرة أو مطالبة أو إجراء قضائي. تحديد موقع الواقعة داخل البدع، مع صفة مقدم الطلب والمستند الأساسي والموعد، يسهّل التوجيه الأولي ويمنع إرسال تفاصيل لا يحتاجها التقييم الأول.",
    areas: ["مدينة البدع", "مقنا", "الأحياء والمخططات", "النطاق الساحلي", "المراكز والقرى التابعة", "أي موقع داخل المحافظة"],
    roads: ["طريق البدع–تبوك", "طريق البدع–حقل", "طريق البدع–مقنا", "مداخل مدينة البدع", "طرق المراكز والقرى", "جميع شوارع البدع"],
    matters: [
      ["العقار والملكيات", "قراءة الصك أو العقد والوقائع المتعلقة بالبيع والإيجار والانتفاع والمقاولات قبل تحديد نوع المطالبة.", "real-estate-lawyer-tabuk.html"],
      ["العقود والمقاولات", "صياغة ومراجعة بنود النطاق والدفعات والمدد والضمانات والفسخ والتعويض للأفراد والمنشآت.", "contracts-lawyer-tabuk.html"],
      ["الأسرة والمواريث", "مسائل الأحوال الشخصية والتركات من خلال ترتيب الصفة والطلبات والوثائق والمواعيد الأساسية.", "family-lawyer-tabuk.html"],
      ["المطالبات والتنفيذ", "تحديد ما إذا كان المستند سندًا تنفيذيًا أو يحتاج إلى دعوى، ومراجعة الحكم أو الإجراء القائم عند وجوده.", "execution-lawyer-tabuk.html"]
    ],
    prep: ["حدّد موضوع الطلب والنتيجة المطلوبة", "اذكر البدع أو مقنا أو المركز التابع", "وضّح صفتك والمرحلة الحالية", "أضف أقرب جلسة أو نهاية مدة", "أرسل ملخصًا فقط في البداية"],
    faqs: [
      ["هل يمكن طلب خدمة قانونية من مقنا؟", "نعم، يستقبل الموقع الطلبات الأولية إلكترونيًا من مدينة البدع ومقنا وجميع المراكز والقرى التابعة، ثم يحدد المسار بحسب نوع القضية."],
      ["ما الذي أرسله في طلب متعلق بأرض أو عقار؟", "اذكر نوع المستند، وموقع العقار، وطبيعة العلاقة أو النزاع، والمرحلة الحالية، ولا ترسل أصل المستند أو بيانات حساسة في الرسالة الأولى."],
      ["هل الصفحة بديل عن الاستشارة القانونية؟", "لا. الصفحة دليل محلي لتنظيم الطلب والوصول إلى التخصص المناسب، أما الرأي القانوني فيتطلب مراجعة الوقائع والمستندات ونطاق الخدمة." ]
    ]
  }
];

const logo = `<div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div>`;

function analytics() {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;
}

function header(topbar, message, servicesHref = "#services", coverageHref = "#coverage") {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">${topbar}</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div>
  <header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية">${logo}<div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="tabuk-region-lawyers.html">مدن تبوك</a><a href="${servicesHref}">الخدمات</a><a href="${coverageHref}">التغطية المحلية</a><a href="#faq">الأسئلة الشائعة</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(message) {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>استقبال طلبات الخدمات القانونية إلكترونيًا من مدينة تبوك وجميع محافظات ومراكز المنطقة.</p></div><div><b>دليل المنطقة</b><a href="tabuk-region-lawyers.html">محامو منطقة تبوك</a><a href="lawyer-tabuk.html">محامي مدينة تبوك</a><a href="legal-services-tabuk.html">الخدمات القانونية</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:ap0554138485@icloud.com">ap0554138485@icloud.com</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer>
  <a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="script.js"></script>`;
}

function renderLocation(location) {
  const url = `${baseUrl}/${location.slug}`;
  const message = `السلام عليكم، أرغب في طلب محامي في ${location.name}. نوع القضية والحي أو المركز: `;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `طلب محامي في ${location.name}`,
        serviceType: `خدمات قانونية ومحاماة في محافظة ${location.name}`,
        url,
        provider: {"@type":"Organization","@id":`${baseUrl}/#organization`,name:"رُكن الأنظمة القانونية",url:`${baseUrl}/`,telephone:phone},
        areaServed: [{"@type":"City",name:location.name},{"@type":"AdministrativeArea",name:`محافظة ${location.name}، منطقة تبوك`},{"@type":"AdministrativeArea",name:"منطقة تبوك"}]
      },
      {"@type":"BreadcrumbList",itemListElement:[
        {"@type":"ListItem",position:1,name:"الرئيسية",item:`${baseUrl}/`},
        {"@type":"ListItem",position:2,name:"محامو منطقة تبوك",item:`${baseUrl}/tabuk-region-lawyers.html`},
        {"@type":"ListItem",position:3,name:`محامي في ${location.name}`,item:url}
      ]},
      {"@type":"FAQPage",mainEntity:location.faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
    ]
  };
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${analytics()}
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <title>محامي في ${location.name} | رُكن الأنظمة القانونية</title>
  <meta name="description" content="${location.meta}">
  <link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="محامي في ${location.name}"><meta property="og:description" content="${location.meta}"><meta property="og:url" content="${url}">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${header(`طلبات المحامين من محافظة ${location.name} وجميع المواقع التابعة`, message)}
  <main>
    <div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="tabuk-region-lawyers.html">منطقة تبوك</a><span aria-hidden="true">/</span><span>محامي في ${location.name}</span></div>
    <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">تغطية محافظة ${location.name}</span><h1>محامي في ${location.name}<br><span>حسب نوع قضيتك</span></h1><p>${location.intro}</p><div class="hero-actions"><a class="btn primary" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">اطلب محاميًا عبر واتساب</a><a class="btn secondary" href="#services">اختر الخدمة</a></div><div class="trust-row"><div><b>كل المحافظة</b><span>مدينة ومراكز وقرى</span></div><div><b>مسارات متخصصة</b><span>لاختيار أدق</span></div><div><b>استقبال إلكتروني</b><span>للطلب الأولي</span></div></div></div><aside class="service-hero-aside" aria-label="بدء طلب محامي في ${location.name}"><span class="service-badge">محامي ${location.name}</span><div class="service-symbol" aria-hidden="true">${location.symbol}</div><h2>ابدأ بثلاث معلومات</h2><p>تساعد هذه البيانات على توجيه الطلب إلى المسار الأقرب.</p><ul class="service-hero-points"><li>نوع القضية أو الخدمة</li><li>المرحلة والجهة الحالية</li><li>الحي أو المركز داخل ${location.name}</li></ul></aside></div></section>
    <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#services">الخدمات</a><a href="#local-context">فهم الطلب</a><a href="#coverage">الأحياء والطرق</a><a href="#prepare">تجهيز الرسالة</a><a href="#faq">الأسئلة الشائعة</a></nav></div>

    <section class="section" id="services"><div class="container"><div class="section-head"><span class="eyebrow">اختر المسار الصحيح</span><h2>خدمات قانونية في ${location.name}</h2><p>كل مسار يقود إلى دليل تخصصي مختلف؛ اختر جوهر الطلب لا مجرد اسم الوثيقة.</p></div><div class="specialty-grid">${location.matters.map(([title,text,href],index)=>`<article class="specialty-card" data-number="0${index+1}"><h3><a href="${href}">${title}</a></h3><p>${text}</p></article>`).join("")}</div></div></section>

    <section class="section alt" id="local-context"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">سياق محلي واضح</span><h2>${location.contextTitle}</h2><p>${location.context}</p></div><div class="locality-panel"><h3>كيف نحدد الصفحة المناسبة؟</h3><p>إذا كان هدفك فهم موقف أو خيار أولي، ابدأ من <a href="legal-consultation-tabuk.html">الاستشارة القانونية</a>. إذا كانت لديك قضية وتبحث عن التخصص، ابدأ من <a href="lawyer-tabuk.html">دليل اختيار المحامي</a>. وللعقود والتنفيذ والأسرة والعقار صفحات مستقلة تمنع خلط نية البحث.</p><p class="coverage-disclaimer">لا تُرسل كلمات مرور أو بيانات بنكية أو أصول المستندات في الرسالة الأولى.</p></div></div></section>

    <section class="section" id="coverage"><div class="container"><div class="section-head"><span class="eyebrow">تغطية جغرافية</span><h2>أحياء وطرق ومراكز محافظة ${location.name}</h2><p>يشمل استقبال الطلبات أي حي أو شارع أو مخطط أو مركز أو قرية داخل المحافظة، سواء ذُكر الاسم أدناه أم لم يُذكر.</p></div><div class="locality-panels"><article class="locality-panel"><h3>المواقع المشمولة</h3><ul class="location-list">${location.areas.map(item=>`<li>${item}</li>`).join("")}</ul></article><article class="locality-panel"><h3>الطرق ونطاق الوصول</h3><ul class="road-chips">${location.roads.map(item=>`<li>${item}</li>`).join("")}</ul></article></div><p class="coverage-disclaimer">التغطية تعني استقبال الطلب الأولي إلكترونيًا من هذه المواقع، ولا تعني وجود فرع فعلي في كل حي أو مدينة أو مركز.</p></div></section>

    <section class="section alt" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">قبل التواصل</span><h2>جهّز طلبك من ${location.name}</h2><p>رسالة واضحة من خمسة عناصر تختصر الوقت وتمنع إرسال تفاصيل لا يحتاجها التقييم الأولي.</p></div><ol class="document-list">${location.prep.map(item=>`<li>${item}</li>`).join("")}</ol></div></section>

    <section class="section"><div class="container"><div class="section-head"><span class="eyebrow">مدن ومحافظات قريبة</span><h2>استكشف جميع صفحات منطقة تبوك</h2><p>دليل جغرافي مترابط لمدينة تبوك والمحافظات الست.</p></div><div class="related-services"><a href="lawyer-tabuk.html">مدينة تبوك</a>${locations.map(item=>`<a href="${item.slug}"${item.slug===location.slug?' aria-current="page"':''}>${item.name}</a>`).join("")}</div></div></section>

    <section class="section alt" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">إجابات مباشرة</span><h2>أسئلة عن المحامين في ${location.name}</h2></div>${location.faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></section>
    <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">ابدأ الآن</span><h2>اذكر نوع القضية وموقعك في ${location.name}</h2><p>تبدأ المراجعة بتحديد التخصص وإمكان تقديم الخدمة ونطاقها.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">طلب محامي عبر واتساب</a></div></div></section>
  </main>
  ${footer(message)}
</body></html>`;
}

function renderHub() {
  const slug = "tabuk-region-lawyers.html";
  const url = `${baseUrl}/${slug}`;
  const message = "السلام عليكم، أرغب في طلب خدمة قانونية داخل منطقة تبوك. المدينة أو المحافظة ونوع القضية: ";
  const directory = [
    ["مدينة تبوك", "lawyer-tabuk.html", "صفحة المدينة الأساسية وتشمل أكثر من خمسين حيًا وخمسة عشر طريقًا وشارعًا رئيسيًا."],
    ...locations.map(location => [location.name, location.slug, `صفحة محافظة ${location.name} وتشمل المدينة والأحياء والمخططات والمراكز والقرى والطرق التابعة.`])
  ];
  const faqs = [
    ["ما المدن والمحافظات التي يغطيها الدليل؟", "يغطي الدليل مدينة تبوك ومحافظات ضباء والوجه وأملج وتيماء وحقل والبدع، إضافة إلى الأحياء والمخططات والمراكز والقرى والطرق التابعة لكل محافظة."],
    ["هل توجد صفحة لكل شارع في منطقة تبوك؟", "لا؛ جُمعت الشوارع والأحياء داخل صفحات المدن المناسبة حتى تكون الصفحات مفيدة وغير مكررة. إنشاء صفحة متشابهة لكل شارع قد يضعف جودة الموقع، بينما تغطي الصفحة أي شارع حتى لو لم يذكر اسمه."],
    ["هل التغطية تعني وجود مكاتب في جميع المحافظات؟", "لا. التغطية تعني استقبال الطلبات الأولية إلكترونيًا من جميع مواقع منطقة تبوك، ثم تحديد طريقة تقديم الخدمة بحسب النوع والإمكان والتخصص."],
    ["كيف أختار بين صفحة المدينة وصفحة التخصص؟", "ابدأ بصفحة مدينتك إذا كان هدفك الوصول المحلي، ثم انتقل إلى صفحة التخصص مثل الجنائي أو الأسرة أو التجاري أو العقود أو التنفيذ بحسب جوهر الطلب."]
  ];
  const schema = {
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"Service","@id":`${url}#service`,name:"خدمات المحامين في منطقة تبوك",serviceType:"دليل التغطية الجغرافية للخدمات القانونية",url,provider:{"@type":"Organization","@id":`${baseUrl}/#organization`,name:"رُكن الأنظمة القانونية",url:`${baseUrl}/`,telephone:phone},areaServed:[{"@type":"AdministrativeArea",name:"منطقة تبوك"},...directory.map(([name])=>({"@type":"City",name:name.replace("مدينة ","")}))]},
      {"@type":"ItemList","@id":`${url}#locations`,name:"مدن ومحافظات منطقة تبوك",numberOfItems:directory.length,itemListElement:directory.map(([name,href],index)=>({"@type":"ListItem",position:index+1,name,url:`${baseUrl}/${href}`}))},
      {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"محامو منطقة تبوك",item:url}]},
      {"@type":"FAQPage",mainEntity:faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
    ]
  };
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${analytics()}
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <title>محامو منطقة تبوك | دليل المدن والمحافظات</title>
  <meta name="description" content="دليل المحامين والخدمات القانونية في منطقة تبوك: مدينة تبوك وضباء والوجه وأملج وتيماء وحقل والبدع، مع الأحياء والمراكز والقرى والطرق.">
  <link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="محامو منطقة تبوك | دليل المدن والمحافظات"><meta property="og:description" content="صفحة مركزية للتغطية القانونية في مدينة تبوك وجميع محافظات المنطقة ومراكزها وطرقها."><meta property="og:url" content="${url}">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${header("دليل التغطية القانونية في جميع منطقة تبوك", message, "#locations", "#tabuk-city")}
  <main>
    <div class="container breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>محامو منطقة تبوك</span></div>
    <section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">مدينة تبوك + 6 محافظات</span><h1>محامو منطقة تبوك<br><span>دليل المدن والمحافظات</span></h1><p>اختر مدينتك أو محافظتك للوصول إلى صفحة محلية أصلية، ثم اختر التخصص القانوني بحسب موضوع القضية. يغطي الدليل الأحياء والمخططات والمراكز والقرى والطرق دون إنشاء صفحات مكررة لكل اسم جغرافي.</p><div class="hero-actions"><a class="btn primary" href="#locations">اختر مدينتك</a><a class="btn secondary" href="legal-services-tabuk.html">اختر الخدمة</a></div><div class="trust-row"><div><b>7 صفحات محلية</b><span>لكامل المنطقة</span></div><div><b>50+ حيًا</b><span>داخل مدينة تبوك</span></div><div><b>كل طريق ومركز</b><span>مشمول بالاستقبال</span></div></div></div><aside class="service-hero-aside" aria-label="دليل منطقة تبوك"><span class="service-badge">منطقة تبوك</span><div class="service-symbol" aria-hidden="true">7</div><h2>هيكل جغرافي واضح</h2><p>كل مدينة لها عنوان ومحتوى وروابط محلية مستقلة.</p><ul class="service-hero-points"><li>مدينة تبوك وأحياؤها</li><li>ست محافظات ومراكزها</li><li>صفحات تخصصية مترابطة</li></ul></aside></div></section>
    <div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#locations">المدن والمحافظات</a><a href="#tabuk-city">أحياء تبوك</a><a href="#method">طريقة التغطية</a><a href="#faq">الأسئلة الشائعة</a></nav></div>

    <section class="section" id="locations"><div class="container"><div class="section-head"><span class="eyebrow">دليل جغرافي</span><h2>اختر مدينتك أو محافظتك في منطقة تبوك</h2><p>تستهدف كل صفحة نية بحث محلية مستقلة، وتربطها بالخدمات القانونية المتخصصة بدل تكرار صفحة واحدة.</p></div><div class="specialty-grid">${directory.map(([name,href,text],index)=>`<article class="specialty-card" data-number="0${index+1}"><h3><a href="${href}">محامي في ${name}</a></h3><p>${text}</p></article>`).join("")}</div></div></section>

    <section class="section alt" id="tabuk-city"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">مدينة تبوك</span><h2>الأحياء والشوارع داخل مقر المنطقة</h2><p>صفحة مدينة تبوك هي المرجع المحلي للأحياء والطرق، وتشمل النخيل، سلطانة، المروج، المصيف، اليرموك، الروضة، الفيصلية، الجامعة، السلام، الحمراء، البوادي، الإسكان، الصناعية وغيرها، إضافة إلى الطرق الرئيسية.</p><a class="primary-btn" href="lawyer-tabuk.html#coverage">عرض جميع أحياء وطرق تبوك</a></div><div class="locality-panel"><h3>طرق رئيسية مشمولة</h3><ul class="road-chips"><li>طريق الملك فهد</li><li>طريق الملك عبدالعزيز</li><li>طريق الملك خالد</li><li>طريق الملك فيصل</li><li>طريق الملك عبدالله</li><li>طريق الأمير فهد بن سلطان</li><li>طريق الأمير سلطان</li><li>طريق المطار</li><li>طريق ضباء</li><li>طريق المدينة المنورة</li><li>طريق شرما</li></ul><p class="coverage-disclaimer">أي حي أو شارع أو مخطط داخل مدينة تبوك مشمول، ولو لم يرد اسمه ضمن الأمثلة.</p></div></div></section>

    <section class="section" id="method"><div class="container"><div class="section-head"><span class="eyebrow">تغطية بلا تكرار</span><h2>كيف تساعد البنية الجديدة على الظهور المحلي؟</h2><p>تربط بين الموقع والخدمة وتمنح محركات البحث مسارًا واضحًا من المنطقة إلى المدينة ثم إلى التخصص.</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>صفحة المنطقة</h3><p>تجمع كل المدن والمحافظات في دليل واحد وتوزع الروابط والبيانات المنظمة بينها.</p></article><article class="specialty-card" data-number="02"><h3>صفحة محلية مفيدة</h3><p>لكل محافظة وصف ونطاق وطرق وأسئلة وسياق مختلف، وليس تبديل اسم المدينة فقط.</p></article><article class="specialty-card" data-number="03"><h3>صفحة تخصصية</h3><p>ينتقل الزائر بعد تحديد موقعه إلى الجنائي أو الأسرة أو التجاري أو العمل أو التنفيذ أو العقود أو العقار.</p></article></div><p class="coverage-disclaimer">لا يمكن ضمان المركز الأول أو مدة الفهرسة؛ التحسين يهيئ صفحات أقوى، بينما يعتمد الظهور أيضًا على المنافسة وجودة الموقع والسمعة والروابط وسلوك الباحثين.</p></div></section>

    <section class="section alt"><div class="container"><div class="section-head"><span class="eyebrow">دليل الخدمات</span><h2>اختر تخصصك القانوني في منطقة تبوك</h2><p>بعد اختيار الموقع، انتقل إلى الصفحة التي تطابق جوهر طلبك.</p></div><div class="related-services"><a href="criminal-lawyer-tabuk.html">محامي جنائي</a><a href="family-lawyer-tabuk.html">أحوال شخصية</a><a href="commercial-lawyer-tabuk.html">محامي تجاري</a><a href="labor-lawyer-tabuk.html">محامي عمالي</a><a href="execution-lawyer-tabuk.html">محامي تنفيذ</a><a href="contracts-lawyer-tabuk.html">محامي عقود</a><a href="real-estate-lawyer-tabuk.html">محامي عقاري</a><a href="legal-consultation-tabuk.html">استشارة قانونية</a></div></div></section>

    <section class="section" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة جغرافية</span><h2>أسئلة عن تغطية منطقة تبوك</h2></div>${faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></section>
    <section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">ابدأ من موقعك</span><h2>اذكر المدينة أو المحافظة ونوع القضية</h2><p>يكفي في البداية تحديد الموقع والموضوع والمرحلة الحالية.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ الطلب عبر واتساب</a></div></div></section>
  </main>
  ${footer(message)}
</body></html>`;
}

writeFileSync(resolve(root, "tabuk-region-lawyers.html"), renderHub(), "utf8");
for (const location of locations) {
  writeFileSync(resolve(root, location.slug), renderLocation(location), "utf8");
}
console.log(`Generated ${locations.length + 1} Tabuk location pages.`);
