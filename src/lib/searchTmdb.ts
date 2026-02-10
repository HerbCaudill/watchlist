import { Schema } from "effect"
import type { MediaItem, MediaType } from "@/types"
import {
  TmdbMovieSearchResponse,
  TmdbTvSearchResponse,
  tmdbMovieResultsToMediaItems,
  tmdbTvResultsToMediaItems,
} from "@/schema/TmdbSearchResult"

/**
 * Search TMDB for movies or TV shows by query string.
 * Decodes the response using Effect Schema and converts to MediaItem[].
 * Returns an empty array on any error (network, decoding, etc.).
 */
export async function searchTmdb(
  /** The search query string. */
  query: string,
  /** Whether to search for movies or TV shows. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<MediaItem[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${encodedQuery}`
    const response = await fetch(url)
    const data: unknown = await response.json()

    if (mediaType === "movie") {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(data)
      return tmdbMovieResultsToMediaItems(decoded)
    } else {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(data)
      return tmdbTvResultsToMediaItems(decoded)
    }
  } catch (error) {
    console.error("Failed to search TMDB:", error)
    return []
  }
}
