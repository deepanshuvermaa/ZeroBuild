import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../auth/middleware.js';
import { deployCPanel } from './cpanel-ftp.js';

const router = Router();

router.use(requireAuth);

// POST /:projectId/deploy
router.post('/:projectId/deploy', async (req, res) => {
  try {
    const { platform, ftpConfig } = req.body;

    if (!platform || !['railway', 'cpanel'].includes(platform)) {
      return res.status(400).json({ error: 'Platform must be "railway" or "cpanel"' });
    }

    // Load project
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.projectId, req.user.id]
    );
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Create deployment record
    const deployResult = await query(
      `INSERT INTO deployments (project_id, platform, status, ftp_host, ftp_path)
       VALUES ($1, $2, 'building', $3, $4)
       RETURNING *`,
      [
        project.id,
        platform,
        ftpConfig?.host || null,
        ftpConfig?.path || null,
      ]
    );

    const deployment = deployResult.rows[0];

    if (platform === 'cpanel') {
      if (!ftpConfig || !ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
        await query(
          "UPDATE deployments SET status = 'failed', build_log = 'Missing FTP configuration' WHERE id = $1",
          [deployment.id]
        );
        return res.status(400).json({ error: 'FTP config (host, user, password) is required for cPanel deployment' });
      }

      try {
        await query(
          "UPDATE deployments SET status = 'deploying' WHERE id = $1",
          [deployment.id]
        );

        const result = await deployCPanel(project.config, ftpConfig, deployment.id);

        await query(
          "UPDATE deployments SET status = 'deployed', url = $1, deployed_at = NOW() WHERE id = $2",
          [result.url, deployment.id]
        );

        await query(
          "UPDATE projects SET status = 'published', published_url = $1, updated_at = NOW() WHERE id = $2",
          [result.url, project.id]
        );

        const updated = await query('SELECT * FROM deployments WHERE id = $1', [deployment.id]);
        res.json({ deployment: updated.rows[0] });
      } catch (ftpError) {
        await query(
          "UPDATE deployments SET status = 'failed', build_log = $1 WHERE id = $2",
          [ftpError.message, deployment.id]
        );
        res.status(500).json({ error: 'Deployment failed', details: ftpError.message });
      }
    } else if (platform === 'railway') {
      // Stub for Railway deployment
      await query(
        "UPDATE deployments SET status = 'queued', build_log = 'Railway deployment not yet implemented' WHERE id = $1",
        [deployment.id]
      );

      const updated = await query('SELECT * FROM deployments WHERE id = $1', [deployment.id]);
      res.json({ deployment: updated.rows[0], message: 'Railway deployment is not yet implemented' });
    }
  } catch (error) {
    console.error('Deploy error:', error);
    res.status(500).json({ error: 'Deployment failed' });
  }
});

// GET /:projectId/deployments
router.get('/:projectId/deployments', async (req, res) => {
  try {
    // Verify ownership
    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.projectId, req.user.id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const result = await query(
      'SELECT * FROM deployments WHERE project_id = $1 ORDER BY created_at DESC',
      [req.params.projectId]
    );
    res.json({ deployments: result.rows });
  } catch (error) {
    console.error('List deployments error:', error);
    res.status(500).json({ error: 'Failed to list deployments' });
  }
});

export default router;
