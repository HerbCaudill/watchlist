import type { MediaType } from "@/types"

/** Build a TMDB search URL for movies or TV shows. */
export function buildTmdbSearchUrl(
  /** The text query to search. */
  query: string,
  /** Whether to search movies or TV shows. */
  mediaType: MediaType,
  /** The TMDB API key. */
  apiKey: string,
): string {
  return `https://api.themoviedb.org/3/search/${mediaType}?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}`
}
