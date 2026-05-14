import type { MediaItem } from "@/types"

/** Dedupe Discover candidates by media type and TMDB ID, keeping the first occurrence. */
export function dedupeDiscoverItems(
  /** The candidate media items to dedupe. */
  items: MediaItem[],
): MediaItem[] {
  return items.reduce<MediaItem[]>((deduped, item) => {
    const hasItem = deduped.some(
      existing => existing.mediaType === item.mediaType && existing.tmdbId === item.tmdbId,
    )
    return hasItem ? deduped : [...deduped, item]
  }, [])
}
