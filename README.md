<p align="center"><img src="apps/frontend/public/reed-logo.svg" alt="Reed logo" width="72"></p>

# Reed

Reed is a swipeable tech-news feed for the gaps between things. Read short summaries from developer-focused sources, then open the original story when it earns your attention.

**Turn waiting into learning.**

## Features

- Full-screen, snap-scrolling story cards
- Short AI or extractive summaries with graceful fallbacks
- Hacker News, Lobsters, DEV, Hashnode, Reddit, Stack Overflow, Cloudflare, GitHub Blog, Vercel, Netflix Tech, Stack Overflow Blog, and Mozilla Hacks
- Touch, wheel, arrow-key, and `J`/`K` navigation
- Source filters, lazy summaries, feed caching, sharing, and responsive mobile layouts
- Retro magazine interface with light/dark themes
- GitHub star count with graceful fallback

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Query, Phosphor Icons
- Backend: Node.js 22, Express, TypeScript, Axios, Cheerio, Linkedom, Mozilla Readability
- Summaries: optional Gemini Flash Lite with a local extractive fallback
- Hosting: Cloudflare Pages-ready frontend; Node-compatible hosting for the Express API

## Project structure

```text
.
├── apps/
│   ├── frontend/
│   │   ├── public/             # Logo, OG image, manifest, sitemap, robots, headers
│   │   └── src/
│   │       ├── components/     # Landing, feed, source logos, theme, shared UI
│   │       ├── App.tsx         # Landing page and reader entry point
│   │       └── App.css         # Shared magazine design system and responsive styles
│   └── backend/
│       ├── routes/             # /health, /api/feed, /api/summary
│       └── services/           # Source adapters, caching, scraping, summaries
├── CONTRIBUTING.md
├── render.yaml                 # Optional Node backend deployment config
├── tsconfig.json
├── pnpm-workspace.yaml
└── wrangler.toml               # Cloudflare Pages configuration
```

## Local setup

Requirements: Node.js 22+ and pnpm.

```bash
git clone https://github.com/xeureka/Reed.git
cd Reed
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:5174`. The backend runs at `http://localhost:3001`.

Run the production build and checks from the repository root:

```bash
pnpm build
pnpm lint
pnpm typecheck
```

Useful commands:

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm build:cloudflare
```

## Environment variables

Frontend: create `apps/frontend/.env.local` or set the variable in the hosting dashboard:

```bash
VITE_API_URL=http://localhost:3001
```

Backend: create `.env` at the repository root or `apps/backend/.env`:

```bash
PORT=3001
CORS_ORIGINS=http://localhost:5174,http://localhost:5173
GEMINI_API_KEY=                 # optional
GEMINI_MODEL=gemini-2.0-flash-lite
```

Without `GEMINI_API_KEY`, Reed uses the local extractive summarizer and the feed still works.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Backend health check |
| `GET /api/feed?source=all&page=1&limit=10` | Cached, normalized, deduplicated feed |
| `GET /api/summary?url=<article-url>` | Cached Gemini or extractive article summary |

Feed sources are fetched in parallel. A failing source is skipped when other sources return stories. Article scraping has timeouts, size limits, fallback excerpts, and SSRF protection.

## Cloudflare Pages deployment

The frontend is configured with `wrangler.toml`:

- Build command: `pnpm install --frozen-lockfile && pnpm build:cloudflare`
- Output directory: `apps/frontend/dist`
- Required Pages variable: `VITE_API_URL=<public API URL>`

The backend is an Express/Node service because the scraper uses Node runtime libraries. Deploy it on a Node-compatible host, allow the Cloudflare Pages origin in `CORS_ORIGINS`, and set its public URL as `VITE_API_URL` in Cloudflare Pages.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch naming, commit conventions, testing, and pull requests.

See the [roadmap](CONTRIBUTING.md#roadmap) for planned features.
