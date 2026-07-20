import OpenAI from "openai";

// Auto-detect provider: use DeepSeek if key present, otherwise OpenAI
const useDeepSeek = !!process.env.DEEPSEEK_API_KEY;

export const provider = useDeepSeek ? "deepseek" : "openai";

export const MODEL = useDeepSeek
  ? (process.env.DEEPSEEK_MODEL ?? "deepseek-chat")
  : (process.env.OPENAI_MODEL ?? "gpt-5.6");

export const openai = new OpenAI({
  apiKey: useDeepSeek ? (process.env.DEEPSEEK_API_KEY ?? "") : (process.env.OPENAI_API_KEY ?? ""),
  baseURL: useDeepSeek ? "https://api.deepseek.com" : undefined,
});

/**
 * Extracts and parses a JSON object from potentially messy assistant output.
 * Strips markdown code blocks if present and grabs the first { ... } structure.
 */
export function safeParseJson<T>(content: string): T {
  let jsonStr = content.trim();

  // Strip markdown code blocks (e.g. ```json or ```)
  if (jsonStr.startsWith("```")) {
    const lines = jsonStr.split("\n");
    jsonStr = lines.slice(1, -1).join("\n");
  }

  // Find first bounding bracket match
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object structure found in response");
  }

  return JSON.parse(jsonMatch[0]) as T;
}
