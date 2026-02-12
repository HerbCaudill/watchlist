import { Schema } from "effect"
import type { MediaItem } from "@/types"

/** The base URL for TMDB poster images at the w500 size. */
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

/** Schema for the response from TMDB's `/movie/{id}` endpoint. */
export const TmdbMovieDetailResponse = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  release_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/** Schema for the response from TMDB's `/tv/{id}` endpoint. */
export const TmdbTvDetailResponse = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  first_air_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/**
 * Extract the year from a TMDB date string (e.g. "1999-10-15" -> 1999).
 * Returns undefined if the string is empty or doesn't start with a valid year.
 */
const parseYear = (
  /** A date string in YYYY-MM-DD format, or an empty string. */
  dateStr: string,
): number | undefined => {
  if (!dateStr) return undefined
  const year = parseInt(dateStr.substring(0, 4), 10)
  return isNaN(year) ? undefined : year
}

/**
 * Build the full poster URL from a TMDB poster_path.
 * Returns undefined if the poster_path is null.
 */
const buildPosterUrl = (
  /** The poster_path from a TMDB result, or null. */
  posterPath: string | null,
): string | undefined => {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : undefined
}

/** Convert a decoded TMDB movie detail response into a MediaItem. */
export const tmdbMovieDetailToMediaItem = (
  /** The decoded movie detail response. */
  response: typeof TmdbMovieDetailResponse.Type,
): MediaItem => ({
  id: `movie-${response.id}`,
  tmdbId: response.id,
  title: response.title,
  year: parseYear(response.release_date),
  posterUrl: buildPosterUrl(response.poster_path),
  mediaType: "movie",
  overview: response.overview || undefined,
  ratings: {},
})

/** Convert a decoded TMDB TV detail response into a MediaItem. */
export const tmdbTvDetailToMediaItem = (
  /** The decoded TV detail response. */
  response: typeof TmdbTvDetailResponse.Type,
): MediaItem => ({
  id: `tv-${response.id}`,
  tmdbId: response.id,
  title: response.name,
  year: parseYear(response.first_air_date),
  posterUrl: buildPosterUrl(response.poster_path),
  mediaType: "tv",
  overview: response.overview || undefined,
  ratings: {},
})
