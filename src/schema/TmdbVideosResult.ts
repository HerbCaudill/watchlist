import { Schema } from "effect"

/** Schema for one TMDB video result. */
export const TmdbVideoResult = Schema.Struct({
  key: Schema.String,
  site: Schema.String,
  type: Schema.String,
  official: Schema.Boolean,
})

/** Schema for a TMDB videos response. */
export const TmdbVideosResponse = Schema.Struct({
  results: Schema.Array(TmdbVideoResult),
})
