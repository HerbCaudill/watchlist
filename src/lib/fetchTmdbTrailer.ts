import { Effect } from "@/lib/effect"
import { fetchTmdbTrailerEffect } from "@/lib/fetchTmdbTrailerEffect"
import type { MediaType } from "@/types"

/** Fetch the best YouTube trailer key for a TMDB media item with a Promise compatibility wrapper. */
export async function fetchTmdbTrailer(
  /** The TMDB ID of the media item. */
  tmdbId: number,
  /** Whether this is a movie or TV show. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<string | null> {
  try {
    return await Effect.runPromise(fetchTmdbTrailerEffect(tmdbId, mediaType, apiKey))
  } catch (error) {
    console.error("Failed to fetch TMDB trailer:", error)
    return null
  }
}
