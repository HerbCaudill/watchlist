import { Schema } from "effect"
import { OmdbResult } from "@/schema/OmdbResult"
import type { Ratings } from "@/types"

/**
 * Fetch enrichment data from the OMDB API for a given title.
 * Decodes the response using the `OmdbResult` Effect Schema and returns a `Ratings` object.
 * Returns empty ratings `{}` on any failure (network error, invalid response, etc.).
 */
export async function fetchOmdbData(
  /** The movie or TV show title to look up. */
  title: string,
  /** OMDB API key. Defaults to the `VITE_OMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_OMDB_API_KEY,
): Promise<Ratings> {
  try {
    const encodedTitle = encodeURIComponent(title)
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodedTitle}`
    const response = await fetch(url)
    const data: unknown = await response.json()
    const ratings = Schema.decodeUnknownSync(OmdbResult)(data)
    return ratings
  } catch (error) {
    console.error("Failed to fetch OMDB data:", error)
    return {}
  }
}
