import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";
import MicButton from "@/components/MicButton";
import leafDecoration from "@/assets/leaf-decoration.png";

type ChatMessage = {
  from: "bot" | "user";
  text: string;
};

const questions = {
  hi: [
    { q: "क्या आपके पास 2 हेक्टेयर से कम ज़मीन है?", options: ["हाँ", "नहीं"] },
    { q: "क्या आप किसान परिवार से हैं?", options: ["हाँ", "नहीं"] },
    { q: "क्या आपकी उम्र 18 साल से ज्यादा है?", options: ["हाँ", "नहीं"] },
  ],
  en: [
    { q: "Do you have less than 2 hectares of land?", options: ["Yes", "No"] },
    { q: "Are you from a farming family?", options: ["Yes", "No"] },
    { q: "Are you above 18 years old?", options: ["Yes", "No"] },
  ],
};

const states = {
  hi: {
    idle: "आप क्या जानना चाहते हैं?",
    idleSub: "माइक बटन दबाएं और बोलना शुरू करें",
    listening: "सुन रहे हैं...",
    processing: "आपके लिए योजना ढूँढी जा रही है…",
    processingSub: "कृपया थोड़ा इंतज़ार करें",
    greeting: "नमस्ते! मैं Sahayak AI हूँ। आपकी eligibility check करते हैं।",
  },
  en: {
    idle: "What would you like to know?",
    idleSub: "Press the mic button and start speaking",
    listening: "Listening...",
    processing: "Finding schemes for you…",
    processingSub: "Please wait a moment",
    greeting: "Hello! I'm Sahayak AI. Let's check your eligibility.",
  },
};

interface DemoPageProps {
  lang: "hi" | "en";
}

const DemoPage = ({ lang }: DemoPageProps) => {
  const navigate = useNavigate();
  const t = states[lang];
  const qs = questions[lang];

  const [status, setStatus] = useState<"idle" | "listening" | "chatting" | "processing">("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQ, setCurrentQ] = useState(0);

  const startConversation = () => {
    setStatus("listening");
    setTimeout(() => {
      setStatus("chatting");
      setMessages([{ from: "bot", text: t.greeting }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: qs[0].q }]);
      }, 800);
    }, 1500);
  };

  const handleAnswer = (answer: string) => {
    const nextQ = currentQ + 1;
    setMessages((prev) => [...prev, { from: "user", text: answer }]);

    if (nextQ < qs.length) {
      setCurrentQ(nextQ);
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: qs[nextQ].q }]);
      }, 600);
    } else {
      setStatus("processing");
      setTimeout(() => {
        navigate("/result", { state: { lang } });
      }, 2000);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-earth flex flex-col relative overflow-hidden">
      {/* Decorative leaves */}
      <img
        src={leafDecoration}
        alt=""
        className="absolute top-20 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none"
        loading="lazy"
        width={800}
        height={800}
      />
      <img
        src={leafDecoration}
        alt=""
        className="absolute bottom-10 -left-16 w-40 opacity-8 -rotate-45 pointer-events-none select-none"
        loading="lazy"
        width={800}
        height={800}
      />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: "radial-gradient(circle, hsl(142 52% 36% / 0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />

      {/* Chat area */}
      <div className="flex-1 container max-w-lg py-6 flex flex-col relative z-10">
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center"
            >
              <Bot size={36} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-2">{t.idle}</p>
              <p className="text-sm text-muted-foreground">{t.idleSub}</p>
            </div>
            <MicButton onClick={startConversation} />
          </motion.div>
        )}

        {status === "listening" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
          >
            <p className="text-2xl font-bold text-primary">{t.listening}</p>
            <MicButton onClick={() => {}} isListening />
            {/* Sound wave visualization */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                  className="w-1.5 h-8 rounded-full bg-primary/40"
                />
              ))}
            </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
                  style={{ borderWidth: 3 }}
                />
              </div>
              {/* Pulsing rings */}
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-primary/30"
              />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground mb-1">{t.processing}</p>
              <p className="text-sm text-muted-foreground">{t.processingSub}</p>
            </div>
          </motion.div>
        )}

        {status === "chatting" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pb-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`flex gap-3 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "bot" && (
                      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-1">
                        <Bot size={18} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-soft ${
                        msg.from === "bot"
                          ? "bg-card border border-border text-foreground rounded-bl-md"
                          : "bg-gradient-hero text-primary-foreground rounded-br-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.from === "user" && (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <User size={18} className="text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Answer buttons */}
            {currentQ < qs.length && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-center py-6"
              >
                {qs[currentQ].options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    className="px-10 py-4 rounded-2xl bg-card border-2 border-primary text-primary font-bold text-base hover:bg-primary hover:text-primary-foreground transition-all shadow-card"
                  >
                    {opt}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
