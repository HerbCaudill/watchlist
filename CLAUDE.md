# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this?

Watchlist is a local-first app for tracking movies and TV shows. It uses TMDB and OMDB APIs for
search and enrichment, DXOS for local-first persistence, and Effect Schema for API data decoding.
The implementation plan is in `plans/001.initial.md`.

## Commands

```bash
pnpm dev                  # Dev server on port 5179 (auto-opens browser)
pnpm build                # TypeScript check + Vite production build
pnpm test                 # Vitest in watch mode
pnpm test run             # Vitest single run (no watch)
pnpm test:pw              # Playwright E2E tests (Chromium only)
pnpm test:pw:headed       # Playwright in headed browser
pnpm test:pw:ui           # Playwright UI mode
pnpm test:all             # Full suite: typecheck + vitest + playwright
pnpm typecheck            # TypeScript type checking only
pnpm format               # Prettier formatting
```

Run a single Vitest test: `pnpm test run src/lib/tests/foo.test.ts`

Run a single Playwright test: `pnpm test:pw e2e/foo.spec.ts`

## Tech stack

- **React 19** + **TypeScript** (strict mode) + **Vite 7**
- **Tailwind CSS v4** (CSS-first config in `src/index.css`, `@tailwindcss/vite` plugin)
- **Shadcn UI** (New York style) + **Radix UI** primitives + **Tabler icons**
- **IBM Plex** fonts (Sans, Serif, Mono)
- **PWA** via `vite-plugin-pwa` with auto-update service worker
- **Vitest** (jsdom) for unit tests, **Playwright** for E2E
- **Effect Schema** for API response decoding (planned)
- **DXOS** for local-first persistence (planned)

## Path alias

`@/` maps to `./src/` — use `@/components/Foo` instead of relative paths.

## Architecture

The app follows a phased implementation plan:

1. **Presentational components** — Storybook-driven, each in `src/components/`
2. **Data layer** — Effect Schema decoders in `src/schema/`
3. **API services** — TMDB search, OMDB enrichment, trailer lookup in `src/lib/`
4. **DXOS integration** — Echo schema, client provider, watchlist persistence
5. **Wire together** — Hooks (`useSearch`, `useWatchlist`) connecting data to UI

Key types are in `src/types.ts`. Fixtures for stories/tests go in `src/lib/fixtures.ts`.

## Environment variables

API keys are loaded via Vite's `import.meta.env`:
- `VITE_TMDB_API_KEY` — The Movie Database API key
- `VITE_OMDB_API_KEY` — Open Movie Database API key

## Prettier config

No semicolons, double quotes, trailing commas, 100 char width, experimental ternaries,
Tailwind class sorting plugin.
