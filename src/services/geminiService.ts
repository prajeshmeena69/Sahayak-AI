const LANG_NAME: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  bn: "Bengali",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
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
 * General-purpose AI assistant for farmers.
 * Answers any farming-related question in the farmer's language.
 */
export async function askAI(
  history: Message[],
  language: string
): Promise<string> {
  const langName = LANG_NAME[language] ?? "Hindi";

  const systemPrompt = `You are Sahayak AI, a friendly and knowledgeable assistant for Indian farmers. You help farmers with all their questions — government schemes, crop advice, weather, prices, diseases, loans, and anything else they need.

Rules:
- Always reply in simple, easy-to-understand ${langName} only
- Keep replies concise (3-6 lines max) and practical
- Be warm, supportive, and encouraging
- Do NOT use markdown formatting — plain text only
- If asked about government schemes, mention relevant ones with benefit amounts
- If asked about crops, give practical actionable advice`;

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...history,
  ];

  try {
    const text = await callModel(messages, 500);
    if (!text) throw new Error("Empty response");
    return text;
  } catch (err: any) {
    console.error("AI error:", err?.message || err);
    const langCode = language as keyof typeof LANG_NAME;
    return langCode === "en"
      ? "Sorry, something went wrong. Please try again."
      : "माफ़ करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।";
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

export interface SchemeResult {
  name: string;
  benefit: string;
  description: string;
  howToApply: string;
}

/**
 * Find farmer schemes based on structured inputs.
 */
export async function findSchemes(params: {
  state: string;
  need: string;
  landSize: string;
  language: string;
}): Promise<SchemeResult[]> {
  const langName = LANG_NAME[params.language] ?? "Hindi";

  const prompt = `You are an expert on Indian farmer schemes (both government and private).

A farmer has provided the following details:
- State: ${params.state}
- Need: ${params.need}
- Land size: ${params.landSize}

List the TOP 4 most relevant schemes (government or private) for this farmer.

IMPORTANT: Write the "description" and "howToApply" fields in ${langName} language only.

Respond with ONLY a valid JSON array, no markdown, no extra text:
[
  {
    "name": "Scheme name (keep original scheme name in English/Hindi)",
    "benefit": "Benefit amount or description in ${langName}",
    "description": "2-3 line description in simple ${langName}",
    "howToApply": "One line on how to apply in ${langName}"
  }
]`;

  try {
    const raw = await callModel([{ role: "user", content: prompt }], 800);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as SchemeResult[];
  } catch {
    return [];
  }
}
