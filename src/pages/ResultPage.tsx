import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Volume2, RotateCcw, FileText, CreditCard, Shield, Leaf, ArrowRight } from "lucide-react";
import leafDecoration from "@/assets/leaf-decoration.png";

const content = {
  hi: {
    title: "आप eligible हैं!",
    subtitle: "बधाई हो! आप नीचे दी गई योजना के लिए पात्र हैं।",
    schemeName: "PM-KISAN सम्मान निधि",
    benefit: "₹6,000/वर्ष",
    benefitPeriod: "3 किस्तों में",
    reason: "आप eligible हैं क्योंकि आप छोटे किसान हैं और आपके पास 2 हेक्टेयर से कम ज़मीन है।",
    howToApply: "Apply कैसे करें",
    steps: [
      "नज़दीकी CSC केंद्र पर जाएं",
      "आधार कार्ड और ज़मीन के कागज़ात ले जाएं",
      "CSC ऑपरेटर से PM-KISAN में registration करवाएं",
    ],
    docsTitle: "ज़रूरी दस्तावेज़",
    docs: [
      { name: "आधार कार्ड", icon: CreditCard },
      { name: "ज़मीन के कागज़ात (खसरा/खतौनी)", icon: FileText },
      { name: "बैंक पासबुक", icon: CreditCard },
      { name: "मोबाइल नंबर", icon: Shield },
    ],
    listen: "🔊 सुनो",
    retry: "दुबारा check करें",
  },
  en: {
    title: "You are eligible!",
    subtitle: "Congratulations! You qualify for the scheme below.",
    schemeName: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000/year",
    benefitPeriod: "in 3 installments",
    reason: "You are eligible because you are a small farmer with less than 2 hectares of land.",
    howToApply: "How to Apply",
    steps: [
      "Visit the nearest CSC center",
      "Carry Aadhaar card and land documents",
      "Ask the CSC operator to register you for PM-KISAN",
    ],
    docsTitle: "Required Documents",
    docs: [
      { name: "Aadhaar Card", icon: CreditCard },
      { name: "Land documents (Khasra/Khatauni)", icon: FileText },
      { name: "Bank Passbook", icon: CreditCard },
      { name: "Mobile Number", icon: Shield },
    ],
    listen: "🔊 Listen",
    retry: "Check again",
  },
};

const ResultPage = () => {
  const location = useLocation();
  const lang = (location.state as any)?.lang || "hi";
  const t = content[lang as "hi" | "en"];

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-earth relative overflow-hidden">
      {/* Decorative elements */}
      <img
        src={leafDecoration}
        alt=""
        className="absolute top-24 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none"
        loading="lazy"
        width={800}
        height={800}
      />
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: "radial-gradient(circle, hsl(142 52% 36% / 0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />

      <div className="container max-w-lg py-8 space-y-6 relative z-10">
        {/* Eligibility Banner */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 text-center space-y-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-hero -z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto"
          >
            <CheckCircle size={36} className="text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-primary-foreground">{t.title}</h1>
          <p className="text-primary-foreground/80 text-sm">{t.subtitle}</p>
        </motion.div>

        {/* Scheme Card */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-card rounded-3xl p-7 shadow-elevated border border-border space-y-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={18} className="text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Scheme</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground">{t.schemeName}</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gradient-primary">{t.benefit}</p>
              <p className="text-xs text-muted-foreground">{t.benefitPeriod}</p>
            </div>
          </div>
          <div className="h-px bg-border" />
          <p className="text-sm text-muted-foreground leading-relaxed">{t.reason}</p>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 text-accent font-semibold text-sm hover:bg-accent/20 transition-colors border border-accent/10">
            <Volume2 size={18} /> {t.listen}
          </button>
        </motion.div>

        {/* How to Apply */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-3xl p-7 shadow-card border border-border space-y-5"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-lg">{t.howToApply}</h3>
          </div>
          <ol className="space-y-4">
            {t.steps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 shadow-soft">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-foreground font-medium">{step}</span>
                </div>
                {i < t.steps.length - 1 && (
                  <ArrowRight size={14} className="text-muted-foreground/30 mt-2 shrink-0 rotate-90 md:hidden" />
                )}
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Documents */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="bg-card rounded-3xl p-7 shadow-card border border-border space-y-4"
        >
          <h3 className="font-bold text-foreground text-lg">{t.docsTitle}</h3>
          <div className="grid grid-cols-2 gap-3">
            {t.docs.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border text-sm text-foreground">
                <doc.icon size={16} className="text-primary shrink-0" />
                <span className="text-xs font-medium">{doc.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Retry CTA */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center pt-4 pb-8"
        >
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px -5px hsl(142 52% 36% / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-5 rounded-2xl bg-gradient-hero text-primary-foreground font-bold text-lg shadow-elevated flex items-center gap-3 mx-auto"
            >
              <RotateCcw size={20} /> {t.retry}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
