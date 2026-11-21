<p align="center"><img src="apps/frontend/public/reed-logo.svg" alt="Reed logo" width="72"></p>

# Reed

Reed is a focused reading stream for the gaps while your coding agent runs. It turns Hacker News, Lobsters, DEV Community, Reddit, and engineering blogs into swipeable cards with quick summaries and direct links to the original stories.

## Features

- Full-screen, snap-scrolling reading feed
- Aggregated stories from five developer-focused sources
- Fast local summaries with optional Gemini article summaries
- Infinite loading, keyboard navigation, sharing, and responsive mobile UI
- Cached GitHub star count and source branding

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Query
- Backend: Node.js, Express, TypeScript, Axios, Cheerio
- Deployment: Vercel-compatible frontend, Docker/Render-compatible backend

## Structure

```text
apps/
├── frontend/   # Vite React application
└── backend/    # Express API and source aggregation
```

## Setup

Requirements: Node.js 22+ and pnpm.

```bash
git clone https://github.com/xeureka/Reed.git
cd Reed
pnpm install
pnpm dev
```

The frontend runs on `http://localhost:5174` and the API on `http://localhost:3001`.

Run checks from the repository root:

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Cloudflare Pages

The Vite frontend is configured for Cloudflare Pages with `wrangler.toml`.

- Build command: `pnpm install --frozen-lockfile && pnpm build:cloudflare`
- Build output directory: `apps/frontend/dist`
- Add the Pages environment variable `VITE_API_URL` with the public URL of the running API.

The API remains a Node/Express service because its scraper uses Node runtime libraries. Deploy it on a Node-compatible host, then point Cloudflare Pages at it with `VITE_API_URL`.

## Environment variables

Create `apps/frontend/.env.local` when the API is not running on the default local port:

```bash
VITE_API_URL=http://localhost:3001
```

Optional backend variables:

```bash
PORT=3001
CORS_ORIGINS=http://localhost:5174,http://localhost:5173
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash-lite
```

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Health check |
| `GET /api/feed?source=&page=1` | Normalized, cached multi-source feed |
| `GET /api/summary?url=<article-url>` | Cached Gemini or extractive summary |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch, commit, and pull request conventions.

Launch copy is collected in [docs/launch-posts.md](docs/launch-posts.md).
