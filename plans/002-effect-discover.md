# Effect-powered Discover

## Goal

Wire the Discover tab so `/movies/discover` and `/tv/discover` automatically show recent, highly rated titles using the same enrichment, caching, and card components as search.

Discover should feel simple in v1: no filters, no pagination, no extra heading. It should show a loading state, then a grid of the best recent titles for the selected media type, with watchlist actions and detail navigation.

## Prerequisite: Effect data-layer refactor

Before wiring the UI, another agent should refactor the external API data layer so Discover is not built on one-off Promise orchestration.

The refactor should expose Effect-returning primitives for:

1. `discoverTmdb(mediaType, options): Effect<MediaItem[], ApiError>`
2. `enrichMediaItem(item): Effect<MediaItem, ApiError>`
3. `getCachedEnrichedMediaItem(item): Effect<MediaItem, ApiError>`

Names can vary, but the contract matters: Discover needs to fetch TMDB candidates, enrich candidates through the same shared cache-aware enrichment path used by search/detail, and run enrichment over a collection with bounded concurrency.

The data layer should use Effect Schema at external JSON boundaries, typed failures for practical API errors, retry policy for transient network and 5xx failures, and best-effort cache behavior that never surfaces cache failures to users.

## Discover source and ranking

Use TMDB Discover only as a candidate source, not as the final quality signal.

For movies, fetch candidates from `/discover/movie` using:

1. `primary_release_date.gte = today - 12 months`
2. `primary_release_date.lte = today`
3. `sort_by = popularity.desc`
4. `vote_count.gte = 100`
5. `include_adult = false`
6. `include_video = false`
7. `language = en-US`

For TV, fetch candidates from `/discover/tv` using:

1. `first_air_date.gte = today - 12 months`
2. `first_air_date.lte = today`
3. `sort_by = popularity.desc`
4. `vote_count.gte = 100`
5. `include_adult = false`
6. `language = en-US`

Do not add region, provider, country, scripted/non-scripted, poster, overview, theatrical-release, or TV-type filters in v1. TV Discover should be no stricter than current TV search, except for the recent-date candidate window.

Fetch 40 TMDB candidates, dedupe by `mediaType + tmdbId`, enrich them with the shared enrichment path using `Effect.forEach(..., { concurrency: 5 })`, drop items with no `normalizedScore`, sort by `normalizedScore` descending, and display the top 20.

The final quality signal is the app’s normalized score from OMDB-backed data: Rotten Tomatoes critics, Metacritic, and IMDb normalized onto 0–100. TMDB `popularity` is only a relevance/candidate signal.

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

Use two cache layers:

1. Shared media-item cache keyed by media type and TMDB ID, e.g. `media:movie:550`. Store the full enriched `MediaItem`. Use a 30-day TTL. Expired entries may be used stale-while-revalidate by callers that can support it.
2. Discover-list cache keyed by media type and rolling date-window/query shape, e.g. `discover:movie:2026-05-14:12mo:popular:v1`. Store the final enriched, sorted top results. Use a rolling 24-hour TTL.

When the Discover list cache is fresh, render it directly. When it is expired or missing, recompute from fresh TMDB candidates. During recomputation, the shared media-item cache may return stale media items while refreshing them, but the Discover-list cache should only be rewritten after the recomputed, filtered, sorted list is available.

## UI behavior

Replace `DiscoverPlaceholder` with a wired Discover route.

`DiscoverPage` should read `mediaType`, `watchlist`, and watchlist IDs from the layout context, call `useDiscover(mediaType)`, and render the same card grid pattern used by search/watchlist.

Extract a reusable `MediaGrid` component if the refactor stays small. It should own consistent loading, empty, and error display props, and render existing `MediaCard` components. It should support card selection and card actions while ignoring action-button clicks for selection.

Discover cards should:

1. Show existing watchlist state.
2. Add/remove via the existing watchlist hook.
3. Navigate to `/${urlMediaType}/${tmdbId}` on card click.
4. Pass the enriched item in router state.

Loading copy can be `Loading...`; empty copy can be `No results`; error copy can be `Couldn’t load discover results`. No retry button is required in v1.

## Hook behavior

Add `useDiscover(mediaType, options?)` after the data-layer prerequisite is complete.

The hook should:

1. Load automatically when `/movies/discover` or `/tv/discover` opens.
2. Refetch when media type changes.
3. Use the fresh Discover-list cache when available.
4. Compose `discoverTmdb`, cache-aware enrichment, dedupe, score filtering, sorting, and top-20 truncation.
5. Use bounded enrichment concurrency of 5.
6. Skip failed candidate enrichments rather than failing the whole list.
7. Drop items that still lack `normalizedScore`.
8. Expose ordinary React state: `items`, `isLoading`, and `error`.
9. Avoid setting stale state after unmount or media-type changes.

## Testing

Use TDD when implementing the executable behavior.

Unit-test pure logic for:

1. Rolling 12-month date window.
2. Discover cache keys.
3. Versioned TTL cache read/write/expiry/wrong-version/corruption behavior.
4. Dedupe by media type and TMDB ID.
5. Filtering out missing scores.
6. Sorting by normalized score descending.
7. Top-20 truncation from a larger candidate set.
8. TMDB movie vs TV discover URL/query differences.
9. OMDB lookup parameter construction with title, year, and media type.

Add hook/component tests for loading, empty, error, cached result, rendered result, add/remove watchlist action, and click-to-detail navigation.

Add one Playwright happy-path test if external API mocking is clean in the current setup. It should visit `/movies/discover`, render mocked discovered items, and verify clicking a card opens the detail route. If mocking is awkward, keep the Playwright test as a follow-up task rather than blocking the feature.

## Tasks

1. Finish the Effect data-layer refactor prerequisite.
2. Define typed API errors and retry policy.
3. Add Effect-based HTTP/config helpers.
4. Refactor OMDB lookup to one shared input object.
5. Convert OMDB ratings and TMDB trailer fetching to Effect-returning functions.
6. Convert `enrichMediaItem` to one shared full-enrichment path.
7. Add the versioned localStorage TTL cache primitive.
8. Add the shared full-`MediaItem` cache with a 30-day TTL.
9. Route existing search/detail flows through shared cache-aware enrichment.
10. Add TMDB Discover schemas and mapping.
11. Implement `discoverTmdb(mediaType, options)`.
12. Add Discover-list cache with a rolling 24-hour TTL.
13. Implement `useDiscover(mediaType)` with bounded enrichment, filtering, sorting, and cache handling.
14. Extract/reuse `MediaGrid` for consistent card grids and states.
15. Wire `DiscoverPage` to `useDiscover`, watchlist actions, and detail navigation.
16. Add unit, hook/component, and feasible Playwright coverage.

## Unresolved questions

None.
