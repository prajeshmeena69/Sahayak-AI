import { PollyClient, SynthesizeSpeechCommand, Engine, OutputFormat, TextType, VoiceId } from "@aws-sdk/client-polly";

const client = new PollyClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const VOICE_MAP: Record<string, VoiceId> = {
  hi: "Aditi",
  en: "Joanna",
};

/**
 * Convert text to speech using AWS Polly.
 * Returns a blob URL that can be set as audio src.
 * Call URL.revokeObjectURL(url) after playback to free memory.
 */
export async function synthesizeSpeech(text: string, language: "hi" | "en"): Promise<string> {
  const awsKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  if (!awsKey) {
    console.warn("AWS credentials not set, skipping Polly.");
    return "";
  }

  const voiceId = VOICE_MAP[language] || "Joanna";

  try {
    const cmd = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: OutputFormat.MP3,
      VoiceId: voiceId,
      Engine: Engine.STANDARD,
      TextType: TextType.TEXT,
      LanguageCode: language === "hi" ? "hi-IN" : "en-US",
    });

    const res = await client.send(cmd);
    if (!res.AudioStream) throw new Error("No audio stream returned from Polly");

    // Convert ReadableStream / Uint8Array to Blob URL
    const chunks: Uint8Array[] = [];
    const reader = (res.AudioStream as any).getReader?.();

    if (reader) {
      // Web ReadableStream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } else if (res.AudioStream instanceof Uint8Array) {
      chunks.push(res.AudioStream);
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("AWS Polly failed:", err);
    return "";
  }
}
