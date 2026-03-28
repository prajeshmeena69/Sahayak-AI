import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, ChevronDown, CheckCircle, FileText } from "lucide-react";
import { findSchemes, type SchemeResult } from "@/services/geminiService";
import { useLanguage } from "@/i18n/LanguageContext";
import { startListening, stopListening, isSpeechSupported } from "@/utils/speechToText";
import { SUPPORTED_LANGS } from "@/i18n/translations";
import leafDecoration from "@/assets/leaf-decoration.png";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

const SchemesPage = () => {
  const { t, lang } = useLanguage();
  const speechLocale = SUPPORTED_LANGS.find((l) => l.code === lang)?.speechLocale ?? "hi-IN";

  const [state, setState] = useState("");
  const [need, setNeed] = useState("");
  const [landSize, setLandSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SchemeResult[] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceField, setVoiceField] = useState<"state" | "need" | "land" | null>(null);

  const needs = [
    t("schemes.need1"), t("schemes.need2"),
    t("schemes.need3"), t("schemes.need4"),
  ];
  const lands = [t("schemes.land1"), t("schemes.land2"), t("schemes.land3")];

  const handleFind = async () => {
    if (!state || !need || !landSize) return;
    setLoading(true);
    setResults(null);
    try {
      const schemes = await findSchemes({ state, need, landSize, language: lang });
      setResults(schemes);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      setVoiceField(null);
      return;
    }
    if (!isSpeechSupported()) return;
    setIsListening(true);
    startListening(
      speechLocale,
      (transcript) => {
        setIsListening(false);
        setVoiceField(null);
        // Try to auto-fill state from transcript
        const matchedState = STATES.find((s) =>
          transcript.toLowerCase().includes(s.toLowerCase())
        );
        if (matchedState) setState(matchedState);
      },
      () => { setIsListening(false); setVoiceField(null); }
    );
  };

  const canSearch = state && need && landSize;

  return (
    <div className="pt-14 min-h-screen bg-gradient-earth relative overflow-hidden">
      <img src={leafDecoration} alt="" className="absolute top-20 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none" loading="lazy" />
      <img src={leafDecoration} alt="" className="absolute bottom-10 -left-16 w-40 opacity-10 -rotate-45 pointer-events-none select-none" loading="lazy" />

      <div className="container max-w-lg py-10 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-foreground mb-1">{t("schemes.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("schemes.subtitle")}</p>
        </motion.div>

        {/* Form card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-elevated border border-border space-y-5 mb-6">

          {/* State */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">{t("schemes.locationLabel")}</label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-border bg-secondary text-sm text-foreground outline-none focus:border-primary transition-colors pr-10"
              >
                <option value="">{t("schemes.locationPlaceholder")}</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Need */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">{t("schemes.needLabel")}</label>
            <div className="relative">
              <select
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-border bg-secondary text-sm text-foreground outline-none focus:border-primary transition-colors pr-10"
              >
                <option value="">{t("schemes.needPlaceholder")}</option>
                {needs.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Land size */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">{t("schemes.landLabel")}</label>
            <div className="relative">
              <select
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-border bg-secondary text-sm text-foreground outline-none focus:border-primary transition-colors pr-10"
              >
                <option value="">{t("schemes.landPlaceholder")}</option>
                {lands.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Voice button */}
          <button
            onClick={handleVoice}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-sm font-medium transition-all ${isListening ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary"}`}
          >
            <Mic size={16} className={isListening ? "animate-pulse" : ""} />
            {isListening ? "Listening… tap to stop" : t("schemes.voiceBtn")}
          </button>

          {/* Find button */}
          <motion.button
            whileHover={{ scale: canSearch ? 1.02 : 1 }}
            whileTap={{ scale: canSearch ? 0.97 : 1 }}
            onClick={handleFind}
            disabled={!canSearch || loading}
            className="w-full py-4 rounded-2xl bg-gradient-hero text-primary-foreground font-bold text-base shadow-elevated flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <Search size={18} />
            {t("schemes.findBtn")}
          </motion.button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-7 h-7 rounded-full border-primary border-t-transparent" style={{ borderWidth: 3, borderStyle: "solid" }} />
            </div>
            <p className="text-sm text-muted-foreground">{t("schemes.loading")}</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {results.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-muted-foreground text-sm">{t("schemes.noResults")}</p>
                  <button onClick={() => setResults(null)} className="text-primary text-sm font-semibold hover:underline">
                    {t("schemes.tryAgain")}
                  </button>
                </div>
              ) : (
                results.map((scheme, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-3xl p-6 shadow-soft border border-border space-y-3">
                    {/* Benefit badge on top */}
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {scheme.benefit}
                    </span>
                    {/* Scheme name */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle size={16} className="text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-base leading-snug">{scheme.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{scheme.description}</p>
                    <div className="flex items-start gap-2 pt-2 border-t border-border">
                      <FileText size={14} className="text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-accent font-medium leading-relaxed">
                        <span className="text-foreground font-semibold">{t("schemes.howToApply")}:</span> {scheme.howToApply}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchemesPage;
