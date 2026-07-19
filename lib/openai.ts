import OpenAI from "openai";

// Auto-detect provider: use DeepSeek if key present, otherwise OpenAI
const useDeepSeek = !!process.env.DEEPSEEK_API_KEY;

export const provider = useDeepSeek ? "deepseek" : "openai";

export const MODEL = useDeepSeek
  ? (process.env.DEEPSEEK_MODEL ?? "deepseek-chat")
  : (process.env.OPENAI_MODEL ?? "gpt-5.6");

export const openai = new OpenAI({
  apiKey: useDeepSeek
    ? (process.env.DEEPSEEK_API_KEY ?? "")
    : (process.env.OPENAI_API_KEY ?? ""),
  baseURL: useDeepSeek ? "https://api.deepseek.com" : undefined,
});
