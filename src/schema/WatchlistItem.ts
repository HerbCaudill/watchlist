import { Schema } from "effect"
import { Type } from "@dxos/echo"

/**
 * DXOS Echo schema for a watchlist item. Represents a movie or TV show
 * that the user has added to their watchlist.
 */
export const WatchlistItem = Schema.Struct({
  /** The Movie Database ID. */
  tmdbId: Schema.Number,

  /** Display title. */
  title: Schema.String,

  /** Release year. */
  year: Schema.optional(Schema.Number),

  /** URL to the poster image. */
  posterUrl: Schema.optional(Schema.String),

  /** Whether this is a movie or TV show. */
  mediaType: Schema.Literal("movie", "tv"),

  /** Plot summary or description. */
  overview: Schema.optional(Schema.String),

  /** Weighted average of available scores on a 0-100 scale, or null if no scores are available. */
  normalizedScore: Schema.optional(Schema.NullOr(Schema.Number)),

  /** ISO date string indicating when the item was added to the watchlist. */
  addedAt: Schema.String,
}).pipe(
  Type.Obj({
    typename: "watchlist/type/WatchlistItem",
    version: "0.1.0",
  }),
)
