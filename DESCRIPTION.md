# PageForge — AI Website Builder SaaS

**One sentence in, full website out.**

PageForge lets users describe a business in plain English and get a complete, deployable landing page in under 60 seconds — then fine-tune it with a drag-and-drop editor.

---

## How It Works

```
User: "Modern billing software for pharmacies"
  → AI picks sections: Hero, Features, Pricing, FAQ, CTA, Footer
  → AI generates colors, copy, layout
  → Outputs PageConfig JSON (the universal format)
  → Editor renders it instantly
  → User drags, edits, tweaks
  → One click → deployed to Railway or cPanel
```

The entire system revolves around one object: **PageConfig JSON**. Every feature reads it, writes it, or renders it. The AI generates it. The editor manipulates it. The renderer displays it. The database stores it.

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Landing    │     │  Dashboard   │     │   Editor     │
│   Page       │────→│  (Projects)  │────→│  (Builder)   │
│   /          │     │  /dashboard  │     │  /editor/:id │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                           ┌──────────────────────┤
                           │                      │
                     ┌─────▼─────┐          ┌─────▼─────┐
                     │  AI Panel │          │  Deploy   │
                     │  Generate │          │  Panel    │
                     │  + Edit   │          │  Railway  │
                     └─────┬─────┘          │  cPanel   │
                           │                └─────┬─────┘
                           ▼                      ▼
                     ┌───────────────────────────────────┐
                     │         Express API (3001)        │
                     │  Auth · Projects · AI · Deploy    │
                     │         PostgreSQL + Redis        │
                     └───────────────────────────────────┘
```

---

## What Exists

| Layer | Tech | Files |
|---|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind 4 | 86 components |
| Drag & Drop | @dnd-kit | Canvas, SectionWrapper, DragHandle |
| State | Zustand | builderStore, historyStore, authStore |
| Animations | Framer Motion | motionVariants + all section transitions |
| Validation | Zod | 19 section schemas |
| Editor | Monaco | Code editor mode |
| Backend | Express 5 | Auth, Projects, AI, Deploy, Assets |
| AI | Claude API | Full page gen + conversational edit |
| Auth | JWT + bcrypt | Register, login, sessions |
| Database | PostgreSQL | Users, projects, versions, deployments |
| Deploy | Railway + cPanel FTP | One-click deployment |

---

## Section Types (19)

Hero · About · Services · Menu · Gallery · Testimonials · Offers · CTA · Footer · WhatsApp · Cards · Stats · Categories · Profiles · Pricing · FAQ · Timeline · Features · Job Board

Each type has: TypeScript interface, Zod schema, preview component (builder), production component (client-template), HTML generator (static export), and AI prompt template.

---

## Data Flow

```
                    ┌─────────────┐
                    │  PageConfig  │ ← the single source of truth
                    │    JSON      │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │  Editor   │   │  Renderer │   │  AI Gen   │
    │  reads +  │   │  reads +  │   │  writes   │
    │  writes   │   │  renders  │   │  new ones │
    └───────────┘   └───────────┘   └───────────┘
```

- **Save**: builderStore.config → PUT /api/projects/:id → PostgreSQL
- **Load**: GET /api/projects/:id → builderStore.setConfig()
- **Generate**: prompt → Claude → PageConfig → builderStore.setConfig()
- **Deploy**: PageConfig → Vite build or HTML gen → Railway/cPanel
- **Export**: PageConfig → downloadJSON() → .json file
- **Undo**: historyStore.past[] → builderStore.setConfig()

---

## AI Pipeline

```
Prompt → Intent (Haiku) → Design Tokens (Haiku) → Section Content (Sonnet, parallel) → Assemble → Validate → PageConfig
```

- Intent analysis picks industry, audience, tone, and which of the 19 section types to use
- Design tokens map directly to ThemeConfig (primaryColor, secondaryColor, fontFamily)
- Each section's content is generated in parallel against its TypeScript interface
- Assembly produces a valid PageConfig, validated against existing Zod schemas
- Conversational edits ("make it more modern") produce JSON patches applied via the same updateSection() the editor uses

---

## Running Locally

```bash
cd builder-app

# Terminal 1 — Backend
npm run dev:server          # http://localhost:3001

# Terminal 2 — Frontend
npm run dev                 # http://localhost:5174
```

Demo login: `demo@pageforge.com` / `password123`

---

## Deploying to Production

```bash
# Railway (recommended)
# 1. Create Railway project + PostgreSQL addon
# 2. Set env vars: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
# 3. Deploy:
railway up
```

The Dockerfile builds the frontend and serves it from the Express server. One service, one deploy.

---

## Subscription Model

| | Free | Starter ($15) | Pro ($39) | Agency ($99) |
|---|---|---|---|---|
| Projects | 2 | 10 | 50 | Unlimited |
| AI Credits/mo | 20 | 150 | 500 | 2000 |
| Custom Domain | — | Yes | Yes | Yes |

Credits: full page = 8, section edit = 1, copy rewrite = 1, SEO = 2.

---

## File Count

- **Untouched from original**: 113 files (all PreviewComponents, client-template, DnD, schemas, types, design system)
- **Modified**: 7 files (builderStore, exportConfig, importConfig, validation, App.tsx, TopToolbar, PageRenderer)
- **New backend**: 11 files (server/auth, db, projects, ai, deploy, assets)
- **New frontend**: 25 files (Landing, Auth, Dashboard, AI panels, hooks, stores, api client)
- **Deployment**: 3 files (Dockerfile, railway.toml, .dockerignore)

Total: ~159 files. The original 113 are architecturally unchanged — the SaaS wraps around them.
