import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

const PLAN_PROJECT_LIMITS = {
  free: 2,
  starter: 10,
  pro: 50,
  enterprise: 999999,
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

router.use(requireAuth);

// GET / — list user's projects
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, slug, status, thumbnail_url, updated_at FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ projects: result.rows });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// POST / — create project
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Check plan limit
    const limit = PLAN_PROJECT_LIMITS[req.user.plan] || 2;
    const countResult = await query(
      'SELECT COUNT(*)::int AS count FROM projects WHERE user_id = $1',
      [req.user.id]
    );
    if (countResult.rows[0].count >= limit) {
      return res.status(403).json({ error: `Project limit reached for your plan (${limit}). Upgrade to create more.` });
    }

    const slug = generateSlug(name);

    const defaultConfig = {
      metadata: {
        clientName: '',
        projectName: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0',
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        fontFamily: 'Inter',
      },
      whatsapp: { phoneNumber: '', defaultMessage: 'Hi!', enabled: false },
      seo: { title: name, description: '', keywords: [] },
      sections: [],
    };

    const result = await query(
      `INSERT INTO projects (user_id, name, slug, config)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, name, slug, JSON.stringify(defaultConfig)]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A project with that name already exists' });
    }
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /:id — get project
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// PUT /:id — update project
router.put('/:id', async (req, res) => {
  try {
    const { config, name } = req.body;

    // Verify ownership
    const existing = await query(
      'SELECT id, config FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
      updates.push(`slug = $${paramIndex}`);
      values.push(generateSlug(name));
      paramIndex++;
    }

    if (config) {
      updates.push(`config = $${paramIndex}`);
      values.push(JSON.stringify(config));
      paramIndex++;

      // Auto-create version
      const versionResult = await query(
        'SELECT COALESCE(MAX(version_number), 0) AS max_version FROM project_versions WHERE project_id = $1',
        [req.params.id]
      );
      const nextVersion = versionResult.rows[0].max_version + 1;

      await query(
        `INSERT INTO project_versions (project_id, version_number, config, change_description)
         VALUES ($1, $2, $3, $4)`,
        [req.params.id, nextVersion, JSON.stringify(config), `Version ${nextVersion}`]
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id);
    values.push(req.user.id);

    const result = await query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`,
      values
    );

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /:id/duplicate
router.post('/:id/duplicate', async (req, res) => {
  try {
    const existing = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check plan limit
    const limit = PLAN_PROJECT_LIMITS[req.user.plan] || 2;
    const countResult = await query(
      'SELECT COUNT(*)::int AS count FROM projects WHERE user_id = $1',
      [req.user.id]
    );
    if (countResult.rows[0].count >= limit) {
      return res.status(403).json({ error: `Project limit reached for your plan (${limit}).` });
    }

    const source = existing.rows[0];
    const newName = `${source.name}-copy`;
    const newSlug = generateSlug(newName);

    const result = await query(
      `INSERT INTO projects (user_id, name, slug, config)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, newName, newSlug, JSON.stringify(source.config)]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({ error: 'Failed to duplicate project' });
  }
});

// GET /:id/versions
router.get('/:id/versions', async (req, res) => {
  try {
    // Verify ownership
    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const result = await query(
      'SELECT * FROM project_versions WHERE project_id = $1 ORDER BY version_number DESC LIMIT 50',
      [req.params.id]
    );
    res.json({ versions: result.rows });
  } catch (error) {
    console.error('List versions error:', error);
    res.status(500).json({ error: 'Failed to list versions' });
  }
});

// POST /:id/versions/:vid/restore
router.post('/:id/versions/:vid/restore', async (req, res) => {
  try {
    // Verify ownership
    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const version = await query(
      'SELECT config FROM project_versions WHERE id = $1 AND project_id = $2',
      [req.params.vid, req.params.id]
    );
    if (version.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }

    const result = await query(
      'UPDATE projects SET config = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(version.rows[0].config), req.params.id]
    );

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({ error: 'Failed to restore version' });
  }
});

export default router;
