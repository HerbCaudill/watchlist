import { Schema } from "effect"
import type { Ratings } from "@/types"

/**
 * Parse a percentage string like "79%" into the number 79.
 * Returns undefined if the string doesn't match the expected format.
 */
const parsePercent = (
  /** A string like "79%" */
  value: string,
): number | undefined => {
  const match = value.match(/^(\d+)%$/)
  return match ? Number(match[1]) : undefined
}

/**
 * Parse a fraction string like "66/100" into the numerator 66.
 * Returns undefined if the string doesn't match the expected format.
 */
const parseFraction = (
  /** A string like "66/100" */
  value: string,
): number | undefined => {
  const match = value.match(/^(\d+)\/\d+$/)
  return match ? Number(match[1]) : undefined
}

/**
 * Parse a comma-separated number string like "2,295,769" into 2295769.
 * Returns undefined if the result is not a finite number.
 */
const parseCommaNumber = (
  /** A string like "2,295,769" */
  value: string,
): number | undefined => {
  const n = Number(value.replace(/,/g, ""))
  return Number.isFinite(n) ? n : undefined
}

/**
 * Parse a decimal rating string like "8.8" into the number 8.8.
 * Returns undefined if the result is not a finite number or the input is "N/A".
 */
const parseDecimal = (
  /** A string like "8.8" or "N/A" */
  value: string,
): number | undefined => {
  if (value === "N/A") return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

/** A single rating entry in the OMDB Ratings array. */
const OmdbRatingEntry = Schema.Struct({
  Source: Schema.String,
  Value: Schema.String,
})

/** The raw OMDB API response shape (relevant fields only). */
const OmdbRawResponse = Schema.Struct({
  Ratings: Schema.optional(Schema.Array(OmdbRatingEntry)),
  imdbRating: Schema.optional(Schema.String),
  imdbVotes: Schema.optional(Schema.String),
})

/**
 * Effect Schema that decodes an OMDB API response into a Ratings object.
 * Extracts Rotten Tomatoes, Metacritic, and IMDb scores, handling missing or
 * "N/A" values gracefully.
 */
export const OmdbResult: Schema.Schema<Ratings, unknown> = Schema.transform(
  Schema.Unknown,
  Schema.typeSchema(Schema.Unknown),
  {
    strict: false,
    decode: input => {
      const parsed = Schema.decodeUnknownSync(OmdbRawResponse)(input)
      const ratings: Ratings = {}

      // Extract ratings from the Ratings array
      for (const entry of parsed.Ratings ?? []) {
        if (entry.Source === "Rotten Tomatoes") {
          const critics = parsePercent(entry.Value)
          if (critics !== undefined) {
            ratings.rottenTomatoes = { critics }
          }
        } else if (entry.Source === "Metacritic") {
          const score = parseFraction(entry.Value)
          if (score !== undefined) {
            ratings.metacritic = score
          }
        }
      }

      // Extract IMDb score and votes from top-level fields
      const imdbScore = parseDecimal(parsed.imdbRating ?? "N/A")
      const imdbVotes = parseCommaNumber(parsed.imdbVotes ?? "N/A")
      if (imdbScore !== undefined && imdbVotes !== undefined) {
        ratings.imdb = { score: imdbScore, votes: imdbVotes }
      }

      return ratings as unknown
    },
    encode: ratings => ratings,
  },
) as unknown as Schema.Schema<Ratings, unknown>
