import OpenAI from "openai";

// Actual API provider is DeepSeek (OpenAI-compatible SDK).
// Use OPENAI_API_KEY / OPENAI_MODEL / OPENAI_BASE_URL env vars for config.
// Default baseURL points to DeepSeek.

export const provider = "deepseek";

export const MODEL = process.env.OPENAI_MODEL ?? "deepseek-chat";

let _openai: OpenAI | null = null;

/**
 * Lazily initializes and returns the OpenAI-compatible client (DeepSeek).
 * Construction is deferred until first call, so importing this module
 * doesn't crash at build time when env vars are absent.
 */
export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? "",
      baseURL: process.env.OPENAI_BASE_URL ?? "https://api.deepseek.com",
    });
  }
  return _openai;
}

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
