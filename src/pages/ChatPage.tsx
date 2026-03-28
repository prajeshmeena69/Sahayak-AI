import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Volume2, VolumeX, Send, Trash2 } from "lucide-react";
import MicButton from "@/components/MicButton";
import { useChat } from "@/context/ChatContext";
import { startListening, stopListening, isSpeechSupported } from "@/utils/speechToText";
import { useLanguage } from "@/i18n/LanguageContext";
import { SUPPORTED_LANGS } from "@/i18n/translations";
import leafDecoration from "@/assets/leaf-decoration.png";

const ChatPage = () => {
  const { state, sendMessage, resetChat } = useChat();
  const { status, messages } = state;
  const { t, lang } = useLanguage();
  const speechLocale = SUPPORTED_LANGS.find((l) => l.code === lang)?.speechLocale ?? "hi-IN";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => { stopListening(); audioRef.current?.pause(); }, []);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status === "processing") return;
    setInputText("");
    sendMessage(trimmed, lang);
  };

  const handleMicClick = () => {
    if (status === "processing") return;
    if (isListening) {
      // Second click — stop and send whatever was recorded
      setIsListening(false);
      stopListening(); // this fires the onResult callback with accumulated text
      return;
    }
    if (!isSpeechSupported()) return;
    setIsListening(true);
    startListening(
      speechLocale,
      (transcript) => {
        // Called by stopListening when user clicks mic again
        setIsListening(false);
        if (transcript.trim()) handleSend(transcript);
      },
      (err) => {
        console.warn("Speech error:", err);
        setIsListening(false);
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

  return (
    <div className="pt-14 h-screen bg-gradient-earth flex flex-col relative overflow-hidden">
      <img src={leafDecoration} alt="" className="absolute top-20 -right-16 w-48 opacity-10 rotate-12 pointer-events-none select-none" loading="lazy" />
      <img src={leafDecoration} alt="" className="absolute bottom-20 -left-16 w-40 opacity-10 -rotate-45 pointer-events-none select-none" loading="lazy" />
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, hsl(142 52% 36% / 0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="flex-1 container max-w-lg flex flex-col relative z-10 overflow-hidden">

        {/* IDLE STATE */}
        {showIdle && !isListening && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
              <Bot size={36} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-2">{t("chat.idle")}</p>
              <p className="text-sm text-muted-foreground">{t("chat.idleSub")}</p>
            </div>
            <MicButton onClick={handleMicClick} isListening={false} />
            <div className="space-y-2 max-w-sm w-full">
              {[t("chat.hint1"), t("chat.hint2"), t("chat.hint3")].map((hint, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                  className="text-xs text-muted-foreground bg-secondary/60 rounded-xl px-4 py-2.5 text-left border border-border/50 cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => handleSend(hint)}>
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

        {/* MESSAGES */}
        {!showIdle && !isListening && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat header with clear button */}
            <div className="flex justify-end py-2 shrink-0">
              <button
                onClick={() => { resetChat(); audioRef.current?.pause(); setPlayingIndex(null); }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-xl hover:bg-destructive/5"
              >
                <Trash2 size={13} />
                Clear chat
              </button>
            </div>

            {/* Scrollable messages — scrollbar hidden so it doesn't appear mid-page */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    {msg.from === "bot" && msg.audioUrl && (
                      <button onClick={() => handlePlay(msg.audioUrl!, i)}
                        className="flex items-center gap-1.5 text-xs text-accent font-medium px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors border border-accent/10 self-start">
                        {playingIndex === i
                          ? <><VolumeX size={14} /> {t("chat.stop")}</>
                          : <><Volume2 size={14} /> {t("chat.listen")}</>}
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

            {/* Processing indicator */}
            {status === "processing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                  <Bot size={18} className="text-primary" />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-card border border-border rounded-bl-md">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          </div>
        )}
      </div>

      {/* INPUT BAR — always visible at bottom */}
      {!isListening && (
        <div className="border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2">
            {/* Compact mic button */}
            <button
              onClick={handleMicClick}
              disabled={status === "processing"}
              className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground shadow-soft shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-secondary focus-within:border-primary transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
                placeholder={t("chat.idleSub")}
                disabled={status === "processing"}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || status === "processing"}
                className="text-primary disabled:opacity-30 hover:text-primary/80 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
