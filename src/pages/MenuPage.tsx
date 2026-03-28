import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import leafDecoration from "@/assets/leaf-decoration.png";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const MENU_ITEMS: { emoji: string; titleKey: TranslationKey; descKey: TranslationKey; border: string; bg: string; href: string }[] = [
  { emoji: "🎤", titleKey: "menu.option1.title", descKey: "menu.option1.desc", bg: "bg-primary-light",              border: "border-primary/20",                          href: "/chat" },
  { emoji: "📜", titleKey: "menu.option2.title", descKey: "menu.option2.desc", bg: "bg-accent-light",               border: "border-accent/20",                           href: "/schemes" },
  { emoji: "💰", titleKey: "menu.option3.title", descKey: "menu.option3.desc", bg: "bg-[hsl(var(--warm-light))]",   border: "border-[hsl(var(--warm))]/20",               href: "/crop-prices" },
  { emoji: "🦠", titleKey: "menu.option4.title", descKey: "menu.option4.desc", bg: "bg-destructive/5",              border: "border-destructive/20",                      href: "/crop-disease" },
];

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="pt-14 min-h-screen bg-gradient-earth relative overflow-hidden">
      <img
        src={leafDecoration}
        alt=""
        className="absolute top-20 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none"
        loading="lazy"
      />
      <img
        src={leafDecoration}
        alt=""
        className="absolute bottom-10 -left-16 w-40 opacity-10 -rotate-45 pointer-events-none select-none"
        loading="lazy"
      />

      <div className="container max-w-lg py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            {t("menu.title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("menu.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {MENU_ITEMS.map((m) => (
            <motion.button
              key={m.href}
              variants={item}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(m.href)}
              className={`w-full flex items-center gap-5 p-5 rounded-2xl bg-card border ${m.border} shadow-soft hover:shadow-elevated transition-all text-left`}
            >
              <div className={`w-14 h-14 rounded-2xl ${m.bg} flex items-center justify-center shrink-0 text-2xl`}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-base">{t(m.titleKey)}</p>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{t(m.descKey)}</p>
              </div>
              <div className="text-muted-foreground/40 shrink-0">›</div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MenuPage;
