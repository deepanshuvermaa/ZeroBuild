/**
 * Provider-agnostic AI client.
 * Tries Gemini first (3 keys, round-robin), falls back to Groq (2 keys).
 * Both use the OpenAI-compatible API format — one SDK handles all.
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
 * Call AI with automatic provider fallback + key rotation.
 *
 * @param {object} opts
 * @param {string} opts.systemPrompt
 * @param {string} opts.userPrompt
 * @param {number} [opts.maxTokens=4096]
 * @param {boolean} [opts.json=false]  - parse response as JSON
 * @returns {Promise<string|object>}   - string if json=false, parsed object if json=true
 */
export async function aiComplete({ systemPrompt, userPrompt, maxTokens = 4096, json = false }) {
  const errors = [];

  // ── Try Gemini (3 keys, round-robin) ─────────────────────────────────
  if (GEMINI_KEYS.length > 0) {
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
      return json ? extractJSON(text) : text;
    } catch (err) {
      const msg = err?.message || String(err);
      errors.push(`Gemini: ${msg}`);
      console.warn(`[AI] Gemini failed (key rotated): ${msg}`);
    }
  }

  // ── Fallback: Groq (2 keys, round-robin) ─────────────────────────────
  if (GROQ_KEYS.length > 0) {
    const key = getGroqKey();
    try {
      const client = new OpenAI({
        apiKey: key,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      const res = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: Math.min(maxTokens, 8192), // Groq has lower token limits
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      });

      const text = res.choices[0].message.content;
      console.log('[AI] Used Groq fallback');
      return json ? extractJSON(text) : text;
    } catch (err) {
      const msg = err?.message || String(err);
      errors.push(`Groq: ${msg}`);
      console.warn(`[AI] Groq failed: ${msg}`);
    }
  }

  throw new Error(`All AI providers exhausted. Errors: ${errors.join(' | ')}`);
}
