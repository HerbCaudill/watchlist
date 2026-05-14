import {
  TmdbMovieDiscoverResponse,
  TmdbTvDiscoverResponse,
  tmdbMovieDiscoverToMediaItems,
  tmdbTvDiscoverToMediaItems,
} from "@/schema/TmdbDiscoverResult"
import { Effect } from "@/lib/effect"
import { buildTmdbDiscoverUrl } from "@/lib/buildTmdbDiscoverUrl"
import { decodeJson } from "@/lib/decodeJson"
import { fetchJson } from "@/lib/fetchJson"
import { getRequiredApiKey } from "@/lib/getRequiredApiKey"
import { retryTransient } from "@/lib/retryTransient"
import type { DiscoverOptions } from "@/lib/apiTypes"
import type { MediaType } from "@/types"

/** Discover TMDB candidates and map them to media items. */
export function discoverTmdb(
  /** Whether to discover movies or TV shows. */
  mediaType: MediaType,
  /** Discover options. */
  options: DiscoverOptions = {},
) {
  return Effect.gen(function* () {
    const apiKey = yield* getRequiredApiKey(
      options.apiKey,
      import.meta.env.VITE_TMDB_API_KEY,
      "TMDB",
    )
    const json = yield* retryTransient(
      fetchJson(buildTmdbDiscoverUrl(mediaType, { ...options, apiKey })),
    )

    if (mediaType === "movie") {
      const decoded = yield* decodeJson(TmdbMovieDiscoverResponse, json)
      return tmdbMovieDiscoverToMediaItems(decoded)
    }

    const decoded = yield* decodeJson(TmdbTvDiscoverResponse, json)
    return tmdbTvDiscoverToMediaItems(decoded)
  })
}
