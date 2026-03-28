import { createContext, useContext, useReducer, useRef, type ReactNode } from "react";
import { askAI } from "@/services/geminiService";
import { synthesizeSpeech } from "@/services/pollyService";

export type Lang = "hi" | "en";
export type ChatStatus = "idle" | "processing" | "done";

export interface ChatMessage {
  from: "bot" | "user";
  text: string;
  audioUrl?: string;
}

interface ChatState {
  status: ChatStatus;
  messages: ChatMessage[];
}

type ChatAction =
  | { type: "SET_STATUS"; payload: ChatStatus }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_AUDIO_ON_LAST"; payload: string }
  | { type: "RESET" };

const initialState: ChatState = { status: "idle", messages: [] };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_STATUS": return { ...state, status: action.payload };
    case "ADD_MESSAGE": return { ...state, messages: [...state.messages, action.payload] };
    case "SET_AUDIO_ON_LAST": {
      const msgs = [...state.messages];
      if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], audioUrl: action.payload };
      return { ...state, messages: msgs };
    }
    case "RESET": return { ...initialState };
    default: return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  sendMessage: (text: string, lang: string) => Promise<void>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const sendMessage = async (text: string, lang: string) => {
    dispatch({ type: "ADD_MESSAGE", payload: { from: "user", text } });
    dispatch({ type: "SET_STATUS", payload: "processing" });

    historyRef.current.push({ role: "user", content: text });

    try {
      const reply = await askAI(historyRef.current, lang);
      historyRef.current.push({ role: "assistant", content: reply });

      dispatch({ type: "ADD_MESSAGE", payload: { from: "bot", text: reply } });

      // Generate audio for the bot reply
      const audioUrl = await synthesizeSpeech(reply, lang as Lang);
      if (audioUrl) dispatch({ type: "SET_AUDIO_ON_LAST", payload: audioUrl });

      dispatch({ type: "SET_STATUS", payload: "done" });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  };

  const resetChat = () => {
    historyRef.current = [];
    dispatch({ type: "RESET" });
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
