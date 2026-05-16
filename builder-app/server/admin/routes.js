import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAdmin } from '../auth/middleware.js';

const router = Router();

// GET /api/admin/stats — all users + usage stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const users = await query(`SELECT id, email, name, plan, ai_credits_remaining, ai_credits_monthly_limit, is_verified, created_at FROM users ORDER BY created_at DESC`);
    const projects = await query(`SELECT user_id, COUNT(*) AS count FROM projects GROUP BY user_id`);
    const generations = await query(`SELECT user_id, COUNT(*) AS total, SUM(tokens_used) AS tokens, COUNT(CASE WHEN status = 'failed' THEN 1 END) AS failures FROM ai_generations GROUP BY user_id`);
    const suggestions = await query(`SELECT * FROM suggestions ORDER BY created_at DESC`);

    // Map project counts by user
    const projectMap = {};
    projects.rows.forEach(r => { projectMap[r.user_id] = Number(r.count); });

    const genMap = {};
    generations.rows.forEach(r => {
      genMap[r.user_id] = {
        total: Number(r.total),
        tokens: Number(r.tokens) || 0,
        failures: Number(r.failures) || 0,
      };
    });

    const enriched = users.rows.map(u => ({
      ...u,
      projects_count: projectMap[u.id] || 0,
      ai_generations: genMap[u.id]?.total || 0,
      tokens_used: genMap[u.id]?.tokens || 0,
      failures: genMap[u.id]?.failures || 0,
      credits_used: u.ai_credits_monthly_limit - u.ai_credits_remaining,
    }));

    res.json({
      users: enriched,
      suggestions: suggestions.rows,
      totals: {
        users: enriched.length,
        projects: Object.values(projectMap).reduce((a, b) => a + b, 0),
        generations: Object.values(genMap).reduce((a, g) => a + g.total, 0),
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
