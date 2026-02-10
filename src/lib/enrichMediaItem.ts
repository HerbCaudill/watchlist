import type { MediaItem } from "@/types"
import { fetchOmdbData } from "@/lib/fetchOmdbData"
import { fetchTmdbTrailer } from "@/lib/fetchTmdbTrailer"
import { calculateNormalizedScore } from "@/lib/calculateNormalizedScore"

/**
 * Enrich a `MediaItem` from TMDB search with OMDB ratings, a normalized score, and a trailer key.
 * Fetches OMDB data and the TMDB trailer in parallel for performance.
 * Returns a new `MediaItem` — the original is not mutated.
 */
export async function enrichMediaItem(
  /** The media item to enrich (typically from a TMDB search result with no ratings yet). */
  item: MediaItem,
): Promise<MediaItem> {
  const [ratings, trailerKey] = await Promise.all([
    fetchOmdbData(item.title),
    fetchTmdbTrailer(item.tmdbId, item.mediaType),
  ])

  const normalizedScore = calculateNormalizedScore(ratings)

  return {
    ...item,
    ratings,
    normalizedScore,
    trailerKey,
  }
}
