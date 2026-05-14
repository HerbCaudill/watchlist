import { Schema } from "effect"
import type { MediaItem } from "@/types"

/** The base URL for TMDB poster images at the w500 size. */
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

/** Schema for a movie result from TMDB's `/discover/movie` endpoint. */
const TmdbMovieDiscoverResult = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  release_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/** Schema for the full response from TMDB's `/discover/movie` endpoint. */
export const TmdbMovieDiscoverResponse = Schema.Struct({
  page: Schema.Number,
  results: Schema.Array(TmdbMovieDiscoverResult),
  total_pages: Schema.Number,
  total_results: Schema.Number,
})

/** Schema for a TV result from TMDB's `/discover/tv` endpoint. */
const TmdbTvDiscoverResult = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  first_air_date: Schema.String,
  poster_path: Schema.NullOr(Schema.String),
  overview: Schema.String,
})

/** Schema for the full response from TMDB's `/discover/tv` endpoint. */
export const TmdbTvDiscoverResponse = Schema.Struct({
  page: Schema.Number,
  results: Schema.Array(TmdbTvDiscoverResult),
  total_pages: Schema.Number,
  total_results: Schema.Number,
})

/** Convert a decoded TMDB movie discover response into media items. */
export function tmdbMovieDiscoverToMediaItems(
  /** The decoded movie discover response. */
  response: typeof TmdbMovieDiscoverResponse.Type,
): MediaItem[] {
  return response.results.map(result => ({
    id: `movie-${result.id}`,
    tmdbId: result.id,
    title: result.title,
    year: parseYear(result.release_date),
    posterUrl: buildPosterUrl(result.poster_path),
    mediaType: "movie",
    overview: result.overview || undefined,
    ratings: {},
  }))
}

/** Convert a decoded TMDB TV discover response into media items. */
export function tmdbTvDiscoverToMediaItems(
  /** The decoded TV discover response. */
  response: typeof TmdbTvDiscoverResponse.Type,
): MediaItem[] {
  return response.results.map(result => ({
    id: `tv-${result.id}`,
    tmdbId: result.id,
    title: result.name,
    year: parseYear(result.first_air_date),
    posterUrl: buildPosterUrl(result.poster_path),
    mediaType: "tv",
    overview: result.overview || undefined,
    ratings: {},
  }))
}

/** Extract the year from a TMDB date string. */
function parseYear(
  /** A date string in YYYY-MM-DD format, or an empty string. */
  dateStr: string,
): number | undefined {
  if (!dateStr) return undefined
  const year = parseInt(dateStr.substring(0, 4), 10)
  return Number.isNaN(year) ? undefined : year
}

/** Build a full TMDB poster URL from a poster path. */
function buildPosterUrl(
  /** The poster path from TMDB, or null. */
  posterPath: string | null,
): string | undefined {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : undefined
}
