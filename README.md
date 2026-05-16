# ZeroBuild

AI website builder. Type a prompt, get a complete website, edit every section, deploy in one click.

## Architecture

```
Landing / Dashboard / Editor  ->  Express API (:3001)  ->  PostgreSQL
                                        |
                               Auth . Projects . AI . Deploy
                                        |
                               Gemini 2.0 Flash + Groq Llama 3.3
                               Railway / cPanel (deployment targets)
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind 4, Framer Motion |
| Drag & Drop | @dnd-kit |
| State | Zustand |
| Backend | Express 5, Node 20 |
| AI | Gemini 2.0 Flash + Groq Llama 3.3 (key rotation) |
| Auth | JWT + bcrypt, httpOnly cookies |
| Database | PostgreSQL (in-memory fallback for local dev) |
| Deploy | Railway + cPanel FTP |

## Running Locally

```bash
cd builder-app

# Terminal 1
npm run dev:server    # API on :3001

# Terminal 2
npm run dev           # Frontend on :5174
```

Demo login: `demo@zerobuild.com` / `password123`

No database setup needed — uses in-memory store locally.

## Environment Variables

Create `builder-app/server/.env`:

```
JWT_SECRET=your-secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

GEMINI_KEY_1=
GEMINI_KEY_2=
GEMINI_KEY_3=

GROQ_KEY_1=
GROQ_KEY_2=
```

Gemini keys: [aistudio.google.com](https://aistudio.google.com) — free, 1500 req/day per key.  
Groq keys: [console.groq.com](https://console.groq.com) — free fallback.

## Deploying to Railway

1. Connect this repo, set root directory to `builder-app`
2. Add PostgreSQL addon — `DATABASE_URL` is auto-injected
3. Set env vars: `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`, all AI keys
4. Deploy — Dockerfile builds frontend and serves it from Express

## Section Types (19)

Hero, About, Services, Menu, Gallery, Testimonials, Offers, CTA, Footer, WhatsApp, Cards, Stats, Categories, Profiles, Pricing, FAQ, Timeline, Features, Job Board
