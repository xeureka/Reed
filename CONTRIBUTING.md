# Contributing to Reed

## Before you start

Install Node.js 22+ and pnpm, then run:

```bash
pnpm install
pnpm dev
```

Run the frontend at `http://localhost:5174` and the API at `http://localhost:3001`. Copy the example environment files before changing API or Gemini settings.

## Project conventions

- Keep frontend changes in `apps/frontend` and backend changes in `apps/backend`.
- Reuse the shared story shape and existing source/service pipeline.
- Keep source failures isolated; one unavailable source must not break the feed.
- Keep responsive behavior working from 320px upward and preserve keyboard/touch accessibility.
- Do not commit `.env` files, API keys, generated `dist/` output, or secrets.
- Avoid new dependencies unless the current stack cannot support the change.

## Branches

Create focused branches from `main`:

```text
feat/source-filter
fix/feed-timeout
docs/deployment
```

Use `main` as the pull-request target. Do not commit directly to `main` unless the change is an agreed documentation or release maintenance update.

## Commits

Use short conventional commits:

```text
feat: add source filter
fix: handle empty feed
docs: clarify Cloudflare setup
refactor: isolate feed adapter
```

Keep commits focused and avoid unrelated formatting or generated files.

## Testing

Run all checks from the repository root before opening a PR:

```bash
pnpm build
pnpm lint
pnpm typecheck
```

For UI changes, check light and dark themes at 320px, 375px, 768px, and 1280px. For feed changes, verify `/health`, `/api/feed`, source filters, partial source failures, and summary fallback behavior.

## Pull requests

Open a PR against `main` with:

- A short summary of the change and why it is needed
- The checks and manual testing performed
- Screenshots or a short recording for visual changes
- Any new environment variables or deployment settings
- Notes about source/API limits or known fallbacks

Keep the PR focused, respond to review feedback, and make sure the checks pass before requesting review.

## Roadmap

- [ ] Personalized feed
- [ ] Multi-language support
- [ ] More blogs and writing areas beyond tech
- [ ] Mobile app

Want to pick one up? Open an issue first so we can align on scope.
