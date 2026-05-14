# Effect-powered discovery

## Goal

Build one Effect-based data layer for external API metadata so search, detail, and Discover share typed API orchestration, enrichment, caching, retry, filtering, and sorting behavior.

## Approach

Move the API boundary from ad hoc `async` functions with swallowed errors to Effect-returning functions with explicit success and failure types. Keep React hooks Promise/state-oriented where useful, and keep Promise wrappers only where existing callers need them during the transition.

The core API should expose:

1. `discoverTmdb(mediaType, options): Effect<MediaItem[], ApiError>`
2. `enrichMediaItem(item): Effect<MediaItem, ApiError>`
3. `getCachedEnrichedMediaItem(item): Effect<MediaItem, ApiError>`
4. `useDiscover(mediaType, options)` that runs a composed Effect, enriches candidates with `Effect.forEach(..., { concurrency: 5 })`, skips bad items where appropriate, filters by `normalizedScore`, sorts by score, and exposes ordinary React state.

Use Effect Schema decoding at every external JSON boundary. Represent practical failures with small tagged errors, not broad `try/catch` + fallback values inside the API functions. Apply retry policy in the Effect layer for transient network and 5xx failures, while treating 4xx/config/schema failures as non-retryable. Preserve current user-facing tolerance at composition boundaries: one bad API item should be skippable by callers, and cache failures should never become API failures.

Introduce a small API-client layer rather than using `fetch` directly in each function. That keeps URL construction, JSON parsing, status handling, config lookup, and retry behavior in one place, and makes tests easier to write with mock services.

Refactor OMDB lookup into one shared path. It should accept title, media type, and year when available, then call OMDB with `t`, `type=movie|series`, and `y` where possible. Existing title-only behavior should disappear except as optional missing fields on the same lookup input.

Refactor enrichment into one shared path. A fully enriched `MediaItem` should consistently include the existing fields plus `ratings`, `normalizedScore`, and `trailerKey`. Search, detail handoff, and Discover should all call this same enrichment mechanism rather than separate ratings-only variants.

Add a best-effort localStorage TTL cache with a versioned envelope:

```ts
type CacheEnvelope<T> = {
  version: number
  savedAt: string
  expiresAt: string
  value: T
}
```

Cache failures should never break app behavior. Corrupted, expired, wrong-version, unavailable, or quota-failed entries should be ignored with at most a dev warning.

Add a shared media-item cache keyed by media type and TMDB ID, e.g. `media:movie:550`. Cache the full enriched `MediaItem`, not partial metadata. Use a long TTL; start with 30 days. Expired media-item cache entries may be returned stale-while-revalidate where a caller can support that, but the canonical enrichment path should refresh and rewrite the cache.

## Tasks

1. Define typed API errors and retry policy.
2. Add Effect-based HTTP/config helpers for API calls.
3. Add schemas and mapping for TMDB discover responses.
4. Implement `discoverTmdb(mediaType, options)` as an Effect-returning function.
5. Convert OMDB ratings and TMDB trailer fetching to Effect-returning functions.
6. Refactor OMDB lookup to use one input object with title, media type, and optional year.
7. Add a best-effort versioned localStorage TTL cache.
8. Add a cache-aware `getCachedEnrichedMediaItem(item)` path keyed by media type and TMDB ID.
9. Convert `enrichMediaItem(item)` to compose OMDB and trailer effects in parallel and return a fully enriched item.
10. Route search, detail handoff, and Discover through the shared enrichment path.
11. Add Promise compatibility wrappers for current search/detail callers, preserving existing UI behavior while the core API moves to typed Effects.
12. Implement `useDiscover` using `Effect.forEach(..., { concurrency: 5 })`, score filtering, sorting, cancellation, and normal React state.
13. Replace the Discover placeholder with a wired discover view and tests.
14. Update tests around retry, typed failures, cache tolerance, cache TTL/version behavior, OMDB lookup parameters, partial/skipped item behavior, filtering, sorting, and hook state.

## Unresolved Questions

1. What minimum `normalizedScore` should Discover use by default?
2. Should enrichment failures keep an item with partial/empty ratings, or exclude that item from Discover?
3. Which TMDB discover options should ship first: sort order, release date window, genre filters, page count, or watch-provider filters?
4. Should Discover use stale-while-revalidate cached media items immediately, or wait for canonical refresh before showing results?
