import { DISCOVER_LIST_CACHE_TTL_MS, DISCOVER_LIST_CACHE_VERSION } from "@/lib/constants"
import { getDiscoverCacheKey } from "@/lib/getDiscoverCacheKey"
import { writeCache } from "@/lib/writeCache"
import type { DiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import type { MediaItem, MediaType } from "@/types"

/** Write the final ranked Discover list to the rolling Discover cache. */
export function writeDiscoverCache(
  /** The media type for the Discover list. */
  mediaType: MediaType,
  /** The rolling Discover date window. */
  window: DiscoverDateWindow,
  /** The ranked Discover items to cache. */
  items: MediaItem[],
): void {
  writeCache(getDiscoverCacheKey(mediaType, window), items, {
    version: DISCOVER_LIST_CACHE_VERSION,
    ttlMs: DISCOVER_LIST_CACHE_TTL_MS,
  })
}
