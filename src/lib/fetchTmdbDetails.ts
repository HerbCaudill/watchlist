import { Effect } from "@/lib/effect"
import { fetchTmdbDetailsEffect } from "@/lib/fetchTmdbDetailsEffect"
import type { MediaItem, MediaType } from "@/types"

/** Fetch a single movie or TV show by TMDB ID with a Promise compatibility wrapper. */
export async function fetchTmdbDetails(
  /** The TMDB ID of the item to fetch. */
  tmdbId: number,
  /** Whether this is a movie or TV show. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<MediaItem | null> {
  try {
    return await Effect.runPromise(fetchTmdbDetailsEffect(tmdbId, mediaType, apiKey))
  } catch (error) {
    console.error("Failed to fetch TMDB details:", error)
    return null
  }
}
