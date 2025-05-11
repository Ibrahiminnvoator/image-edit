# أَيْسَر | AisarEdit - تعديل الصور بالذكاء الاصطناعي

AisarEdit هو تطبيق ويب لتعديل الصور باستخدام الذكاء الاصطناعي، مصمم خصيصًا للمستخدمين الناطقين باللهجة السعودية.

## نظرة عامة | Overview

أيسر (AisarEdit) هو تطبيق ويب يتيح للمستخدمين تعديل الصور باستخدام تقنيات الذكاء الاصطناعي المتقدمة. التطبيق مصمم خصيصًا للمستخدمين الناطقين باللهجة السعودية، مع واجهة مستخدم سهلة الاستخدام ومحتوى مخصص يعكس الثقافة واللغة المحلية.

AisarEdit is a web application that allows users to edit images using advanced AI techniques. The application is specifically designed for Saudi Arabic-speaking users, with an easy-to-use interface and customized content that reflects the local culture and language.

## الميزات الرئيسية | Key Features

- **تعديل الصور بالذكاء الاصطناعي**: استخدام نماذج Gemini AI لتعديل الصور بناءً على وصف نصي
- **واجهة مستخدم باللهجة السعودية**: جميع النصوص والرسائل مكتوبة باللهجة السعودية
- **نظام المصادقة**: تسجيل الدخول وإدارة الحسابات باستخدام Clerk
- **لوحة تحكم المستخدم**: عرض الإحصائيات وعدد التعديلات المتبقية
- **سجل التعديلات**: عرض جميع الصور التي تم تعديلها سابقًا
- **تتبع التحليلات**: تتبع استخدام المستخدمين وأداء التطبيق
- **وضع الألوان الداكن/الفاتح**: دعم وضع الألوان الداكن والفاتح

## التقنيات المستخدمة | Tech Stack

- **نموذج الذكاء الاصطناعي**: [Gemini AI](https://gemini.google.com/)
- **الواجهة الأمامية**: 
  - [Next.js](https://nextjs.org/docs) - إطار عمل React لبناء تطبيقات الويب
  - [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs) - إطار عمل CSS للتصميم السريع
  - [Shadcn UI](https://ui.shadcn.com/docs/installation) - مكونات واجهة المستخدم
- **قاعدة البيانات**: 
  - [PostgreSQL](https://www.postgresql.org/about/) - قاعدة بيانات مفتوحة المصدر
  - [Supabase](https://supabase.com/) - منصة بيانات مفتوحة المصدر
  - [Drizzle ORM](https://orm.drizzle.team/docs/get-started-postgresql) - ORM لقواعد البيانات
- **المصادقة**: [Clerk](https://clerk.com/) - نظام إدارة الهوية والمستخدمين
- **التخزين**: [Supabase Storage](https://supabase.com/storage) - تخزين الصور والملفات
- **التحليلات**: نظام تحليلات مخصص لتتبع الأحداث

## متطلبات النظام | Prerequisites

لتشغيل التطبيق، ستحتاج إلى التالي:

- [Node.js](https://nodejs.org/) (v18.0.0 أو أحدث)
- [npm](https://www.npmjs.com/) أو [yarn](https://yarnpkg.com/) أو [pnpm](https://pnpm.io/)
- حساب [Supabase](https://supabase.com/) لقاعدة البيانات والتخزين
- حساب [Clerk](https://clerk.com/) للمصادقة
- مفتاح API لنموذج [Gemini AI](https://gemini.google.com/)

## التثبيت والإعداد | Installation & Setup

### 1. استنساخ المشروع | Clone the repository

```bash
git clone https://github.com/yourusername/aisaredit.git
cd aisaredit
```

### 2. تثبيت الاعتماديات | Install dependencies

```bash
npm install
# أو yarn install
# أو pnpm install
```

### 3. إعداد المتغيرات البيئية | Set up environment variables

قم بنسخ ملف `.env.example` إلى `.env.local` وقم بتعبئة المتغيرات المطلوبة:

```bash
cp .env.example .env.local
```

المتغيرات المطلوبة تشمل:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: مفتاح Clerk العام
- `CLERK_SECRET_KEY`: مفتاح Clerk السري
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: مسار تسجيل الدخول
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: مسار التسجيل
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: مسار ما بعد تسجيل الدخول
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: مسار ما بعد التسجيل
- `DATABASE_URL`: رابط قاعدة بيانات Supabase
- `SUPABASE_URL`: رابط Supabase
- `SUPABASE_KEY`: مفتاح Supabase
- `GEMINI_API_KEY`: مفتاح API لنموذج Gemini
- `CRON_SECRET`: مفتاح سري للمهام المجدولة
- `AISEREDIT_ORIGINAL_IMAGES_BUCKET`: اسم حاوية الصور الأصلية
- `AISEREDIT_EDITED_IMAGES_BUCKET`: اسم حاوية الصور المعدلة

### 4. إعداد قاعدة البيانات | Set up the database

قم بتشغيل الترحيلات لإنشاء الجداول المطلوبة:

```bash
npm run db:push
```

### 5. تشغيل التطبيق | Run the application

```bash
npm run dev
```

سيتم تشغيل التطبيق على الرابط `http://localhost:3000`.

## بيئة التطوير المحلية المؤتمتة | Automated Local Development Environment

لتسهيل عملية التطوير، قمنا بإنشاء بيئة تطوير محلية مؤتمتة باستخدام Docker. هذه البيئة تتضمن:

- تطبيق Next.js
- خادم Supabase محلي
- إعداد تلقائي للمتغيرات البيئية

### استخدام بيئة التطوير المؤتمتة | Using the Automated Development Environment

1. تأكد من تثبيت [Docker](https://docs.docker.com/get-docker/) و [Docker Compose](https://docs.docker.com/compose/install/)

2. قم بتشغيل سكريبت الإعداد:
   ```bash
   ./setup.sh
   ```

3. بعد اكتمال الإعداد، يمكنك الوصول إلى:
   - تطبيق Next.js: http://localhost:3000
   - منصة Supabase: http://localhost:54322

### أوامر إدارة بيئة التطوير | Development Environment Management

يمكنك استخدام سكريبت إدارة بيئة التطوير للتحكم في البيئة:

```bash
./scripts/dev-env.sh start    # تشغيل البيئة
./scripts/dev-env.sh stop     # إيقاف البيئة
./scripts/dev-env.sh logs     # عرض السجلات
./scripts/dev-env.sh seed     # إضافة بيانات تجريبية
./scripts/dev-env.sh reset    # إعادة تعيين البيئة
```

لمزيد من المعلومات حول بيئة التطوير المحلية، راجع [دليل التطوير المحلي](docs/local-development.md).

## الاستخدام | Usage

1. قم بإنشاء حساب أو تسجيل الدخول
2. انتقل إلى صفحة التعديل من لوحة التحكم
3. قم بتحميل صورة وأدخل وصفًا للتعديل المطلوب
4. انتظر حتى يتم معالجة الصورة
5. يمكنك عرض سجل التعديلات الخاص بك في صفحة السجل

## المساهمة | Contributing

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. قم بعمل fork للمشروع
2. قم بإنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بعمل commit للتغييرات (`git commit -m 'Add some amazing feature'`)
4. قم برفع الفرع (`git push origin feature/amazing-feature`)
5. قم بفتح pull request

## الترخيص | License

تم ترخيص هذا المشروع بموجب ترخيص MIT. انظر ملف `LICENSE` للحصول على مزيد من المعلومات.
