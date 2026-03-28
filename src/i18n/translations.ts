export type LangCode = "en" | "hi" | "bn" | "te" | "mr" | "ta" | "gu" | "kn" | "ml" | "pa" | "or";

export interface Language {
  code: LangCode;
  nativeName: string;
  flag: string;
  speechLocale: string;
}

export const SUPPORTED_LANGS: Language[] = [
  { code: "hi", nativeName: "हिंदी",   flag: "🇮🇳", speechLocale: "hi-IN" },
  { code: "en", nativeName: "English",  flag: "🇬🇧", speechLocale: "en-IN" },
  { code: "bn", nativeName: "বাংলা",   flag: "🇮🇳", speechLocale: "bn-IN" },
  { code: "te", nativeName: "తెలుగు",  flag: "🇮🇳", speechLocale: "te-IN" },
  { code: "mr", nativeName: "मराठी",   flag: "🇮🇳", speechLocale: "mr-IN" },
  { code: "ta", nativeName: "தமிழ்",   flag: "🇮🇳", speechLocale: "ta-IN" },
  { code: "gu", nativeName: "ગુજરાતી", flag: "🇮🇳", speechLocale: "gu-IN" },
  { code: "kn", nativeName: "ಕನ್ನಡ",   flag: "🇮🇳", speechLocale: "kn-IN" },
  { code: "ml", nativeName: "മലയാളം",  flag: "🇮🇳", speechLocale: "ml-IN" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ",  flag: "🇮🇳", speechLocale: "pa-IN" },
  { code: "or", nativeName: "ଓଡ଼ିଆ",   flag: "🇮🇳", speechLocale: "or-IN" },
];

/** Canonical English strings — all other languages are translated from these via AWS Translate */
export const BASE_STRINGS = {
  // Navbar
  "nav.logout": "Logout",

  // Home / Index
  "home.headline": "Know",
  "home.headlineHighlight": "Government Schemes",
  "home.headlineSuffix": "in Your Language",
  "home.subtext": "Ask by speaking and instantly find out if you're eligible. No forms to fill.",
  "home.cta": "🎤 Start by Speaking",
  "home.badge1": "⚡ Just 30 seconds",
  "home.badge2": "🔒 No signup needed",
  "home.badge3": "🗣️ Available in Hindi",
  "home.feature1.title": "Ask by speaking",
  "home.feature1.desc": "No typing required, just speak",
  "home.feature2.title": "In your language",
  "home.feature2.desc": "Talk in Hindi, understand in your language",
  "home.feature3.title": "Know why you're eligible",
  "home.feature3.desc": "AI answers in simple language",
  "home.feature4.title": "Know how to apply",
  "home.feature4.desc": "Step by step complete process",
  "home.featuresTitle": "What does Sahayak AI do?",
  "home.howTitle": "How does it work?",
  "home.howSubtitle": "Just 3 simple steps",
  "home.step1.title": "Ask a question",
  "home.step1.desc": "Press the mic button and speak your question",
  "home.step2.title": "Answer questions",
  "home.step2.desc": "Simple yes or no answers to 2-3 questions",
  "home.step3.title": "Get your result",
  "home.step3.desc": "Instantly know your eligibility and scheme details",
  "home.demoTitle": "Your result will look like this",
  "home.demoSubtitle": "Preview of an actual result",
  "home.schemeName": "PM-KISAN",
  "home.schemeBenefit": "₹6,000/year",
  "home.schemeReason": "You are eligible because you are a small farmer",
  "home.eligible": "✅ You are eligible!",
  "home.impactTitle": "Trusted by Farmers",
  "home.impactCount": "1,248+",
  "home.impactDesc": "farmers checked their eligibility so far",
  "home.impactSub": "and this number is growing every day",
  "home.finalCta": "Check your eligibility now",
  "home.finalCtaDesc": "No signup, no forms — just speak",
  "home.finalCtaBtn": "Start by Speaking",
  "home.trust1": "100% Free",
  "home.trust2": "Data Secure",
  "home.trust3": "Government Verified Schemes",
  "home.listen": "Listen",

  // Login
  "login.title": "Enter your number",
  "login.subtitle": "Login with OTP — no password needed",
  "login.sendOtp": "Send OTP",
  "login.otpTitle": "Enter OTP",
  "login.otpSubtitle": "Check your SMS for the OTP",
  "login.otpPlaceholder": "6-digit OTP",
  "login.verify": "Verify",
  "login.change": "Change number",
  "login.sending": "Sending...",
  "login.verifying": "Verifying...",
  "login.trust": "Your data is secure",

  // Chat
  "chat.idle": "What would you like to know?",
  "chat.idleSub": "Press the mic button and start speaking",
  "chat.hint1": "You can say: I have 2 acres of land",
  "chat.hint2": "Or: I want to know about farmer schemes",
  "chat.hint3": "Or: Which government schemes am I eligible for?",
  "chat.listening": "Listening...",
  "chat.processing": "Finding answer for you…",
  "chat.processingSub": "Please wait a moment",
  "chat.askAnother": "Ask something else",
  "chat.listen": "Listen",
  "chat.stop": "Stop",

  // Result
  "result.eligible": "You are eligible!",
  "result.eligibleSubtitle": "Congratulations! You qualify for the scheme below.",
  "result.schemeLabel": "Scheme",
  "result.howToApply": "How to Apply",
  "result.docsTitle": "Required Documents",
  "result.listen": "🔊 Listen",
  "result.playing": "🔊 Playing…",
  "result.retry": "Check again",

  // NotFound
  "notFound.title": "404",
  "notFound.message": "Oops! Page not found",
  "notFound.back": "Return to Home",
} as const;

export type TranslationKey = keyof typeof BASE_STRINGS;
