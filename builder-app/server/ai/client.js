/**
 * Provider-agnostic AI client.
 * Tries ALL Gemini keys (round-robin start), then ALL Groq keys.
 * Both use the OpenAI-compatible API format.
 */

import OpenAI from 'openai';
import { getGeminiKey, getGroqKey, GEMINI_KEYS, GROQ_KEYS } from './providers.js';

function extractJSON(text) {
  if (!text) throw new Error('Empty response from AI');
  try {
    return JSON.parse(text);
  } catch {
    const mdMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (mdMatch) return JSON.parse(mdMatch[1].trim());
    const objMatch = text.match(/(\{[\s\S]*\})/);
    if (objMatch) return JSON.parse(objMatch[1]);
    throw new Error('Could not extract JSON from response');
  }
}

/**
 * Sanitize AI output to prevent React rendering crashes (Error #31).
 * Ensures all values that should be strings ARE strings.
 */
function sanitizeOutput(obj) {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeOutput);
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeOutput(value);
    } else if (value === undefined || value === null) {
      clean[key] = '';
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Call AI with automatic provider fallback + full key rotation.
 * Tries ALL Gemini keys before falling back to ALL Groq keys.
 */
export async function aiComplete({ systemPrompt, userPrompt, maxTokens = 4096, json = false }) {
  const errors = [];

  // ── Try ALL Gemini keys ──────────────────────────────────────────────
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = getGeminiKey();
    try {
      const client = new OpenAI({
        apiKey: key,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });

      const res = await client.chat.completions.create({
        model: 'gemini-2.0-flash',
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      });

      const text = res.choices[0].message.content;
      const result = json ? extractJSON(text) : text;
      return json ? sanitizeOutput(result) : result;
    } catch (err) {
      const msg = err?.message || String(err);
      errors.push(`Gemini[${i}]: ${msg}`);
      console.warn(`[AI] Gemini key ${i + 1}/${GEMINI_KEYS.length} failed: ${msg}`);
    }
  }

  // ── Fallback: try ALL Groq keys ──────────────────────────────────────
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const key = getGroqKey();
    try {
      const client = new OpenAI({
        apiKey: key,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      const res = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: Math.min(maxTokens, 8192),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      });

      const text = res.choices[0].message.content;
      console.log(`[AI] Used Groq fallback (key ${i + 1})`);
      const result = json ? extractJSON(text) : text;
      return json ? sanitizeOutput(result) : result;
    } catch (err) {
      const msg = err?.message || String(err);
      errors.push(`Groq[${i}]: ${msg}`);
      console.warn(`[AI] Groq key ${i + 1}/${GROQ_KEYS.length} failed: ${msg}`);
    }
  }

  throw new Error(`All AI providers exhausted. Errors: ${errors.join(' | ')}`);
}
