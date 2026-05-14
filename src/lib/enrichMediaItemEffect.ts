import { Effect } from "@/lib/effect"
import { calculateNormalizedScore } from "@/lib/calculateNormalizedScore"
import { fetchOmdbDataEffect } from "@/lib/fetchOmdbDataEffect"
import { fetchTmdbTrailerEffect } from "@/lib/fetchTmdbTrailerEffect"
import type { ApiKeys } from "@/lib/apiTypes"
import type { MediaItem } from "@/types"

/** Enrich a media item with OMDB ratings, normalized score, and trailer key. */
export function enrichMediaItemEffect(
  /** The media item to enrich. */
  item: MediaItem,
  /** Optional explicit API keys. */
  keys: ApiKeys = {},
) {
  return Effect.gen(function* () {
    const { ratings, trailerKey } = yield* Effect.all(
      {
        ratings: fetchOmdbDataEffect({
          title: item.title,
          mediaType: item.mediaType,
          year: item.year,
          apiKey: keys.omdbApiKey,
        }),
        trailerKey: fetchTmdbTrailerEffect(item.tmdbId, item.mediaType, keys.tmdbApiKey),
      },
      { concurrency: "unbounded" },
    )
    return { ...item, ratings, normalizedScore: calculateNormalizedScore(ratings), trailerKey }
  })
}
