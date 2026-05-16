import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../db/connection.js';
import { requireAuth } from '../auth/middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, SVG)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = Router();

router.use(requireAuth);

// POST /upload
router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const publicUrl = `/uploads/${req.file.filename}`;

      const result = await query(
        `INSERT INTO assets (user_id, project_id, filename, content_type, size_bytes, storage_path, public_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, filename, content_type, size_bytes, public_url, created_at`,
        [
          req.user.id,
          req.body.projectId || null,
          req.file.originalname,
          req.file.mimetype,
          req.file.size,
          req.file.path,
          publicUrl,
        ]
      );

      res.status(201).json({ asset: result.rows[0] });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to save asset' });
    }
  });
});

// GET / — list user's assets
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, filename, content_type, size_bytes, public_url, project_id, created_at FROM assets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ assets: result.rows });
  } catch (error) {
    console.error('List assets error:', error);
    res.status(500).json({ error: 'Failed to list assets' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, storage_path FROM assets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = result.rows[0];

    // Delete file from disk
    try {
      if (fs.existsSync(asset.storage_path)) {
        fs.unlinkSync(asset.storage_path);
      }
    } catch (fsError) {
      console.warn('Failed to delete file from disk:', fsError.message);
    }

    await query('DELETE FROM assets WHERE id = $1', [asset.id]);
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
