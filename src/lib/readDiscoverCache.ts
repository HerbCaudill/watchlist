import { DISCOVER_LIST_CACHE_VERSION } from "@/lib/constants"
import { getDiscoverCacheKey } from "@/lib/getDiscoverCacheKey"
import { readCache } from "@/lib/readCache"
import type { DiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import type { MediaItem, MediaType } from "@/types"

/** Read a fresh cached Discover list for the media type and date window. */
export function readDiscoverCache(
  /** The media type for the Discover list. */
  mediaType: MediaType,
  /** The rolling Discover date window. */
  window: DiscoverDateWindow,
): MediaItem[] | null {
  return readCache<MediaItem[]>(getDiscoverCacheKey(mediaType, window), {
    version: DISCOVER_LIST_CACHE_VERSION,
  })
}
