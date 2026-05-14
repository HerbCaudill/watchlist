import {
  TmdbMovieSearchResponse,
  TmdbTvSearchResponse,
  tmdbMovieResultsToMediaItems,
  tmdbTvResultsToMediaItems,
} from "@/schema/TmdbSearchResult"
import { Effect } from "@/lib/effect"
import { buildTmdbSearchUrl } from "@/lib/buildTmdbSearchUrl"
import { decodeJson } from "@/lib/decodeJson"
import { fetchJson } from "@/lib/fetchJson"
import { getRequiredApiKey } from "@/lib/getRequiredApiKey"
import { retryTransient } from "@/lib/retryTransient"
import type { MediaType } from "@/types"

/** Search TMDB with typed Effect failures. */
export function searchTmdbEffect(
  /** The search query string. */
  query: string,
  /** Whether to search for movies or TV shows. */
  mediaType: MediaType,
  /** Optional TMDB API key override. */
  apiKey?: string,
) {
  return Effect.gen(function* () {
    const resolvedApiKey = yield* getRequiredApiKey(
      apiKey,
      import.meta.env.VITE_TMDB_API_KEY,
      "TMDB",
    )
    const json = yield* retryTransient(
      fetchJson(buildTmdbSearchUrl(query, mediaType, resolvedApiKey)),
    )

    if (mediaType === "movie") {
      const decoded = yield* decodeJson(TmdbMovieSearchResponse, json)
      return tmdbMovieResultsToMediaItems(decoded)
    }

    const decoded = yield* decodeJson(TmdbTvSearchResponse, json)
    return tmdbTvResultsToMediaItems(decoded)
  })
}
