# Effect-powered discovery

## Goal

Refactor TMDB/OMDB API work into typed Effect programs so discovery can compose candidate fetching, enrichment, retry, filtering, and sorting predictably from React.

## Approach

Move the API boundary from ad hoc `async` functions with swallowed errors to Effect-returning functions with explicit success and failure types. Keep Promise wrappers only where existing React/search/detail callers need them during the transition.

The core API should expose:

1. `discoverTmdb(mediaType, options): Effect<MediaItem[], TmdbApiError | DecodeError | ConfigError>`
2. `enrichMediaItem(item): Effect<MediaItem, OmdbApiError | TmdbApiError | DecodeError | ConfigError>`
3. `useDiscover(mediaType, options)` that runs a composed Effect, enriches candidates with `Effect.forEach(..., { concurrency: 5 })`, keeps partial successes where appropriate, filters by `normalizedScore`, sorts by score, and exposes ordinary React state.

Use Effect Schema decoding at every external JSON boundary. Represent failures with small tagged errors, not `console.error` + fallback values inside the API functions. Apply retry policy in the Effect layer for transient network and 5xx failures, while treating 4xx/config/schema failures as non-retryable. For enrichment, decide at the composition boundary whether a failed OMDB/trailer call should drop the item, keep it unenriched, or keep it with partial enrichment.

Introduce a small API-client layer rather than using `fetch` directly in each function. That keeps URL construction, JSON parsing, status handling, config lookup, and retry behavior in one place, and makes tests easier to write with mock services.

## Tasks

1. Define typed API errors and retry policy.
2. Add Effect-based HTTP/config helpers for API calls.
3. Add schemas and mapping for TMDB discover responses.
4. Implement `discoverTmdb(mediaType, options)` as an Effect-returning function.
5. Convert OMDB ratings and TMDB trailer fetching to Effect-returning functions.
6. Convert `enrichMediaItem(item)` to compose OMDB and trailer effects in parallel.
7. Add Promise compatibility wrappers for current search/detail callers, preserving existing UI behavior while the discover path moves to Effect.
8. Implement `useDiscover` using `Effect.forEach(..., { concurrency: 5 })`, score filtering, sorting, cancellation, and normal React state.
9. Replace the Discover placeholder with a wired discover view and tests.
10. Update tests around retry, typed failures, partial enrichment behavior, filtering, sorting, and hook state.

## Unresolved Questions

1. What minimum `normalizedScore` should Discover use by default?
2. Should enrichment failures keep an item with partial/empty ratings, or exclude that item from Discover?
3. Which TMDB discover options should ship first: sort order, release date window, genre filters, page count, or watch-provider filters?
