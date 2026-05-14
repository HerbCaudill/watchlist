import type { OmdbLookup } from "@/lib/apiTypes"

/** Build the OMDB lookup URL from shared title/media/year input. */
export function buildOmdbUrl(
  /** The OMDB lookup parameters. */
  lookup: Required<Pick<OmdbLookup, "apiKey" | "title">> & Pick<OmdbLookup, "mediaType" | "year">,
): string {
  const params = new URLSearchParams({ apikey: lookup.apiKey, t: lookup.title })
  if (lookup.mediaType) params.set("type", lookup.mediaType === "tv" ? "series" : "movie")
  if (lookup.year !== undefined) params.set("y", String(lookup.year))
  return `https://www.omdbapi.com/?${params.toString().replace(/\+/g, "%20")}`
}
