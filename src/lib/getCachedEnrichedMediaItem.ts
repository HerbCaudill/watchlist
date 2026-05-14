import { Effect } from "@/lib/effect"
import { MEDIA_ITEM_CACHE_TTL_MS, MEDIA_ITEM_CACHE_VERSION } from "@/lib/constants"
import { enrichMediaItemEffect } from "@/lib/enrichMediaItemEffect"
import { getMediaItemCacheKey } from "@/lib/getMediaItemCacheKey"
import { readCache } from "@/lib/readCache"
import { writeCache } from "@/lib/writeCache"
import type { ApiKeys } from "@/lib/apiTypes"
import type { MediaItem } from "@/types"

/** Return cached enrichment when fresh, otherwise enrich and refresh the media-item cache. */
export function getCachedEnrichedMediaItem(
  /** The media item to enrich. */
  item: MediaItem,
  /** Optional explicit API keys. */
  keys: ApiKeys = {},
) {
  return Effect.gen(function* () {
    const cacheKey = getMediaItemCacheKey(item)
    const cached = readCache<MediaItem>(cacheKey, { version: MEDIA_ITEM_CACHE_VERSION })
    if (cached) return cached

    const enriched = yield* enrichMediaItemEffect(item, keys)
    writeCache(cacheKey, enriched, {
      version: MEDIA_ITEM_CACHE_VERSION,
      ttlMs: MEDIA_ITEM_CACHE_TTL_MS,
    })
    return enriched
  })
}
