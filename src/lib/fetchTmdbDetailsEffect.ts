import {
  TmdbMovieDetailResponse,
  TmdbTvDetailResponse,
  tmdbMovieDetailToMediaItem,
  tmdbTvDetailToMediaItem,
} from "@/schema/TmdbDetailResult"
import { Effect } from "@/lib/effect"
import { buildTmdbDetailUrl } from "@/lib/buildTmdbDetailUrl"
import { decodeJson } from "@/lib/decodeJson"
import { fetchJson } from "@/lib/fetchJson"
import { getRequiredApiKey } from "@/lib/getRequiredApiKey"
import { retryTransient } from "@/lib/retryTransient"
import type { MediaType } from "@/types"

/** Fetch one TMDB detail item with typed Effect failures. */
export function fetchTmdbDetailsEffect(
  /** The TMDB ID of the item to fetch. */
  tmdbId: number,
  /** Whether this is a movie or TV show. */
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
      fetchJson(buildTmdbDetailUrl(tmdbId, mediaType, resolvedApiKey)),
    )

    if (mediaType === "movie") {
      const decoded = yield* decodeJson(TmdbMovieDetailResponse, json)
      return tmdbMovieDetailToMediaItem(decoded)
    }

    const decoded = yield* decodeJson(TmdbTvDetailResponse, json)
    return tmdbTvDetailToMediaItem(decoded)
  })
}
