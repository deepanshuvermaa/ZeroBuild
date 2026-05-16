import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAdmin } from '../auth/middleware.js';

const router = Router();

// GET /api/admin/stats — all users + usage stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const users = await query(`SELECT id, email, name, plan, role, ai_credits_remaining, ai_credits_monthly_limit, is_verified, created_at FROM users ORDER BY created_at DESC`);
    const allProjects = await query(`SELECT user_id FROM projects`);
    const allGenerations = await query(`SELECT user_id, status, tokens_used FROM ai_generations`);
    const suggestions = await query(`SELECT * FROM suggestions ORDER BY created_at DESC`);

    // Aggregate in JS instead of SQL GROUP BY (in-memory DB can't handle it)
    const projectMap = {};
    allProjects.rows.forEach(r => {
      projectMap[r.user_id] = (projectMap[r.user_id] || 0) + 1;
    });

    const genMap = {};
    allGenerations.rows.forEach(r => {
      if (!genMap[r.user_id]) genMap[r.user_id] = { total: 0, tokens: 0, failures: 0 };
      genMap[r.user_id].total++;
      genMap[r.user_id].tokens += Number(r.tokens_used) || 0;
      if (r.status === 'failed') genMap[r.user_id].failures++;
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
