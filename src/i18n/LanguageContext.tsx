import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { SUPPORTED_LANGS, BASE_STRINGS, type LangCode, type TranslationKey } from "./translations";
import { translateRecord } from "@/services/translateService";

const STORAGE_KEY = "sahayak_lang";

type TranslationMap = Record<TranslationKey, string>;

interface LanguageContextValue {
  lang: LangCode;
  setLanguage: (code: LangCode) => void;
  t: (key: TranslationKey) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.some((l) => l.code === stored)) {
      return stored as LangCode;
    }
  } catch {
    // localStorage unavailable
  }
  return "hi";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>(getInitialLang);
  const [translations, setTranslations] = useState<TranslationMap>(BASE_STRINGS as TranslationMap);
  const [isTranslating, setIsTranslating] = useState(false);

  // Cache translated maps per language so we don't re-fetch
  const translationCache = useRef<Partial<Record<LangCode, TranslationMap>>>({
    en: BASE_STRINGS as TranslationMap,
  });

  const loadTranslations = useCallback(async (code: LangCode) => {
    // Invalidate cache if key count has changed (new keys added to BASE_STRINGS)
    const cached = translationCache.current[code];
    const baseKeyCount = Object.keys(BASE_STRINGS).length;
    if (cached && Object.keys(cached).length === baseKeyCount) {
      setTranslations(cached);
      return;
    }
    // Remove stale cache entry
    delete translationCache.current[code];
    setIsTranslating(true);
    try {
      const translated = await translateRecord(BASE_STRINGS as Record<string, string>, code);
      const map = translated as TranslationMap;
      translationCache.current[code] = map;
      setTranslations(map);
    } catch {
      // fallback to English on error
      setTranslations(BASE_STRINGS as TranslationMap);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Load translations on mount for initial language
  useEffect(() => {
    loadTranslations(lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLanguage = useCallback((code: LangCode) => {
    setLang(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore write errors (private browsing)
    }
    loadTranslations(code);
  }, [loadTranslations]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key] ?? (BASE_STRINGS as TranslationMap)[key] ?? key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
