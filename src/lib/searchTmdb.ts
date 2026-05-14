import { Effect } from "@/lib/effect"
import { searchTmdbEffect } from "@/lib/searchTmdbEffect"
import type { MediaItem, MediaType } from "@/types"

/** Search TMDB for movies or TV shows by query string with a Promise compatibility wrapper. */
export async function searchTmdb(
  /** The search query string. */
  query: string,
  /** Whether to search for movies or TV shows. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<MediaItem[]> {
  try {
    return await Effect.runPromise(searchTmdbEffect(query, mediaType, apiKey))
  } catch (error) {
    console.error("Failed to search TMDB:", error)
    return []
  }
}
