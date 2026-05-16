/**
 * AI client with Gemini (primary) + Groq (fallback).
 * Handles 429 rate limits with exponential backoff per key.
 */

import OpenAI from 'openai';
import { getGeminiKey, getGroqKey, GEMINI_KEYS, GROQ_KEYS } from './providers.js';

function extractJSON(text) {
  if (!text) throw new Error('Empty response from AI');
  try { return JSON.parse(text); } catch {}
  const mdMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (mdMatch) try { return JSON.parse(mdMatch[1].trim()); } catch {}
  const objMatch = text.match(/(\{[\s\S]*\})/);
  if (objMatch) try { return JSON.parse(objMatch[1]); } catch {}
  throw new Error('Could not extract JSON from response');
}

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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Track which keys are rate-limited and when they can be retried
const rateLimitedUntil = new Map(); // key -> timestamp

function isKeyAvailable(key) {
  const until = rateLimitedUntil.get(key);
  if (!until) return true;
  if (Date.now() > until) { rateLimitedUntil.delete(key); return true; }
  return false;
}

function markKeyRateLimited(key, retryAfterMs = 60000) {
  rateLimitedUntil.set(key, Date.now() + retryAfterMs);
}

async function callGemini(key, systemPrompt, userPrompt, maxTokens, json) {
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

  return res.choices[0].message.content;
}

async function callGroq(key, systemPrompt, userPrompt, maxTokens, json) {
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

  return res.choices[0].message.content;
}

export async function aiComplete({ systemPrompt, userPrompt, maxTokens = 4096, json = false }) {
  const errors = [];

  // ── Try Gemini keys (skip rate-limited ones) ─────────────────────────
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = getGeminiKey();
    if (!isKeyAvailable(key)) {
      errors.push(`Gemini[${i}]: rate-limited, skipping`);
      continue;
    }

    try {
      const text = await callGemini(key, systemPrompt, userPrompt, maxTokens, json);
      const result = json ? extractJSON(text) : text;
      return json ? sanitizeOutput(result) : result;
    } catch (err) {
      const msg = err?.message || String(err);
      const status = err?.status || err?.response?.status;

      if (status === 429) {
        // Parse retry-after or default to 60s
        const retryAfter = parseInt(err?.headers?.['retry-after'] || '60') * 1000;
        markKeyRateLimited(key, retryAfter);
        errors.push(`Gemini[${i}]: 429 rate limited (cooling ${retryAfter / 1000}s)`);
      } else {
        errors.push(`Gemini[${i}]: ${msg}`);
      }
      console.warn(`[AI] Gemini key ${i + 1}/${GEMINI_KEYS.length} failed: ${msg}`);
    }
  }

  // ── Fallback: Groq ───────────────────────────────────────────────────
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const key = getGroqKey();
    if (!isKeyAvailable(key)) {
      errors.push(`Groq[${i}]: rate-limited, skipping`);
      continue;
    }

    try {
      const text = await callGroq(key, systemPrompt, userPrompt, maxTokens, json);
      console.log(`[AI] Used Groq fallback (key ${i + 1})`);
      const result = json ? extractJSON(text) : text;
      return json ? sanitizeOutput(result) : result;
    } catch (err) {
      const msg = err?.message || String(err);
      const status = err?.status || err?.response?.status;

      if (status === 429) {
        markKeyRateLimited(key, 60000);
      }
      errors.push(`Groq[${i}]: ${msg}`);
      console.warn(`[AI] Groq key ${i + 1}/${GROQ_KEYS.length} failed: ${msg}`);
    }
  }

  // ── Last resort: wait 5s and retry one Gemini key ────────────────────
  if (GEMINI_KEYS.length > 0) {
    console.log('[AI] All keys exhausted. Waiting 5s for one final retry...');
    await sleep(5000);
    const key = GEMINI_KEYS[0];
    try {
      const text = await callGemini(key, systemPrompt, userPrompt, maxTokens, json);
      console.log('[AI] Final retry succeeded');
      const result = json ? extractJSON(text) : text;
      return json ? sanitizeOutput(result) : result;
    } catch (err) {
      errors.push(`Final retry: ${err?.message || String(err)}`);
    }
  }

  throw new Error(`All AI providers exhausted. Errors: ${errors.join(' | ')}`);
}
