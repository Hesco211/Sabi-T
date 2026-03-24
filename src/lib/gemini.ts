import { GoogleGenAI } from "@google/genai";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const LEGACY_MODEL_ALIASES: Record<string, string> = {
  "gemini-1.5-flash": DEFAULT_GEMINI_MODEL,
};

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or GOOGLE_API_KEY.");
  }

  return apiKey;
}

function getModelName() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  if (!configuredModel) {
    return DEFAULT_GEMINI_MODEL;
  }

  return LEGACY_MODEL_ALIASES[configuredModel] || configuredModel;
}

function getClient() {
  return new GoogleGenAI({ apiKey: getApiKey() });
}

export async function generateGeminiText(
  prompt: string,
  systemInstruction?: string
) {
  const client = getClient();
  const result = await client.models.generateContent({
    model: getModelName(),
    config: systemInstruction ? { systemInstruction } : undefined,
    contents: prompt,
  });

  return result.text?.trim() || "";
}

export async function generateGeminiJson<T>(
  prompt: string,
  systemInstruction?: string
) {
  const client = getClient();
  const result = await client.models.generateContent({
    model: getModelName(),
    config: {
      responseMimeType: "application/json",
      ...(systemInstruction ? { systemInstruction } : {}),
    },
    contents: prompt,
  });

  const text = result.text?.trim() || "";
  const normalized = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(normalized) as T;
}
