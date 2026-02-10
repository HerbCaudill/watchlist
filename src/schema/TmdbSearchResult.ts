import { Schema } from "effect"
import type { MediaItem } from "@/types"

/** The base URL for TMDB poster images at the w500 size. */
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

/** Schema for a single movie result from TMDB's `/search/movie` endpoint. */
const TmdbMovieResult = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  release_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/** Schema for the full response from TMDB's `/search/movie` endpoint. */
export const TmdbMovieSearchResponse = Schema.Struct({
  page: Schema.Number,
  results: Schema.Array(TmdbMovieResult),
  total_pages: Schema.Number,
  total_results: Schema.Number,
})

/** The decoded type of a TMDB movie search response. */
type TmdbMovieSearchResponseType = typeof TmdbMovieSearchResponse.Type

/** Schema for a single TV result from TMDB's `/search/tv` endpoint. */
const TmdbTvResult = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  first_air_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/** Schema for the full response from TMDB's `/search/tv` endpoint. */
export const TmdbTvSearchResponse = Schema.Struct({
  page: Schema.Number,
  results: Schema.Array(TmdbTvResult),
  total_pages: Schema.Number,
  total_results: Schema.Number,
})

/** The decoded type of a TMDB TV search response. */
type TmdbTvSearchResponseType = typeof TmdbTvSearchResponse.Type

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

/**
 * Convert a decoded TMDB movie search response into an array of MediaItems.
 * Ratings are left empty because TMDB doesn't provide them; they come from OMDB enrichment.
 */
export const tmdbMovieResultsToMediaItems = (
  /** The decoded movie search response. */
  response: TmdbMovieSearchResponseType,
): MediaItem[] => {
  return response.results.map(result => ({
    id: `movie-${result.id}`,
    tmdbId: result.id,
    title: result.title,
    year: parseYear(result.release_date),
    posterUrl: buildPosterUrl(result.poster_path),
    mediaType: "movie" as const,
    overview: result.overview || undefined,
    ratings: {},
  }))
}

/**
 * Convert a decoded TMDB TV search response into an array of MediaItems.
 * Ratings are left empty because TMDB doesn't provide them; they come from OMDB enrichment.
 */
export const tmdbTvResultsToMediaItems = (
  /** The decoded TV search response. */
  response: TmdbTvSearchResponseType,
): MediaItem[] => {
  return response.results.map(result => ({
    id: `tv-${result.id}`,
    tmdbId: result.id,
    title: result.name,
    year: parseYear(result.first_air_date),
    posterUrl: buildPosterUrl(result.poster_path),
    mediaType: "tv" as const,
    overview: result.overview || undefined,
    ratings: {},
  }))
}
