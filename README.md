# ZeroBuild

**Working product demo — prompt-to-deploy website builder with an editable product workflow.**

ZeroBuild turns a plain-language brief into a website draft, lets the user edit the generated sections, saves projects, and prepares a deployment path. The product is designed around the full workflow rather than a single generation call: create, inspect, edit, save, retry, and deploy.

## Architecture

```
Landing / Dashboard / Editor  ->  Express API (:3001)  ->  PostgreSQL
                                        |
                               Auth . Projects . AI . Deploy
                                        |
                               Gemini 2.0 Flash + Groq Llama 3.3
                               Railway / cPanel (deployment targets)
```

## Product workflow

```text
Brief → generate structured page model → preview → edit sections → save project → retry failed generation → deploy or export
```

The important engineering problem is not only generating markup. It is keeping the generated result editable, validating structured output, isolating projects by user, handling provider timeouts, and giving the user a recoverable manual path when generation fails.

## Verification status

- **Implemented product surface:** landing/dashboard/editor flow, project persistence, authentication, AI provider routing, deployment targets, and local development fallback.
- **Founder-demo ready:** a user can create a project, edit the output, save it, simulate a provider failure, and recover through retry or manual editing.
- **Before production use:** verify provider quotas, sandbox generated content, harden authentication and rate limits, add end-to-end tests, review deployment credentials, and validate generated output against a safe component allowlist.

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

## Demo walkthrough

1. Enter a short website brief.
2. Generate a structured page and inspect the preview.
3. Edit a section manually and save the project.
4. Simulate a provider timeout and show retry/fallback behavior.
5. Export or deploy the saved result.

## Running Locally

```bash
cd builder-app

# Terminal 1
npm run dev:server    # API on :3001

# Terminal 2
npm run dev           # Frontend on :5174
```

For local demos, use a seeded development account created through the local seed flow. Do not reuse local credentials in production or publish a shared production password.

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
