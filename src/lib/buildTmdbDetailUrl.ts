import type { MediaType } from "@/types"

/** Build a TMDB detail URL for a media item. */
export function buildTmdbDetailUrl(
  /** The TMDB media ID. */
  tmdbId: number,
  /** Whether the item is a movie or TV show. */
  mediaType: MediaType,
  /** The TMDB API key. */
  apiKey: string,
): string {
  return `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${encodeURIComponent(apiKey)}`
}
