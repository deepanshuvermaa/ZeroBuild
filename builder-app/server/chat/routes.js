import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../auth/middleware.js';
import { aiComplete } from '../ai/client.js';

const router = Router();
router.use(requireAuth);

// GET /api/chat/:projectId — load messages (+ summary if exists)
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await query(
      'SELECT id, role, content, created_at FROM chat_messages WHERE project_id = $1 AND user_id = $2 ORDER BY created_at ASC',
      [projectId, req.user.id]
    );
    const summary = await query(
      'SELECT summary FROM chat_summaries WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );
    res.json({ messages: messages.rows, summary: summary.rows[0]?.summary || null });
  } catch (error) {
    console.error('Chat load error:', error);
    res.status(500).json({ error: 'Failed to load chat' });
  }
});

// POST /api/chat/:projectId — store a message
router.post('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role, content } = req.body;
    if (!role || !content) return res.status(400).json({ error: 'role and content required' });

    const result = await query(
      'INSERT INTO chat_messages (project_id, user_id, role, content) VALUES ($1, $2, $3, $4) RETURNING id, role, content, created_at',
      [projectId, req.user.id, role, content]
    );
    res.json({ message: result.rows[0] });
  } catch (error) {
    console.error('Chat store error:', error);
    res.status(500).json({ error: 'Failed to store message' });
  }
});

// POST /api/chat/:projectId/summarize — summarize messages older than 15 days
router.post('/:projectId/summarize', async (req, res) => {
  try {
    const { projectId } = req.params;
    const oldMessages = await query(
      `SELECT role, content FROM chat_messages WHERE project_id = $1 AND user_id = $2 AND created_at < NOW() - INTERVAL '15 days' ORDER BY created_at ASC`,
      [projectId, req.user.id]
    );

    if (oldMessages.rows.length === 0) return res.json({ summarized: false, message: 'No old messages to summarize' });

    const chatText = oldMessages.rows.map(m => `${m.role}: ${m.content}`).join('\n');
    const summary = await aiComplete({
      systemPrompt: 'Summarize this conversation between a user and an AI website builder. Keep key decisions, preferences, and context. Be concise (max 200 words).',
      userPrompt: chatText,
      maxTokens: 512,
    });

    // Upsert summary
    const existing = await query('SELECT id FROM chat_summaries WHERE project_id = $1 AND user_id = $2', [projectId, req.user.id]);
    if (existing.rows.length > 0) {
      await query('UPDATE chat_summaries SET summary = $1, updated_at = NOW() WHERE project_id = $2 AND user_id = $3', [summary, projectId, req.user.id]);
    } else {
      await query('INSERT INTO chat_summaries (project_id, user_id, summary) VALUES ($1, $2, $3)', [projectId, req.user.id, summary]);
    }

    // Delete old messages
    await query(`DELETE FROM chat_messages WHERE project_id = $1 AND user_id = $2 AND created_at < NOW() - INTERVAL '15 days'`, [projectId, req.user.id]);

    res.json({ summarized: true, summary, deletedCount: oldMessages.rows.length });
  } catch (error) {
    console.error('Chat summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

// DELETE /api/chat/:projectId — cleanup messages older than 30 days entirely
router.delete('/:projectId/cleanup', async (req, res) => {
  try {
    const { projectId } = req.params;
    await query(`DELETE FROM chat_messages WHERE project_id = $1 AND user_id = $2 AND created_at < NOW() - INTERVAL '30 days'`, [projectId, req.user.id]);
    await query(`DELETE FROM chat_summaries WHERE project_id = $1 AND user_id = $2 AND updated_at < NOW() - INTERVAL '30 days'`, [projectId, req.user.id]);
    res.json({ cleaned: true });
  } catch (error) {
    console.error('Chat cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup' });
  }
});

export default router;
