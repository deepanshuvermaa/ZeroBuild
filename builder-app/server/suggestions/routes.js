import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAdmin, optionalAuth } from '../auth/middleware.js';

const router = Router();

// POST /api/suggestions — anyone can submit
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { text, email, name } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Suggestion text is required' });

    const userId = req.user?.id || null;
    const submittedBy = name || req.user?.email || email || 'Anonymous';

    await query(
      `INSERT INTO suggestions (user_id, submitted_by, text) VALUES ($1, $2, $3)`,
      [userId, submittedBy, text.trim()]
    );

    res.json({ success: true, message: 'Suggestion submitted. Thank you!' });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
});

// GET /api/suggestions — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM suggestions ORDER BY created_at DESC`);
    res.json({ suggestions: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

export default router;
