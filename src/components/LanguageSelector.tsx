import { useRef, useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { SUPPORTED_LANGS } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageContext";

const LanguageSelector = () => {
  const { lang, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = SUPPORTED_LANGS.find((l) => l.code === lang) ?? SUPPORTED_LANGS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-card border border-border shadow-soft text-foreground hover:bg-secondary transition-all"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {isTranslating ? (
          <Loader2 size={14} className="animate-spin text-primary" />
        ) : (
          <span>{active.flag}</span>
        )}
        <span>{active.nativeName}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-44 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden z-50 max-h-72 overflow-y-auto"
        >
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => { setLanguage(l.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-secondary transition-colors ${l.code === lang ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
            >
              <span>{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
