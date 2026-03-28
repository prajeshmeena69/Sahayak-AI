import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const client = new TranslateClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

// In-memory cache: "key:langCode" -> translated string
const cache = new Map<string, string>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === "en") return text;

  const cacheKey = `${targetLang}:${text}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const cmd = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: "en",
      TargetLanguageCode: targetLang,
    });
    const res = await client.send(cmd);
    const translated = res.TranslatedText || text;
    cache.set(cacheKey, translated);
    return translated;
  } catch (err) {
    console.error("AWS Translate failed:", err);
    return text; // fallback to English
  }
}

/** Translate a whole record of strings at once, returns translated record */
export async function translateRecord<T extends Record<string, string>>(
  record: T,
  targetLang: string
): Promise<T> {
  if (targetLang === "en") return record;

  const entries = Object.entries(record) as [keyof T, string][];
  const translated = await Promise.all(
    entries.map(async ([key, value]) => [key, await translateText(value, targetLang)] as const)
  );
  return Object.fromEntries(translated) as T;
}
