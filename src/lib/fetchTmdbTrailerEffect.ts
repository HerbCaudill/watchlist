import { TmdbVideosResponse } from "@/schema/TmdbVideosResult"
import { Effect } from "@/lib/effect"
import { buildTmdbVideosUrl } from "@/lib/buildTmdbVideosUrl"
import { decodeJson } from "@/lib/decodeJson"
import { fetchJson } from "@/lib/fetchJson"
import { getRequiredApiKey } from "@/lib/getRequiredApiKey"
import { retryTransient } from "@/lib/retryTransient"
import { selectBestTrailerKey } from "@/lib/selectBestTrailerKey"
import type { MediaType } from "@/types"

/** Fetch the best TMDB trailer key through the shared Effect data layer. */
export function fetchTmdbTrailerEffect(
  /** The TMDB ID of the media item. */
  tmdbId: number,
  /** Whether the item is a movie or TV show. */
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
      fetchJson(buildTmdbVideosUrl(tmdbId, mediaType, resolvedApiKey)),
    )
    const decoded = yield* decodeJson(TmdbVideosResponse, json)
    return selectBestTrailerKey(decoded.results)
  })
}
