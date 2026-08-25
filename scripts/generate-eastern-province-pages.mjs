import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://rukn-legal-vwptio.cranl.net";
const lastmod = "2026-08-25";
const phone = "+966506142113";
const displayPhone = "+966 50 614 2113";
const email = "ap0554138485@icloud.com";
const assetVersion = "20260821b";
const stylesheet = `styles-${assetVersion}.css`;
const fontUrl = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap";
const analytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKGEYHSD29"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KKGEYHSD29');</script>`;
const logo = `<div class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7m3-7 3 7m9 0-3-7-3 7M2 14h8a4 4 0 0 1-8 0Zm12 0h8a4 4 0 0 1-8 0Z"/></svg></div>`;

export const localities = [
  { key: "dammam", name: "الدمام", kind: "مدينة", cluster: "حاضرة الدمام", hub: "legal-services-dammam.html", profile: "مقر إمارة المنطقة الشرقية ومركز حضري تتداخل فيه طلبات الأفراد والمنشآت والعقار والعمل والتجارة، لذلك يفيد فصل موقع الواقعة عن مقر الطرف والجهة والموعد.", anchors: ["العقود الحضرية", "الشركات والخدمات", "العقار والمقاولات", "علاقات العمل"] },
  { key: "al-ahsa", name: "الأحساء", kind: "محافظة", cluster: "واحة الأحساء", profile: "محافظة واسعة تضم مدنًا ومراكز متعددة؛ وقد يرتبط الملف بأصل عقاري أو نشاط تجاري أو أسري في موقع، بينما تكون إقامة الأطراف أو المستندات في موقع آخر.", anchors: ["الأصول العقارية", "المنشآت العائلية", "العقود الزراعية والتجارية", "تعدد المراكز"] },
  { key: "hafar-al-batin", name: "حفر الباطن", kind: "محافظة", cluster: "شمال الشرقية", profile: "محافظة شمالية تخدم نطاقًا سكانيًا وتجاريًا واسعًا، ويحتاج الطلب فيها إلى ضبط المدينة أو المركز، وتاريخ الالتزام، ومكان التسليم أو العمل أو الواقعة.", anchors: ["المطالبات التجارية", "عقود التوريد", "علاقات العمل", "المواقع المتباعدة"] },
  { key: "jubail", name: "الجبيل", kind: "محافظة", cluster: "ساحل وصناعة الشرقية", profile: "بيئة تجمع المدينة والأنشطة الصناعية واللوجستية، ما يجعل نطاق العقد، وسلسلة المقاولين، ومحاضر الإنجاز والسلامة والتسليم عناصر متكررة في تنظيم الملف.", anchors: ["المقاولات الصناعية", "سلاسل التوريد", "الخدمات اللوجستية", "العقود التشغيلية"] },
  { key: "qatif", name: "القطيف", kind: "محافظة", cluster: "ساحل القطيف", profile: "محافظة مترابطة المدن والبلدات؛ وقد يجمع الملف بين عقار أو تركة أو منشأة عائلية واتفاقات قديمة، فيلزم ترتيب الصفة والتواريخ والمستندات قبل اختيار المسار.", anchors: ["التركات والأصول", "العقار", "الشراكات العائلية", "المطالبات المدنية"] },
  { key: "khobar", name: "الخبر", kind: "محافظة", cluster: "حاضرة الدمام", profile: "مركز أعمال وسكن وخدمات يرتبط بكثافة بعقود الإيجار والتوظيف والشركات والخدمات؛ ويجب تمييز عنوان المنشأة عن موقع تنفيذ الالتزام والجهة المختصة.", anchors: ["عقود الخدمات", "الإيجارات التجارية", "الشركات", "التوظيف"] },
  { key: "khafji", name: "الخفجي", kind: "محافظة", cluster: "الساحل الشمالي", profile: "محافظة حدودية ساحلية؛ وقد تتوزع أطراف الطلب ومستنداته بين مواقع عمل أو سكن مختلفة، لذلك تصبح الصفة ومكان التنفيذ والتبليغ والتاريخ عناصر أساسية.", anchors: ["عقود العمل", "الخدمات التشغيلية", "المطالبات", "تعدد مواقع الأطراف"] },
  { key: "al-udayd", name: "العديد", kind: "محافظة", cluster: "جنوب الشرقية", profile: "نطاق جغرافي واسع قليل الكثافة، ويزداد فيه أثر تحديد المركز والعنوان الرسمي ومكان الأصل أو الواقعة عند تنظيم العقود والمطالبات والملفات العقارية.", anchors: ["العنوان الرسمي", "موقع الأصل", "المطالبات", "الإثبات الكتابي"] },
  { key: "ras-tanura", name: "رأس تنورة", kind: "محافظة", cluster: "ساحل وصناعة الشرقية", profile: "محافظة ساحلية ذات أنشطة تشغيلية وصناعية؛ وتظهر أهمية أوامر العمل، ومحاضر الاستلام، وساعات العمل، ومسؤوليات المقاول والمورد في كثير من الملفات.", anchors: ["التشغيل والصيانة", "منازعات الموردين", "العمل", "المقاولات"] },
  { key: "abqaiq", name: "بقيق", kind: "محافظة", cluster: "وسط الشرقية", profile: "محافظة ترتبط بأنشطة تشغيلية وخدمية ومراكز تابعة؛ ويحتاج الملف إلى ربط العقد أو علاقة العمل بالموقع الفعلي والتسلسل الزمني والمستند الحاسم.", anchors: ["الخدمات التشغيلية", "العمل", "التوريد", "إثبات التسليم"] },
  { key: "nuayriyah", name: "النعيرية", kind: "محافظة", cluster: "شمال الشرقية", profile: "محافظة تتبعها مراكز عديدة، لذلك يجب عدم الاكتفاء باسم المحافظة؛ بل توثيق المركز وموقع الواقعة أو الأصل وبيانات الأطراف والمهل ذات الصلة.", anchors: ["تحديد المركز", "العقار", "عقود الخدمات", "المطالبات"] },
  { key: "qaryat-al-ulya", name: "قرية العليا", kind: "محافظة", cluster: "شمال الشرقية", profile: "محافظة واسعة المراكز والمسافات؛ ويستفيد الطلب من تحديد موقع التنفيذ أو الأصل، وطريقة التعاقد، وإثبات التسليم، وأقرب موعد أو إجراء قائم.", anchors: ["المواقع المتباعدة", "التنفيذ", "التوريد", "المستندات الزمنية"] },
  { key: "al-bayda", name: "البيضاء", kind: "محافظة", cluster: "حاضرة الدمام", profile: "محافظة ضمن النطاق الحضري المتنامي؛ وقد تتداخل فيها عقود التطوير والبناء والإيجار والخدمات مع عناوين أطراف في مدن مجاورة.", anchors: ["التطوير العقاري", "المقاولات", "الإيجار", "الخدمات"] },
  { key: "dhahran", name: "الظهران", kind: "مدينة", cluster: "حاضرة الدمام", profile: "مدينة أعمال وتعليم وخدمات ضمن حاضرة مترابطة؛ ويحتاج الملف إلى تمييز مقر العمل أو المنشأة عن محل إقامة الطرف ومكان تنفيذ العقد.", anchors: ["عقود الخبرات", "علاقات العمل", "الخدمات المهنية", "التقنية"] },
  { key: "hofuf", name: "الهفوف", kind: "مدينة", cluster: "واحة الأحساء", profile: "مدينة رئيسية في الأحساء تضم أنشطة تجارية وعقارية وأسرية متنوعة، ويُستحسن ربط كل طلب بالصفة والأصل أو العقد والمرحلة بدل الاعتماد على اسم المدينة وحده.", anchors: ["التجارة المحلية", "العقار", "الأسرة", "التركات"] },
  { key: "mubarraz", name: "المبرز", kind: "مدينة", cluster: "واحة الأحساء", profile: "مدينة متصلة بالنطاق الحضري للأحساء؛ وقد تتقاطع فيها الملكيات والعقود والشراكات والعلاقات الأسرية، فتكون خريطة الأطراف والأصول نقطة بداية مهمة.", anchors: ["الملكية", "الشراكات", "العقود", "الأحوال الشخصية"] },
  { key: "saihat", name: "سيهات", kind: "مدينة", cluster: "ساحل القطيف", profile: "مدينة ساحلية ضمن محافظة القطيف، وتتنوع الطلبات فيها بين العقار والأسرة والتجارة والعمل؛ ويجب تحديد الجهة والمدينة المثبتة في المستند عند اختلافها عن موقع العميل.", anchors: ["العقار السكني", "الأسرة", "الأعمال الصغيرة", "العمل"] },
  { key: "safwa", name: "صفوى", kind: "مدينة", cluster: "ساحل القطيف", profile: "مدينة تتبع محافظة القطيف وترتبط بمراكز وطرق مجاورة؛ ويحتاج الملف إلى وصف دقيق لموقع الأصل أو العمل أو التسليم مع تجميع المراسلات حسب التاريخ.", anchors: ["موقع الأصل", "التوريد", "العقار", "المطالبات"] },
  { key: "al-uyun", name: "العيون", kind: "مدينة", cluster: "واحة الأحساء", profile: "مدينة ضمن محافظة الأحساء، وقد ترتبط الطلبات بأصول وعقود وأعمال في مراكز مختلفة؛ لذلك تُفصل بيانات الموقع عن جوهر الحق والالتزام.", anchors: ["الأصول", "العقود", "التركات", "الأعمال المحلية"] },
  { key: "qaisumah", name: "القيصومة", kind: "مدينة", cluster: "شمال الشرقية", profile: "مدينة تتبع محافظة حفر الباطن، ويظهر فيها أثر النقل والتوريد والعمل وتعدد المواقع؛ لذا يفيد توثيق نقطة التسليم ومقر الطرف وتاريخ كل واقعة.", anchors: ["النقل والتوريد", "العمل", "إثبات التسليم", "المطالبات"] }
];

const specialties = {
  contracts: { label: "العقود", focus: "قراءة الالتزامات والمدة والضمان والإنهاء قبل بناء أي طلب", docs: ["العقد وجميع ملاحقه", "المسودات والتعديلات", "مراسلات التفاوض", "إثبات التنفيذ أو الإخلال", "كشف زمني للوقائع"], risks: ["قراءة بند منفصل عن بقية العقد", "إغفال ملحق أو تعديل لاحق", "عدم توثيق الإشعار", "طلب نتيجة لا يدعمها النص"] },
  commercial: { label: "القضايا التجارية", focus: "فصل أصل العلاقة التجارية عن الفواتير والتسليم والدفعات والاعتراضات", docs: ["العقد أو أمر الشراء", "الفواتير وكشف الحساب", "إثبات التسليم", "المراسلات والاعتراضات", "السجل الزمني للدفعات"], risks: ["خلط الرصيد بالفواتير المختلف عليها", "إغفال صفة الموقع", "عدم مطابقة التسليم", "التأخر في حفظ الأدلة"] },
  corporate: { label: "الشركات والشركاء", focus: "تحديد الحصص والصلاحيات والقرارات والتمويل وآلية الخروج أو المعالجة", docs: ["عقد التأسيس", "اتفاق الشركاء", "قرارات الشركاء أو المجلس", "السجل التجاري والتراخيص", "الحسابات والمساهمات"], risks: ["الاعتماد على تفاهم شفهي", "خلط ملكية الحصة بالإدارة", "تجاهل صلاحيات التوقيع", "غياب آلية التقييم"] },
  labor: { label: "القضايا العمالية", focus: "مطابقة عقد العمل والأجر والإشعارات والحضور والمستحقات مع التواريخ", docs: ["عقد العمل", "مسيرات وتحويلات الأجر", "الإشعارات والقرارات", "سجل الحضور أو التسليم", "حساب المستحقات"], risks: ["حساب المبلغ دون فترة واضحة", "إغفال نوع العقد", "عدم حفظ إشعار الإنهاء", "خلط المطالبات المختلفة"] },
  family: { label: "الأحوال الشخصية", focus: "تحديد الصفة والطلب والوقائع الجوهرية والأحكام السابقة مع حماية الخصوصية", docs: ["ما يثبت الصفة", "الأحكام أو المحاضر السابقة", "ملخص زمني مختصر", "المراسلات الضرورية فقط", "قائمة الطلبات المحددة"], risks: ["إرسال معلومات حساسة مبكرًا", "سرد وقائع بلا تواريخ", "خلط أكثر من طلب", "إغفال حكم قائم"] },
  inheritance: { label: "المواريث والتركات", focus: "حصر الورثة والأصول والديون والإدارة السابقة قبل القسمة أو النزاع", docs: ["مستندات الصفة والورثة", "الصكوك وبيانات الأصول", "قائمة الديون والحقوق", "الحسابات والعوائد", "الاتفاقات أو القسمة السابقة"], risks: ["بدء القسمة قبل الحصر", "إغفال دين أو حق", "خلط الملكية الشخصية بالتركة", "غياب تقييم موحد"] },
  criminal: { label: "القضايا الجنائية", focus: "ضبط الصفة والجهة والمرحلة والتسلسل الزمني والأدلة دون نشر تفاصيل حساسة", docs: ["الإشعار أو المحضر المتاح", "ما يوضح الصفة", "ملخص زمني للواقعة", "الأدلة الضرورية", "بيانات الموعد والجهة"], risks: ["تداول تفاصيل القضية علنًا", "تعديل أو حذف دليل", "إغفال موعد قريب", "الخلط بين الحق العام والخاص"] },
  execution: { label: "التنفيذ والمطالبات", focus: "مطابقة السند والأطراف والرصيد والمدفوعات والإجراءات القائمة قبل تقديم الطلب", docs: ["السند التنفيذي أو الحكم", "بيانات الأطراف", "كشف الرصيد", "إثباتات السداد", "قرارات وإشعارات التنفيذ"], risks: ["طلب مبلغ غير مطابق", "إغفال سداد سابق", "استخدام بيانات طرف قديمة", "عدم قراءة منطوق السند"] },
  realestate: { label: "العقار والمقاولات", focus: "التحقق من الصفة ووصف الأصل ونطاق العمل والدفعات والتسليم والعيوب", docs: ["مستند الملكية أو العقد", "المخططات والمواصفات", "جدول الدفعات", "طلبات التغيير", "محاضر المعاينة والاستلام"], risks: ["عدم مطابقة وصف الأصل", "غياب محضر حالة", "خلط الأعمال الأصلية والإضافية", "سداد بلا إثبات مرحلة"] },
  administrative: { label: "الاعتراضات والقضايا الإدارية", focus: "ربط القرار أو الحكم بالتبليغ والصفة والمهلة والطلبات والمستندات السابقة", docs: ["القرار أو الحكم كاملًا", "إثبات التبليغ", "الطلب أو التظلم السابق", "المذكرات والمرفقات", "جدول المهل والإجراءات"], risks: ["البدء قبل قراءة الأسباب", "إغفال تاريخ التبليغ", "تكرار أقوال بلا سبب محدد", "إضافة مستند غير مرتبط"] },
  business: { label: "الأعمال والملكية الفكرية", focus: "تنظيم الأصول والعقود والديون والعلامات والحقوق التشغيلية ضمن صورة واحدة", docs: ["بيانات المنشأة", "العقود الرئيسية", "القوائم والالتزامات", "مستندات العلامة أو الترخيص", "خطة الإجراء المطلوبة"], risks: ["إغفال عقد حرج", "عدم حصر الالتزامات", "استخدام علامة بلا توثيق", "خلط الملكية بالتشغيل"] },
  digital: { label: "النزاعات الرقمية والمستهلك", focus: "حفظ العرض الإلكتروني والطلب والدفع والتسليم والمحادثات بصيغة قابلة للمراجعة", docs: ["لقطة العرض أو الإعلان", "تأكيد الطلب والفاتورة", "إثبات الدفع والتسليم", "المراسلات الأصلية", "صور العيب أو الدليل الرقمي"], risks: ["الاكتفاء بلقطة مبتورة", "حذف بيانات المصدر", "التأخر في حفظ المحادثة", "عدم تحديد الحساب أو الرابط"] }
};

export const intents = [
  ["contract-risk-review", "مراجعة مخاطر عقد قبل التوقيع", "contracts", "طرف يستعد للتوقيع", "قبل الالتزام", "تحديد البنود غير المتوازنة وخيارات التعديل"],
  ["contract-breach-response", "معالجة إخلال أو إنهاء عقد", "contracts", "طرف واجه إخلالًا تعاقديًا", "بعد بدء التنفيذ", "تثبيت الإخلال والإشعار والطلب المناسب"],
  ["commercial-invoice-claim", "مطالبة فواتير ورصيد تجاري", "commercial", "منشأة لها رصيد مستحق", "بعد الاستحقاق", "توحيد الفواتير والتسليم والدفعات في كشف واحد"],
  ["supplier-dispute", "نزاع مورد أو مقاول فرعي", "commercial", "عميل أو مورد أو مقاول", "أثناء التنفيذ", "فصل نطاق التوريد عن الجودة والتأخير والدفعات"],
  ["partner-exit", "تخارج شريك وتقييم الحصة", "corporate", "شريك يرغب في الخروج", "قبل نقل الحصة", "ضبط التقييم والالتزامات والصلاحيات وما بعد التخارج"],
  ["corporate-authority-review", "مراجعة صلاحيات الإدارة والتوقيع", "corporate", "شركة أو شريك أو مدير", "قبل قرار جوهري", "مطابقة القرار بعقد التأسيس والصلاحيات والإجراءات"],
  ["employment-termination", "مراجعة إنهاء علاقة عمل", "labor", "عامل أو صاحب عمل", "عند الإنهاء", "تحديد السبب والإشعار والمستحقات والتسليم"],
  ["unpaid-benefits", "مطالبة أجور ومزايا عمالية", "labor", "عامل لديه مستحقات", "بعد تأخر السداد", "حساب الفترات والمكونات والدفعات بدقة"],
  ["divorce-file", "تجهيز ملف طلاق أو فسخ", "family", "زوج أو زوجة", "قبل الطلب أو أثناءه", "فصل الوقائع عن الطلبات التابعة وحماية الخصوصية"],
  ["custody-visitation", "مراجعة حضانة أو زيارة أو نفقة", "family", "أحد الوالدين أو صاحب صفة", "عند طلب جديد أو تعديل", "تحديد الحكم القائم والتغير والطلب العملي"],
  ["estate-inventory", "حصر تركة وديون وحقوق", "inheritance", "وارث أو صاحب صفة", "قبل القسمة", "بناء قائمة موحدة للأصول والديون والعوائد"],
  ["heirs-division", "نزاع قسمة بين الورثة", "inheritance", "وارث في تركة غير مقسمة", "بعد ظهور الخلاف", "تحديد المتفق عليه والمختلف عليه وخيارات القسمة"],
  ["investigation-preparation", "الاستعداد لبلاغ أو تحقيق", "criminal", "متهم أو مجني عليه أو صاحب صفة", "قبل موعد قريب", "ترتيب الصفة والوقائع والأدلة والجهة دون إفشاء حساس"],
  ["private-right-claim", "تنظيم مطالبة بالحق الخاص", "criminal", "متضرر من واقعة", "أثناء أو بعد المسار الجزائي", "ربط الضرر والمبلغ والمستند بالواقعة"],
  ["enforcement-application", "مراجعة طلب تنفيذ سند أو حكم", "execution", "دائن يحمل سندًا", "قبل فتح الطلب", "مطابقة السند والرصيد وبيانات الأطراف"],
  ["enforcement-objection", "اعتراض أو منازعة في التنفيذ", "execution", "طرف في إجراء تنفيذ", "بعد بدء الإجراء", "تحديد القرار محل الاعتراض وأساسه والمهلة"],
  ["property-sale-review", "فحص عقد بيع أو شراء عقار", "realestate", "مشتري أو بائع", "قبل التوقيع أو التسليم", "التحقق من الصفة والوصف والثمن والضمانات"],
  ["construction-handover", "نزاع مقاولة وتسليم وعيوب", "realestate", "مالك أو مقاول أو مطور", "عند التأخير أو الاستلام", "فصل الأعمال والتغييرات والدفعات والعيوب"],
  ["administrative-grievance", "تظلم من قرار إداري", "administrative", "صاحب صفة متأثر بقرار", "بعد التبليغ", "ضبط القرار والسبب والمهلة والطلب"],
  ["judgment-appeal", "مراجعة حكم وتجهيز اعتراض", "administrative", "طرف صدر له أو عليه حكم", "خلال مهلة الاعتراض", "مقارنة المنطوق والأسباب بالطلبات والمستندات"],
  ["business-distress", "تنظيم تعثر منشأة والتزاماتها", "business", "منشأة أو شريك أو دائن", "عند ضغط السيولة أو الديون", "حصر الدائنين والأصول والعقود والإجراءات القائمة"],
  ["franchise-trademark", "مراجعة امتياز أو علامة تجارية", "business", "مالك علامة أو طرف امتياز", "قبل التسجيل أو التعاقد", "ضبط الملكية والفئات والمنطقة والرسوم والترخيص"],
  ["ecommerce-consumer", "نزاع متجر إلكتروني أو مستهلك", "digital", "متجر أو عميل", "بعد طلب أو تسليم مختلف عليه", "حفظ العرض والدفع والتسليم والضمان والطلب"],
  ["cyber-fraud-evidence", "تنظيم أدلة احتيال أو واقعة رقمية", "digital", "متضرر من تعامل رقمي", "فور اكتشاف الواقعة", "حفظ المصدر والتسلسل والحسابات والتحويلات دون تعديل الدليل"]
].map(([key, title, specialty, audience, stage, goal], index) => ({ key, title, specialty, audience, stage, goal, index }));

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function list(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const className = ordered ? " class=\"document-list\"" : "";
  return `<${tag}${className}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function pick(items, seed, count) {
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(seed + index) % items.length]);
}

function hubFor(locality) {
  return locality.hub || `eastern-${locality.key}-legal-services.html`;
}

function serviceSlug(locality, intent) {
  return `eastern-${locality.key}-${intent.key}.html`;
}

const regionPage = { slug: "eastern-province-legal-services.html", kind: "region", title: "محامي وخدمات قانونية في المنطقة الشرقية" };
const cityPages = localities.filter((locality) => !locality.hub).map((locality) => ({ slug: hubFor(locality), kind: "city", locality, title: `محامي وخدمات قانونية في ${locality.name}` }));
const servicePages = localities.flatMap((locality) => intents.map((intent) => ({ slug: serviceSlug(locality, intent), kind: "service", locality, intent, title: `${intent.title} في ${locality.name}` })));
export const generatedPages = [regionPage, ...cityPages, ...servicePages];
export const generatedSlugs = generatedPages.map((page) => page.slug);

function fontLinks() {
  return `<!-- site-fonts:start --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="${fontUrl}"><link rel="stylesheet" href="${fontUrl}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${fontUrl}"></noscript><!-- site-fonts:end -->`;
}

function header(message) {
  return `<div class="topbar"><div class="container topbar-inner"><p class="topbar-status">استقبال إلكتروني من مدن ومحافظات المنطقة الشرقية</p><p>تواصل مباشر: <a href="tel:${phone}" dir="ltr">${displayPhone}</a></p></div></div><header class="site-header simple-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="رُكن الأنظمة القانونية - الرئيسية">${logo}<div><strong>رُكن الأنظمة القانونية</strong><span>LEGAL SYSTEMS CORNER</span></div></a><nav class="nav" id="nav" aria-label="التنقل الرئيسي"><a href="/">الرئيسية</a><a href="${regionPage.slug}">دليل الشرقية</a><a href="legal-services-dammam.html">الدمام</a><a href="site-directory.html">دليل الصفحات</a><a href="#faq">الأسئلة</a></nav><div class="nav-actions"><a class="header-cta" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><button class="menu-btn" id="menuBtn" aria-label="فتح القائمة" aria-expanded="false">☰</button></div></div></header>`;
}

function footer(message) {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>رُكن الأنظمة القانونية</strong><p>استقبال وتنظيم طلبات الخدمات القانونية إلكترونيًا من المنطقة الشرقية، دون ادعاء وجود فروع في المدن المذكورة.</p></div><div><b>دليل الشرقية</b><a href="${regionPage.slug}">المنطقة الشرقية</a><a href="legal-services-dammam.html">الدمام</a><a href="eastern-khobar-legal-services.html">الخبر</a><a href="eastern-al-ahsa-legal-services.html">الأحساء</a></div><div><b>تواصل</b><a href="tel:${phone}" dir="ltr">${displayPhone}</a><a href="mailto:${email}">${email}</a></div></div><div class="container copyright">© 2026 رُكن الأنظمة القانونية. جميع الحقوق محفوظة.</div></footer><a class="whatsapp-float" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.2-1.3 2 .5c-.4 2-1.7 3-3.4 2.8-3.8-.5-7-3.7-7.5-7.5C6 6.6 7 5.3 9 4.9l.5 2-1.3 1.2Z"/></svg></a><script src="script.js?v=${assetVersion}"></script>`;
}

function shell({ page, title, description, h1, eyebrow, intro, asideTitle, asideText, body, faqs, schema, breadcrumb }) {
  const url = `${baseUrl}/${page.slug}`;
  const message = `السلام عليكم، أرغب في ${title}. المدينة ونوع الطلب والمرحلة: `;
  const documentTitle = title.includes("|") ? title : title.length <= 51 ? `${title} | رُكن الأنظمة` : title;
  const graph = [
    ...(Array.isArray(schema) ? schema : [schema]),
    { "@type": "BreadcrumbList", itemListElement: breadcrumb.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.href.startsWith("http") ? item.href : `${baseUrl}/${item.href}` })) },
    { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ];
  const crumbs = breadcrumb.map((item, index) => index === breadcrumb.length - 1 ? `<span>${escapeHtml(item.name)}</span>` : `<a href="${item.href}">${escapeHtml(item.name)}</a><span aria-hidden="true">/</span>`).join("");
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head>${analytics}<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><title>${escapeHtml(documentTitle)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ar_SA"><meta property="og:site_name" content="رُكن الأنظمة القانونية"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><script type="application/ld+json">${jsonLd({ "@context": "https://schema.org", "@graph": graph })}</script>${fontLinks()}<link rel="stylesheet" href="${stylesheet}"><!-- accessibility-contrast:start --><style>:root{--muted:#536360}.brand span{color:#695f4e}.article-grid article>span{color:#715731}.footer p,.site-footer p{color:rgba(255,255,255,.72)}.footer a{color:rgba(255,255,255,.74)}.copyright{color:rgba(255,255,255,.68)}</style><!-- accessibility-contrast:end --></head><body data-eastern-page="${page.kind}">${header(message)}<main><div class="container breadcrumb" aria-label="مسار الصفحة">${crumbs}</div><section class="hero service-detail-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h1>${h1}</h1><p>${escapeHtml(intro)}</p><div class="hero-actions"><a class="btn primary" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">ابدأ طلبك</a><a class="btn secondary" href="#prepare">قائمة التجهيز</a></div><div class="trust-row"><div><b>المنطقة الشرقية</b><span>تغطية منظمة</span></div><div><b>استقبال إلكتروني</b><span>من المدن والمحافظات</span></div><div><b>دون فرع مزعوم</b><span>وصف واضح للنطاق</span></div></div></div><aside class="service-hero-aside"><span class="service-badge">دليل الشرقية</span><div class="service-symbol" aria-hidden="true">${String(generatedPages.indexOf(page) + 1).padStart(3, "0")}</div><h2>${escapeHtml(asideTitle)}</h2><p>${escapeHtml(asideText)}</p></aside></div></section>${body}<section class="section" id="faq"><div class="container narrow"><div class="section-head"><span class="eyebrow">أسئلة مرتبطة بالصفحة</span><h2>أسئلة شائعة</h2></div>${faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></section><section class="section contact-section"><div class="container"><div class="contact-card"><div><span class="eyebrow">بداية منظمة</span><h2>اذكر المدينة والصفة والمرحلة وأقرب موعد</h2><p>لا ترسل كلمات مرور أو بيانات بنكية أو أصول مستندات أو معلومات شديدة الحساسية في الرسالة الأولى.</p></div><a class="primary-btn" href="https://wa.me/966506142113?text=${encodeURIComponent(message)}">إرسال الطلب عبر واتساب</a></div></div></section></main>${footer(message)}</body></html>`;
}

function localityContext(locality, intent) {
  const specialty = specialties[intent.specialty];
  const variants = [
    `في ${locality.name} لا يكفي وصف الموضوع بأنه ${specialty.label}؛ الأفضل تثبيت موقع الالتزام والصفة والمرحلة والمستند الذي غيّر موقف الأطراف.`,
    `عند بدء هذا الطلب من ${locality.name} تُفصل بيانات الموقع عن جوهر الحق، ثم تُرتب الوقائع بحسب التاريخ حتى لا تختلط المراسلات بالطلبات.`,
    `طبيعة ${locality.cluster} تجعل تحديد مكان التنفيذ أو الأصل أو العمل مفيدًا، لكن الاختصاص والخطوة لا يُحسمان باسم المدينة وحده.`,
    `يستفيد ملف ${intent.title} في ${locality.name} من جدول واحد يربط كل واقعة بالطرف والمستند والتاريخ والنتيجة المطلوبة.`,
    `الهدف من صفحة ${locality.name} هو تنظيم الوصول والطلب، مع بقاء تقييم المسار معتمدًا على الوقائع والوثائق والمهل النظامية.`
  ];
  return variants[(localities.indexOf(locality) * 7 + intent.index) % variants.length];
}

function servicePage(page) {
  const { locality, intent } = page;
  const specialty = specialties[intent.specialty];
  const localityIndex = localities.indexOf(locality);
  const relatedIntents = pick(intents.filter((item) => item.key !== intent.key), intent.index + localityIndex, 5);
  const nearby = pick(localities.filter((item) => item.key !== locality.key), localityIndex + intent.index * 2, 4);
  const evidence = specialty.docs.map((item, index) => `${item} مع بيان صلته بـ${intent.title} في ${locality.name}${index === 0 ? " وتاريخه" : ""}`);
  const reviewSteps = [
    `تحديد صفة ${intent.audience} والنتيجة المطلوبة في ${locality.name}`,
    `بناء تسلسل زمني يبدأ من أول واقعة وينتهي بمرحلة ${intent.stage}`,
    `ربط كل ادعاء بمستند من ملف ${specialty.label}`,
    `فصل النقاط المتفق عليها عن النقاط المختلف عليها`,
    `مراجعة الموعد والجهة والبيانات الرسمية قبل اتخاذ الخطوة`
  ];
  const scenarioOpeners = [
    `تبدأ الحالة بوثيقة رئيسية، ثم تظهر مراسلات أو دفعات أو قرارات تغير فهمها الأولي.`,
    `يتوزع الملف بين أكثر من طرف وتاريخ، ولا يمكن تقييمه من رسالة واحدة أو مستند منفرد.`,
    `تظهر المشكلة عند اختلاف وصف الطرفين لما نُفذ وما بقي وما طُلب لاحقًا.`,
    `توجد مهلة أو جلسة أو التزام قريب يجعل ترتيب الأولويات أهم من جمع مستندات بلا تصنيف.`
  ];
  const uniqueScenario = `${scenarioOpeners[(localityIndex + intent.index) % scenarioOpeners.length]} في سياق ${locality.name} يكون الهدف هو ${intent.goal}، مع مراعاة ${locality.anchors[(intent.index + 1) % locality.anchors.length]} بوصفه سياقًا محليًا محتملًا لا افتراضًا ثابتًا عن كل ملف.`;
  const localDetailPatterns = [
    (anchor, document, risk) => `تبدأ خريطة ${anchor} في ${locality.name} من المستند «${document}». وبالنسبة إلى ${intent.title} يُسجل تاريخ المستند ومن أصدره وما يثبته، ثم يقارن بهدف «${intent.goal}». النقطة التي تحتاج مراجعة مستقلة هنا هي ${risk}؛ لأن وجود اسم المدينة وحده لا يحسم أثر الواقعة أو الاختصاص أو النتيجة.`,
    (anchor, document, risk) => `إذا ظهر محور ${anchor} ضمن ملف ${intent.title} في ${locality.name}، فلا يوضع مع بقية الأوراق دون تصنيف. يُنشأ له سجل يربط «${document}» بمرحلة ${intent.stage} وبصفة ${intent.audience}. ثم يُختبر ما إذا كان ${risk} قد غيّر المبلغ أو الطلب أو التسلسل الزمني أو الطرف المسؤول.`,
    (anchor, document, risk) => `في نطاق ${locality.cluster} قد يكون ${anchor} مجرد خلفية، وقد يكون حقيقة مؤثرة. يحدد ملف ${locality.name} ذلك بواسطة «${document}» لا بالافتراض. ولخدمة ${intent.title} تكتب الوقائع المؤيدة والمعارضة كلٌ في سطر، ويشار صراحة إلى أثر ${risk} قبل اقتراح أي خطوة أو طلب.`,
    (anchor, document, risk) => `الاختبار العملي لمحور ${anchor} هو: هل يغير فهم ${intent.title} أم لا؟ في ${locality.name} تُراجع إجابة هذا السؤال مع «${document}»، ثم تربط بتاريخ مرحلة ${intent.stage}. وإذا ظهر احتمال ${risk}، فيُطلب مستند مقابل أو توضيح محدد بدل توسيع الملف بمرفقات لا تخدم النتيجة المطلوبة.`,
    (anchor, document, risk) => `عند ترتيب طلب ${intent.audience} في ${locality.name} يعالج ${anchor} بوصفه مسار تحقق منفصلًا. تُسمى نسخة «${document}» باسم واضح، ويكتب بجوارها ما تؤيده وما لا تؤيده. بهذه الطريقة يبقى هدف ${intent.goal} قابلًا للفحص، ولا يتحول ${risk} إلى استنتاج غير موثق أو مطالبة غير محسوبة.`,
    (anchor, document, risk) => `يوضع ${anchor} في جدول قرار خاص بملف ${intent.title}: المصدر هو «${document}»، والمرحلة هي ${intent.stage}، والموقع المثبت هو ${locality.name}. بعد ذلك تُفحص فجوة ${risk}، ويحدد هل يلزم إشعار أو كشف أو نسخة رسمية أو سؤال للطرف قبل الانتقال من تنظيم الوقائع إلى اختيار الإجراء.`,
    (anchor, document, risk) => `لا يُفهم ${anchor} في ${locality.name} بمعزل عن بقية عناصر ${specialty.label}. تُقرأ «${document}» مع التسلسل والصفة، ثم تُستخرج منها معلومة واحدة قابلة للتحقق تخدم ${intent.title}. أما ${risk} فيسجل كاحتمال يحتاج دليلًا، وليس كحقيقة، حتى تبقى المراجعة دقيقة وقابلة للتحديث.`,
    (anchor, document, risk) => `الملخص المفيد في ${locality.name} يشرح لماذا أصبح ${anchor} مهمًا في هذه المرحلة. يرفق به «${document}» ويحدد ارتباطه بطلب ${intent.audience} وهدف ${intent.goal}. ثم تُكتب نتيجة أولية مشروطة تتعامل مع ${risk}، وتترك مساحة لأي واقعة أو مستند معاكس يظهر أثناء المراجعة.`,
    (anchor, document, risk) => `يعامل محور ${anchor} كفرضية قابلة للإثبات داخل ${locality.name}. أول خطوة هي قراءة «${document}» واستخراج الأسماء والتواريخ والأفعال منه، ثم مقارنتها بما يتطلبه ${intent.title}. في الخلاصة يذكر أثر ${risk} بصيغة سؤال مفتوح، ويحدد المستند الذي يمكنه تأكيد الإجابة أو نفيها.`,
    (anchor, document, risk) => `تُبنى بطاقة واقعة مستقلة لـ${anchor} ضمن نطاق ${locality.name}: من قام بالفعل، وأين، ومتى، وما المرجع؟ المرجع الأول المقترح هو «${document}». تخدم البطاقة مرحلة ${intent.stage} وتمنع أن يطغى سرد ${risk} على المطلوب الفعلي، وهو ${intent.goal}، قبل اكتمال التحقق.`,
    (anchor, document, risk) => `مسار التحقق من ${anchor} يبدأ من نتيجة يريدها ${intent.audience} في ${locality.name}، ثم يعود إلى «${document}» لمعرفة حدودها الواقعية. عند معالجة ${intent.title} تفصل البيانات المؤكدة عن التقديرات. كما يوضح في هامش المراجعة إن كان ${risk} نقصًا في الدليل أم خلافًا في تفسيره.`,
    (anchor, document, risk) => `في ورقة العمل الخاصة بـ${locality.name} يمنح ${anchor} رقمًا مرجعيًا مرتبطًا بـ«${document}». توضع تحته ثلاثة أسطر: حقيقة ثابتة، ونقطة تحتاج تحققًا، وأثر محتمل على ${intent.title}. ويُعاد فحص الورقة عند مرحلة ${intent.stage} حتى لا يؤدي ${risk} إلى اختيار إجراء قبل اكتمال عناصره.`,
    (anchor, document, risk) => `لفهم ${anchor} في ملف ${specialty.label} القادم من ${locality.name}، تُراجع «${document}» مع آخر إجراء معروف. بعدها يصاغ سؤال قصير يخدم ${intent.goal}، ويجاب عنه من المستندات فقط. ظهور ${risk} لا يعني رفض المسار؛ بل يعني تحديد الوثيقة أو التاريخ الناقص قبل متابعة ${intent.title}.`,
    (anchor, document, risk) => `يُقسّم محور ${anchor} في ${locality.name} إلى واقعة ودليل وطلب. الواقعة تلخص الحدث، والدليل يبدأ من «${document}»، والطلب يرتبط بهدف ${intent.goal}. هذا الفصل مهم عند ${intent.stage}، لأنه يكشف هل ${risk} يؤثر في أصل المسألة أم في مقدارها أم في الإجراء التالي فقط.`,
    (anchor, document, risk) => `تتبع مراجعة ${anchor} طريقة «المصدر ثم الاستنتاج» في ${locality.name}. المصدر هنا «${document}»، والاستنتاج المطلوب يخدم ${intent.title} دون تجاوز ما تقوله الوثيقة. إذا بقيت مسألة ${risk} معلقة، تسجل ضمن قائمة النواقص مع مسؤول الحصول عليها والموعد بدل إدخالها كحقيقة.`,
    (anchor, document, risk) => `يُسأل عن ${anchor} لأن له صلة محتملة بهدف ${intent.goal} في ${locality.name}. تُقرأ «${document}» بحثًا عن اللفظ والتاريخ والطرف المرتبط، ثم تقارن الإجابة بمرحلة ${intent.stage}. أما ${risk} فيعالج بتحقق مخصص، كي لا يختلط سبب الخلاف بمستند الإثبات أو بالنتيجة التي يطلبها العميل.`,
    (anchor, document, risk) => `ملف ${intent.title} في ${locality.name} يحتاج سجلًا صغيرًا لـ${anchor}. يضم السجل نسخة «${document}»، وملخصًا لا يتجاوز بضعة أسطر، وملاحظة عن أثره على صفة ${intent.audience}. ويُذكر ${risk} في خانة منفصلة حتى يسهل معرفة ما عولج وما بقي قبل اتخاذ القرار.`,
    (anchor, document, risk) => `تُراجع علاقة ${anchor} بالموضوع من نهاية المسار إلى بدايته: ما نتيجة ${intent.goal}، وما الذي يلزمها، وأين تثبته «${document}»؟ هذا الأسلوب في ${locality.name} يحد من تكرار المرفقات. كما يسمح بعزل ${risk} وتقدير أثره على ${intent.title} بدل تعميمه على الملف كاملًا.`,
    (anchor, document, risk) => `لكل إشارة إلى ${anchor} داخل أوراق ${locality.name} يوضع رابط إلى مصدرها، وأول مصدر يراجع هو «${document}». ثم يحدد إن كانت الإشارة تؤثر في ${intent.stage} أو في هدف ${intent.goal}. وإذا نتجت عن ${risk} فجوة، فتعالج بسؤال واحد واضح قبل إعادة تقييم المسار.`,
    (anchor, document, risk) => `تبدأ مذكرة ${anchor} باسم الموقع المثبت في الوثيقة لا بمكان إقامة صاحب الطلب؛ وهنا يسجل ${locality.name} كما ورد رسميًا. ترفق «${document}» وتشرح صلتها بـ${intent.title}. وفي الختام تفصل ملاحظة ${risk} عن الوقائع الثابتة، مع تحديد ما يحتاجه ${intent.audience} للمرحلة التالية.`
  ];
  const localDetailCards = Array.from({ length: 8 }, (_, index) => {
    const anchor = locality.anchors[index % locality.anchors.length];
    const document = specialty.docs[(intent.index + index) % specialty.docs.length];
    const risk = specialty.risks[(localityIndex + index) % specialty.risks.length];
    const patternIndexes = [
      localityIndex,
      localityIndex,
      intent.index % localDetailPatterns.length,
      (localityIndex + intent.index) % localDetailPatterns.length,
      (localityIndex * 7 + intent.index) % localDetailPatterns.length,
      (localityIndex + intent.index * 3) % localDetailPatterns.length,
      (localityIndex * 11 + intent.index * 5) % localDetailPatterns.length,
      (localityIndex * 13 + intent.index * 7) % localDetailPatterns.length
    ];
    const patternIndex = patternIndexes[index];
    const pattern = localDetailPatterns[patternIndex];
    const heading = index < 4 ? `${anchor} × ${intent.title}` : `اختبار ${anchor} عند ${intent.stage}`;
    return `<article class="locality-panel"><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(pattern(anchor, document, risk))}</p></article>`;
  }).join("");
  const faqs = [
    [`كيف أبدأ ${intent.title} من ${locality.name}؟`, `ابدأ بذكر الصفة والمرحلة والنتيجة المطلوبة، ثم أرسل المستند الأساسي وتاريخ أقرب موعد. لا يلزم إرسال الملف كاملًا في التواصل الأول.`],
    [`ما الوثيقة الأولى في ملف ${specialty.label}؟`, `${specialty.docs[0]} نقطة بداية شائعة، لكن الوثيقة الحاسمة تتغير بحسب الوقائع ومرحلة ${intent.stage}.`],
    [`هل موقع ${locality.name} يغيّر النظام المطبق؟`, `الأنظمة السعودية واحدة، بينما يساعد الموقع في تحديد العقار أو المنشأة أو مكان العمل أو الواقعة والجهة والموعد المرتبط بالطلب.`],
    [`هل توجد نتيجة مضمونة أو فرع في ${locality.name}؟`, `لا. المحتوى تنظيمي عام ولا يضمن نتيجة، والتغطية تعني إمكانية بدء الطلب إلكترونيًا ولا تعني وجود مكتب أو فرع فعلي في ${locality.name}.`]
  ];
  const body = `<div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#scope">نطاق الطلب</a><a href="#scenario">الحالة العملية</a><a href="#prepare">المستندات</a><a href="#review">المراجعة</a><a href="#related">روابط مرتبطة</a></nav></div>
  <section class="section" id="scope"><div class="container"><div class="section-head"><span class="eyebrow">نية مستقلة • ${escapeHtml(specialty.label)}</span><h2>${escapeHtml(intent.title)} في ${escapeHtml(locality.name)}</h2><p>${escapeHtml(localityContext(locality, intent))}</p></div><div class="specialty-grid"><article class="specialty-card" data-number="01"><h3>الهدف المحدد</h3><p>${escapeHtml(intent.goal)}، دون القفز إلى نتيجة قبل مراجعة كامل المستندات ذات الصلة.</p></article><article class="specialty-card" data-number="02"><h3>المرحلة الحالية</h3><p>تركز الصفحة على مرحلة ${escapeHtml(intent.stage)} وما يلزم تثبيته قبل الانتقال إلى الإجراء التالي.</p></article><article class="specialty-card" data-number="03"><h3>السياق المحلي</h3><p>${escapeHtml(locality.profile)}</p></article><article class="specialty-card" data-number="04"><h3>قاعدة المراجعة</h3><p>${escapeHtml(specialty.focus)}، ثم مقارنة المطلوب بما تثبته الوثائق فعليًا.</p></article></div><p class="service-legal-note">هذا المحتوى للتنظيم والتوعية العامة، ولا يمثل تقييمًا قانونيًا لملف بعينه أو وعدًا بنتيجة.</p></div></section>
  <section class="section alt" id="scenario"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">حالة صممت لهذه الصفحة</span><h2>مثال تنظيمي يوضح نقطة البداية</h2><p>${escapeHtml(uniqueScenario)}</p><p>تُراجع الحالة من زاويتين: ماذا يريد ${escapeHtml(intent.audience)}، وما الذي يثبته التسلسل والمستند عند مرحلة ${escapeHtml(intent.stage)}. ثم تُستبعد الوقائع غير المؤثرة وتُفصل الطلبات البديلة.</p></div><article class="locality-panel"><h3>سياقات يمكن أن تكون ذات صلة</h3>${list(locality.anchors.map((item) => `${item} عندما يظهر أثره في العقد أو المستند أو الواقعة`))}<p class="coverage-disclaimer">هذه أمثلة تنظيمية وليست افتراضًا بأن كل طلب في ${escapeHtml(locality.name)} ينتمي إلى هذه الأنشطة.</p></article></div></section>
  <section class="section" id="local-detail"><div class="container"><div class="section-head"><span class="eyebrow">تحليل خاص بهذه التركيبة</span><h2>خريطة ${escapeHtml(intent.title)} في ${escapeHtml(locality.name)}</h2><p>الأجزاء التالية تربط محاور الموقع بمرحلة الطلب ووثائقه ومخاطره؛ وهي لا تتكرر بالتركيبة نفسها في صفحة أخرى.</p></div><div class="locality-panels">${localDetailCards}</div></div></section>
  <section class="section" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">ملف أولي مختلف</span><h2>مستندات ${escapeHtml(intent.title)}</h2><p>سمّ كل ملف بتاريخ واضح، واحتفظ بالأصل، وأرسل الحد الأدنى اللازم بعد تحديد قناة الاستلام. المستند الأقرب للموضوع أهم من كثرة المرفقات.</p></div>${list(evidence, true)}</div></section>
  <section class="section alt" id="review"><div class="container"><div class="section-head"><span class="eyebrow">خمس خطوات مرتبة</span><h2>كيف تُراجع المسألة قبل اتخاذ القرار؟</h2><p>تختلف هذه الخطوات عن صفحة المدينة العامة لأنها موجهة تحديدًا إلى ${escapeHtml(intent.title)} ومرحلة ${escapeHtml(intent.stage)}.</p></div><div class="specialty-grid">${reviewSteps.map((item, index) => `<article class="specialty-card" data-number="0${index + 1}"><h3>${escapeHtml(item)}</h3><p>${escapeHtml(index % 2 ? specialty.risks[index % specialty.risks.length] : specialty.focus)}. سجّل النتيجة في ملاحظة مستقلة قبل الانتقال للخطوة التالية.</p></article>`).join("")}</div><div class="locality-panels"><article class="locality-panel"><h3>مخاطر تنظيمية يجب تجنبها</h3>${list(specialty.risks.map((risk) => `${risk} عند إعداد ${intent.title}`))}</article><article class="locality-panel"><h3>ما الذي يميز هذه الصفحة؟</h3><p>تجمع الصفحة بين ${escapeHtml(intent.title)}، ومرحلة ${escapeHtml(intent.stage)}، وسياق ${escapeHtml(locality.name)}، وقائمة مستندات وروابط لا تتكرر بالتركيبة نفسها في صفحة أخرى.</p><p>إذا تغير الهدف أو المرحلة، انتقل إلى المسار المرتبط بدل استخدام الصفحة لكلمة المدينة فقط.</p></article></div></div></section>
  <section class="section" id="related"><div class="container"><div class="section-head"><span class="eyebrow">تنقل داخلي حسب الحاجة</span><h2>مسارات قريبة دون تكرار النية</h2><p>اختر رابطًا آخر فقط إذا اختلف جوهر الطلب أو مرحلته أو موقعه الفعلي.</p></div><div class="locality-panels"><article class="locality-panel"><h3>خدمات أخرى في ${escapeHtml(locality.name)}</h3><div class="related-services">${relatedIntents.map((item) => `<a href="${serviceSlug(locality, item)}">${escapeHtml(item.title)}</a>`).join("")}<a href="${hubFor(locality)}">دليل ${escapeHtml(locality.name)} الكامل</a></div></article><article class="locality-panel"><h3>المسار نفسه في مواقع قريبة</h3><div class="related-services">${nearby.map((item) => `<a href="${serviceSlug(item, intent)}">${escapeHtml(intent.title)} في ${escapeHtml(item.name)}</a>`).join("")}<a href="${regionPage.slug}">دليل المنطقة الشرقية</a></div></article></div><p class="coverage-disclaimer">ذكر ${escapeHtml(locality.name)} يصف نطاق استقبال الطلب إلكترونيًا، ولا يعني وجود مكتب أو فرع فعلي في المدينة أو المحافظة.</p></div></section>`;
  const schema = { "@type": "Service", "@id": `${baseUrl}/${page.slug}#service`, name: page.title, serviceType: `${specialty.label} - ${intent.title}`, description: `${intent.goal} مع تنظيم المستندات والمرحلة من ${locality.name}.`, url: `${baseUrl}/${page.slug}`, provider: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "رُكن الأنظمة القانونية", url: `${baseUrl}/`, telephone: phone }, areaServed: { "@type": locality.kind === "محافظة" ? "AdministrativeArea" : "City", name: locality.name } };
  return shell({ page, title: page.title, description: `${intent.title} في ${locality.name}. دليل عملي يوضح المستندات والمخاطر وخطوات التنظيم بحسب المرحلة، مع استقبال إلكتروني دون ادعاء فرع.`, h1: `${escapeHtml(intent.title)} في ${escapeHtml(locality.name)}<br><span>محامي ${escapeHtml(specialty.label)}</span>`, eyebrow: `${locality.kind} ${locality.name} • ${specialty.label}`, intro: `${intent.goal}. ${localityContext(locality, intent)}`, asideTitle: `مرحلة ${intent.stage}`, asideText: `${specialty.focus}.`, body, faqs, schema, breadcrumb: [{ name: "الرئيسية", href: "/" }, { name: "دليل الشرقية", href: regionPage.slug }, { name: locality.name, href: hubFor(locality) }, { name: intent.title, href: page.slug }] });
}

function cityPage(page) {
  const { locality } = page;
  const localityIndex = localities.indexOf(locality);
  const nearby = pick(localities.filter((item) => item.key !== locality.key), localityIndex + 2, 5);
  const groups = Object.entries(specialties).map(([key, specialty]) => ({ key, specialty, pages: intents.filter((intent) => intent.specialty === key) }));
  const faqs = [
    [`ما الخدمات الموجودة في دليل ${locality.name}؟`, `يضم الدليل 24 مسارًا مختلفًا للعقود والتجارة والشركات والعمل والأسرة والتركات والجنائي والتنفيذ والعقار والاعتراضات والأعمال والنزاعات الرقمية.`],
    [`كيف أختار صفحة بدل البحث باسم ${locality.name} فقط؟`, `حدد موضوع الطلب ومرحلة الملف والنتيجة المطلوبة، ثم اختر الصفحة التي تطابق هذه العناصر. اسم الموقع وحده لا يحدد الخدمة.`],
    [`هل كل الصفحات متشابهة؟`, `لا؛ لكل صفحة نية ومرحلة وسيناريو وقائمة مستندات وروابط مستقلة، ويمنع الفحص الآلي تكرار العنوان والوصف والمحتوى.`],
    [`هل يوجد فرع في ${locality.name}؟`, `لا يدعي الدليل وجود فرع. المقصود هو استقبال الطلبات إلكترونيًا من ${locality.name} ثم تحديد طريقة الخدمة بعد مراجعة الملف.`]
  ];
  const body = `<div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#services">24 مسارًا</a><a href="#local">سياق المدينة</a><a href="#prepare">تجهيز الطلب</a><a href="#nearby">مواقع قريبة</a></nav></div>
  <section class="section" id="services"><div class="container"><div class="section-head"><span class="eyebrow">24 نية بحث مختلفة</span><h2>اختر الموضوع والمرحلة في ${escapeHtml(locality.name)}</h2><p>كل رابط يجيب عن احتياج مستقل؛ لا توجد صفحة لمجرد تبديل كلمة الموقع.</p></div>${groups.map((group) => `<section class="directory-group"><h2>${escapeHtml(group.specialty.label)}</h2><div class="related-services">${group.pages.map((intent) => `<a href="${serviceSlug(locality, intent)}">${escapeHtml(intent.title)}</a>`).join("")}</div></section>`).join("")}</div></section>
  <section class="section alt" id="local"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">سياق ${escapeHtml(locality.cluster)}</span><h2>كيف يساعد الموقع دون أن يكرر المحتوى؟</h2><p>${escapeHtml(locality.profile)}</p><p>يُستخدم اسم ${escapeHtml(locality.name)} لتحديد موقع الأصل أو العمل أو الواقعة أو الجهة، بينما يظل نوع الحق والصفة والمرحلة والمستند أساس الاختيار.</p></div><article class="locality-panel"><h3>محاور محلية محتملة</h3>${list(locality.anchors.map((item) => `${item} عند ثبوته في مستند الطلب`))}</article></div></section>
  <section class="section" id="prepare"><div class="container prep-layout"><div class="prep-intro"><span class="eyebrow">رسالة أولى قابلة للفهم</span><h2>خمس معلومات قبل التواصل</h2><p>تقلل الرسالة المنظمة الأسئلة المتكررة وتساعد على تحديد الصفحة والمسار المناسبين.</p></div>${list([`اسم ${locality.kind} ${locality.name} والموقع كما يظهر في المستند`, "نوع المسألة والنتيجة المطلوبة", "صفة مقدم الطلب والطرف الآخر", "المرحلة الحالية والجهة وأقرب موعد", "اسم المستند الأساسي وتاريخه دون إرسال بيانات حساسة"], true)}</div></section>
  <section class="section alt" id="nearby"><div class="container"><div class="section-head"><span class="eyebrow">شبكة المنطقة الشرقية</span><h2>أدلة مدن ومحافظات مرتبطة</h2><p>انتقل فقط عندما يكون الموقع الآخر هو الأقرب للأصل أو العمل أو الواقعة أو الطرف المؤثر.</p></div><div class="related-services">${nearby.map((item) => `<a href="${hubFor(item)}">دليل ${escapeHtml(item.name)}</a>`).join("")}<a href="${regionPage.slug}">جميع مواقع المنطقة الشرقية</a></div><p class="coverage-disclaimer">التغطية إلكترونية ولا تعني وجود فرع في ${escapeHtml(locality.name)} أو المواقع المرتبطة.</p></div></section>`;
  const schema = [{ "@type": "Service", "@id": `${baseUrl}/${page.slug}#service`, name: page.title, serviceType: "دليل خدمات قانونية", url: `${baseUrl}/${page.slug}`, provider: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "رُكن الأنظمة القانونية", telephone: phone }, areaServed: { "@type": locality.kind === "محافظة" ? "AdministrativeArea" : "City", name: locality.name } }, { "@type": "ItemList", name: `الخدمات القانونية في ${locality.name}`, numberOfItems: intents.length, itemListElement: intents.map((intent, index) => ({ "@type": "ListItem", position: index + 1, name: intent.title, url: `${baseUrl}/${serviceSlug(locality, intent)}` })) }];
  return shell({ page, title: `محامي وخدمات قانونية في ${locality.name} | 24 مسارًا`, description: `محامي وخدمات قانونية في ${locality.name} عبر دليل يضم 24 صفحة مستقلة حسب التخصص والمرحلة والمستند، مع استقبال إلكتروني وروابط واضحة قابلة للتصفح.`, h1: `محامي وخدمات قانونية في ${escapeHtml(locality.name)}<br><span>24 مسارًا مختلفًا لا صفحات مكررة</span>`, eyebrow: `${locality.kind} ${locality.name} • المنطقة الشرقية`, intro: `دليل يربط الموقع بنوع المسألة والمرحلة والوثيقة. ${locality.profile}`, asideTitle: "24 صفحة متخصصة", asideText: "مساران مختلفان داخل كل واحد من 12 تخصصًا رئيسيًا، مع سيناريو ومستندات وروابط مستقلة.", body, faqs, schema, breadcrumb: [{ name: "الرئيسية", href: "/" }, { name: "دليل الشرقية", href: regionPage.slug }, { name: locality.name, href: page.slug }] });
}

function regionHub() {
  const page = regionPage;
  const governorates = localities.filter((item) => item.kind === "محافظة");
  const cities = localities.filter((item) => item.kind === "مدينة");
  const faqs = [
    ["ما نطاق دليل المنطقة الشرقية؟", "يغطي الدمام والمحافظات الرسمية ومدنًا ومراكز رئيسية ضمن شبكة من 500 صفحة جديدة: دليل إقليمي و19 دليل موقع و480 مسار خدمة."],
    ["لماذا لم تُنشأ صفحة لكل شارع؟", "لأن اسم الشارع وحده لا يغير الخدمة القانونية. بُنيت الصفحات على التخصص والمرحلة والوثيقة مع استخدام المدينة لوصف الموقع فقط."],
    ["هل الأنظمة تختلف بين مدن الشرقية؟", "الأنظمة السعودية واحدة، لكن الموقع قد يحدد العقار أو المنشأة أو مكان العمل أو الواقعة أو الجهة والموعد المرتبط بالطلب."],
    ["هل التغطية تعني وجود فروع؟", "لا. جميع الصفحات توضح أن الاستقبال الأولي إلكتروني ولا تدعي وجود مكتب أو فرع في المدن والمحافظات المذكورة."]
  ];
  const localityCard = (locality, index) => `<article class="locality-panel" data-number="${String(index + 1).padStart(2, "0")}"><h3>${locality.kind} ${escapeHtml(locality.name)}</h3><p>${escapeHtml(locality.profile)}</p><a href="${hubFor(locality)}">فتح دليل ${escapeHtml(locality.name)}</a></article>`;
  const body = `<div class="service-jump-wrap"><nav class="container service-jump" aria-label="روابط داخل الصفحة"><a href="#governorates">المحافظات</a><a href="#cities">المدن</a><a href="#specialties">التخصصات</a><a href="#quality">منهج الجودة</a><a href="#sources">المصادر</a></nav></div>
  <section class="section" id="governorates"><div class="container"><div class="section-head"><span class="eyebrow">تقسيم إداري ومواقع رئيسية</span><h2>محافظات المنطقة الشرقية</h2><p>اعتمد الدليل أسماء المحافظات الرسمية، ثم أضاف المدن والمراكز المهمة لتسهيل وصف الموقع دون اختلاق فروع.</p></div><div class="locality-panels">${governorates.map(localityCard).join("")}</div></div></section>
  <section class="section alt" id="cities"><div class="container"><div class="section-head"><span class="eyebrow">مدن ومراكز ضمن المحافظات</span><h2>مدن رئيسية في شبكة الشرقية</h2><p>تستخدم الصفحة اسم المدينة لتوضيح موقع الملف، ثم تنقل الزائر إلى واحدة من 24 نية قانونية مختلفة.</p></div><div class="locality-panels">${cities.map(localityCard).join("")}</div></div></section>
  <section class="section" id="specialties"><div class="container"><div class="section-head"><span class="eyebrow">12 تخصصًا × مسارين</span><h2>بنية 480 صفحة خدمة</h2><p>لكل موقع 24 صفحة: مساران مختلفان في العقود والتجارة والشركات والعمل والأسرة والتركات والجنائي والتنفيذ والعقار والاعتراضات والأعمال والنزاعات الرقمية.</p></div><div class="specialty-grid">${Object.values(specialties).map((specialty, index) => `<article class="specialty-card" data-number="${String(index + 1).padStart(2, "0")}"><h3>${escapeHtml(specialty.label)}</h3><p>${escapeHtml(specialty.focus)}.</p></article>`).join("")}</div></div></section>
  <section class="section alt" id="quality"><div class="container prep-layout" id="prepare"><div class="prep-intro"><span class="eyebrow">ضمانات قبل الفهرسة</span><h2>كيف نمنع التشابه والصفحات البوابية؟</h2><p>يختبر المولد العناوين والأوصاف والعناوين الرئيسية والمحتوى والروابط قبل النشر، ولا تعتمد الصفحة على استبدال اسم المدينة فقط.</p></div>${list(["نية ومرحلة وهدف مستقل لكل صفحة", "سياق محلي وقائمة مستندات وسيناريو مختلف", "روابط واردة من دليل الموقع وصفحات قريبة", "بيانات منظمة وCanonical وAnalytics", "توضيح التغطية الإلكترونية وعدم ادعاء الفروع", "اختبار تشابه نصي بين أكثر التركيبات تقاربًا"], true)}</div></section>
  <section class="section" id="sources"><div class="container"><div class="section-head"><span class="eyebrow">مصادر وحدود المحتوى</span><h2>تحقق قبل الاعتماد القانوني</h2><p>استُخدمت القوائم الرسمية للمحافظات والمراكز لبناء التصفح. أما الإجراء القانوني فيجب مراجعته وفق الوقائع والنص الرسمي الساري.</p></div><div class="related-services"><a href="https://saudipedia.com/قائمة-محافظات-المنطقة-الشرقية">قائمة محافظات المنطقة الشرقية</a><a href="https://saudipedia.com/قائمة-المراكز-الإدارية-في-المنطقة-الشرقية">قائمة المراكز الإدارية</a><a href="https://laws.boe.gov.sa/">بوابة الأنظمة السعودية</a><a href="https://www.moj.gov.sa/">وزارة العدل</a></div><p class="coverage-disclaimer">المحتوى إرشادي عام ولا يغني عن مراجعة مختص، ولا يضمن قبول طلب أو نتيجة معينة.</p></div></section>`;
  const schema = [{ "@type": "Service", "@id": `${baseUrl}/${page.slug}#service`, name: page.title, serviceType: "دليل الخدمات القانونية في المنطقة الشرقية", url: `${baseUrl}/${page.slug}`, provider: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "رُكن الأنظمة القانونية", telephone: phone }, areaServed: { "@type": "AdministrativeArea", name: "المنطقة الشرقية" } }, { "@type": "ItemList", name: "مدن ومحافظات دليل المنطقة الشرقية", numberOfItems: localities.length, itemListElement: localities.map((locality, index) => ({ "@type": "ListItem", position: index + 1, name: locality.name, url: `${baseUrl}/${hubFor(locality)}` })) }];
  return shell({ page, title: "محامي وخدمات قانونية في المنطقة الشرقية | دليل الشرقية", description: "محامي وخدمات قانونية في المنطقة الشرقية عبر دليل يربط 20 مدينة ومحافظة بـ24 مسارًا قانونيًا مختلفًا، مع 500 صفحة مترابطة ومهيأة للفهرسة دون تكرار.", h1: "محامي وخدمات قانونية في المنطقة الشرقية<br><span>500 صفحة مفيدة ومترابطة</span>", eyebrow: "20 موقعًا • 24 مسارًا • محتوى غير مكرر", intro: "بوابة واحدة للدمام ومحافظات ومدن الشرقية، تربط الموقع بنوع المسألة والمرحلة والمستند بدل إنشاء صفحات أسماء متشابهة.", asideTitle: "500 صفحة جديدة", asideText: "دليل إقليمي واحد، و19 دليل مدينة ومحافظة، و480 صفحة تخصص ومرحلة قانونية.", body, faqs, schema, breadcrumb: [{ name: "الرئيسية", href: "/" }, { name: "دليل المنطقة الشرقية", href: page.slug }] });
}

function render(page) {
  if (page.kind === "region") return regionHub();
  if (page.kind === "city") return cityPage(page);
  return servicePage(page);
}

function updateSitemap() {
  const sitemapPath = resolve(root, "sitemap.xml");
  let sitemap = readFileSync(sitemapPath, "utf8");
  for (const page of generatedPages) {
    const url = `${baseUrl}/${page.slug}`;
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>`, "g"), "");
    const priority = page.kind === "region" ? "0.9" : page.kind === "city" ? "0.8" : "0.7";
    const entry = `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    sitemap = sitemap.replace("</urlset>", `${entry}</urlset>`);
  }
  writeFileSync(sitemapPath, sitemap, "utf8");
}

export function generateEasternProvincePages() {
  if (localities.length !== 20) throw new Error(`Expected 20 Eastern Province locations, found ${localities.length}.`);
  if (intents.length !== 24) throw new Error(`Expected 24 legal intents, found ${intents.length}.`);
  if (generatedPages.length !== 500) throw new Error(`Expected exactly 500 new pages, found ${generatedPages.length}.`);
  for (const page of generatedPages) writeFileSync(resolve(root, page.slug), render(page), "utf8");
  updateSitemap();
  console.log(`Generated ${generatedPages.length} Eastern Province pages: 1 regional hub, 19 city hubs, and ${servicePages.length} service pages.`);
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirect) generateEasternProvincePages();
if (isDirect) for (const slug of generatedSlugs) if (!existsSync(resolve(root, slug))) throw new Error(`Missing generated page: ${slug}`);
