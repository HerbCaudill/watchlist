import type { MediaType } from "@/types"

/** Build a TMDB videos URL for a media item. */
export function buildTmdbVideosUrl(
  /** The TMDB media ID. */
  tmdbId: number,
  /** Whether the item is a movie or TV show. */
  mediaType: MediaType,
  /** The TMDB API key. */
  apiKey: string,
): string {
  return `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/videos?api_key=${encodeURIComponent(apiKey)}`
}
