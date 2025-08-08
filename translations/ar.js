export default {
    // App Info
    appTitle: "StarryCrypt",
    versionBadge: "v2.0",
    
    // Notifications
    notificationSuccess: "نجاح!",
    notificationError: "خطأ!",

    // Header & Navigation
    languageSelect: "اختر اللغة",
    english: "🇺🇸 English",
    french: "🇫🇷 Français",
    spanish: "🇪🇸 Español",
    bengali: "🇧🇩 বাংলা",
    japanese: "🇯🇵 日本語",
    korean: "🇰🇷 한국어",
    turkish: "🇹🇷 Türkçe",
    russian: "🇷🇺 Русский",
    arabic: "🇸🇦 العربية",
    themeToggle: "تبديل الوضع",
    helpBtn: "مساعدة",

    // Main Sections
    textInputTitle: "إدخال النص",
    clearBtn: "مسح الكل",
    textPlaceholder: "أدخل النص هنا أو اسحب وأفلت ملف .txt...",
    fileDropZoneText: "أسقط ملفك هنا",
    fileDropZoneSubtext: "يدعم ملفات .txt و .enc.txt",
    charCount: "أحرف",
    wordCount: "كلمات",
    importBtn: "استيراد ملف",

    securityConfigTitle: "إعدادات الأمان",
    securityStatusNotConfigured: "غير مهيأ",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة مرور آمنة",
    starIdLabel: "معرّف النجمة (بصمة كلمة المرور)",
    starIdPlaceholder: "يتم إنشاؤه تلقائيًا",
    iterationsLabel: "قوة اشتقاق المفتاح",
    iterationsOptionMaximum: "🔒 أقصى (1M تكرار) - الأكثر أمانًا",
    iterationsOptionRecommended: "⚡ موصى به (600K تكرار) - متوازن",
    iterationsOptionFast: "🚀 سريع (300K تكرار) - سريع",
    iterationsOptionMinimal: "⚠️ أدنى (100K تكرار) - الأسرع",
    iterationsRecommendation: "القيم الأعلى توفر أمانًا أفضل ولكن معالجة أبطأ",
    hmacLabel: "تمكين التحقق من التكامل HMAC-SHA256",
    hmacNote: "يضيف تحققًا تشفيريًا للكشف عن العبث",

    encryptBtn: "تشفير النص",
    encryptBtnSubtitle: "تأمين رسالتك",
    decryptBtn: "فك التشفير",
    decryptBtnSubtitle: "كشف الرسالة الأصلية",

    outputTitle: "الناتج",
    copyBtn: "نسخ",
    exportBtn: "تصدير",
    outputPlaceholder: "لا يوجد ناتج حتى الآن. قم بتشفير أو فك تشفير نص لرؤية النتائج هنا.",
    outputHidden: "الناتج مخفي للخصوصية",
    revealBtn: "كشف",

    shareSectionTitle: "شارك عبر رابط / رمز QR",
    shareNote: "أنشئ رابطًا فريدًا أو رمز QR لمشاركة النص. يتم تضمين النص مباشرة في الرابط.",
    shareUrlLabel: "الرابط القابل للمشاركة الذي تم إنشاؤه",
    shareUrlPlaceholder: "انقر على 'إنشاء رابط' لإنشاء...",
    copyUrlBtn: "نسخ",
    qrScanText: "امسح لفتح الرابط على جهاز محمول.",
    createLinkBtn: "إنشاء رابط ورمز QR",

    settingsTitle: "الخصوصية والإعدادات",
    autoClearOutputTitle: "مسح الناتج تلقائيًا",
    autoClearOutputDescription: "مسح الناتج الحساس تلقائيًا بعد وقت محدد",
    autoClearClipboardTitle: "مسح الحافظة تلقائيًا",
    autoClearClipboardDescription: "مسح المحتوى المنسوخ من الحافظة تلقائيًا",
    autoClearInactivityTitle: "مسح عند عدم النشاط",
    autoClearInactivityDescription: "مسح جميع البيانات الحساسة عند عدم النشاط",
    clearAfterLabel: "مسح بعد:",
    secondsLabel: "ثوانٍ",
    minutesLabel: "دقائق",

    // Footer
    footerCopyright: "&copy; 2024 StarryCrypt - تشفير نص آمن",
    footerCredits: "صنع بـ",
    footerCreditsLink: "Samin Yasar",
    footerSecurityInfo: "معلومات الأمان",
    footerPrivacy: "الخصوصية",

    // Help Modal
    helpModalTitle: "المساعدة واختصارات لوحة المفاتيح",
    shortcutsTitle: "اختصارات لوحة المفاتيح",
    helpBtnOpen: "افتح قائمة المساعدة هذه",
    shortcutEncrypt: "تشفير النص",
    shortcutDecrypt: "فك التشفير",
    shortcutCopy: "نسخ الناتج",
    shortcutExport: "تصدير كملف",
    shortcutImport: "استيراد ملف",
    shortcutClear: "مسح جميع الحقول",
    shortcutGeneratePassword: "إنشاء كلمة مرور",
    securityFeaturesTitle: "ميزات الأمان",
    feature1: "تشفير AES-256-GCM",
    feature2: "اشتقاق المفتاح PBKDF2",
    feature3: "بصمة كلمة المرور",
    feature4: "التحقق من التكامل HMAC-SHA256",
    feature5: "المعالجة من جانب العميل فقط",

    // Notification Strings from app.js
    EncryptSuccess: "تم التشفير بنجاح! الناتج جاهز.",
    decryptSuccess: "تم فك التشفير بنجاح!",
    copySuccess: "تم نسخ الناتج إلى الحافظة!",
    exportSuccess: "تم تنزيل الناتج المشفر كملف!",
    clearSuccess: "تم مسح جميع الحقول.",
    errorEncrypt: "فشل التشفير. يرجى التحقق من إدخالاتك.",
    errorDecrypt: "فشل فك التشفير. قد تكون كلمة المرور غير صحيحة.",
    errorCopy: "فشل النسخ إلى الحافظة.",
    errorImportFile: "فشل استيراد الملف.",
    errorFileType: "نوع ملف غير صالح. يرجى استخدام .txt أو .enc.txt.",
    errorFileSize: "حجم الملف كبير جدًا. الحد الأقصى هو 1MB.",
    errorHttps: "يتطلب هذا التطبيق اتصال HTTPS آمنًا.",
    errorShareNoText: "الرجاء إدخال نص للمشاركة.",
    linkGenerated: 'تم إنشاء رابط قابل للمشاركة ورمز QR!',
    copyUrlSuccess: 'تم نسخ الرابط القابل للمشاركة إلى الحافظة!',
    textPrefilled: 'تم ملء النص مسبقًا من الرابط.',
    errorPrefill: 'تعذر فك تشفير النص من الرابط.',
    passwordStrength: "قوة كلمة المرور:",
    passwordWeak: "ضعيفة",
    passwordFair: "مقبولة",
    passwordGood: "جيدة",
    passwordStrong: "قوية",
    generatePasswordSuccess: "تم إنشاء كلمة المرور وملؤها بنجاح!",
    generatePasswordError: "فشل إنشاء كلمة المرور.",
    errorInvalidPassword: "تم توفير كلمة مرور غير صالحة.",
    errorDecryptPassword: "فشل فك تشفير كلمة المرور.",
    copyStarIdSuccess: "تم نسخ معرف النجمة إلى الحافظة!",
    autoClearTimeout: "تم مسح الناتج للخصوصية.",
    autoClearClipboard: "تم مسح الحافظة للخصوصية.",
};