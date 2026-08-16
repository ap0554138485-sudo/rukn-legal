# Rukn Legal

موقع رُكن الأنظمة القانونية، جاهز للنشر على CranL عبر Railpack.

## التشغيل

```bash
npm start
```

المنفذ الافتراضي: `3000`، ويستخدم متغير البيئة `PORT` تلقائيًا عند توفره.

## النشر

المشروع مرتبط بمستودع GitHub وبخدمة Cranl. بعد رفع التعديلات إلى فرع `main`، شغّل:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-cranl.ps1
```

تفاصيل الربط، المعرّفات، بيانات الجهاز، وخطوات الإعداد موجودة في [DEPLOYMENT.md](DEPLOYMENT.md).
