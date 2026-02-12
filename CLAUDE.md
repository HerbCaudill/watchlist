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
pnpm storybook            # Storybook dev server on port 6006
pnpm build:storybook      # Build static Storybook site
```

Run a single Vitest test: `pnpm test run src/lib/tests/foo.test.ts`

Run a single Playwright test: `pnpm test:pw e2e/foo.spec.ts`

## Tech stack

- **React 19** + **TypeScript** (strict mode) + **Vite 7**
- **Tailwind CSS v4** (CSS-first config in `src/index.css`, `@tailwindcss/vite` plugin)
- **Shadcn UI** (New York style) + **Radix UI** primitives + **Tabler icons**
- **IBM Plex** fonts (Sans, Serif, Mono)
- **PWA** via `vite-plugin-pwa` with auto-update service worker
- **Storybook 8** for component development and visual testing
- **Vitest** (jsdom) for unit tests, **Playwright** for E2E
- **React Router v7** for URL-based routing
- **Effect Schema** for API response decoding
- **DXOS 0.8.3** for local-first persistence (ClientProvider wraps RouterProvider in `main.tsx`)

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

### Routing

URL-based routing via React Router v7 (`src/main.tsx`). Routes:

```
/                         → redirect to /movies/watchlist
/:mediaType/discover      → discover view (DiscoverPage)
/:mediaType/watchlist     → watchlist filtered by media type (WatchlistPage)
/:mediaType/:tmdbId       → detail view for a specific item (DetailPage)
```

`mediaType` is `movies` or `tv` in the URL. The `Layout` component (`src/routes/Layout.tsx`)
renders the shared chrome (search, toggle, tabs) and derives `mediaType`/`activeTab` from the URL.
Search state (`useSearch`) lives in the Layout as ephemeral UI state. `DetailPage` accepts items
via router state (instant) or fetches from TMDB API (for direct URL access/deep links).

## Environment variables

API keys are loaded via Vite's `import.meta.env`:

- `VITE_TMDB_API_KEY` — The Movie Database API key
- `VITE_OMDB_API_KEY` — Open Movie Database API key

## Known issues

- **Effect version pinned to 3.14.21**: The `effect` dependency is pinned to match `@dxos/echo`'s
  exact version. A version mismatch causes `[TypeId]` unique symbol conflicts that break type
  compatibility between DXOS schema types and Effect Schema types in `tsc -b` composite builds.
  When upgrading DXOS, check `node_modules/@dxos/echo/package.json` for its `effect` version and
  keep the project's `effect` dependency in sync.
- **DXOS object creation**: Use `Obj.make()` from `@dxos/echo` (not `live()` from
  `@dxos/react-client/echo`) to create typed ECHO objects. `Obj.make` properly omits the `[KindId]`
  symbol from creation props; `live()` uses a different `CreationProps` type that doesn't.
- **DXOS shell + React 19**: `@dxos/shell@0.8.3` bundles React 18 jsx-runtime that references
  `ReactCurrentDispatcher`, removed in React 19. The `shell` prop on `ClientProvider` is omitted
  in `main.tsx` until DXOS is upgraded to a React 19-compatible version.
- **DXOS React 18 dep**: `@dxos/echo-signals` depends on `react@18.2.0` directly. The Vite config
  uses `resolve.alias` to force all imports to the project's React 19 to avoid dual instances.
- **Rollup TDZ bug with DXOS SpaceProxy**: Rollup places `let _inspectCustom` declarations after
  the class body that uses them as computed property keys, causing a temporal dead zone error in
  production builds. The `fixRollupTdzPlugin()` in `vite.config.ts` patches these declarations
  from `let` to `var` in the generated output (both main bundle and worker). This is needed until
  Rollup fixes the variable ordering for class computed property keys.

## Prettier config

No semicolons, double quotes, trailing commas, 100 char width, experimental ternaries,
Tailwind class sorting plugin.
