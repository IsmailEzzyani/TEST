// ========== Enhanced UI behaviors + theme + language ==========
(function () {
    const select = sel => document.querySelector(sel);
    const selectAll = sel => Array.from(document.querySelectorAll(sel));

    const html = document.documentElement;

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ------------------ THEME TOGGLE ------------------
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('prac-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
        html.setAttribute('data-theme', storedTheme);
    }

    function updateThemeButtonLabel() {
        const current = html.getAttribute('data-theme') || 'dark';
        if (!themeToggle) return;
        if (current === 'dark') {
            themeToggle.textContent = '🌙 Dark';
        } else {
            themeToggle.textContent = '☀️ Light';
        }
    }
    updateThemeButtonLabel();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('prac-theme', next);
            updateThemeButtonLabel();
        });
    }

    // ------------------ LANGUAGE SELECTOR WITH SEARCH ------------------
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langSearch = document.getElementById('langSearch');
    const langList = document.getElementById('langList');
    const langFlag = document.getElementById('langFlag');
    const langCode = document.getElementById('langCode');

    // Language data with flags and names
    const languages = [
        { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
        { code: 'es', flag: '🇪🇸', name: 'Spanish', nativeName: 'Español' },
        { code: 'ar', flag: '🇸🇦', name: 'Arabic', nativeName: 'العربية' },
        { code: 'de', flag: '🇩🇪', name: 'German', nativeName: 'Deutsch' },
        { code: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français' },
        { code: 'it', flag: '🇮🇹', name: 'Italian', nativeName: 'Italiano' },
        { code: 'pt', flag: '🇵🇹', name: 'Portuguese', nativeName: 'Português' },
        { code: 'ru', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский' },
        { code: 'zh', flag: '🇨🇳', name: 'Chinese', nativeName: '中文' },
        { code: 'ja', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語' },
        { code: 'ko', flag: '🇰🇷', name: 'Korean', nativeName: '한국어' },
        { code: 'nl', flag: '🇳🇱', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'pl', flag: '🇵🇱', name: 'Polish', nativeName: 'Polski' },
        { code: 'tr', flag: '🇹🇷', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'hi', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिन्दी' }
    ];

    const translations = {
        en: {
            'nav.features': 'Features',
            'nav.live': 'Live exchange',
            'nav.usecases': 'Use cases',
            'nav.security': 'Security',
            'nav.login': 'Log in',
            'nav.getStarted': 'Get started',

            'hero.pill': '⚡ Real-time FX with transparent rates',
            'hero.title': 'Borderless money <span class="accent">made simple</span>',
            'hero.lead': 'PRAC unifies sending, receiving and converting money into one secure, global wallet. Instant transfers, live FX, and transparent pricing—built for a modern, international life.',
            'hero.primaryCta': 'Create your wallet →',
            'hero.secondaryCta': 'Explore features',
            'hero.statSpeedLabel': 'Transfer speed',
            'hero.statSpeedValue': 'Instant',
            'hero.statCurrenciesLabel': 'Currencies',
            'hero.statCurrenciesValue': '50+ wallets',
            'hero.statFeesLabel': 'Fees',
            'hero.statFeesValue': 'Transparent',

            'card.title': 'PRAC Wallet',
            'card.subtitle': 'USD • Primary',
            'card.balanceLabel': 'Balance',
            'card.fxLabel': 'FX rate',
            'card.recent': 'Recent: Received 500 USD • Sent 200 USD • Exchanged 120 USD',
            'card.footer': '⚡ Instant transfers',
            'card.send': 'Send',
            'card.receive': 'Receive',

            'onewallet.title': 'One wallet. Every border.',
            'onewallet.subtitle': 'Move money at the speed of the internet with a platform that\'s faster than banks, cheaper than exchange books, and simpler than multiple accounts.',
            'onewallet.f1Title': '⚡ Instant PRAC-to-PRAC',
            'onewallet.f1Body': 'Send and receive money worldwide in seconds with zero friction between PRAC users.',
            'onewallet.f2Title': '🔒 Security by design',
            'onewallet.f2Body': 'Encryption, fraud detection, and dispute management keep your funds protected 24/7.',
            'onewallet.f3Title': '💱 Real-time conversion',
            'onewallet.f3Body': 'Live FX rates with full price transparency. Convert only what you need—no hidden spreads.',

            'features.title': 'Features built for you',
            'features.f1Title': '🚀 Fast Transfers',
            'features.f1Body': 'Move money internationally in seconds with competitive FX rates.',
            'features.f2Title': '🌍 Multiple Wallets',
            'features.f2Body': 'Hold balances in 50+ currencies and switch instantly between them.',
            'features.f3Title': '💎 Transparent Fees',
            'features.f3Body': 'No hidden charges—see live FX and fees before you send.',

            'live.title': 'Live exchange rates',
            'live.subtitle': 'Real-time currency rates updated every second. What you see is what you get.',
            'live.updated': 'Updated live',

            'usecases.title': 'Built for borderless living',
            'usecases.subtitle': 'For freelancers, travelers, remote workers and businesses operating across borders.',
            'usecases.f1Title': '💼 Multi-currency wallet',
            'usecases.f1Body': 'Hold, manage, and execute business transactions in 50+ currencies from one global wallet.',
            'usecases.f2Title': '📊 Track in real time',
            'usecases.f2Body': 'Instant notifications and live transaction tracking for complete peace of mind.',
            'usecases.f3Title': '🏢 Business tools',
            'usecases.f3Body': 'Invoice clients globally and get paid into local currencies with ease.',
            'usecases.f4Title': '✈️ For Travelers',
            'usecases.f4Body': 'Convert currency when you need it and avoid surprise fees abroad.',
            'usecases.f5Title': '💻 Remote Workers',
            'usecases.f5Body': 'Receive salaries from foreign employers and withdraw to local currency easily.',
            'usecases.f6Title': '🏭 Businesses',
            'usecases.f6Body': 'Pay suppliers worldwide at low cost and track every transaction in real time.',

            'security.title': 'Security, compliance, trust',
            'security.subtitle': 'Every transfer is protected with bank-grade encryption, rigorous monitoring, and layered fraud prevention. Dispute management gives you confidence when something needs attention.',
            'security.f1Title': '✓ Verified transfers',
            'security.f1Body': 'Every transaction is verified and encrypted with industry-leading security.',
            'security.f2Title': '🌐 Global coverage',
            'security.f2Body': 'Cross-border support with local payout options where available.',
            'security.f3Title': '🔐 Privacy & controls',
            'security.f3Body': 'Role-based access, secure authentication, and complete audit trails.',

            'cta.title': 'Ready to move money across borders?',
            'cta.subtitle': 'Create a PRAC wallet and start sending instantly—no fees for your first month.',
            'cta.button': 'Get started—it\'s free →',

            'footer.brand': 'PRAC — Pay • Receive • Convert',
            'footer.security': 'Security',
            'footer.support': 'Support',
            'footer.rates': 'Rates',

            // Auth Pages
            'auth.login.title': 'Welcome back',
            'auth.login.subtitle': 'Sign in to your PRAC account',
            'auth.login.emailLabel': 'Username or email',
            'auth.login.emailPlaceholder': 'Enter your email',
            'auth.login.passwordLabel': 'Password',
            'auth.login.passwordPlaceholder': 'Enter your password',
            'auth.login.rememberMe': 'Remember me',
            'auth.login.submit': 'Sign in',
            'auth.login.forgotPassword': 'Forgot password?',
            'auth.login.noAccount': 'Don\'t have an account?',
            'auth.login.signupLink': 'Sign up',

            'auth.signup.title': 'Create account',
            'auth.signup.subtitle': 'Join PRAC and start sending money globally',
            'auth.signup.nameLabel': 'Full name',
            'auth.signup.namePlaceholder': 'Enter your full name',
            'auth.signup.emailLabel': 'Email address',
            'auth.signup.emailPlaceholder': 'Enter your email',
            'auth.signup.usernameLabel': 'Username',
            'auth.signup.usernamePlaceholder': 'Choose a username',
            'auth.signup.usernameHint': 'Only letters and numbers, at least 3 characters',
            'auth.signup.passwordLabel': 'Password',
            'auth.signup.passwordPlaceholder': 'Create a password',
            'auth.signup.confirmPasswordLabel': 'Confirm password',
            'auth.signup.confirmPasswordPlaceholder': 'Confirm your password',
            'auth.signup.terms': 'I agree to the Terms of Service and Privacy Policy',
            'auth.signup.submit': 'Create account',
            'auth.signup.hasAccount': 'Already have an account?',
            'auth.signup.loginLink': 'Sign in',

            'auth.forgot.title': 'Reset password',
            'auth.forgot.subtitle': 'Enter your email to receive a reset link',
            'auth.forgot.emailLabel': 'Email address',
            'auth.forgot.emailPlaceholder': 'Enter your email',
            'auth.forgot.submit': 'Send reset link',
            'auth.forgot.backToLogin': 'Back to login',

            'auth.reset.title': 'Set new password',
            'auth.reset.subtitle': 'Choose a strong password for your account',
            'auth.reset.passwordLabel': 'New password',
            'auth.reset.passwordPlaceholder': 'Enter new password',
            'auth.reset.confirmPasswordLabel': 'Confirm new password',
            'auth.reset.confirmPasswordPlaceholder': 'Confirm new password',
            'auth.reset.submit': 'Reset password'
        },

        es: {
            'nav.features': 'Funciones',
            'nav.live': 'Cambio en vivo',
            'nav.usecases': 'Casos de uso',
            'nav.security': 'Seguridad',
            'nav.login': 'Iniciar sesión',
            'nav.getStarted': 'Empezar',

            'hero.pill': '⚡ Tipos de cambio en tiempo real y transparentes',
            'hero.title': 'Dinero sin fronteras <span class="accent">hecho simple</span>',
            'hero.lead': 'PRAC unifica el envío, la recepción y la conversión de dinero en una sola billetera global y segura. Transferencias instantáneas, FX en vivo y precios transparentes para una vida internacional moderna.',
            'hero.primaryCta': 'Crea tu billetera →',
            'hero.secondaryCta': 'Explorar funciones',
            'hero.statSpeedLabel': 'Velocidad de envío',
            'hero.statSpeedValue': 'Instantáneo',
            'hero.statCurrenciesLabel': 'Monedas',
            'hero.statCurrenciesValue': '50+ billeteras',
            'hero.statFeesLabel': 'Comisiones',
            'hero.statFeesValue': 'Transparentes',

            'card.title': 'Billetera PRAC',
            'card.subtitle': 'USD • Principal',
            'card.balanceLabel': 'Saldo',
            'card.fxLabel': 'Tipo de cambio',
            'card.recent': 'Reciente: +500 USD recibidos • 200 USD enviados • 120 USD convertidos',
            'card.footer': '⚡ Transferencias instantáneas',
            'card.send': 'Enviar',
            'card.receive': 'Recibir',

            'onewallet.title': 'Una sola billetera. Todas las fronteras.',
            'onewallet.subtitle': 'Mueve dinero a la velocidad de internet con una plataforma más rápida que los bancos, más barata que las casas de cambio y más simple que tener múltiples cuentas.',
            'onewallet.f1Title': '⚡ PRAC a PRAC instantáneo',
            'onewallet.f1Body': 'Envía y recibe dinero en todo el mundo en segundos, sin fricción entre usuarios PRAC.',
            'onewallet.f2Title': '🔒 Seguridad por diseño',
            'onewallet.f2Body': 'Cifrado, detección de fraude y gestión de disputas protegen tus fondos 24/7.',
            'onewallet.f3Title': '💱 Conversión en tiempo real',
            'onewallet.f3Body': 'Tipos de cambio en vivo con total transparencia. Convierte solo lo que necesitas, sin márgenes ocultos.',

            'features.title': 'Funciones creadas para ti',
            'features.f1Title': '🚀 Transferencias rápidas',
            'features.f1Body': 'Mueve dinero internacionalmente en segundos con tipos de cambio competitivos.',
            'features.f2Title': '🌍 Múltiples billeteras',
            'features.f2Body': 'Mantén saldos en más de 50 monedas y cambia entre ellas al instante.',
            'features.f3Title': '💎 Comisiones transparentes',
            'features.f3Body': 'Sin cargos ocultos: ve el FX y las comisiones antes de enviar.',

            'live.title': 'Tipos de cambio en vivo',
            'live.subtitle': 'Tipos de cambio actualizados en tiempo real. Lo que ves es lo que obtienes.',
            'live.updated': 'Actualizado en vivo',

            'usecases.title': 'Diseñado para una vida sin fronteras',
            'usecases.subtitle': 'Para freelancers, viajeros, trabajadores remotos y empresas globales.',
            'usecases.f1Title': '💼 Billetera multidivisa',
            'usecases.f1Body': 'Administra operaciones en más de 50 monedas desde una sola billetera global.',
            'usecases.f2Title': '📊 Seguimiento en tiempo real',
            'usecases.f2Body': 'Notificaciones instantáneas y seguimiento de transacciones para tu tranquilidad.',
            'usecases.f3Title': '🏢 Herramientas para empresas',
            'usecases.f3Body': 'Factura a clientes globales y cobra fácilmente en monedas locales.',
            'usecases.f4Title': '✈️ Para viajeros',
            'usecases.f4Body': 'Convierte moneda solo cuando la necesites y evita comisiones sorpresa.',
            'usecases.f5Title': '💻 Trabajadores remotos',
            'usecases.f5Body': 'Recibe salarios de empleadores extranjeros y retira en tu moneda local sin complicaciones.',
            'usecases.f6Title': '🏭 Empresas',
            'usecases.f6Body': 'Paga proveedores en todo el mundo a bajo costo y sigue cada transacción en tiempo real.',

            'security.title': 'Seguridad, cumplimiento y confianza',
            'security.subtitle': 'Cada transferencia está protegida con cifrado de nivel bancario, monitoreo riguroso y prevención de fraude en capas.',
            'security.f1Title': '✓ Transferencias verificadas',
            'security.f1Body': 'Cada transacción se verifica y cifra con estándares de primer nivel.',
            'security.f2Title': '🌐 Cobertura global',
            'security.f2Body': 'Soporte transfronterizo con opciones de pago locales cuando estén disponibles.',
            'security.f3Title': '🔐 Privacidad y controles',
            'security.f3Body': 'Acceso basado en roles, autenticación segura y trazabilidad completa.',

            'cta.title': '¿Listo para mover dinero sin fronteras?',
            'cta.subtitle': 'Crea tu billetera PRAC y empieza a enviar al instante — sin comisiones el primer mes.',
            'cta.button': 'Empezar — es gratis →',

            'footer.brand': 'PRAC — Pagar • Recibir • Convertir',
            'footer.security': 'Seguridad',
            'footer.support': 'Soporte',
            'footer.rates': 'Tipos'
        },

        ar: {
            'nav.features': 'الميزات',
            'nav.live': 'سعر الصرف المباشر',
            'nav.usecases': 'حالات الاستخدام',
            'nav.security': 'الأمان',
            'nav.login': 'تسجيل الدخول',
            'nav.getStarted': 'ابدأ الآن',

            'hero.pill': '⚡ أسعار صرف فورية وشفافة',
            'hero.title': 'أموال بلا حدود <span class="accent">بأسلوب بسيط</span>',
            'hero.lead': 'تجمع PRAC بين الإرسال والاستقبال والتحويل في محفظة عالمية واحدة وآمنة. تحويلات فورية، أسعار صرف لحظية ورسوم واضحة لحياة دولية حديثة.',
            'hero.primaryCta': 'أنشئ محفظتك →',
            'hero.secondaryCta': 'استكشف الميزات',
            'hero.statSpeedLabel': 'سرعة التحويل',
            'hero.statSpeedValue': 'فوري',
            'hero.statCurrenciesLabel': 'العملات',
            'hero.statCurrenciesValue': 'أكثر من 50 محفظة',
            'hero.statFeesLabel': 'الرسوم',
            'hero.statFeesValue': 'شفافة',

            'card.title': 'محفظة PRAC',
            'card.subtitle': 'الدولار الأمريكي • رئيسية',
            'card.balanceLabel': 'الرصيد',
            'card.fxLabel': 'سعر الصرف',
            'card.recent': 'حديثًا: استلام 500 دولار أمريكي • إرسال 200 دولار أمريكي • تحويل 120 دولار أمريكي',
            'card.footer': '⚡ تحويلات فورية',
            'card.send': 'إرسال',
            'card.receive': 'استلام',

            'onewallet.title': 'محفظة واحدة. كل الحدود.',
            'onewallet.subtitle': 'حرّك أموالك بسرعة الإنترنت عبر منصة أسرع من البنوك وأرخص من مكاتب الصرافة وأسهل من تعدد الحسابات.',
            'onewallet.f1Title': '⚡ تحويل فوري بين حسابات PRAC',
            'onewallet.f1Body': 'أرسل واستلم الأموال حول العالم في ثوانٍ معدودة بدون أي عوائق بين مستخدمي PRAC.',
            'onewallet.f2Title': '🔒 الأمان من الأساس',
            'onewallet.f2Body': 'تشفير واكتشاف تلقائي للاحتيال وإدارة للنزاعات لحماية أموالك على مدار الساعة.',
            'onewallet.f3Title': '💱 تحويلات لحظية',
            'onewallet.f3Body': 'أسعار صرف مباشرة وشفافة بالكامل. حوّل فقط ما تحتاجه — بدون هوامش خفية.',

            'features.title': 'ميزات مصممة من أجلك',
            'features.f1Title': '🚀 تحويلات سريعة',
            'features.f1Body': 'حوّل الأموال دوليًا في ثوانٍ مع أسعار صرف منافسة.',
            'features.f2Title': '🌍 محافظ متعددة',
            'features.f2Body': 'احتفظ بأرصدة في أكثر من 50 عملة وقم بالتبديل بينها فورًا.',
            'features.f3Title': '💎 رسوم شفافة',
            'features.f3Body': 'لا رسوم مخفية — اطلع على السعر والرسوم قبل الإرسال.',

            'live.title': 'أسعار الصرف المباشرة',
            'live.subtitle': 'أسعار عملات محدثة في الوقت الحقيقي. ما تراه هو ما تدفعه.',
            'live.updated': 'تحديث مباشر',

            'usecases.title': 'مصممة لحياة بلا حدود',
            'usecases.subtitle': 'للعاملين المستقلين والمسافرين والعاملين عن بُعد والشركات العالمية.',
            'usecases.f1Title': '💼 محفظة متعددة العملات',
            'usecases.f1Body': 'احتفظ بالأموال وأدر المعاملات في أكثر من 50 عملة من محفظة عالمية واحدة.',
            'usecases.f2Title': '📊 متابعة لحظية',
            'usecases.f2Body': 'إشعارات فورية وتتبع مباشر للمعاملات لراحة بالك.',
            'usecases.f3Title': '🏢 أدوات للأعمال',
            'usecases.f3Body': 'فوّت عملاءك حول العالم وتلقَّ المدفوعات بعملاتهم المحلية بسهولة.',
            'usecases.f4Title': '✈️ للمسافرين',
            'usecases.f4Body': 'حوّل العملة عند الحاجة فقط وتجنّب الرسوم المفاجئة.',
            'usecases.f5Title': '💻 للعاملين عن بُعد',
            'usecases.f5Body': 'استلم الرواتب من أصحاب عمل أجانب واسحبها بعملتك المحلية بسهولة.',
            'usecases.f6Title': '🏭 للشركات',
            'usecases.f6Body': 'ادفع للموردين حول العالم بتكلفة منخفضة وتابع كل معاملة في الوقت الفعلي.',

            'security.title': 'الأمان والامتثال والثقة',
            'security.subtitle': 'كل تحويل محمي بتشفير بمستوى البنوك، ومراقبة مستمرة، وطبقات متعددة لمنع الاحتيال.',
            'security.f1Title': '✓ تحويلات موثّقة',
            'security.f1Body': 'كل معاملة يتم التحقق منها وتشفيرها وفقًا لأعلى المعايير.',
            'security.f2Title': '🌐 تغطية عالمية',
            'security.f2Body': 'دعم للمدفوعات عبر الحدود مع خيارات دفع محلية حيثما توفرت.',
            'security.f3Title': '🔐 الخصوصية والتحكم',
            'security.f3Body': 'صلاحيات مبنية على الأدوار، وتوثيق آمن، وسجل كامل للحركات.',

            'cta.title': 'هل أنت مستعد لتحريك أموالك عبر الحدود؟',
            'cta.subtitle': 'أنشئ محفظة PRAC وابدأ الإرسال فورًا — بدون رسوم في الشهر الأول.',
            'cta.button': 'ابدأ الآن — مجانًا →',

            'footer.brand': 'PRAC — ادفع • استلم • حوّل',
            'footer.security': 'الأمان',
            'footer.support': 'الدعم',
            'footer.rates': 'الأسعار'
        },

        de: {
            'nav.features': 'Funktionen',
            'nav.live': 'Live-Wechselkurse',
            'nav.usecases': 'Anwendungsfälle',
            'nav.security': 'Sicherheit',
            'nav.login': 'Anmelden',
            'nav.getStarted': 'Loslegen',

            'hero.pill': '⚡ Echtzeit-Devisen mit transparenten Kursen',
            'hero.title': 'Grenzenloses Geld <span class="accent">ganz einfach</span>',
            'hero.lead': 'PRAC vereint Senden, Empfangen und Umtauschen von Geld in einer sicheren globalen Wallet. Sofortige Überweisungen, Live-FX und transparente Preise – für ein modernes, internationales Leben.',
            'hero.primaryCta': 'Wallet erstellen →',
            'hero.secondaryCta': 'Funktionen entdecken',
            'hero.statSpeedLabel': 'Überweisungsgeschwindigkeit',
            'hero.statSpeedValue': 'Sofort',
            'hero.statCurrenciesLabel': 'Währungen',
            'hero.statCurrenciesValue': '50+ Wallets',
            'hero.statFeesLabel': 'Gebühren',
            'hero.statFeesValue': 'Transparent',

            'card.title': 'PRAC Wallet',
            'card.subtitle': 'USD • Primär',
            'card.balanceLabel': 'Kontostand',
            'card.fxLabel': 'Wechselkurs',
            'card.recent': 'Zuletzt: 500 USD empfangen • 200 USD gesendet • 120 USD gewechselt',
            'card.footer': '⚡ Sofortige Überweisungen',
            'card.send': 'Senden',
            'card.receive': 'Empfangen',

            'onewallet.title': 'Eine Wallet. Alle Grenzen.',
            'onewallet.subtitle': 'Bewegen Sie Geld mit Internetgeschwindigkeit – schneller als Banken, günstiger als Wechselstuben und einfacher als mehrere Konten.',
            'onewallet.f1Title': '⚡ Sofort PRAC-zu-PRAC',
            'onewallet.f1Body': 'Senden und empfangen Sie weltweit Geld in Sekunden – ohne Reibung zwischen PRAC-Nutzern.',
            'onewallet.f2Title': '🔒 Sicherheit von Anfang an',
            'onewallet.f2Body': 'Verschlüsselung, Betrugserkennung und Konfliktmanagement schützen Ihre Gelder rund um die Uhr.',
            'onewallet.f3Title': '💱 Umrechnung in Echtzeit',
            'onewallet.f3Body': 'Live-Wechselkurse mit voller Preistransparenz. Tauschen Sie nur, was Sie brauchen – ohne versteckte Spreads.',

            'features.title': 'Funktionen für Sie entwickelt',
            'features.f1Title': '🚀 Schnelle Überweisungen',
            'features.f1Body': 'Internationale Überweisungen in Sekunden mit wettbewerbsfähigen FX-Kursen.',
            'features.f2Title': '🌍 Mehrere Wallets',
            'features.f2Body': 'Halten Sie Guthaben in über 50 Währungen und wechseln Sie sofort zwischen ihnen.',
            'features.f3Title': '💎 Transparente Gebühren',
            'features.f3Body': 'Keine versteckten Kosten – sehen Sie Kurs und Gebühren vor dem Senden.',

            'live.title': 'Live-Wechselkurse',
            'live.subtitle': 'Währungskurse in Echtzeit aktualisiert. Was Sie sehen, ist was Sie bekommen.',
            'live.updated': 'Laufend aktualisiert',

            'usecases.title': 'Gemacht für ein grenzenloses Leben',
            'usecases.subtitle': 'Für Freelancer, Reisende, Remote-Worker und Unternehmen mit internationaler Tätigkeit.',
            'usecases.f1Title': '💼 Multiwährungs-Wallet',
            'usecases.f1Body': 'Verwalten Sie Geschäfte in über 50 Währungen aus einer globalen Wallet.',
            'usecases.f2Title': '📊 Echtzeit-Tracking',
            'usecases.f2Body': 'Sofortige Benachrichtigungen und Live-Tracking für volle Transparenz.',
            'usecases.f3Title': '🏢 Business-Tools',
            'usecases.f3Body': 'Stellen Sie global Rechnungen und lassen Sie sich bequem in Landeswährung bezahlen.',
            'usecases.f4Title': '✈️ Für Reisende',
            'usecases.f4Body': 'Tauschen Sie Währungen nur bei Bedarf und vermeiden Sie Überraschungsgebühren.',
            'usecases.f5Title': '💻 Remote-Worker',
            'usecases.f5Body': 'Empfangen Sie Gehälter aus dem Ausland und heben Sie sie einfach in lokaler Währung ab.',
            'usecases.f6Title': '🏭 Unternehmen',
            'usecases.f6Body': 'Bezahlen Sie Lieferanten weltweit kostengünstig und verfolgen Sie jede Transaktion in Echtzeit.',

            'security.title': 'Sicherheit, Compliance, Vertrauen',
            'security.subtitle': 'Jede Überweisung ist mit Bankstandard-Verschlüsselung, strenger Überwachung und mehrschichtiger Betrugsprävention geschützt.',
            'security.f1Title': '✓ Verifizierte Überweisungen',
            'security.f1Body': 'Jede Transaktion wird geprüft und mit modernen Standards verschlüsselt.',
            'security.f2Title': '🌐 Globale Abdeckung',
            'security.f2Body': 'Grenzüberschreitender Support mit lokalen Auszahlungsoptionen, wo verfügbar.',
            'security.f3Title': '🔐 Datenschutz & Kontrolle',
            'security.f3Body': 'Rollenbasierter Zugriff, sichere Authentifizierung und vollständige Audit-Trails.',

            'cta.title': 'Bereit, Geld über Grenzen hinweg zu bewegen?',
            'cta.subtitle': 'Erstellen Sie eine PRAC Wallet und senden Sie sofort – im ersten Monat ohne Gebühren.',
            'cta.button': 'Loslegen – kostenlos →',

            'footer.brand': 'PRAC — Bezahlen • Empfangen • Wechseln',
            'footer.security': 'Sicherheit',
            'footer.support': 'Support',
            'footer.rates': 'Kurse'
        },

        fr: {
            'nav.features': 'Fonctionnalités',
            'nav.live': 'Taux en direct',
            'nav.usecases': 'Cas d\'usage',
            'nav.security': 'Sécurité',
            'nav.login': 'Connexion',
            'nav.getStarted': 'Commencer',
            'hero.pill': '⚡ Taux de change réels et transparents',
            'hero.title': 'L\'argent sans frontières <span class="accent">en toute simplicité</span>',
            'hero.lead': 'PRAC unifie l\'envoi, la réception et la conversion d\'argent dans un portefeuille mondial sécurisé.',
            'hero.primaryCta': 'Créer votre portefeuille →',
            'hero.secondaryCta': 'Explorer les fonctionnalités',
            'hero.statSpeedLabel': 'Vitesse',
            'hero.statSpeedValue': 'Instantané',
            'hero.statCurrenciesLabel': 'Devises',
            'hero.statCurrenciesValue': '50+ portefeuilles',
            'hero.statFeesLabel': 'Frais',
            'hero.statFeesValue': 'Transparents',
            'card.title': 'Portefeuille PRAC',
            'card.subtitle': 'USD • Principal',
            'card.balanceLabel': 'Solde',
            'card.fxLabel': 'Taux FX',
            'card.recent': 'Récent : Reçu 500 USD • Envoyé 200 USD',
            'card.footer': '⚡ Virements instantanés',
            'card.send': 'Envoyer',
            'card.receive': 'Recevoir',
            'onewallet.title': 'Un portefeuille. Toutes les frontières.',
            'onewallet.subtitle': 'Déplacez de l\'argent à la vitesse d\'Internet avec une plateforme plus rapide que les banques.',
            'onewallet.f1Title': '⚡ Instantané PRAC-à-PRAC',
            'onewallet.f1Body': 'Envoyez et recevez de l\'argent dans le monde entier en quelques secondes.',
            'onewallet.f2Title': '🔒 Sécurité par conception',
            'onewallet.f2Body': 'Chiffrement, détection de fraude et gestion des litiges protègent vos fonds 24/7.',
            'onewallet.f3Title': '💱 Conversion en temps réel',
            'onewallet.f3Body': 'Taux FX en direct avec transparence totale des prix.',
            'features.title': 'Fonctionnalités conçues pour vous',
            'features.f1Title': '🚀 Virements rapides',
            'features.f1Body': 'Déplacez de l\'argent à l\'international en quelques secondes.',
            'features.f2Title': '🌍 Portefeuilles multiples',
            'features.f2Body': 'Détenez des soldes dans plus de 50 devises.',
            'features.f3Title': '💎 Frais transparents',
            'features.f3Body': 'Pas de frais cachés — voyez le taux et les frais avant d\'envoyer.',
            'live.title': 'Taux de change en direct',
            'live.subtitle': 'Taux de change mis à jour en temps réel.',
            'live.updated': 'Mis à jour en direct',
            'usecases.title': 'Conçu pour une vie sans frontières',
            'usecases.subtitle': 'Pour les freelances, voyageurs, et entreprises internationales.',
            'usecases.f1Title': '💼 Portefeuille multi-devises',
            'usecases.f1Body': 'Gérez des transactions dans plus de 50 devises.',
            'usecases.f2Title': '📊 Suivi en temps réel',
            'usecases.f2Body': 'Notifications instantanées et suivi des transactions.',
            'usecases.f3Title': '🏢 Outils professionnels',
            'usecases.f3Body': 'Facturez des clients mondiaux et soyez payé facilement.',
            'usecases.f4Title': '✈️ Pour les voyageurs',
            'usecases.f4Body': 'Convertissez des devises quand vous en avez besoin.',
            'usecases.f5Title': '💻 Travailleurs à distance',
            'usecases.f5Body': 'Recevez des salaires d\'employeurs étrangers facilement.',
            'usecases.f6Title': '🏭 Entreprises',
            'usecases.f6Body': 'Payez des fournisseurs dans le monde entier à faible coût.',
            'security.title': 'Sécurité, conformité, confiance',
            'security.subtitle': 'Chaque virement est protégé par un chiffrement bancaire.',
            'security.f1Title': '✓ Virements vérifiés',
            'security.f1Body': 'Chaque transaction est vérifiée et chiffrée.',
            'security.f2Title': '🌐 Couverture mondiale',
            'security.f2Body': 'Support transfrontalier avec options locales.',
            'security.f3Title': '🔐 Confidentialité & contrôles',
            'security.f3Body': 'Accès basé sur les rôles et authentification sécurisée.',
            'cta.title': 'Prêt à déplacer de l\'argent ?',
            'cta.subtitle': 'Créez un portefeuille PRAC et commencez à envoyer instantanément.',
            'cta.button': 'Commencer — c\'est gratuit →',
            'footer.brand': 'PRAC — Payer • Recevoir • Convertir',
            'footer.security': 'Sécurité',
            'footer.support': 'Support',
            'footer.rates': 'Taux'
        },
        it: {
            'nav.features': 'Funzionalità',
            'nav.live': 'Tassi live',
            'nav.usecases': 'Casi d\'uso',
            'nav.security': 'Sicurezza',
            'nav.login': 'Accedi',
            'nav.getStarted': 'Inizia',
            'hero.pill': '⚡ Tassi di cambio reali e trasparenti',
            'hero.title': 'Denaro senza confini <span class="accent">in semplicità</span>',
            'hero.lead': 'PRAC unifica invio, ricezione e conversione di denaro in un unico portafoglio globale sicuro.',
            'hero.primaryCta': 'Crea il tuo portafoglio →',
            'hero.secondaryCta': 'Esplora funzionalità',
            'hero.statSpeedLabel': 'Velocità',
            'hero.statSpeedValue': 'Istantaneo',
            'hero.statCurrenciesLabel': 'Valute',
            'hero.statCurrenciesValue': '50+ portafogli',
            'hero.statFeesLabel': 'Commissioni',
            'hero.statFeesValue': 'Trasparenti',
            'card.title': 'Portafoglio PRAC',
            'card.subtitle': 'USD • Principale',
            'card.balanceLabel': 'Saldo',
            'card.fxLabel': 'Tasso FX',
            'card.recent': 'Recenti: Ricevuti 500 USD • Inviati 200 USD',
            'card.footer': '⚡ Trasferimenti istantanei',
            'card.send': 'Invia',
            'card.receive': 'Ricevi',
            'onewallet.title': 'Un portafoglio. Ogni confine.',
            'onewallet.subtitle': 'Sposta denaro alla velocità di internet con una piattaforma più veloce delle banche.',
            'onewallet.f1Title': '⚡ Istantaneo PRAC-to-PRAC',
            'onewallet.f1Body': 'Invia e ricevi denaro in tutto il mondo in pochi secondi.',
            'onewallet.f2Title': '🔒 Sicurezza by design',
            'onewallet.f2Body': 'Crittografia e rilevamento frodi proteggono i tuoi fondi 24/7.',
            'onewallet.f3Title': '💱 Conversione in tempo reale',
            'onewallet.f3Body': 'Tassi FX live con totale trasparenza dei prezzi.',
            'features.title': 'Funzionalità costruite per te',
            'features.f1Title': '🚀 Trasferimenti veloci',
            'features.f1Body': 'Sposta denaro a livello internazionale in pochi secondi.',
            'features.f2Title': '🌍 Portafogli multipli',
            'features.f2Body': 'Mantieni saldi in oltre 50 valute.',
            'features.f3Title': '💎 Commissioni trasparenti',
            'features.f3Body': 'Nessun costo nascosto — vedi tassi e commissioni prima di inviare.',
            'live.title': 'Tassi di cambio live',
            'live.subtitle': 'Tassi valute aggiornati in tempo reale.',
            'live.updated': 'Aggiornato live',
            'usecases.title': 'Costruito per una vita senza confini',
            'usecases.subtitle': 'Per freelancer, viaggiatori e aziende globali.',
            'usecases.f1Title': '💼 Portafoglio multi-valuta',
            'usecases.f1Body': 'Gestisci transazioni in 50+ valute da un unico portafoglio.',
            'usecases.f2Title': '📊 Tracciamento in tempo reale',
            'usecases.f2Body': 'Notifiche istantanee e tracciamento delle transazioni.',
            'usecases.f3Title': '🏢 Strumenti aziendali',
            'usecases.f3Body': 'Fattura clienti globali e fatti pagare facilmente.',
            'usecases.f4Title': '✈️ Per viaggiatori',
            'usecases.f4Body': 'Converti valuta quando serve ed evita commissioni a sorpresa.',
            'usecases.f5Title': '💻 Lavoratori da remoto',
            'usecases.f5Body': 'Ricevi stipendi dall\'estero facilmente.',
            'usecases.f6Title': '🏭 Aziende',
            'usecases.f6Body': 'Paga fornitori in tutto il mondo a basso costo.',
            'security.title': 'Sicurezza, conformità, fiducia',
            'security.subtitle': 'Ogni trasferimento è protetto da crittografia bancaria.',
            'security.f1Title': '✓ Trasferimenti verificati',
            'security.f1Body': 'Ogni transazione è verificata e crittografata.',
            'security.f2Title': '🌐 Copertura globale',
            'security.f2Body': 'Supporto transfrontaliero con opzioni locali.',
            'security.f3Title': '🔐 Privacy & controlli',
            'security.f3Body': 'Accesso basato sui ruoli e autenticazione sicura.',
            'cta.title': 'Pronto a spostare denaro?',
            'cta.subtitle': 'Crea un portafoglio PRAC e inizia a inviare istantaneamente.',
            'cta.button': 'Inizia — è gratis →',
            'footer.brand': 'PRAC — Paga • Ricevi • Converti',
            'footer.security': 'Sicurezza',
            'footer.support': 'Supporto',
            'footer.rates': 'Tassi'
        },
        pt: {
            'nav.features': 'Funcionalidades',
            'nav.live': 'Taxas ao vivo',
            'nav.usecases': 'Casos de uso',
            'nav.security': 'Segurança',
            'nav.login': 'Entrar',
            'nav.getStarted': 'Começar',
            'hero.pill': '⚡ Taxas de câmbio reais e transparentes',
            'hero.title': 'Dinheiro sem fronteiras <span class="accent">simplificado</span>',
            'hero.lead': 'PRAC unifica envio, recebimento e conversão de dinheiro em uma carteira global segura.',
            'hero.primaryCta': 'Criar carteira →',
            'hero.secondaryCta': 'Explorar',
            'hero.statSpeedLabel': 'Velocidade',
            'hero.statSpeedValue': 'Instantâneo',
            'hero.statCurrenciesLabel': 'Moedas',
            'hero.statCurrenciesValue': '50+ carteiras',
            'hero.statFeesLabel': 'Taxas',
            'hero.statFeesValue': 'Transparentes',
            'card.title': 'Carteira PRAC',
            'card.subtitle': 'USD • Principal',
            'card.balanceLabel': 'Saldo',
            'card.fxLabel': 'Taxa FX',
            'card.recent': 'Recente: Recebido 500 USD • Enviado 200 USD',
            'card.footer': '⚡ Transferências instantâneas',
            'card.send': 'Enviar',
            'card.receive': 'Receber',
            'onewallet.title': 'Uma carteira. Todas as fronteiras.',
            'onewallet.subtitle': 'Mova dinheiro na velocidade da internet com uma plataforma mais rápida que bancos.',
            'onewallet.f1Title': '⚡ Instantâneo PRAC-a-PRAC',
            'onewallet.f1Body': 'Envie e receba dinheiro mundialmente em segundos.',
            'onewallet.f2Title': '🔒 Segurança por design',
            'onewallet.f2Body': 'Criptografia e detecção de fraude protegem seus fundos 24/7.',
            'onewallet.f3Title': '💱 Conversão em tempo real',
            'onewallet.f3Body': 'Taxas FX ao vivo com total transparência de preços.',
            'features.title': 'Funcionalidades para você',
            'features.f1Title': '🚀 Transferências rápidas',
            'features.f1Body': 'Mova dinheiro internacionalmente em segundos.',
            'features.f2Title': '🌍 Múltiplas carteiras',
            'features.f2Body': 'Mantenha saldos em mais de 50 moedas.',
            'features.f3Title': '💎 Taxas transparentes',
            'features.f3Body': 'Sem taxas ocultas — veja a taxa antes de enviar.',
            'live.title': 'Taxas de câmbio ao vivo',
            'live.subtitle': 'Taxas de moeda atualizadas em tempo real.',
            'live.updated': 'Atualizado ao vivo',
            'usecases.title': 'Feito para uma vida sem fronteiras',
            'usecases.subtitle': 'Para freelancers, viajantes e empresas globais.',
            'usecases.f1Title': '💼 Carteira multimoeda',
            'usecases.f1Body': 'Gerencie transações em 50+ moedas de uma só carteira.',
            'usecases.f2Title': '📊 Rastreamento em tempo real',
            'usecases.f2Body': 'Notificações instantâneas e rastreamento de transações.',
            'usecases.f3Title': '🏢 Ferramentas de negócios',
            'usecases.f3Body': 'Fature clientes globais e receba facilmente.',
            'usecases.f4Title': '✈️ Para viajantes',
            'usecases.f4Body': 'Converta moeda quando precisar e evite taxas surpresa.',
            'usecases.f5Title': '💻 Trabalhadores remotos',
            'usecases.f5Body': 'Receba salários de empregadores estrangeiros facilmente.',
            'usecases.f6Title': '🏭 Empresas',
            'usecases.f6Body': 'Pague fornecedores mundialmente com baixo custo.',
            'security.title': 'Segurança, conformidade, confiança',
            'security.subtitle': 'Cada transferência é protegida com criptografia bancária.',
            'security.f1Title': '✓ Transferências verificadas',
            'security.f1Body': 'Cada transação é verificada e criptografada.',
            'security.f2Title': '🌐 Cobertura global',
            'security.f2Body': 'Suporte transfronteiriço com opções locais.',
            'security.f3Title': '🔐 Privacidade & controles',
            'security.f3Body': 'Acesso baseado em funções e autenticação segura.',
            'cta.title': 'Pronto para mover dinheiro?',
            'cta.subtitle': 'Crie uma carteira PRAC e comece a enviar instantaneamente.',
            'cta.button': 'Começar — é grátis →',
            'footer.brand': 'PRAC — Pagar • Receber • Converter',
            'footer.security': 'Segurança',
            'footer.support': 'Suporte',
            'footer.rates': 'Taxas'
        },
        ru: {
            'nav.features': 'Функции',
            'nav.live': 'Курсы',
            'nav.usecases': 'Примеры',
            'nav.security': 'Безопасность',
            'nav.login': 'Войти',
            'nav.getStarted': 'Начать',
            'hero.pill': '⚡ Реальные курсы обмена',
            'hero.title': 'Деньги без границ <span class="accent">это просто</span>',
            'hero.lead': 'PRAC объединяет отправку, получение и конвертацию денег в одном безопасном кошельке.',
            'hero.primaryCta': 'Создать кошелек →',
            'hero.secondaryCta': 'Узнать больше',
            'hero.statSpeedLabel': 'Скорость',
            'hero.statSpeedValue': 'Мгновенно',
            'hero.statCurrenciesLabel': 'Валюты',
            'hero.statCurrenciesValue': '50+ кошельков',
            'hero.statFeesLabel': 'Комиссии',
            'hero.statFeesValue': 'Прозрачные',
            'card.title': 'Кошелек PRAC',
            'card.subtitle': 'USD • Основной',
            'card.balanceLabel': 'Баланс',
            'card.fxLabel': 'Курс',
            'card.recent': 'Недавно: Получено 500 USD • Отправлено 200 USD',
            'card.footer': '⚡ Мгновенные переводы',
            'card.send': 'Отправить',
            'card.receive': 'Получить',
            'onewallet.title': 'Один кошелек. Все границы.',
            'onewallet.subtitle': 'Перемещайте деньги со скоростью интернета с платформой быстрее банков.',
            'onewallet.f1Title': '⚡ Мгновенно PRAC-to-PRAC',
            'onewallet.f1Body': 'Отправляйте и получайте деньги по всему миру за секунды.',
            'onewallet.f2Title': '🔒 Безопасность',
            'onewallet.f2Body': 'Шифрование и обнаружение мошенничества защищают ваши средства 24/7.',
            'onewallet.f3Title': '💱 Конвертация в реальном времени',
            'onewallet.f3Body': 'Живые курсы валют с полной прозрачностью цен.',
            'features.title': 'Функции для вас',
            'features.f1Title': '🚀 Быстрые переводы',
            'features.f1Body': 'Перемещайте деньги за границу за секунды.',
            'features.f2Title': '🌍 Мультивалютность',
            'features.f2Body': 'Держите балансы в 50+ валютах.',
            'features.f3Title': '💎 Прозрачные комиссии',
            'features.f3Body': 'Никаких скрытых комиссий — смотрите курс перед отправкой.',
            'live.title': 'Живые курсы обмена',
            'live.subtitle': 'Курсы валют обновляются в реальном времени.',
            'live.updated': 'Обновлено сейчас',
            'usecases.title': 'Создано для жизни без границ',
            'usecases.subtitle': 'Для фрилансеров, путешественников и глобальных компаний.',
            'usecases.f1Title': '💼 Мультивалютный кошелек',
            'usecases.f1Body': 'Управляйте транзакциями в 50+ валютах.',
            'usecases.f2Title': '📊 Отслеживание',
            'usecases.f2Body': 'Мгновенные уведомления и отслеживание транзакций.',
            'usecases.f3Title': '🏢 Инструменты для бизнеса',
            'usecases.f3Body': 'Выставляйте счета клиентам и получайте оплату легко.',
            'usecases.f4Title': '✈️ Для путешественников',
            'usecases.f4Body': 'Конвертируйте валюту по необходимости.',
            'usecases.f5Title': '💻 Удаленная работа',
            'usecases.f5Body': 'Получайте зарплату от иностранных работодателей.',
            'usecases.f6Title': '🏭 Компании',
            'usecases.f6Body': 'Платите поставщикам по всему миру с низкими издержками.',
            'security.title': 'Безопасность и доверие',
            'security.subtitle': 'Каждый перевод защищен банковским шифрованием.',
            'security.f1Title': '✓ Проверенные переводы',
            'security.f1Body': 'Каждая транзакция проверяется и шифруется.',
            'security.f2Title': '🌐 Глобальное покрытие',
            'security.f2Body': 'Международная поддержка с локальными опциями.',
            'security.f3Title': '🔐 Приватность',
            'security.f3Body': 'Ролевой доступ и безопасная аутентификация.',
            'cta.title': 'Готовы перемещать деньги?',
            'cta.subtitle': 'Создайте кошелек PRAC и начните отправлять мгновенно.',
            'cta.button': 'Начать — бесплатно →',
            'footer.brand': 'PRAC — Плати • Получай • Конвертируй',
            'footer.security': 'Безопасность',
            'footer.support': 'Поддержка',
            'footer.rates': 'Курсы'
        },
        zh: {
            'nav.features': '功能',
            'nav.live': '实时汇率',
            'nav.usecases': '用例',
            'nav.security': '安全',
            'nav.login': '登录',
            'nav.getStarted': '开始',
            'hero.pill': '⚡ 实时透明汇率',
            'hero.title': '无国界资金 <span class="accent">变得简单</span>',
            'hero.lead': 'PRAC 将汇款、收款和兑换统一在一个安全的全球钱包中。即时转账，实时汇率，价格透明。',
            'hero.primaryCta': '创建钱包 →',
            'hero.secondaryCta': '探索功能',
            'hero.statSpeedLabel': '转账速度',
            'hero.statSpeedValue': '即时',
            'hero.statCurrenciesLabel': '货币',
            'hero.statCurrenciesValue': '50+ 钱包',
            'hero.statFeesLabel': '费用',
            'hero.statFeesValue': '透明',
            'card.title': 'PRAC 钱包',
            'card.subtitle': 'USD • 主账户',
            'card.balanceLabel': '余额',
            'card.fxLabel': '汇率',
            'card.recent': '最近：收到 500 USD • 发送 200 USD',
            'card.footer': '⚡ 即时转账',
            'card.send': '发送',
            'card.receive': '接收',
            'onewallet.title': '一个钱包。所有边界。',
            'onewallet.subtitle': '以互联网的速度转移资金，比银行更快，比兑换店更便宜。',
            'onewallet.f1Title': '⚡ 即时 PRAC 转账',
            'onewallet.f1Body': '几秒钟内在全球范围内发送和接收资金。',
            'onewallet.f2Title': '🔒 安全设计',
            'onewallet.f2Body': '加密和欺诈检测全天候保护您的资金。',
            'onewallet.f3Title': '💱 实时兑换',
            'onewallet.f3Body': '实时汇率，价格完全透明。',
            'features.title': '为您打造的功能',
            'features.f1Title': '🚀 快速转账',
            'features.f1Body': '以具有竞争力的汇率在几秒钟内进行国际汇款。',
            'features.f2Title': '🌍 多币种钱包',
            'features.f2Body': '持有 50 多种货币的余额。',
            'features.f3Title': '💎 透明费用',
            'features.f3Body': '无隐藏费用 — 发送前查看汇率和费用。',
            'live.title': '实时汇率',
            'live.subtitle': '货币汇率实时更新。',
            'live.updated': '实时更新',
            'usecases.title': '为无国界生活而生',
            'usecases.subtitle': '适用于自由职业者、旅行者和全球企业。',
            'usecases.f1Title': '💼 多币种钱包',
            'usecases.f1Body': '从一个全球钱包管理 50 多种货币的交易。',
            'usecases.f2Title': '📊 实时追踪',
            'usecases.f2Body': '即时通知和交易追踪。',
            'usecases.f3Title': '🏢 商业工具',
            'usecases.f3Body': '向全球客户开具发票并轻松收款。',
            'usecases.f4Title': '✈️ 对于旅行者',
            'usecases.f4Body': '在需要时兑换货币，避免意外费用。',
            'usecases.f5Title': '💻 远程工作者',
            'usecases.f5Body': '轻松接收外国雇主的工资。',
            'usecases.f6Title': '🏭 企业',
            'usecases.f6Body': '以低成本向全球供应商付款。',
            'security.title': '安全、合规、信任',
            'security.subtitle': '每笔转账都受到银行级加密的保护。',
            'security.f1Title': '✓ 验证转账',
            'security.f1Body': '每笔交易都经过验证和加密。',
            'security.f2Title': '🌐 全球覆盖',
            'security.f2Body': '跨境支持和本地支付选项。',
            'security.f3Title': '🔐 隐私与控制',
            'security.f3Body': '基于角色的访问和安全认证。',
            'cta.title': '准备好转移资金了吗？',
            'cta.subtitle': '创建 PRAC 钱包并立即开始发送。',
            'cta.button': '开始 — 免费 →',
            'footer.brand': 'PRAC — 支付 • 接收 • 兑换',
            'footer.security': '安全',
            'footer.support': '支持',
            'footer.rates': '汇率'
        },
        ja: {
            'nav.features': '機能',
            'nav.live': 'ライブレート',
            'nav.usecases': '使用例',
            'nav.security': 'セキュリティ',
            'nav.login': 'ログイン',
            'nav.getStarted': '始める',
            'hero.pill': '⚡ リアルタイムで透明な為替レート',
            'hero.title': '国境のないお金 <span class="accent">シンプルに</span>',
            'hero.lead': 'PRACは、送金、受取、両替を1つの安全なグローバルウォレットに統合します。',
            'hero.primaryCta': 'ウォレットを作成 →',
            'hero.secondaryCta': '機能を見る',
            'hero.statSpeedLabel': '送金速度',
            'hero.statSpeedValue': '即時',
            'hero.statCurrenciesLabel': '通貨',
            'hero.statCurrenciesValue': '50+ ウォレット',
            'hero.statFeesLabel': '手数料',
            'hero.statFeesValue': '透明',
            'card.title': 'PRAC ウォレット',
            'card.subtitle': 'USD • メイン',
            'card.balanceLabel': '残高',
            'card.fxLabel': 'レート',
            'card.recent': '最近: 受取 500 USD • 送金 200 USD',
            'card.footer': '⚡ 即時送金',
            'card.send': '送る',
            'card.receive': '受け取る',
            'onewallet.title': '1つのウォレット。全ての国境。',
            'onewallet.subtitle': '銀行よりも速く、両替所よりも安く、インターネットの速度でお金を移動します。',
            'onewallet.f1Title': '⚡ 即時 PRAC間送金',
            'onewallet.f1Body': '数秒で世界中に送金・受取が可能です。',
            'onewallet.f2Title': '🔒 設計されたセキュリティ',
            'onewallet.f2Body': '暗号化と不正検知が24時間365日資金を守ります。',
            'onewallet.f3Title': '💱 リアルタイム両替',
            'onewallet.f3Body': '完全な価格透明性を備えたライブ為替レート。',
            'features.title': 'あなたのための機能',
            'features.f1Title': '🚀 高速送金',
            'features.f1Body': '競争力のあるレートで数秒で国際送金。',
            'features.f2Title': '🌍 複数通貨ウォレット',
            'features.f2Body': '50以上の通貨で残高を保有。',
            'features.f3Title': '💎 透明な手数料',
            'features.f3Body': '隠れた手数料なし — 送金前にレートと手数料を確認。',
            'live.title': 'ライブ為替レート',
            'live.subtitle': 'リアルタイムで更新される通貨レート。',
            'live.updated': 'ライブ更新',
            'usecases.title': '国境のない生活のために',
            'usecases.subtitle': 'フリーランサー、旅行者、グローバル企業向け。',
            'usecases.f1Title': '💼 多通貨ウォレット',
            'usecases.f1Body': '1つのウォレットで50以上の通貨を管理。',
            'usecases.f2Title': '📊 リアルタイム追跡',
            'usecases.f2Body': '即時通知と取引追跡。',
            'usecases.f3Title': '🏢 ビジネスツール',
            'usecases.f3Body': 'グローバルな顧客に請求し、簡単に支払いを受け取る。',
            'usecases.f4Title': '✈️ 旅行者向け',
            'usecases.f4Body': '必要な時に通貨を両替し、予期せぬ手数料を回避。',
            'usecases.f5Title': '💻 リモートワーカー',
            'usecases.f5Body': '海外の雇用主からの給与を簡単に受け取る。',
            'usecases.f6Title': '🏭 企業',
            'usecases.f6Body': '低コストで世界中のサプライヤーに支払い。',
            'security.title': 'セキュリティ、コンプライアンス、信頼',
            'security.subtitle': 'すべての送金は銀行レベルの暗号化で保護されています。',
            'security.f1Title': '✓ 検証済み送金',
            'security.f1Body': 'すべての取引は検証され、暗号化されます。',
            'security.f2Title': '🌐 グローバルカバレッジ',
            'security.f2Body': 'ローカル支払いオプションを備えたクロスボーダーサポート。',
            'security.f3Title': '🔐 プライバシーと管理',
            'security.f3Body': 'ロールベースのアクセスと安全な認証。',
            'cta.title': 'お金を移動する準備はできましたか？',
            'cta.subtitle': 'PRACウォレットを作成して、即座に送金を開始しましょう。',
            'cta.button': '始める — 無料です →',
            'footer.brand': 'PRAC — 支払う • 受け取る • 両替',
            'footer.security': 'セキュリティ',
            'footer.support': 'サポート',
            'footer.rates': 'レート'
        },
        ko: {
            'nav.features': '기능',
            'nav.live': '실시간 환율',
            'nav.usecases': '사용 사례',
            'nav.security': '보안',
            'nav.login': '로그인',
            'nav.getStarted': '시작하기',
            'hero.pill': '⚡ 투명한 실시간 환율',
            'hero.title': '국경 없는 금융 <span class="accent">간편하게</span>',
            'hero.lead': 'PRAC은 송금, 수취 및 환전을 하나의 안전한 글로벌 지갑으로 통합합니다.',
            'hero.primaryCta': '지갑 만들기 →',
            'hero.secondaryCta': '기능 살펴보기',
            'hero.statSpeedLabel': '전송 속도',
            'hero.statSpeedValue': '즉시',
            'hero.statCurrenciesLabel': '통화',
            'hero.statCurrenciesValue': '50+ 지갑',
            'hero.statFeesLabel': '수수료',
            'hero.statFeesValue': '투명함',
            'card.title': 'PRAC 지갑',
            'card.subtitle': 'USD • 기본',
            'card.balanceLabel': '잔액',
            'card.fxLabel': '환율',
            'card.recent': '최근: 수신 500 USD • 발신 200 USD',
            'card.footer': '⚡ 즉시 이체',
            'card.send': '보내기',
            'card.receive': '받기',
            'onewallet.title': '하나의 지갑. 모든 국경.',
            'onewallet.subtitle': '은행보다 빠르고 환전소보다 저렴하게 인터넷 속도로 돈을 이동하세요.',
            'onewallet.f1Title': '⚡ 즉시 PRAC 간 이체',
            'onewallet.f1Body': '전 세계 어디서나 몇 초 만에 송금하고 받을 수 있습니다.',
            'onewallet.f2Title': '🔒 설계된 보안',
            'onewallet.f2Body': '암호화 및 사기 탐지로 자금을 24/7 보호합니다.',
            'onewallet.f3Title': '💱 실시간 환전',
            'onewallet.f3Body': '완전한 가격 투명성을 갖춘 실시간 환율.',
            'features.title': '당신을 위한 기능',
            'features.f1Title': '🚀 빠른 송금',
            'features.f1Body': '경쟁력 있는 환율로 몇 초 만에 해외 송금.',
            'features.f2Title': '🌍 다중 통화 지갑',
            'features.f2Body': '50개 이상의 통화로 잔액 보유.',
            'features.f3Title': '💎 투명한 수수료',
            'features.f3Body': '숨겨진 수수료 없음 — 보내기 전에 환율과 수수료 확인.',
            'live.title': '실시간 환율',
            'live.subtitle': '실시간으로 업데이트되는 통화 환율.',
            'live.updated': '실시간 업데이트',
            'usecases.title': '국경 없는 삶을 위해',
            'usecases.subtitle': '프리랜서, 여행자 및 글로벌 기업을 위해.',
            'usecases.f1Title': '💼 다중 통화 지갑',
            'usecases.f1Body': '하나의 지갑에서 50개 이상의 통화 거래 관리.',
            'usecases.f2Title': '📊 실시간 추적',
            'usecases.f2Body': '즉시 알림 및 거래 추적.',
            'usecases.f3Title': '🏢 비즈니스 도구',
            'usecases.f3Body': '글로벌 고객에게 청구하고 쉽게 대금 수령.',
            'usecases.f4Title': '✈️ 여행자용',
            'usecases.f4Body': '필요할 때 환전하고 예상치 못한 수수료 방지.',
            'usecases.f5Title': '💻 원격 근무자',
            'usecases.f5Body': '해외 고용주로부터 급여를 쉽게 수령.',
            'usecases.f6Title': '🏭 기업',
            'usecases.f6Body': '저렴한 비용으로 전 세계 공급업체에 지불.',
            'security.title': '보안, 규정 준수, 신뢰',
            'security.subtitle': '모든 이체는 은행 수준의 암호화로 보호됩니다.',
            'security.f1Title': '✓ 검증된 이체',
            'security.f1Body': '모든 거래는 검증되고 암호화됩니다.',
            'security.f2Title': '🌐 글로벌 커버리지',
            'security.f2Body': '현지 지불 옵션이 있는 국경 간 지원.',
            'security.f3Title': '🔐 개인정보 및 제어',
            'security.f3Body': '역할 기반 액세스 및 보안 인증.',
            'cta.title': '돈을 이동할 준비가 되셨나요?',
            'cta.subtitle': 'PRAC 지갑을 만들고 즉시 송금을 시작하세요.',
            'cta.button': '시작하기 — 무료입니다 →',
            'footer.brand': 'PRAC — 지불 • 수취 • 환전',
            'footer.security': '보안',
            'footer.support': '지원',
            'footer.rates': '환율'
        },
        nl: {
            'nav.features': 'Functies',
            'nav.live': 'Live koersen',
            'nav.usecases': 'Toepassingen',
            'nav.security': 'Beveiliging',
            'nav.login': 'Inloggen',
            'nav.getStarted': 'Beginnen',
            'hero.pill': '⚡ Real-time en transparante wisselkoersen',
            'hero.title': 'Geld zonder grenzen <span class="accent">eenvoudig gemaakt</span>',
            'hero.lead': 'PRAC verenigt verzenden, ontvangen en omwisselen van geld in één veilige, wereldwijde portemonnee.',
            'hero.primaryCta': 'Maak je portemonnee →',
            'hero.secondaryCta': 'Ontdek functies',
            'hero.statSpeedLabel': 'Snelheid',
            'hero.statSpeedValue': 'Direct',
            'hero.statCurrenciesLabel': 'Valuta\'s',
            'hero.statCurrenciesValue': '50+ portemonnees',
            'hero.statFeesLabel': 'Kosten',
            'hero.statFeesValue': 'Transparant',
            'card.title': 'PRAC Portemonnee',
            'card.subtitle': 'USD • Primair',
            'card.balanceLabel': 'Saldo',
            'card.fxLabel': 'Wisselkoers',
            'card.recent': 'Recent: Ontvangen 500 USD • Verzonden 200 USD',
            'card.footer': '⚡ Directe overschrijvingen',
            'card.send': 'Verzenden',
            'card.receive': 'Ontvangen',
            'onewallet.title': 'Eén portemonnee. Alle grenzen.',
            'onewallet.subtitle': 'Verplaats geld met de snelheid van het internet met een platform dat sneller is dan banken.',
            'onewallet.f1Title': '⚡ Direct PRAC-naar-PRAC',
            'onewallet.f1Body': 'Verzend en ontvang wereldwijd geld in seconden.',
            'onewallet.f2Title': '🔒 Veiligheid door ontwerp',
            'onewallet.f2Body': 'Versleuteling en fraudedetectie beschermen uw geld 24/7.',
            'onewallet.f3Title': '💱 Real-time conversie',
            'onewallet.f3Body': 'Live wisselkoersen met volledige prijstransparantie.',
            'features.title': 'Functies voor jou gebouwd',
            'features.f1Title': '🚀 Snelle overschrijvingen',
            'features.f1Body': 'Verplaats internationaal geld in seconden.',
            'features.f2Title': '🌍 Meerdere portemonnees',
            'features.f2Body': 'Houd saldo\'s aan in meer dan 50 valuta\'s.',
            'features.f3Title': '💎 Transparante kosten',
            'features.f3Body': 'Geen verborgen kosten — zie de koers en kosten voordat je verzendt.',
            'live.title': 'Live wisselkoersen',
            'live.subtitle': 'Valutakoersen real-time bijgewerkt.',
            'live.updated': 'Live bijgewerkt',
            'usecases.title': 'Gebouwd voor een leven zonder grenzen',
            'usecases.subtitle': 'Voor freelancers, reizigers en wereldwijde bedrijven.',
            'usecases.f1Title': '💼 Multi-valuta portemonnee',
            'usecases.f1Body': 'Beheer transacties in 50+ valuta\'s vanuit één portemonnee.',
            'usecases.f2Title': '📊 Real-time tracking',
            'usecases.f2Body': 'Directe meldingen en transactietracking.',
            'usecases.f3Title': '🏢 Zakelijke tools',
            'usecases.f3Body': 'Factureer wereldwijde klanten en word gemakkelijk betaald.',
            'usecases.f4Title': '✈️ Voor reizigers',
            'usecases.f4Body': 'Wissel valuta wanneer nodig en vermijd onverwachte kosten.',
            'usecases.f5Title': '💻 Externe werknemers',
            'usecases.f5Body': 'Ontvang gemakkelijk salarissen van buitenlandse werkgevers.',
            'usecases.f6Title': '🏭 Bedrijven',
            'usecases.f6Body': 'Betaal leveranciers wereldwijd tegen lage kosten.',
            'security.title': 'Beveiliging, naleving, vertrouwen',
            'security.subtitle': 'Elke overschrijving is beveiligd met versleuteling van bankniveau.',
            'security.f1Title': '✓ Geverifieerde overschrijvingen',
            'security.f1Body': 'Elke transactie wordt geverifieerd en versleuteld.',
            'security.f2Title': '🌐 Wereldwijde dekking',
            'security.f2Body': 'Grensoverschrijdende ondersteuning met lokale opties.',
            'security.f3Title': '🔐 Privacy & controles',
            'security.f3Body': 'Toegang op basis van rollen en veilige authenticatie.',
            'cta.title': 'Klaar om geld te verplaatsen?',
            'cta.subtitle': 'Maak een PRAC-portemonnee en begin direct met verzenden.',
            'cta.button': 'Beginnen — het is gratis →',
            'footer.brand': 'PRAC — Betalen • Ontvangen • Converteren',
            'footer.security': 'Beveiliging',
            'footer.support': 'Ondersteuning',
            'footer.rates': 'Koersen'
        },
        pl: {
            'nav.features': 'Funkcje',
            'nav.live': 'Kursy na żywo',
            'nav.usecases': 'Zastosowania',
            'nav.security': 'Bezpieczeństwo',
            'nav.login': 'Zaloguj',
            'nav.getStarted': 'Zacznij',
            'hero.pill': '⚡ Rzeczywiste i przejrzyste kursy wymiany',
            'hero.title': 'Pieniądze bez granic <span class="accent">prosto</span>',
            'hero.lead': 'PRAC łączy wysyłanie, otrzymywanie i wymianę pieniędzy w jednym bezpiecznym portfelu.',
            'hero.primaryCta': 'Utwórz portfel →',
            'hero.secondaryCta': 'Poznaj funkcje',
            'hero.statSpeedLabel': 'Prędkość',
            'hero.statSpeedValue': 'Natychmiast',
            'hero.statCurrenciesLabel': 'Waluty',
            'hero.statCurrenciesValue': '50+ portfeli',
            'hero.statFeesLabel': 'Opłaty',
            'hero.statFeesValue': 'Przejrzyste',
            'card.title': 'Portfel PRAC',
            'card.subtitle': 'USD • Główny',
            'card.balanceLabel': 'Saldo',
            'card.fxLabel': 'Kurs FX',
            'card.recent': 'Ostatnie: Otrzymano 500 USD • Wysłano 200 USD',
            'card.footer': '⚡ Natychmiastowe przelewy',
            'card.send': 'Wyślij',
            'card.receive': 'Odbierz',
            'onewallet.title': 'Jeden portfel. Wszystkie granice.',
            'onewallet.subtitle': 'Przesyłaj pieniądze z prędkością internetu dzięki platformie szybszej niż banki.',
            'onewallet.f1Title': '⚡ Natychmiastowo PRAC-do-PRAC',
            'onewallet.f1Body': 'Wysyłaj i odbieraj pieniądze na całym świecie w kilka sekund.',
            'onewallet.f2Title': '🔒 Bezpieczeństwo z założenia',
            'onewallet.f2Body': 'Szyfrowanie i wykrywanie oszustw chronią Twoje środki 24/7.',
            'onewallet.f3Title': '💱 Wymiana w czasie rzeczywistym',
            'onewallet.f3Body': 'Kursy FX na żywo z pełną przejrzystością cen.',
            'features.title': 'Funkcje stworzone dla Ciebie',
            'features.f1Title': '🚀 Szybkie przelewy',
            'features.f1Body': 'Przesyłaj pieniądze za granicę w kilka sekund.',
            'features.f2Title': '🌍 Wiele portfeli',
            'features.f2Body': 'Trzymaj salda w ponad 50 walutach.',
            'features.f3Title': '💎 Przejrzyste opłaty',
            'features.f3Body': 'Brak ukrytych opłat — zobacz kurs i opłaty przed wysłaniem.',
            'live.title': 'Kursy wymiany na żywo',
            'live.subtitle': 'Kursy walut aktualizowane w czasie rzeczywistym.',
            'live.updated': 'Aktualizowane na żywo',
            'usecases.title': 'Stworzone do życia bez granic',
            'usecases.subtitle': 'Dla freelancerów, podróżników i globalnych firm.',
            'usecases.f1Title': '💼 Portfel wielowalutowy',
            'usecases.f1Body': 'Zarządzaj transakcjami w 50+ walutach z jednego portfela.',
            'usecases.f2Title': '📊 Śledzenie w czasie rzeczywistym',
            'usecases.f2Body': 'Natychmiastowe powiadomienia i śledzenie transakcji.',
            'usecases.f3Title': '🏢 Narzędzia biznesowe',
            'usecases.f3Body': 'Wystawiaj faktury globalnym klientom i łatwo otrzymuj płatności.',
            'usecases.f4Title': '✈️ Dla podróżników',
            'usecases.f4Body': 'Wymieniaj walutę, gdy potrzebujesz i unikaj niespodziewanych opłat.',
            'usecases.f5Title': '💻 Pracownicy zdalni',
            'usecases.f5Body': 'Łatwo otrzymuj wynagrodzenia od zagranicznych pracodawców.',
            'usecases.f6Title': '🏭 Firmy',
            'usecases.f6Body': 'Płać dostawcom na całym świecie przy niskich kosztach.',
            'security.title': 'Bezpieczeństwo, zgodność, zaufanie',
            'security.subtitle': 'Każdy przelew jest chroniony szyfrowaniem klasy bankowej.',
            'security.f1Title': '✓ Zweryfikowane przelewy',
            'security.f1Body': 'Każda transakcja jest weryfikowana i szyfrowana.',
            'security.f2Title': '🌐 Globalny zasięg',
            'security.f2Body': 'Wsparcie transgraniczne z lokalnymi opcjami.',
            'security.f3Title': '🔐 Prywatność i kontrola',
            'security.f3Body': 'Dostęp oparty na rolach i bezpieczne uwierzytelnianie.',
            'cta.title': 'Gotowy na przesyłanie pieniędzy?',
            'cta.subtitle': 'Utwórz portfel PRAC i zacznij wysyłać natychmiast.',
            'cta.button': 'Zacznij — za darmo →',
            'footer.brand': 'PRAC — Płać • Odbieraj • Wymieniaj',
            'footer.security': 'Bezpieczeństwo',
            'footer.support': 'Wsparcie',
            'footer.rates': 'Kursy'
        },
        tr: {
            'nav.features': 'Özellikler',
            'nav.live': 'Canlı kurlar',
            'nav.usecases': 'Kullanım',
            'nav.security': 'Güvenlik',
            'nav.login': 'Giriş',
            'nav.getStarted': 'Başla',
            'hero.pill': '⚡ Gerçek zamanlı ve şeffaf döviz kurları',
            'hero.title': 'Sınırsız para <span class="accent">basitleştirildi</span>',
            'hero.lead': 'PRAC, para gönderme, alma ve dönüştürme işlemlerini tek bir güvenli küresel cüzdanda birleştirir.',
            'hero.primaryCta': 'Cüzdan oluştur →',
            'hero.secondaryCta': 'Özellikleri keşfet',
            'hero.statSpeedLabel': 'Hız',
            'hero.statSpeedValue': 'Anında',
            'hero.statCurrenciesLabel': 'Para Birimleri',
            'hero.statCurrenciesValue': '50+ cüzdan',
            'hero.statFeesLabel': 'Ücretler',
            'hero.statFeesValue': 'Şeffaf',
            'card.title': 'PRAC Cüzdan',
            'card.subtitle': 'USD • Birincil',
            'card.balanceLabel': 'Bakiye',
            'card.fxLabel': 'FX kuru',
            'card.recent': 'Son: 500 USD Alındı • 200 USD Gönderildi',
            'card.footer': '⚡ Anında transferler',
            'card.send': 'Gönder',
            'card.receive': 'Al',
            'onewallet.title': 'Tek cüzdan. Tüm sınırlar.',
            'onewallet.subtitle': 'Parayı internet hızında, bankalardan daha hızlı bir platformla taşıyın.',
            'onewallet.f1Title': '⚡ Anında PRAC\'tan PRAC\'a',
            'onewallet.f1Body': 'Saniyeler içinde dünya çapında para gönderin ve alın.',
            'onewallet.f2Title': '🔒 Tasarımla güvenlik',
            'onewallet.f2Body': 'Şifreleme ve dolandırıcılık tespiti fonlarınızı 7/24 korur.',
            'onewallet.f3Title': '💱 Gerçek zamanlı dönüşüm',
            'onewallet.f3Body': 'Tam fiyat şeffaflığı ile canlı FX kurları.',
            'features.title': 'Sizin için oluşturulan özellikler',
            'features.f1Title': '🚀 Hızlı Transferler',
            'features.f1Body': 'Rekabetçi kurlarla saniyeler içinde uluslararası para taşıyın.',
            'features.f2Title': '🌍 Çoklu Cüzdanlar',
            'features.f2Body': '50\'den fazla para biriminde bakiye tutun.',
            'features.f3Title': '💎 Şeffaf Ücretler',
            'features.f3Body': 'Gizli ücret yok — göndermeden önce kuru ve ücretleri görün.',
            'live.title': 'Canlı döviz kurları',
            'live.subtitle': 'Gerçek zamanlı güncellenen döviz kurları.',
            'live.updated': 'Canlı güncellendi',
            'usecases.title': 'Sınırsız yaşam için',
            'usecases.subtitle': 'Freelancerlar, gezginler ve küresel işletmeler için.',
            'usecases.f1Title': '💼 Çoklu para birimi cüzdanı',
            'usecases.f1Body': 'Tek bir küresel cüzdandan 50+ para biriminde işlem yönetin.',
            'usecases.f2Title': '📊 Gerçek zamanlı takip',
            'usecases.f2Body': 'Anlık bildirimler ve işlem takibi.',
            'usecases.f3Title': '🏢 İş araçları',
            'usecases.f3Body': 'Küresel müşterilere fatura kesin ve kolayca ödeme alın.',
            'usecases.f4Title': '✈️ Gezginler için',
            'usecases.f4Body': 'İhtiyacınız olduğunda para birimi dönüştürün.',
            'usecases.f5Title': '💻 Uzaktan Çalışanlar',
            'usecases.f5Body': 'Yabancı işverenlerden maaşları kolayca alın.',
            'usecases.f6Title': '🏭 İşletmeler',
            'usecases.f6Body': 'Tedarikçilere düşük maliyetle dünya çapında ödeme yapın.',
            'security.title': 'Güvenlik, uyumluluk, güven',
            'security.subtitle': 'Her transfer banka düzeyinde şifreleme ile korunmaktadır.',
            'security.f1Title': '✓ Doğrulanmış transferler',
            'security.f1Body': 'Her işlem doğrulanır ve şifrelenir.',
            'security.f2Title': '🌐 Küresel kapsam',
            'security.f2Body': 'Yerel ödeme seçenekleri ile sınır ötesi destek.',
            'security.f3Title': '🔐 Gizlilik ve kontroller',
            'security.f3Body': 'Rol tabanlı erişim ve güvenli kimlik doğrulama.',
            'cta.title': 'Para taşımaya hazır mısınız?',
            'cta.subtitle': 'Bir PRAC cüzdanı oluşturun ve anında göndermeye başlayın.',
            'cta.button': 'Başla — ücretsiz →',
            'footer.brand': 'PRAC — Öde • Al • Dönüştür',
            'footer.security': 'Güvenlik',
            'footer.support': 'Destek',
            'footer.rates': 'Kurlar'
        },
        hi: {
            'nav.features': 'सुविधाएँ',
            'nav.live': 'लाइव दरें',
            'nav.usecases': 'उपयोग',
            'nav.security': 'सुरक्षा',
            'nav.login': 'लॉग इन',
            'nav.getStarted': 'शुरू करें',
            'hero.pill': '⚡ वास्तविक समय और पारदर्शी विनिमय दरें',
            'hero.title': 'सीमाहीन पैसा <span class="accent">सरल बनाया</span>',
            'hero.lead': 'PRAC पैसे भेजने, प्राप्त करने और बदलने को एक सुरक्षित वैश्विक वॉलेट में एकीकृत करता है।',
            'hero.primaryCta': 'वॉलेट बनाएं →',
            'hero.secondaryCta': 'सुविधाएँ देखें',
            'hero.statSpeedLabel': 'गति',
            'hero.statSpeedValue': 'तत्काल',
            'hero.statCurrenciesLabel': 'मुद्राएँ',
            'hero.statCurrenciesValue': '50+ वॉलेट',
            'hero.statFeesLabel': 'शुल्क',
            'hero.statFeesValue': 'पारदर्शी',
            'card.title': 'PRAC वॉलेट',
            'card.subtitle': 'USD • प्राथमिक',
            'card.balanceLabel': 'शेष',
            'card.fxLabel': 'FX दर',
            'card.recent': 'हाल ही में: प्राप्त 500 USD • भेजा 200 USD',
            'card.footer': '⚡ तत्काल स्थानांतरण',
            'card.send': 'भेजें',
            'card.receive': 'प्राप्त करें',
            'onewallet.title': 'एक वॉलेट। सभी सीमाएँ।',
            'onewallet.subtitle': 'बैंकों से तेज प्लेटफॉर्म के साथ इंटरनेट की गति से पैसा ले जाएं।',
            'onewallet.f1Title': '⚡ तत्काल PRAC-से-PRAC',
            'onewallet.f1Body': 'सेकंड में दुनिया भर में पैसा भेजें और प्राप्त करें।',
            'onewallet.f2Title': '🔒 डिजाइन द्वारा सुरक्षा',
            'onewallet.f2Body': 'एन्क्रिप्शन और धोखाधड़ी का पता लगाना आपके धन की सुरक्षा करता है।',
            'onewallet.f3Title': '💱 वास्तविक समय रूपांतरण',
            'onewallet.f3Body': 'पूर्ण मूल्य पारदर्शिता के साथ लाइव FX दरें।',
            'features.title': 'आपके लिए बनाई गई सुविधाएँ',
            'features.f1Title': '🚀 तेज स्थानांतरण',
            'features.f1Body': 'प्रतिस्पर्धी दरों के साथ सेकंड में अंतरराष्ट्रीय स्तर पर पैसा ले जाएं।',
            'features.f2Title': '🌍 एकाधिक वॉलेट',
            'features.f2Body': '50 से अधिक मुद्राओं में शेष राशि रखें।',
            'features.f3Title': '💎 पारदर्शी शुल्क',
            'features.f3Body': 'कोई छिपा शुल्क नहीं — भेजने से पहले दर और शुल्क देखें।',
            'live.title': 'लाइव विनिमय दरें',
            'live.subtitle': 'वास्तविक समय में अपडेट की गई मुद्रा दरें।',
            'live.updated': 'लाइव अपडेट',
            'usecases.title': 'सीमाहीन जीवन के लिए',
            'usecases.subtitle': 'फ्रीलांसरों, यात्रियों और वैश्विक व्यवसायों के लिए।',
            'usecases.f1Title': '💼 बहु-मुद्रा वॉलेट',
            'usecases.f1Body': 'एक वॉलेट से 50+ मुद्राओं में लेनदेन प्रबंधित करें।',
            'usecases.f2Title': '📊 वास्तविक समय ट्रैकिंग',
            'usecases.f2Body': 'तत्काल सूचनाएं और लेनदेन ट्रैकिंग।',
            'usecases.f3Title': '🏢 व्यावसायिक उपकरण',
            'usecases.f3Body': 'वैश्विक ग्राहकों को चालान करें और आसानी से भुगतान प्राप्त करें।',
            'usecases.f4Title': '✈️ यात्रियों के लिए',
            'usecases.f4Body': 'जरूरत पड़ने पर मुद्रा बदलें और आश्चर्यजनक शुल्क से बचें।',
            'usecases.f5Title': '💻 दूरस्थ कार्यकर्ता',
            'usecases.f5Body': 'विदेशी नियोक्ताओं से आसानी से वेतन प्राप्त करें।',
            'usecases.f6Title': '🏭 व्यवसाय',
            'usecases.f6Body': 'कम लागत पर दुनिया भर में आपूर्तिकर्ताओं को भुगतान करें।',
            'security.title': 'सुरक्षा, अनुपालन, विश्वास',
            'security.subtitle': 'हर स्थानांतरण बैंक-ग्रेड एन्क्रिप्शन के साथ सुरक्षित है।',
            'security.f1Title': '✓ सत्यापित स्थानांतरण',
            'security.f1Body': 'हर लेनदेन सत्यापित और एन्क्रिप्ट किया गया है।',
            'security.f2Title': '🌐 वैश्विक कवरेज',
            'security.f2Body': 'स्थानीय भुगतान विकल्पों के साथ सीमा पार समर्थन।',
            'security.f3Title': '🔐 गोपनीयता और नियंत्रण',
            'security.f3Body': 'भूमिका-आधारित पहुंच और सुरक्षित प्रमाणीकरण।',
            'cta.title': 'पैसा ले जाने के लिए तैयार?',
            'cta.subtitle': 'PRAC वॉलेट बनाएं और तुरंत भेजना शुरू करें।',
            'cta.button': 'शुरू करें — यह मुफ़्त है →',
            'footer.brand': 'PRAC — भुगतान • प्राप्त • रूपांतरण',
            'footer.security': 'सुरक्षा',
            'footer.support': 'समर्थन',
            'footer.rates': 'दरें'
        }
    };

    // Available languages (only those with translations)
    const availableLangs = ['en', 'es', 'ar', 'de', 'fr', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'nl', 'pl', 'tr', 'hi'];

    let currentLang = localStorage.getItem('prac-lang') || 'en';
    if (!availableLangs.includes(currentLang)) currentLang = 'en';

    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    function applyTranslations(lang) {
        const dict = translations[lang] || translations.en;
        const isArabic = lang === 'ar';

        html.setAttribute('lang', lang);
        html.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

        // Text content
        selectAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!dict[key]) return;
            if (key === 'hero.title') {
                el.innerHTML = dict[key];
            } else {
                el.textContent = dict[key];
            }
        });

        // Placeholders
        selectAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });
    }

    function updateLangButton() {
        if (!langFlag || !langCode) return; // Safety check
        const lang = languages.find(l => l.code === currentLang);
        if (lang) {
            langFlag.textContent = lang.flag;
            langCode.textContent = lang.code.toUpperCase();
        }
    }

    function renderLangList(filter = '') {
        if (!langList) return;

        const filtered = languages.filter(lang => {
            const search = filter.toLowerCase();
            return lang.name.toLowerCase().includes(search) ||
                lang.nativeName.toLowerCase().includes(search) ||
                lang.code.toLowerCase().includes(search);
        });

        if (filtered.length === 0) {
            langList.innerHTML = '<div class="lang-no-results">No languages found</div>';
            return;
        }

        langList.innerHTML = filtered.map(lang => {
            const isActive = lang.code === currentLang;
            const isAvailable = availableLangs.includes(lang.code);
            return `
                <div class="lang-item ${isActive ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}" 
                     data-lang="${lang.code}" 
                     ${!isAvailable ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <span class="lang-flag">${lang.flag}</span>
                    <span class="lang-item-name">${lang.nativeName}</span>
                    <span class="lang-item-code">${lang.code.toUpperCase()}</span>
                    ${isActive ? '<span style="color: var(--accent1);">✓</span>' : ''}
                    ${!isAvailable ? '<span style="font-size: 10px; color: var(--muted);">(Coming soon)</span>' : ''}
                </div>
            `;
        }).join('');

        // Add click handlers
        langList.querySelectorAll('.lang-item:not(.disabled)').forEach(item => {
            item.addEventListener('click', () => {
                const langCode = item.getAttribute('data-lang');
                if (availableLangs.includes(langCode)) {
                    currentLang = langCode;
                    localStorage.setItem('prac-lang', currentLang);
                    applyTranslations(currentLang);
                    updateLangButton();
                    langDropdown.classList.remove('show');
                    langSearch.value = '';
                    renderLangList();
                }
            });
        });
    }

    // Toggle dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
            if (langDropdown.classList.contains('show')) {
                langSearch.focus();
                renderLangList();
            }
        });
    }

    // Search functionality
    if (langSearch) {
        langSearch.addEventListener('input', (e) => {
            renderLangList(e.target.value);
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langDropdown && !langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
            langDropdown.classList.remove('show');
            langSearch.value = '';
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langDropdown && langDropdown.classList.contains('show')) {
            langDropdown.classList.remove('show');
            langSearch.value = '';
        }
    });

    applyTranslations(currentLang);
    updateLangButton();

    // ------------------ Menu toggle ------------------
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => mainNav.classList.toggle('show'));
    }

    // Fade-up via IntersectionObserver
    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
            }
        });
    }, { threshold: 0.1 });
    selectAll('.fade-up').forEach(el => fadeUpObserver.observe(el));

    // Scroll progress
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight);
            scrollProgress.style.transform = `scaleX(${scrolled})`;
        });
    }

    // Navbar scroll effect
    const mainHeader = document.getElementById('mainHeader');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Floating card parallax
    const card = document.getElementById('floatingCard');
    let bounds = card ? card.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    let isHovering = false;

    function getClientCoords(e) {
        if (e.touches && e.touches[0]) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if ('clientX' in e && 'clientY' in e) {
            return { x: e.clientX, y: e.clientY };
        }
        return null;
    }

    function handleMove(e) {
        if (!card || !isHovering) return;
        const coords = getClientCoords(e);
        if (!coords) return;

        const x = coords.x - (bounds.left + bounds.width / 2);
        const y = coords.y - (bounds.top + bounds.height / 2);
        const rx = (-y / (bounds.height || 1)) * 10;
        const ry = (x / (bounds.width || 1)) * 15;

        card.style.animation = 'none';
        card.style.transform = `translateZ(20px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    }

    function resetCard() {
        if (card) {
            card.style.animation = '';
            card.style.transform = '';
        }
        isHovering = false;
    }

    if (card) {
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            bounds = card.getBoundingClientRect();
        });
        card.addEventListener('mouseleave', resetCard);
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('resize', () => {
            if (card) bounds = card.getBoundingClientRect();
        });
    }

    // FX updates
    function randomVariance(n, spread) {
        return +((n + (Math.random() * 2 - 1) * spread).toFixed(4));
    }

    function updateFx() {
        const usd_eur = randomVariance(0.93, 0.003);
        const usd_gbp = randomVariance(0.79, 0.003);
        const usd_mad = randomVariance(10.25, 0.08);

        const elEur = document.getElementById('rate-usd-eur');
        const elGbp = document.getElementById('rate-usd-gbp');
        const elMad = document.getElementById('rate-usd-mad');
        const fxRate = document.getElementById('fxRate');

        if (elEur) {
            elEur.style.animation = 'counter 0.5s var(--ease)';
            setTimeout(() => elEur.style.animation = '', 500);
            elEur.textContent = usd_eur;
        }
        if (elGbp) {
            elGbp.style.animation = 'counter 0.5s var(--ease)';
            setTimeout(() => elGbp.style.animation = '', 500);
            elGbp.textContent = usd_gbp;
        }
        if (elMad) {
            elMad.style.animation = 'counter 0.5s var(--ease)';
            setTimeout(() => elMad.style.animation = '', 500);
            elMad.textContent = usd_mad;
        }
        if (fxRate) {
            fxRate.textContent = `1 USD → ${usd_eur} EUR`;
        }
    }

    setInterval(updateFx, 3000);
    updateFx();

    // Transfer simulations
    function parseBalanceText(text) {
        return parseFloat(String(text).replace(/,/g, '')) || 12430;
    }

    window.simulateTransfer = function () {
        const b = document.getElementById('balanceAmount');
        if (!b) return;

        let val = parseBalanceText(b.textContent);
        const amount = Math.floor(Math.random() * 300 + 50);
        val = Math.max(0, val - amount);

        b.classList.add('animate-counter');
        b.textContent = Math.round(val).toLocaleString();
        setTimeout(() => b.classList.remove('animate-counter'), 500);

        pulseCard('#ff6b6b');
        showNotification(`Sent $${amount}`, 'send');
    }

    window.simulateReceive = function () {
        const b = document.getElementById('balanceAmount');
        if (!b) return;

        let val = parseBalanceText(b.textContent);
        const amount = Math.floor(Math.random() * 1200 + 100);
        val = val + amount;

        b.classList.add('animate-counter');
        b.textContent = Math.round(val).toLocaleString();
        setTimeout(() => b.classList.remove('animate-counter'), 500);

        pulseCard('#5af78e');
        showNotification(`Received $${amount}`, 'receive');
    }

    function pulseCard(color) {
        if (!card || !card.animate) return;
        card.animate([
            { boxShadow: '0 50px 100px rgba(2,6,23,0.9), 0 0 0 1px rgba(255,255,255,0.05)' },
            { boxShadow: `0 50px 150px ${color}88, 0 0 0 2px ${color}44` },
            { boxShadow: '0 50px 100px rgba(2,6,23,0.9), 0 0 0 1px rgba(255,255,255,0.05)' }
        ], { duration: 800, easing: 'ease-out' });
    }

    function showNotification(text, type) {
        const notification = document.createElement('div');
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'send' ? 'rgba(255,107,107,0.2)' : 'rgba(90,247,142,0.2)'};
            border: 1px solid ${type === 'send' ? 'rgba(255,107,107,0.4)' : 'rgba(90,247,142,0.4)'};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            z-index: 10000;
            animation: slideIn 0.3s var(--ease);
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s var(--ease)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Close nav on click (mobile)
    selectAll('#mainNav a').forEach(a => {
        a.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('show')) {
                mainNav.classList.remove('show');
            }
        });
    });

    // Smooth scroll
    selectAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
})();
