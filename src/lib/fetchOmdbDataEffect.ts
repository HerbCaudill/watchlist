import { OmdbResult } from "@/schema/OmdbResult"
import { Effect } from "@/lib/effect"
import { buildOmdbUrl } from "@/lib/buildOmdbUrl"
import { decodeJson } from "@/lib/decodeJson"
import { fetchJson } from "@/lib/fetchJson"
import { getRequiredApiKey } from "@/lib/getRequiredApiKey"
import { retryTransient } from "@/lib/retryTransient"
import type { OmdbLookup } from "@/lib/apiTypes"

/** Fetch and decode OMDB ratings through the shared Effect data layer. */
export function fetchOmdbDataEffect(
  /** The OMDB lookup input. */
  lookup: OmdbLookup,
) {
  return Effect.gen(function* () {
    const apiKey = yield* getRequiredApiKey(
      lookup.apiKey,
      import.meta.env.VITE_OMDB_API_KEY,
      "OMDB",
    )
    const json = yield* retryTransient(fetchJson(buildOmdbUrl({ ...lookup, apiKey })))
    return yield* decodeJson(OmdbResult, json)
  })
}
