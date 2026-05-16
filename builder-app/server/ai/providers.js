/**
 * AI provider key pools with round-robin rotation.
 * Add more keys by appending GEMINI_KEY_4, GROQ_KEY_3, etc. in .env
 */

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
].filter(Boolean);

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
].filter(Boolean);

let geminiIndex = 0;
let groqIndex = 0;

export function getGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[geminiIndex % GEMINI_KEYS.length];
  geminiIndex++;
  return key;
}

export function getGroqKey() {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[groqIndex % GROQ_KEYS.length];
  groqIndex++;
  return key;
}

export { GEMINI_KEYS, GROQ_KEYS };
