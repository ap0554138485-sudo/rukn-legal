# دليل ربط ونشر مشروع رُكن الأنظمة القانونية

هذا الملف هو المرجع الدائم لنشر المشروع من هذا الجهاز أو من جهاز جديد.

## معلومات المشروع

| البيان | القيمة |
|---|---|
| مستودع GitHub | `https://github.com/ap0554138485-sudo/rukn-legal` |
| فرع الإنتاج | `main` |
| رابط الموقع | `https://rukn-legal-vwptio.cranl.net/` |
| مشروع Cranl | `Rukn Legal` |
| معرّف مشروع Cranl | `dad57738-b3e5-492b-8580-379a2fff9f82` |
| تطبيق Cranl | `rukn-legal` |
| معرّف تطبيق Cranl | `f3d8bfeb-3712-4ca1-ab4c-72317e96d297` |
| ملف خريطة Google | `https://rukn-legal-vwptio.cranl.net/sitemap.xml` |

## مكان بيانات الدخول

المفتاح الكامل لخدمة Cranl محفوظ على هذا الجهاز بواسطة أداة Cranl الرسمية في:

`%USERPROFILE%\.cranl\config.json`

لا تنسخ محتوى هذا الملف إلى المشروع ولا ترفعه إلى GitHub. أداة النشر الموجودة في `scripts/deploy-cranl.ps1` تقرأ المفتاح تلقائيًا في الذاكرة، ولا تعرضه في الشاشة أو السجلات.

## النشر المعتاد

بعد تعديل ملفات الموقع واختبارها:

```powershell
git status
git add .
git commit -m "وصف التعديل"
git push origin main
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-cranl.ps1
```

أداة النشر تقوم بالآتي:

1. تتأكد من وجود أداة Cranl وبيانات الدخول المحلية.
2. تطلب نشر تطبيق `rukn-legal` من فرع `main`.
3. تتابع حالة النشر عبر واجهة Cranl حتى النجاح أو الفشل.
4. لا تطبع مفتاح API في أي مرحلة.

## فحص آخر نشر بدون إنشاء نشر جديد

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-cranl.ps1 -CheckOnly
```

## إعداد جهاز جديد

1. ثبّت Git ثم استنسخ المستودع.
2. ثبّت أداة Cranl الرسمية.
3. سجّل الدخول مرة واحدة باستخدام `cranl login <api-key>`.
4. شغّل أداة النشر الموجودة في هذا المشروع.

عند تغيير مفتاح Cranl، شغّل `cranl logout` ثم `cranl login <new-api-key>`. لا تحفظ المفتاح الجديد داخل GitHub.

## التحقق بعد النشر

- افتح الصفحة الرئيسية وتأكد من استجابة `200`.
- تحقق من `robots.txt` و`sitemap.xml` وملف إثبات ملكية Google.
- راقب Google Search Console عند إضافة صفحات جديدة، وأعد إرسال خريطة الموقع عند الحاجة.
