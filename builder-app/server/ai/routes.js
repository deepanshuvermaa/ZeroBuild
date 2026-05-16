import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../auth/middleware.js';
import { generateFullPage, editSection, rewriteCopy, generateSEO } from './orchestrator.js';

const router = Router();

router.use(requireAuth);

async function checkAndConsumeCredits(userId, cost) {
  const result = await query(
    'SELECT ai_credits_remaining FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: 'User not found' };
  }

  const remaining = result.rows[0].ai_credits_remaining;
  if (remaining < cost) {
    throw { status: 402, message: `Not enough AI credits. Need ${cost}, have ${remaining}.` };
  }

  await query(
    'UPDATE users SET ai_credits_remaining = ai_credits_remaining - $1, updated_at = NOW() WHERE id = $2',
    [cost, userId]
  );
}

// POST /generate — full page generation
router.post('/generate', async (req, res) => {
  try {
    const { prompt, projectId } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cost = 8;
    await checkAndConsumeCredits(req.user.id, cost);

    const startTime = Date.now();

    // Create ai_generations record
    const genRecord = await query(
      `INSERT INTO ai_generations (user_id, project_id, prompt, generation_type, model, credits_consumed, status)
       VALUES ($1, $2, $3, 'full_page', 'claude-sonnet-4-6', $4, 'processing')
       RETURNING id`,
      [req.user.id, projectId || null, prompt, cost]
    );

    const pageConfig = await generateFullPage(prompt);
    const durationMs = Date.now() - startTime;

    // Update generation record
    await query(
      `UPDATE ai_generations SET status = 'completed', output_config = $1, duration_ms = $2 WHERE id = $3`,
      [JSON.stringify(pageConfig), durationMs, genRecord.rows[0].id]
    );

    res.json({ config: pageConfig });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
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

    await query(
      `INSERT INTO ai_generations (user_id, project_id, prompt, generation_type, model, credits_consumed, status)
       VALUES ($1, $2, $3, 'edit', 'claude-sonnet-4-6', $4, 'processing')`,
      [req.user.id, projectId || null, instruction, cost]
    );

    const newProps = await editSection(currentConfig, sectionId, instruction);
    const durationMs = Date.now() - startTime;

    res.json({ props: newProps, durationMs });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
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

    const newProps = await rewriteCopy(sectionType, currentProps, instruction);
    res.json({ props: newProps });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Rewrite copy error:', error);
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

// POST /seo
router.post('/seo', async (req, res) => {
  try {
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ error: 'config is required' });
    }

    const cost = 2;
    await checkAndConsumeCredits(req.user.id, cost);

    const seo = await generateSEO(config);
    res.json({ seo });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { ai_credits_remaining, ai_credits_monthly_limit, credits_reset_at } = result.rows[0];
    res.json({
      remaining: ai_credits_remaining,
      limit: ai_credits_monthly_limit,
      resetsAt: credits_reset_at,
    });
  } catch (error) {
    console.error('Credits error:', error);
    res.status(500).json({ error: 'Failed to get credits' });
  }
});

export default router;
