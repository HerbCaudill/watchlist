# Discover

## Goal

Wire the Discover tab so `/movies/discover` and `/tv/discover` automatically show recent, highly rated titles using the shared Effect data layer, enrichment cache, and card components.

Discover should feel simple in v1: no filters, no pagination, no extra heading. It should show a loading state, then a grid of the best recent titles for the selected media type, with watchlist actions and detail navigation.

## Prerequisite

Finish the Effect data-layer refactor in `plans/002-effect-data-layer.md` before wiring Discover. Discover should compose these Effect-returning primitives rather than introduce one-off Promise orchestration:

1. `discoverTmdb(mediaType, options): Effect<MediaItem[], ApiError>`
2. `getCachedEnrichedMediaItem(item): Effect<MediaItem, ApiError>`

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

Fetch 40 TMDB candidates, dedupe by `mediaType + tmdbId`, enrich them with the shared cache-aware enrichment path using `Effect.forEach(..., { concurrency: 5 })`, drop items with no `normalizedScore`, sort by `normalizedScore` descending, and display the top 20.

The final quality signal is the app’s normalized score from OMDB-backed data: Rotten Tomatoes critics, Metacritic, and IMDb normalized onto 0–100. TMDB `popularity` is only a relevance/candidate signal.

## Discover-list cache

Add a Discover-list cache keyed by media type and rolling date-window/query shape, e.g. `discover:movie:2026-05-14:12mo:popular:v1`. Store the final enriched, sorted top results. Use a rolling 24-hour TTL.

When the Discover-list cache is fresh, render it directly. When it is expired or missing, recompute from fresh TMDB candidates. During recomputation, the shared media-item cache may return stale media items while refreshing them, but the Discover-list cache should only be rewritten after the recomputed, filtered, sorted list is available.

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

Use TDD when implementing executable behavior.

Unit-test pure logic for:

1. Rolling 12-month date window.
2. Discover cache keys.
3. Dedupe by media type and TMDB ID.
4. Filtering out missing scores.
5. Sorting by normalized score descending.
6. Top-20 truncation from a larger candidate set.

Add hook/component tests for loading, empty, error, cached result, rendered result, add/remove watchlist action, and click-to-detail navigation.

Add one Playwright happy-path test if external API mocking is clean in the current setup. It should visit `/movies/discover`, render mocked discovered items, and verify clicking a card opens the detail route. If mocking is awkward, keep the Playwright test as a follow-up task rather than blocking the feature.

## Tasks

1. Finish the Effect data-layer refactor prerequisite.
2. Add Discover-list cache with a rolling 24-hour TTL.
3. Implement `useDiscover(mediaType)` with bounded enrichment, filtering, sorting, and cache handling.
4. Extract/reuse `MediaGrid` for consistent card grids and states.
5. Wire `DiscoverPage` to `useDiscover`, watchlist actions, and detail navigation.
6. Add unit, hook/component, and feasible Playwright coverage.

## Unresolved questions

None.
