import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Globe, Brain, FileText, CheckCircle, Volume2, Leaf, Shield, Users, Sparkles } from "lucide-react";
import heroFarmer from "@/assets/hero-farmer.jpg";
import leafDecoration from "@/assets/leaf-decoration.png";
import fieldLandscape from "@/assets/field-landscape.jpg";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";

const FEATURE_ICONS = [Mic, Globe, Brain, FileText];
const STEP_ICONS = [Mic, Users, Sparkles];
const FEATURE_COLORS = ["primary", "accent", "warm", "primary"];

const LandingPage = () => {
  const { t } = useLanguage();
  const { authenticated } = useAuth();
  const ctaPath = authenticated ? "/chat" : "/login";

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };

  const stagger = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  const featureColors: Record<string, { bg: string; icon: string; border: string }> = {
    primary: { bg: "bg-primary-light", icon: "text-primary", border: "border-primary/10" },
    accent: { bg: "bg-accent-light", icon: "text-accent", border: "border-accent/10" },
    warm: { bg: "bg-[hsl(var(--warm-light))]", icon: "text-[hsl(var(--warm))]", border: "border-[hsl(var(--warm))]/10" },
  };

  const badges = [t("home.badge1"), t("home.badge2"), t("home.badge3")];
  const features = [
    { Icon: FEATURE_ICONS[0], title: t("home.feature1.title"), desc: t("home.feature1.desc"), color: FEATURE_COLORS[0] },
    { Icon: FEATURE_ICONS[1], title: t("home.feature2.title"), desc: t("home.feature2.desc"), color: FEATURE_COLORS[1] },
    { Icon: FEATURE_ICONS[2], title: t("home.feature3.title"), desc: t("home.feature3.desc"), color: FEATURE_COLORS[2] },
    { Icon: FEATURE_ICONS[3], title: t("home.feature4.title"), desc: t("home.feature4.desc"), color: FEATURE_COLORS[3] },
  ];
  const steps = [
    { num: "1", title: t("home.step1.title"), desc: t("home.step1.desc"), Icon: STEP_ICONS[0] },
    { num: "2", title: t("home.step2.title"), desc: t("home.step2.desc"), Icon: STEP_ICONS[1] },
    { num: "3", title: t("home.step3.title"), desc: t("home.step3.desc"), Icon: STEP_ICONS[2] },
  ];
  const trustItems = [t("home.trust1"), t("home.trust2"), t("home.trust3")];

  return (
    <div className="pt-14 overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-earth -z-20" />
        <img src={leafDecoration} alt="" className="absolute -top-10 -right-20 w-64 md:w-96 opacity-20 rotate-12 -z-10 pointer-events-none select-none" loading="lazy" width={800} height={800} />
        <img src={leafDecoration} alt="" className="absolute -bottom-20 -left-16 w-48 md:w-72 opacity-15 -rotate-45 -z-10 pointer-events-none select-none" loading="lazy" width={800} height={800} />
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10" />
        <div className="absolute bottom-10 left-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl -z-10" />

        <div className="container py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div {...fadeUp} className="space-y-8">
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span key={b} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-card border border-border shadow-soft text-foreground">{b}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.15] text-foreground">
                {t("home.headline")} <span className="text-gradient-primary">{t("home.headlineHighlight")}</span> {t("home.headlineSuffix")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">{t("home.subtext")}</p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to={ctaPath}>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px -5px hsl(142 52% 36% / 0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-5 rounded-2xl bg-gradient-hero text-primary-foreground text-lg font-bold shadow-elevated transition-all"
                  >
                    {t("home.cta")}
                  </motion.button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={16} className="text-primary" />
                  {trustItems[1]}
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                {trustItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle size={14} className="text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] border-2 border-dashed border-primary/15 -z-10" />
              <div className="rounded-3xl overflow-hidden shadow-elevated relative">
                <img src={heroFarmer} alt="Indian farmer using smartphone" className="w-full h-auto object-cover" width={1280} height={768} />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-4 md:left-6 glass-strong rounded-2xl p-4 shadow-elevated border border-border/50 max-w-[240px]"
              >
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><CheckCircle size={18} /></div>
                  {t("home.eligible")}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{t("home.schemeName")} • {t("home.schemeBenefit")}</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 -right-3 md:right-6 md:top-4 glass-strong rounded-xl p-3 shadow-card border border-border/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center"><Mic size={14} className="text-primary-foreground" /></div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div key={i} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} className="w-1 h-4 rounded-full bg-primary" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-secondary -z-10" />
        <div className="absolute -top-16 left-0 right-0 h-16 -z-10">
          <svg viewBox="0 0 1440 64" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 64V32C240 0 480 0 720 32C960 64 1200 64 1440 32V64H0Z" fill="hsl(120 20% 96%)" />
          </svg>
        </div>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-semibold mb-4"><Leaf size={16} /> Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("home.featuresTitle")}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((f, i) => {
              const colors = featureColors[f.color] || featureColors.primary;
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: "0 12px 40px -8px hsl(142 30% 30% / 0.15)" }} className={`bg-card rounded-3xl p-7 shadow-soft border ${colors.border} text-center space-y-4 cursor-default transition-all`}>
                  <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto`}><f.Icon size={28} className={colors.icon} /></div>
                  <h3 className="font-bold text-foreground text-base">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 md:py-28 relative">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent text-sm font-semibold mb-4"><Sparkles size={16} /> {t("home.howSubtitle")}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("home.howTitle")}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 z-0" />
            {steps.map((s, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative flex flex-col items-center text-center space-y-5 z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow"><s.Icon size={32} className="text-primary-foreground" /></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center border-2 border-primary text-primary font-bold text-sm">{s.num}</div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-[220px] mx-auto">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEMO PREVIEW ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img src={fieldLandscape} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={600} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        </div>
        <div className="container max-w-2xl relative z-10">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-semibold mb-4">Preview</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("home.demoTitle")}</h2>
            <p className="text-muted-foreground mt-2">{t("home.demoSubtitle")}</p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="glass-strong rounded-3xl p-8 md:p-10 shadow-elevated border border-border/50 space-y-5">
            <motion.div initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="text-center">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-lg font-bold"><CheckCircle size={22} />{t("home.eligible")}</span>
            </motion.div>
            <div className="bg-primary-light/60 rounded-2xl p-6 space-y-3 border border-primary/10">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-foreground text-xl">{t("home.schemeName")}</span>
                <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-sm">{t("home.schemeBenefit")}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("home.schemeReason")}</p>
            </div>
            <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-accent/10 text-accent font-semibold text-sm hover:bg-accent/20 transition-colors border border-accent/10">
              <Volume2 size={18} /> 🔊 {t("home.listen")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== IMPACT COUNTER ===== */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="relative bg-card rounded-[2rem] p-10 md:p-16 text-center shadow-card border border-border overflow-hidden">
            <img src={leafDecoration} alt="" className="absolute -top-10 -right-10 w-40 opacity-10 rotate-45 pointer-events-none select-none" loading="lazy" width={800} height={800} />
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">{t("home.impactTitle")}</p>
            <motion.p initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }} className="text-6xl md:text-8xl font-black text-gradient-primary mb-4">{t("home.impactCount")}</motion.p>
            <p className="text-xl text-foreground font-medium">{t("home.impactDesc")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("home.impactSub")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div {...fadeUp} className="relative bg-gradient-hero rounded-[2rem] p-10 md:p-16 text-center text-primary-foreground overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative z-10 space-y-6 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">{t("home.finalCta")}</h2>
              <p className="text-primary-foreground/80 text-lg">{t("home.finalCtaDesc")}</p>
              <Link to={ctaPath}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-4 px-10 py-5 rounded-2xl bg-card text-primary font-bold text-lg shadow-elevated transition-all">🎤 {t("home.finalCtaBtn")}</motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t border-border bg-secondary/50">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Sahayak AI" className="h-8 w-8" />
            <span className="font-bold text-foreground">Sahayak <span className="text-gradient-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5"><CheckCircle size={12} className="text-primary" />{item}</span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Sahayak AI</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
