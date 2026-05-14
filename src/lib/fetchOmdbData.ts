import { Effect } from "@/lib/effect"
import { fetchOmdbDataEffect } from "@/lib/fetchOmdbDataEffect"
import type { Ratings } from "@/types"

/** Fetch enrichment data from OMDB with a Promise compatibility wrapper. */
export async function fetchOmdbData(
  /** The movie or TV show title to look up. */
  title: string,
  /** OMDB API key. Defaults to the `VITE_OMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_OMDB_API_KEY,
): Promise<Ratings> {
  try {
    return await Effect.runPromise(fetchOmdbDataEffect({ title, apiKey }))
  } catch (error) {
    console.error("Failed to fetch OMDB data:", error)
    return {}
  }
}
