/**
 * In-memory database that mimics the pg query() interface.
 * Swap this for the real PostgreSQL version when deploying to Railway.
 *
 * Dummy user: demo@zerobuild.com / password123
 */

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// ─── In-memory tables ────────────────────────────────────────────────
const tables = {
  users: [],
  projects: [],
  project_versions: [],
  deployments: [],
  ai_generations: [],
  assets: [],
};

// ─── SQL parser / executor ───────────────────────────────────────────
// Translates the most common SQL patterns used by our routes into
// array operations. NOT a general SQL engine — just enough to run
// the existing route code unchanged.

function resolveParams(text, params) {
  // Replace $1, $2 etc. with actual values for matching
  return { text, params: params || [] };
}

function matchWhere(row, conditions) {
  return conditions.every(({ field, value }) => {
    if (value === null) return row[field] == null;
    return String(row[field]) === String(value);
  });
}

function parseSimpleWhere(whereClause, params) {
  // Parse "field = $1 AND field2 = $2" etc.
  if (!whereClause) return [];
  const conditions = [];
  const parts = whereClause.split(/\s+AND\s+/i);
  for (const part of parts) {
    const match = part.trim().match(/(\w+)\s*=\s*\$(\d+)/);
    if (match) {
      conditions.push({ field: match[1], value: params[parseInt(match[2]) - 1] });
    }
    // Handle "reset_token_expires > NOW()" — just skip this check for in-memory
    if (part.includes('NOW()')) {
      // For reset token expiry check — just validate token exists
    }
  }
  return conditions;
}

export async function query(text, params = []) {
  const sql = text.trim().replace(/\s+/g, ' ');

  // ── INSERT ──
  const insertMatch = sql.match(/^INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (insertMatch) {
    const table = insertMatch[1];
    const columns = insertMatch[2].split(',').map(c => c.trim());
    const row = { id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

    columns.forEach((col, i) => {
      const valRef = insertMatch[3].split(',')[i]?.trim();
      if (valRef && valRef.match(/\$(\d+)/)) {
        const idx = parseInt(valRef.match(/\$(\d+)/)[1]) - 1;
        let val = params[idx];
        // Parse JSON strings back to objects for JSONB columns
        if ((col === 'config' || col === 'input_config' || col === 'output_config') && typeof val === 'string') {
          try { val = JSON.parse(val); } catch {}
        }
        row[col] = val;
      }
    });

    // Set defaults for missing fields
    if (table === 'users') {
      row.plan = row.plan || 'free';
      row.ai_credits_remaining = row.ai_credits_remaining ?? 50;
      row.ai_credits_monthly_limit = row.ai_credits_monthly_limit ?? 50;
      row.avatar_url = row.avatar_url || null;
      row.is_verified = false;
      row.reset_token = null;
      row.reset_token_expires = null;
    }
    if (table === 'projects') {
      row.status = row.status || 'draft';
      row.published_url = null;
      row.custom_domain = null;
      row.thumbnail_url = null;
    }
    if (table === 'deployments') {
      row.status = row.status || 'queued';
      row.deployed_at = null;
    }
    if (table === 'ai_generations') {
      row.status = row.status || 'pending';
      row.tokens_used = row.tokens_used || 0;
    }

    tables[table].push(row);
    return { rows: [row], rowCount: 1 };
  }

  // ── SELECT COUNT ──
  const countMatch = sql.match(/^SELECT COUNT\(\*\)(?:::int)?\s+AS\s+(\w+)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
  if (countMatch) {
    const table = countMatch[2];
    const alias = countMatch[1];
    const conditions = parseSimpleWhere(countMatch[3], params);
    const count = tables[table].filter(r => matchWhere(r, conditions)).length;
    return { rows: [{ [alias]: count }] };
  }

  // ── SELECT MAX ──
  const maxMatch = sql.match(/SELECT COALESCE\(MAX\((\w+)\),\s*0\)\s+AS\s+(\w+)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
  if (maxMatch) {
    const field = maxMatch[1];
    const alias = maxMatch[2];
    const table = maxMatch[3];
    const conditions = parseSimpleWhere(maxMatch[4], params);
    const rows = tables[table].filter(r => matchWhere(r, conditions));
    const max = rows.reduce((m, r) => Math.max(m, r[field] || 0), 0);
    return { rows: [{ [alias]: max }] };
  }

  // ── SELECT ──
  const selectMatch = sql.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i);
  if (selectMatch) {
    const table = selectMatch[2];
    const conditions = parseSimpleWhere(selectMatch[3], params);
    let rows = tables[table].filter(r => matchWhere(r, conditions));

    // Handle ORDER BY
    if (selectMatch[4]) {
      const orderMatch = selectMatch[4].match(/(\w+)\s*(ASC|DESC)?/i);
      if (orderMatch) {
        const field = orderMatch[1];
        const desc = (orderMatch[2] || '').toUpperCase() === 'DESC';
        rows.sort((a, b) => {
          const va = a[field] || '';
          const vb = b[field] || '';
          return desc ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
        });
      }
    }

    // Handle LIMIT
    if (selectMatch[5]) {
      rows = rows.slice(0, parseInt(selectMatch[5]));
    }

    // Handle column selection (return all columns if * or complex select)
    const cols = selectMatch[1].trim();
    if (cols !== '*' && !cols.includes('(')) {
      const selectedCols = cols.split(',').map(c => c.trim());
      rows = rows.map(r => {
        const filtered = {};
        selectedCols.forEach(c => { if (c in r) filtered[c] = r[c]; });
        return filtered;
      });
    }

    return { rows, rowCount: rows.length };
  }

  // ── UPDATE ──
  const updateMatch = sql.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+?)(?:\s+RETURNING\s+(.+))?$/i);
  if (updateMatch) {
    const table = updateMatch[1];
    const conditions = parseSimpleWhere(updateMatch[3], params);
    const rows = tables[table].filter(r => matchWhere(r, conditions));

    // Parse SET clauses
    const setClauses = updateMatch[2].split(/,\s*(?=\w+\s*=)/);
    for (const row of rows) {
      for (const clause of setClauses) {
        const setMatch = clause.trim().match(/(\w+)\s*=\s*(?:\$(\d+)|NOW\(\)|NULL)/i);
        if (setMatch) {
          const field = setMatch[1];
          if (setMatch[2]) {
            let val = params[parseInt(setMatch[2]) - 1];
            if ((field === 'config' || field === 'input_config' || field === 'output_config') && typeof val === 'string') {
              try { val = JSON.parse(val); } catch {}
            }
            row[field] = val;
          } else if (clause.includes('NOW()')) {
            row[field] = new Date().toISOString();
          } else if (clause.includes('NULL')) {
            row[field] = null;
          }
        }
        // Handle ai_credits_remaining = ai_credits_remaining - N
        const decrMatch = clause.trim().match(/(\w+)\s*=\s*\1\s*-\s*\$(\d+)/);
        if (decrMatch) {
          const field = decrMatch[1];
          const amount = params[parseInt(decrMatch[2]) - 1];
          row[field] = (row[field] || 0) - amount;
        }
      }
      row.updated_at = new Date().toISOString();
    }

    return { rows, rowCount: rows.length };
  }

  // ── DELETE ──
  const deleteMatch = sql.match(/^DELETE FROM (\w+)\s+WHERE\s+(.+?)(?:\s+RETURNING\s+(.+))?$/i);
  if (deleteMatch) {
    const table = deleteMatch[1];
    const conditions = parseSimpleWhere(deleteMatch[2], params);
    const toDelete = tables[table].filter(r => matchWhere(r, conditions));
    tables[table] = tables[table].filter(r => !matchWhere(r, conditions));
    return { rows: toDelete, rowCount: toDelete.length };
  }

  // ── CREATE TABLE / CREATE INDEX (no-op for in-memory) ──
  if (sql.match(/^CREATE\s+(TABLE|INDEX)/i)) {
    return { rows: [], rowCount: 0 };
  }

  console.warn('[InMemoryDB] Unhandled query:', sql.substring(0, 100));
  return { rows: [], rowCount: 0 };
}

// ─── Initialize with dummy data ──────────────────────────────────────

export async function initDatabase() {
  // Create dummy user: demo@zerobuild.com / password123
  const existingUser = tables.users.find(u => u.email === 'demo@zerobuild.com');
  if (!existingUser) {
    const hash = await bcrypt.hash('password123', 12);
    const demoUser = {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'demo@zerobuild.com',
      password_hash: hash,
      name: 'Demo User',
      avatar_url: null,
      plan: 'pro',
      ai_credits_remaining: 500,
      ai_credits_monthly_limit: 500,
      credits_reset_at: null,
      is_verified: true,
      verification_token: null,
      reset_token: null,
      reset_token_expires: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tables.users.push(demoUser);

    // Create a sample project for the demo user
    const sampleProject = {
      id: 'p1-demo-project-0001-000000000001',
      user_id: demoUser.id,
      name: 'My First Website',
      slug: 'my-first-website',
      config: {
        metadata: {
          clientName: 'Demo Client',
          projectName: 'My First Website',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: '1.0',
        },
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          fontFamily: 'Inter',
          accentColor: '#F59E0B',
        },
        whatsapp: { phoneNumber: '', defaultMessage: 'Hi!', enabled: false },
        seo: { title: 'My First Website', description: 'A beautiful website built with ZeroBuild', keywords: ['website', 'landing page'] },
        sections: [
          {
            id: 'hero-001',
            type: 'HeroSection',
            order: 0,
            props: {
              heading: 'Welcome to My Website',
              subheading: 'Built with ZeroBuild AI Website Builder',
              ctaText: 'Get Started',
              ctaLink: '#contact',
              backgroundImage: '',
              backgroundColor: '#1e293b',
              textColor: '#ffffff',
              overlayOpacity: 0.5,
            },
          },
          {
            id: 'features-001',
            type: 'FeatureSection',
            order: 1,
            props: {
              heading: 'Our Features',
              subheading: 'Everything you need',
              features: [
                { id: 'f1', icon: '🚀', title: 'Fast', description: 'Lightning fast performance' },
                { id: 'f2', icon: '🎨', title: 'Beautiful', description: 'Stunning modern design' },
                { id: 'f3', icon: '📱', title: 'Responsive', description: 'Works on all devices' },
              ],
              backgroundColor: '#ffffff',
              columns: 3,
            },
          },
          {
            id: 'cta-001',
            type: 'CTASection',
            order: 2,
            props: {
              heading: 'Ready to Get Started?',
              description: 'Join thousands of happy customers today.',
              ctaText: 'Contact Us',
              ctaLink: '#',
              backgroundImage: '',
              backgroundColor: '#3B82F6',
              textColor: '#ffffff',
            },
          },
          {
            id: 'footer-001',
            type: 'FooterSection',
            order: 3,
            props: {
              businessName: 'My Business',
              tagline: 'Building the future',
              address: '123 Main St',
              phone: '+1 234 567 890',
              email: 'hello@mybusiness.com',
              socialLinks: [],
              backgroundColor: '#1f2937',
              textColor: '#ffffff',
            },
          },
        ],
      },
      status: 'draft',
      published_url: null,
      custom_domain: null,
      thumbnail_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tables.projects.push(sampleProject);

    console.log('');
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║  IN-MEMORY DATABASE — Demo Mode                 ║');
    console.log('  ║                                                  ║');
    console.log('  ║  Login:    demo@zerobuild.com                   ║');
    console.log('  ║  Password: password123                          ║');
    console.log('  ║                                                  ║');
    console.log('  ║  Data resets on server restart.                  ║');
    console.log('  ║  Connect PostgreSQL for persistence.             ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log('');
  }

  console.log('In-memory database initialized');
}

export default { query };
