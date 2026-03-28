import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Volume2, VolumeX } from "lucide-react";
import MicButton from "@/components/MicButton";
import { useChat, type Lang } from "@/context/ChatContext";
import { startListening, stopListening, isSpeechSupported } from "@/utils/speechToText";
import { useLanguage } from "@/i18n/LanguageContext";
import { SUPPORTED_LANGS } from "@/i18n/translations";
import leafDecoration from "@/assets/leaf-decoration.png";

const ChatPage = () => {
  const navigate = useNavigate();
  const { state, handleUserSpeech, resetChat } = useChat();
  const { status, messages, schemeResult } = state;
  const { t, lang } = useLanguage();
  const speechLocale = SUPPORTED_LANGS.find((l) => l.code === lang)?.speechLocale ?? "hi-IN";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Navigate to result page when scheme data is ready
  useEffect(() => {
    if (schemeResult) {
      setTimeout(() => navigate("/result", { state: schemeResult }), 800);
    }
  }, [schemeResult]);

  useEffect(() => () => { stopListening(); audioRef.current?.pause(); }, []);

  const handleMicClick = () => {
    if (status === "processing") return;

    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    if (!isSpeechSupported()) return;

    setIsListening(true);
    startListening(
      speechLocale,
      (transcript) => {
        setIsListening(false);
        stopListening();
        handleUserSpeech(transcript, lang as Lang);
      },
      (err) => {
        console.warn("Speech error:", err);
        setIsListening(false);
        stopListening();
      }
    );
  };

  const handlePlay = (audioUrl: string, index: number) => {
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingIndex(index);
    audio.onended = () => setPlayingIndex(null);
  };

  const showIdle = status === "idle" && messages.length === 0;
  const showDone = status === "done" && messages.length > 0;

  return (
    <div className="pt-14 min-h-screen bg-gradient-earth flex flex-col relative overflow-hidden">
      <img src={leafDecoration} alt="" className="absolute top-20 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none" loading="lazy" width={800} height={800} />
      <img src={leafDecoration} alt="" className="absolute bottom-10 -left-16 w-40 opacity-8 -rotate-45 pointer-events-none select-none" loading="lazy" width={800} height={800} />
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, hsl(142 52% 36% / 0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="flex-1 container max-w-lg py-6 flex flex-col relative z-10">

        {/* IDLE — mic + hints */}
        {showIdle && !isListening && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
              <Bot size={36} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-2">{t("chat.idle")}</p>
              <p className="text-sm text-muted-foreground">{t("chat.idleSub")}</p>
            </div>
            <MicButton onClick={handleMicClick} isListening={isListening} />
            <div className="space-y-2 max-w-sm w-full">
              {[t("chat.hint1"), t("chat.hint2"), t("chat.hint3")].map((hint, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                  className="text-xs text-muted-foreground bg-secondary/60 rounded-xl px-4 py-2.5 text-left border border-border/50">
                  {hint}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* LISTENING */}
        {isListening && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <p className="text-2xl font-bold text-primary">{t("chat.listening")}</p>
            <MicButton onClick={handleMicClick} isListening />
            <div className="flex items-center gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div key={i} animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }} className="w-1.5 h-8 rounded-full bg-primary/40" />
              ))}
            </div>
          </motion.div>
        )}

        {/* PROCESSING */}
        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 rounded-full border-primary border-t-transparent" style={{ borderWidth: 3, borderStyle: "solid" }} />
              </div>
              <motion.div animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-primary/30" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground mb-1">{t("chat.processing")}</p>
              <p className="text-sm text-muted-foreground">{t("chat.processingSub")}</p>
            </div>
          </motion.div>
        )}

        {/* MESSAGES + result */}
        {!showIdle && !isListening && status !== "processing" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pb-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`flex gap-3 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "bot" && (
                      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-1">
                        <Bot size={18} className="text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 max-w-[75%]">
                      <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-soft ${msg.from === "bot" ? "bg-card border border-border text-foreground rounded-bl-md" : "bg-gradient-hero text-primary-foreground rounded-br-md"}`}>
                        {msg.text}
                      </div>
                      {/* Speaker button on bot messages */}
                      {msg.from === "bot" && msg.audioUrl && (
                        <button onClick={() => handlePlay(msg.audioUrl!, i)}
                          className="flex items-center gap-1.5 text-xs text-accent font-medium px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors border border-accent/10 self-start">
                          {playingIndex === i
                            ? <><VolumeX size={14} /> {t("chat.stop")}</>
                            : <><Volume2 size={14} /> {t("chat.listen")}</>
                          }
                        </button>
                      )}
                    </div>
                    {msg.from === "user" && (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <User size={18} className="text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Ask another — mic button */}
            {showDone && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 py-4">
                <p className="text-xs text-muted-foreground">{t("chat.askAnother")}</p>
                <MicButton size="lg" onClick={handleMicClick} isListening={isListening} />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
