const LANG_NAME: Record<string, string> = {
  hi: "Hindi",
  en: "English",
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001";

type Message = { role: string; content: string };

async function callModel(messages: Message[], maxTokens = 400): Promise<string> {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key) throw new Error("VITE_OPENROUTER_API_KEY not set");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}

/**
 * Answer a farmer's question using full conversation history.
 * Asks follow-up questions if needed to gather enough info.
 */
export async function askGemini(
  history: Message[],
  language: "hi" | "en"
): Promise<string> {
  const langName = LANG_NAME[language];

  const systemPrompt = `You are Sahayak AI, a helpful assistant for Indian farmers. Your job is to help farmers find government schemes they are eligible for.

Rules:
- Always reply in simple ${langName} only
- If you don't have enough information (land size, age, state, farmer status), ask ONE follow-up question at a time
- Once you have enough info, tell the farmer which schemes they qualify for with scheme name, benefit amount, and how to apply
- Keep replies short and simple (3-5 lines max)
- Do NOT use markdown formatting, just plain text
- Be warm and helpful`;

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...history,
  ];

  try {
    const text = await callModel(messages);
    if (!text) throw new Error("Empty response");
    return text;
  } catch (err: any) {
    console.error("Gemini error:", err?.message || err);
    return language === "hi"
      ? "माफ़ करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।"
      : "Sorry, something went wrong. Please try again.";
  }
}

export interface SchemeData {
  eligible: boolean;
  schemeName: string;
  benefit: string;
  reason: string;
  steps: string[];
  docs: string[];
}

/**
 * After conversation, extract structured scheme data if Gemini has enough info.
 * Returns null if more info is still needed.
 */
export async function extractSchemeData(
  history: Message[],
  language: "hi" | "en"
): Promise<SchemeData | null> {
  const extractPrompt = `Based on the conversation below, determine if there is enough information to recommend a specific Indian government scheme to the farmer.

If YES, respond with ONLY this exact JSON (no markdown, no extra text):
{"eligible":true,"schemeName":"scheme name","benefit":"benefit amount","reason":"why eligible in ${LANG_NAME[language]}","steps":["step1","step2","step3"],"docs":["doc1","doc2","doc3"]}

If NOT enough info yet, respond with ONLY:
{"eligible":false,"schemeName":"","benefit":"","reason":"","steps":[],"docs":[]}

Conversation:
${history.map((m) => `${m.role}: ${m.content}`).join("\n")}`;

  try {
    const raw = await callModel([{ role: "user", content: extractPrompt }], 500);
    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed: SchemeData = JSON.parse(jsonMatch[0]);
    // Only return if we have a real scheme name
    if (!parsed.schemeName || parsed.schemeName.trim() === "") return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Simplify a response text for a farmer audience.
 */
export async function simplifyResponse(
  text: string,
  language: "hi" | "en"
): Promise<string> {
  const langName = LANG_NAME[language];
  const prompt = `Simplify the following text in very simple ${langName} for a farmer. Do not change meaning. Keep it short, clear, and easy to understand. Return ONLY the simplified text, nothing else.\n\nText: ${text}`;
  try {
    return (await callModel([{ role: "user", content: prompt }])) || text;
  } catch {
    return text;
  }
}
