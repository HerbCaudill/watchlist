import { Schema } from "effect"
import type { MediaItem, MediaType } from "@/types"
import {
  TmdbMovieDetailResponse,
  TmdbTvDetailResponse,
  tmdbMovieDetailToMediaItem,
  tmdbTvDetailToMediaItem,
} from "@/schema/TmdbDetailResult"

/**
 * Fetch a single movie or TV show by TMDB ID.
 * Decodes the response using Effect Schema and converts to a MediaItem.
 * Returns null on any error (network, decoding, not found, etc.).
 */
export async function fetchTmdbDetails(
  /** The TMDB ID of the item to fetch. */
  tmdbId: number,
  /** Whether this is a movie or TV show. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<MediaItem | null> {
  try {
    const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${apiKey}`
    const response = await fetch(url)
    if (!response.ok) return null
    const data: unknown = await response.json()

    if (mediaType === "movie") {
      const decoded = Schema.decodeUnknownSync(TmdbMovieDetailResponse)(data)
      return tmdbMovieDetailToMediaItem(decoded)
    } else {
      const decoded = Schema.decodeUnknownSync(TmdbTvDetailResponse)(data)
      return tmdbTvDetailToMediaItem(decoded)
    }
  } catch (error) {
    console.error("Failed to fetch TMDB details:", error)
    return null
  }
}
