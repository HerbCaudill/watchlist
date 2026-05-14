import type { MediaItem } from "@/types"

/** Build the shared full media-item cache key. */
export function getMediaItemCacheKey(
  /** The media item to cache. */
  item: Pick<MediaItem, "mediaType" | "tmdbId">,
): string {
  return `media:${item.mediaType}:${item.tmdbId}`
}
