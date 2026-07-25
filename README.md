# Reed

> **Stop doom-scrolling. Start smart-scrolling.**

Reed transforms the way you consume tech news. It takes stories from Hacker News and top tech blogs and delivers them as full-screen, swipeable cards — think TikTok, but for developer content. Each story gets an AI-extracted summary, so you can decide what's worth your time without ever leaving the feed.

**Live:** [reed-three.vercel.app](https://reed-three.vercel.app)

---

## Why Reed?

The average developer misses valuable stories because long-form feeds don't fit how we actually consume content anymore. Reed solves this with a **vertical snap-scroll interface** — one story per screen, swipe to move on. Background summarization means you never wait for content to load.

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    REED ARCHITECTURE                     │
├──────────────┬──────────────────────────────────────────┤
│   FRONTEND   │  React 19 · TypeScript · Vite 7 ·       │
│              │  Tailwind CSS 4 · Axios · Web Share API  │
├──────────────┼──────────────────────────────────────────┤
│   BACKEND    │  Bun · Express 5 · TypeScript ·          │
│              │  Cheerio (scraping) · extractive-summarize│
├──────────────┼──────────────────────────────────────────┤
│   DEPLOY     │  Vercel (FE) · Render (BE) · Docker      │
└──────────────┴──────────────────────────────────────────┘
```

**Key libraries:**
- **React 19** — latest concurrent features for smooth UI
- **Vite 7** — instant HMR, native TypeScript support
- **Tailwind CSS 4** — utility-first styling via Vite plugin
- **Bun** — fast JS/TS runtime for the backend
- **Cheerio** — server-side HTML parsing for article scraping
- **extractive-summarize** — sentence-level summary generation

---

## How It Works

```
Hacker News API
       │
       ▼
┌──────────────┐      ┌──────────────┐
│  Express API │─────▶│  Cheerio +   │
│  /foryou/*   │      │  Summarizer  │
└──────┬───────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│  React SPA   │  ◀──  Snap scroll + infinite pagination
│  Vite + TW4  │
└──────────────┘
```

1. **Backend** fetches and paginates Hacker News stories (`/foryou/new`, `/top`, `/best`)
2. **Frontend** renders stories as full-screen cards with CSS `snap-y snap-mandatory`
3. **Summaries** are fetched in the background per card — no blocking initial load
4. **Keyboard nav** — Arrow Up/Down snaps between cards

---

## Project Structure

```
Reed/
├── backend/
│   ├── index.ts                          # Express app entry
│   ├── controllers/foryou.controller.ts  # HN API fetcher + pagination
│   ├── routes/
│   │   ├── foryou.routes.ts              # /foryou/{new,top,best}
│   │   └── summery.routes.ts            # /summarize?url=
│   ├── utils/db.connect.ts              # MongoDB util (planned)
│   └── Dockerfile                        # Alpine Bun image
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                       # Root component
│   │   ├── types.ts                      # Shared TypeScript types
│   │   └── components/
│   │       ├── HNReels/
│   │       │   ├── HNReels.tsx           # Main feed (snap scroll + infinite load)
│   │       │   ├── Header/              # Gradient header bar
│   │       │   ├── StoryCard/           # Full-screen story card
│   │       │   └── hooks/
│   │       │       ├── useStoryData.ts   # Fetch + pagination + background summaries
│   │       │       └── useArrowKeySnap.ts # Keyboard navigation
│   │       └── shared/
│   │           ├── helpers.ts            # domainFromUrl, shareLink, fallbackSummarize
│   │           └── timeAgo.ts           # Timestamp formatter
│   └── vite.config.ts
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (backend)
- [Node.js](https://nodejs.org/) + [pnpm](https://pnpm.io/) (frontend)

### 1. Clone & install

```bash
git clone https://github.com/xeureka/Reed.git
cd Reed

# Backend
cd backend && bun install

# Frontend
cd ../frontend && pnpm install
```

### 2. Configure environment

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && bun run dev

# Terminal 2 — Frontend
cd frontend && pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/foryou/new?page=1&limit=10` | New HN stories (paginated) |
| `GET` | `/foryou/top?page=1&limit=10` | Top HN stories (paginated) |
| `GET` | `/foryou/best?page=1&limit=10` | Best HN stories (paginated) |
| `GET` | `/summarize?url=<article-url>` | Scrape + summarize an article |

---

## Contributing

Contributions are welcome. Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/your-feature`)
3. **Commit** with clear messages
4. **Push** and open a **Pull Request**

### Areas to contribute

- [ ] LLM-powered summaries (OpenAI SDK is installed, awaiting integration)
- [ ] User accounts and favorites (MongoDB connection util exists)
- [ ] Additional feed sources beyond Hacker News
- [ ] Backend test coverage (currently none)
- [ ] Dark/light theme toggle
- [ ] Frontend consumption of `/top` and `/best` endpoints
- [ ] Health check endpoint for Render deployment
- [ ] Accessibility improvements (screen reader support, focus management)

---

## License

MIT
