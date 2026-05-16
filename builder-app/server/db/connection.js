/**
 * Database layer: PostgreSQL when DATABASE_URL is set, in-memory fallback for local dev.
 */
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
let pool = null;
let usePostgres = false;

// ─── In-memory fallback ──────────────────────────────────────────────
const tables = { users: [], projects: [], project_versions: [], deployments: [], ai_generations: [], assets: [], suggestions: [], chat_messages: [] };

function parseSimpleWhere(whereClause, params) {
  if (!whereClause) return [];
  const conditions = [];
  const parts = whereClause.split(/\s+AND\s+/i);
  for (const part of parts) {
    const match = part.trim().match(/(\w+)\s*=\s*\$(\d+)/);
    if (match) conditions.push({ field: match[1], value: params[parseInt(match[2]) - 1] });
  }
  return conditions;
}

function matchWhere(row, conditions) {
  return conditions.every(({ field, value }) => {
    if (value === null) return row[field] == null;
    return String(row[field]) === String(value);
  });
}

async function memQuery(text, params = []) {
  const sql = text.trim().replace(/\s+/g, ' ');

  if (sql.match(/^CREATE\s+(TABLE|INDEX)/i)) return { rows: [], rowCount: 0 };

  const insertMatch = sql.match(/^INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (insertMatch) {
    const table = insertMatch[1];
    const columns = insertMatch[2].split(',').map(c => c.trim());
    const row = { id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    columns.forEach((col, i) => {
      const valRef = insertMatch[3].split(',')[i]?.trim();
      if (valRef?.match(/\$(\d+)/)) {
        let val = params[parseInt(valRef.match(/\$(\d+)/)[1]) - 1];
        if ((col === 'config' || col === 'output_config' || col === 'messages') && typeof val === 'string') try { val = JSON.parse(val); } catch {}
        row[col] = val;
      }
    });
    if (table === 'users') { row.plan = row.plan || 'free'; row.role = row.role || 'user'; row.ai_credits_remaining = row.ai_credits_remaining ?? 50; row.ai_credits_monthly_limit = row.ai_credits_monthly_limit ?? 50; row.avatar_url = null; row.is_verified = false; row.reset_token = null; row.reset_token_expires = null; }
    if (table === 'projects') { row.status = row.status || 'draft'; row.published_url = null; row.custom_domain = null; row.thumbnail_url = null; }
    if (table === 'ai_generations') { row.status = row.status || 'pending'; row.tokens_used = row.tokens_used || 0; }
    if (!tables[table]) tables[table] = [];
    tables[table].push(row);
    return { rows: [row], rowCount: 1 };
  }

  const selectMatch = sql.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i);
  if (selectMatch) {
    const table = selectMatch[2];
    if (!tables[table]) tables[table] = [];
    const conditions = parseSimpleWhere(selectMatch[3], params);
    let rows = tables[table].filter(r => matchWhere(r, conditions));
    if (selectMatch[4]) {
      const orderMatch = selectMatch[4].match(/(\w+)\s*(ASC|DESC)?/i);
      if (orderMatch) { const f = orderMatch[1]; const d = (orderMatch[2] || '').toUpperCase() === 'DESC'; rows.sort((a, b) => d ? (b[f] > a[f] ? 1 : -1) : (a[f] > b[f] ? 1 : -1)); }
    }
    if (selectMatch[5]) rows = rows.slice(0, parseInt(selectMatch[5]));
    return { rows, rowCount: rows.length };
  }

  const updateMatch = sql.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+?)(?:\s+RETURNING\s+(.+))?$/i);
  if (updateMatch) {
    const table = updateMatch[1];
    if (!tables[table]) tables[table] = [];
    const conditions = parseSimpleWhere(updateMatch[3], params);
    const rows = tables[table].filter(r => matchWhere(r, conditions));
    const setClauses = updateMatch[2].split(/,\s*(?=\w+\s*=)/);
    for (const row of rows) {
      for (const clause of setClauses) {
        const setMatch = clause.trim().match(/(\w+)\s*=\s*(?:\$(\d+)|NOW\(\)|NULL)/i);
        if (setMatch) {
          const field = setMatch[1];
          if (setMatch[2]) { let val = params[parseInt(setMatch[2]) - 1]; if ((field === 'config' || field === 'output_config' || field === 'messages') && typeof val === 'string') try { val = JSON.parse(val); } catch {} row[field] = val; }
          else if (clause.includes('NOW()')) row[field] = new Date().toISOString();
          else if (clause.includes('NULL')) row[field] = null;
        }
        const decrMatch = clause.trim().match(/(\w+)\s*=\s*\1\s*-\s*\$(\d+)/);
        if (decrMatch) row[decrMatch[1]] = (row[decrMatch[1]] || 0) - params[parseInt(decrMatch[2]) - 1];
      }
      row.updated_at = new Date().toISOString();
    }
    return { rows, rowCount: rows.length };
  }

  const deleteMatch = sql.match(/^DELETE FROM (\w+)\s+WHERE\s+(.+?)$/i);
  if (deleteMatch) {
    const table = deleteMatch[1];
    if (!tables[table]) tables[table] = [];
    const conditions = parseSimpleWhere(deleteMatch[2], params);
    const toDelete = tables[table].filter(r => matchWhere(r, conditions));
    tables[table] = tables[table].filter(r => !matchWhere(r, conditions));
    return { rows: toDelete, rowCount: toDelete.length };
  }

  return { rows: [], rowCount: 0 };
}

// ─── Public API ──────────────────────────────────────────────────────
export async function query(text, params = []) {
  if (usePostgres) {
    return pool.query(text, params);
  }
  return memQuery(text, params);
}

export async function initDatabase() {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
    try {
      await pool.query('SELECT 1');
      usePostgres = true;
      console.log('Connected to PostgreSQL');
    } catch (err) {
      console.warn('PostgreSQL connection failed, using in-memory:', err.message);
      usePostgres = false;
    }
  }

  // Create tables (no-op for in-memory)
  const createSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      avatar_url TEXT,
      plan VARCHAR(50) DEFAULT 'free',
      role VARCHAR(50) DEFAULT 'user',
      ai_credits_remaining INT DEFAULT 50,
      ai_credits_monthly_limit INT DEFAULT 50,
      credits_reset_at TIMESTAMPTZ,
      is_verified BOOLEAN DEFAULT false,
      verification_token TEXT,
      reset_token TEXT,
      reset_token_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255),
      config JSONB DEFAULT '{}',
      status VARCHAR(50) DEFAULT 'draft',
      published_url TEXT,
      custom_domain TEXT,
      thumbnail_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ai_generations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      project_id UUID,
      prompt TEXT,
      generation_type VARCHAR(50),
      model VARCHAR(100),
      credits_consumed INT DEFAULT 0,
      tokens_used INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      output_config JSONB,
      duration_ms INT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS suggestions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      submitted_by VARCHAR(255),
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS project_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      config JSONB DEFAULT '{}',
      change_description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS chat_summaries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL UNIQUE,
      user_id UUID NOT NULL,
      summary TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_project ON chat_messages(project_id);
    CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);
  `;

  if (usePostgres) {
    await pool.query(createSQL);
    console.log('PostgreSQL tables ready');
  }

  // Seed demo + admin users
  const demoExists = await query('SELECT id FROM users WHERE email = $1', ['demo@zerobuild.com']);
  if (demoExists.rows.length === 0) {
    const hash = await bcrypt.hash('password123', 12);
    await query(
      `INSERT INTO users (email, password_hash, name, plan, role, ai_credits_remaining, ai_credits_monthly_limit, is_verified) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      ['demo@zerobuild.com', hash, 'Demo User', 'pro', 'user', 500, 500, true]
    );
    console.log('  Demo user: demo@zerobuild.com / password123');
  }

  const adminExists = await query('SELECT id FROM users WHERE email = $1', ['deepanshuverma966@gmail.com']);
  if (adminExists.rows.length === 0) {
    const adminHash = await bcrypt.hash('Dv12062001@', 12);
    await query(
      `INSERT INTO users (email, password_hash, name, plan, role, ai_credits_remaining, ai_credits_monthly_limit, is_verified) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      ['deepanshuverma966@gmail.com', adminHash, 'Deepanshu Verma', 'agency', 'admin', 9999, 9999, true]
    );
    console.log('  Admin user: deepanshuverma966@gmail.com');
  }

  if (!usePostgres) console.log('In-memory database initialized');
}

export default { query };
