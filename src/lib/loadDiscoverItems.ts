import { Effect } from "@/lib/effect"
import { dedupeDiscoverItems } from "@/lib/dedupeDiscoverItems"
import { discoverTmdb } from "@/lib/discoverTmdb"
import { getCachedEnrichedMediaItem } from "@/lib/getCachedEnrichedMediaItem"
import { getDiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import { rankDiscoverItems } from "@/lib/rankDiscoverItems"
import { readDiscoverCache } from "@/lib/readDiscoverCache"
import { writeDiscoverCache } from "@/lib/writeDiscoverCache"
import type { ApiError, ApiKeys } from "@/lib/apiTypes"
import type { MediaItem, MediaType } from "@/types"

/** Load the ranked Discover list from cache or from fresh TMDB candidates plus enrichment. */
export function loadDiscoverItems(
  /** The media type to discover. */
  mediaType: MediaType,
  /** Optional explicit API keys for tests and compatibility. */
  keys?: ApiKeys,
) {
  return Effect.gen(function* () {
    const window = getDiscoverDateWindow()
    const cached = readDiscoverCache(mediaType, window)
    if (cached) return cached

    const pages = yield* Effect.forEach(
      [1, 2],
      page => discoverTmdb(mediaType, { apiKey: keys?.tmdbApiKey, page, ...window }),
      { concurrency: 2 },
    )
    const candidates = dedupeDiscoverItems(pages.flat()).slice(0, 40)
    const enriched = yield* Effect.forEach(candidates, enrichCandidate(keys), { concurrency: 5 })
    const ranked = rankDiscoverItems(enriched.filter(item => item != null))

    writeDiscoverCache(mediaType, window, ranked)
    return ranked
  })
}

/** Build a cache-aware enrichment effect that skips failed candidate enrichments. */
function enrichCandidate(
  /** Optional explicit API keys for tests and compatibility. */
  keys?: ApiKeys,
): (item: MediaItem) => Effect.Effect<MediaItem | null, never> {
  return item =>
    Effect.catchAll(
      getCachedEnrichedMediaItem(item, {
        tmdbApiKey: keys?.tmdbApiKey,
        omdbApiKey: keys?.omdbApiKey,
      }),
      (_error: ApiError) => Effect.succeed(null),
    )
}
