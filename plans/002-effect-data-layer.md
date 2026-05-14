# Effect data layer

## Goal

Build one Effect-based data layer for external API metadata so search, detail, and Discover share typed API orchestration, enrichment, caching, and retry behavior.

## Approach

Move the API boundary from ad hoc `async` functions with swallowed errors to Effect-returning functions with explicit success and failure types. Keep React hooks Promise/state-oriented where useful, and keep Promise wrappers only where existing callers need them during the transition.

The core API should expose:

1. `discoverTmdb(mediaType, options): Effect<MediaItem[], ApiError>`
2. `enrichMediaItem(item): Effect<MediaItem, ApiError>`
3. `getCachedEnrichedMediaItem(item): Effect<MediaItem, ApiError>`

Names can vary, but the contract matters: callers need to fetch TMDB candidates, enrich candidates through one shared cache-aware enrichment path, and run enrichment over collections with bounded concurrency.

Use Effect Schema decoding at every external JSON boundary. Represent practical failures with small tagged errors, not broad `try/catch` + fallback values inside API functions. Apply retry policy in the Effect layer for transient network and 5xx failures, while treating 4xx/config/schema failures as non-retryable. Preserve current user-facing tolerance at composition boundaries: one bad API item should be skippable by callers, and cache failures should never become API failures.

Introduce a small API-client layer rather than using `fetch` directly in each function. That keeps URL construction, JSON parsing, status handling, config lookup, and retry behavior in one place, and makes tests easier to write with mock services.

## Shared enrichment

There should be one enrichment mechanism for the app. Search, detail handoff, and Discover should all use the same cache-aware enrichment path.

A fully enriched `MediaItem` should include ratings, `normalizedScore`, and `trailerKey`. Discover should not use a ratings-only shortcut; consistency is more important than avoiding trailer requests.

OMDB lookup should use one shared input object with title, media type, and optional year. It should call OMDB with `t`, `type=movie|series`, and `y` when available. Title-only lookup should only exist as the same path with missing optional fields, not as a second mechanism.

## Caching strategy

Use best-effort `localStorage` TTL caches with versioned envelopes:

```ts
type CacheEnvelope<T> = {
  version: number
  savedAt: string
  expiresAt: string
  value: T
}
```

Cache reads/writes should ignore unavailable storage, corrupted values, expired values, wrong versions, and quota errors. They may log a development warning but must not fail user-facing API flows.

Add a shared media-item cache keyed by media type and TMDB ID, e.g. `media:movie:550`. Store the full enriched `MediaItem`. Use a 30-day TTL. Discover may return expired media-item cache entries immediately as stale-while-revalidate, while the canonical enrichment path refreshes and rewrites the cache in the background.

## Testing

Use TDD when implementing executable behavior.

Unit-test pure logic for:

1. Versioned TTL cache read/write/expiry/wrong-version/corruption behavior.
2. Cache tolerance when localStorage is unavailable or quota-limited.
3. TMDB movie vs TV discover URL/query differences.
4. OMDB lookup parameter construction with title, year, and media type.
5. Typed API failures and retry behavior.
6. Schema decode failures.
7. Full enrichment output shape: ratings, `normalizedScore`, and `trailerKey`.
8. Cache-aware enriched media item reads, refreshes, and writes.

## Tasks

1. Define typed API errors and retry policy.
2. Add Effect-based HTTP/config helpers.
3. Refactor OMDB lookup to one shared input object.
4. Convert OMDB ratings and TMDB trailer fetching to Effect-returning functions.
5. Convert `enrichMediaItem` to one shared full-enrichment path.
6. Add the versioned localStorage TTL cache primitive.
7. Add the shared full-`MediaItem` cache with a 30-day TTL.
8. Add TMDB Discover schemas and mapping.
9. Implement `discoverTmdb(mediaType, options)`.
10. Add Promise compatibility wrappers for current search/detail callers.
11. Route existing search/detail flows through shared cache-aware enrichment.
12. Add data-layer unit tests.

## Unresolved questions

None.
