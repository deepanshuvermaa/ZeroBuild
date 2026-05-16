import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';
import { generateFullPage, editSection, rewriteCopy, generateSEO } from './orchestrator.js';

const router = Router();

async function checkAndConsumeCredits(userId, cost) {
  const result = await query(
    'SELECT ai_credits_remaining FROM users WHERE id = $1',
    [userId]
  );
  if (result.rows.length === 0) throw { status: 404, message: 'User not found' };
  const remaining = result.rows[0].ai_credits_remaining;
  if (remaining < cost) throw { status: 402, message: `Not enough AI credits. Need ${cost}, have ${remaining}.` };
  await query(
    'UPDATE users SET ai_credits_remaining = ai_credits_remaining - $1, updated_at = NOW() WHERE id = $2',
    [cost, userId]
  );
}

async function refundCredits(userId, cost) {
  await query(
    'UPDATE users SET ai_credits_remaining = ai_credits_remaining - $1, updated_at = NOW() WHERE id = $2',
    [-cost, userId] // negative decrement = add back
  );
}

// ── Guest preview (no auth) — Phase 2 ─────────────────────────────────
const guestSessions = new Map(); // sessionId -> { config, createdAt }

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of guestSessions) {
    if (now - session.createdAt > 15 * 60 * 1000) guestSessions.delete(id);
  }
}, 5 * 60 * 1000);

router.post('/guest-preview', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const config = await generateFullPage(prompt);
    const sessionId = crypto.randomUUID();
    guestSessions.set(sessionId, { config, createdAt: Date.now() });

    res.cookie('guest_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.json({
      sessionId,
      sectionCount: config.sections.length,
      sectionTypes: config.sections.map(s => s.type),
      theme: config.theme,
    });
  } catch (error) {
    console.error('Guest preview error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Claim guest session after signup
router.post('/claim-session', requireAuth, async (req, res) => {
  try {
    const sessionId = req.cookies?.guest_session || req.body.sessionId;
    if (!sessionId || !guestSessions.has(sessionId)) {
      return res.status(404).json({ error: 'No guest session found or session expired' });
    }

    const { config } = guestSessions.get(sessionId);
    guestSessions.delete(sessionId);
    res.clearCookie('guest_session', { path: '/' });

    // Create project for user
    const result = await query(
      `INSERT INTO projects (user_id, name, slug, config) VALUES ($1, $2, $3, $4) RETURNING id, name, slug, config, status, created_at`,
      [req.user.id, config.metadata.projectName || 'My AI Website', 'ai-generated-' + Date.now(), JSON.stringify(config)]
    );

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Claim session error:', error);
    res.status(500).json({ error: 'Failed to claim session' });
  }
});

// ── Authenticated routes ───────────────────────────────────────────────
router.use(requireAuth);

// POST /generate — full page generation with credit refund on failure
router.post('/generate', async (req, res) => {
  try {
    const { prompt, projectId } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const cost = 8;
    await checkAndConsumeCredits(req.user.id, cost);

    const startTime = Date.now();

    await query(
      `INSERT INTO ai_generations (user_id, project_id, prompt, generation_type, model, credits_consumed, status)
       VALUES ($1, $2, $3, 'full_page', 'gemini-2.0-flash', $4, 'processing')
       RETURNING id`,
      [req.user.id, projectId || null, prompt, cost]
    );

    let pageConfig;
    try {
      pageConfig = await generateFullPage(prompt);
    } catch (genError) {
      // Refund credits on AI failure
      await refundCredits(req.user.id, cost);
      console.error('Generation failed, credits refunded:', genError.message);
      return res.status(500).json({ error: 'Generation failed. Credits have been refunded.' });
    }

    const durationMs = Date.now() - startTime;

    await query(
      `UPDATE ai_generations SET status = 'completed', output_config = $1, duration_ms = $2 WHERE user_id = $3`,
      [JSON.stringify(pageConfig), durationMs, req.user.id]
    );

    res.json({ config: pageConfig });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// POST /edit — edit a section
router.post('/edit', async (req, res) => {
  try {
    const { projectId, sectionId, instruction, currentConfig } = req.body;
    if (!sectionId || !instruction || !currentConfig) {
      return res.status(400).json({ error: 'sectionId, instruction, and currentConfig are required' });
    }

    const cost = 1;
    await checkAndConsumeCredits(req.user.id, cost);

    const startTime = Date.now();

    let newProps;
    try {
      newProps = await editSection(currentConfig, sectionId, instruction);
    } catch (editError) {
      await refundCredits(req.user.id, cost);
      return res.status(500).json({ error: 'Edit failed. Credit refunded.' });
    }

    const durationMs = Date.now() - startTime;
    res.json({ props: newProps, durationMs });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error('Edit error:', error);
    res.status(500).json({ error: 'Edit failed' });
  }
});

// POST /rewrite-copy
router.post('/rewrite-copy', async (req, res) => {
  try {
    const { sectionType, currentProps, instruction } = req.body;
    if (!sectionType || !currentProps || !instruction) {
      return res.status(400).json({ error: 'sectionType, currentProps, and instruction are required' });
    }

    const cost = 1;
    await checkAndConsumeCredits(req.user.id, cost);

    let newProps;
    try {
      newProps = await rewriteCopy(sectionType, currentProps, instruction);
    } catch (err) {
      await refundCredits(req.user.id, cost);
      return res.status(500).json({ error: 'Rewrite failed. Credit refunded.' });
    }

    res.json({ props: newProps });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error('Rewrite copy error:', error);
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

// POST /seo
router.post('/seo', async (req, res) => {
  try {
    const { config } = req.body;
    if (!config) return res.status(400).json({ error: 'config is required' });

    const cost = 2;
    await checkAndConsumeCredits(req.user.id, cost);

    let seo;
    try {
      seo = await generateSEO(config);
    } catch (err) {
      await refundCredits(req.user.id, cost);
      return res.status(500).json({ error: 'SEO generation failed. Credits refunded.' });
    }

    res.json({ seo });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error('SEO error:', error);
    res.status(500).json({ error: 'SEO generation failed' });
  }
});

// GET /credits
router.get('/credits', async (req, res) => {
  try {
    const result = await query(
      'SELECT ai_credits_remaining, ai_credits_monthly_limit, credits_reset_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const { ai_credits_remaining, ai_credits_monthly_limit, credits_reset_at } = result.rows[0];
    res.json({ remaining: ai_credits_remaining, limit: ai_credits_monthly_limit, resetsAt: credits_reset_at });
  } catch (error) {
    console.error('Credits error:', error);
    res.status(500).json({ error: 'Failed to get credits' });
  }
});

export default router;
