# Contributing to Reed

## Setup

Install Node.js 22+ and pnpm, then run:

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run `pnpm build`, `pnpm lint`, and `pnpm typecheck` from the repository root.

## Branches

Create focused branches from `main` using a short type/name format:

```text
feat/source-filter
fix/feed-timeout
docs/setup
```

## Commits

Use concise conventional commits such as `feat: add source filter`, `fix: handle empty feed`, or `docs: clarify setup`. Keep each commit focused and avoid unrelated formatting changes.

## Pull requests

Open a PR against `main` with a short summary, testing notes, screenshots for visual changes, and any required environment or deployment changes. Keep the PR focused, respond to review feedback, and make sure all checks pass before requesting review.
