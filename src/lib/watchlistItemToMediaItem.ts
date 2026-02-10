import type { MediaItem, MediaType } from "@/types"

/**
 * Convert a DXOS WatchlistItem object into a MediaItem for use in UI components.
 * The WatchlistItem lacks `id`, `ratings`, and `trailerKey`, so those are derived or defaulted.
 */
export function watchlistItemToMediaItem(
  /** The DXOS WatchlistItem record. */
  item: WatchlistItemLike,
): MediaItem {
  return {
    id: `${item.mediaType}-${item.tmdbId}`,
    tmdbId: item.tmdbId,
    title: item.title,
    year: item.year,
    posterUrl: item.posterUrl,
    mediaType: item.mediaType,
    overview: item.overview,
    normalizedScore: item.normalizedScore,
    ratings: {},
  }
}

/** The subset of WatchlistItem fields needed for conversion. */
type WatchlistItemLike = {
  tmdbId: number
  title: string
  year?: number
  posterUrl?: string
  mediaType: MediaType
  overview?: string
  normalizedScore?: number | null
}
