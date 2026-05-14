import type { DiscoverOptions } from "@/lib/apiTypes"
import type { MediaType } from "@/types"

/** Build a TMDB discover URL for movies or TV shows. */
export function buildTmdbDiscoverUrl(
  /** The media type to discover. */
  mediaType: MediaType,
  /** Discover query options with an API key. */
  options: DiscoverOptions & { apiKey: string },
): string {
  const params = new URLSearchParams({
    api_key: options.apiKey,
    page: String(options.page ?? 1),
    sort_by: "popularity.desc",
  })
  const datePrefix = mediaType === "movie" ? "release_date" : "first_air_date"
  if (options.fromDate) params.set(`${datePrefix}.gte`, options.fromDate)
  if (options.toDate) params.set(`${datePrefix}.lte`, options.toDate)
  return `https://api.themoviedb.org/3/discover/${mediaType}?${params.toString().replace(/\+/g, "%20")}`
}
