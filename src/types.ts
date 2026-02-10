/** The kind of media: a movie or a TV show. */
export type MediaType = "movie" | "tv"

/** The active tab in the app. */
export type Tab = "discover" | "watchlist"

/** Aggregated ratings from multiple review sources. */
export interface Ratings {
  rottenTomatoes?: { critics: number; audience?: number }
  metacritic?: number
  imdb?: { score: number; votes: number }
}

/** A movie or TV show with metadata, poster, and ratings. */
export interface MediaItem {
  /** Unique identifier for this item (e.g. "movie-123"). */
  id: string
  /** The Movie Database ID. */
  tmdbId: number
  /** Display title. */
  title: string
  /** Release year. */
  year?: number
  /** URL to the poster image. */
  posterUrl?: string
  /** Whether this is a movie or TV show. */
  mediaType: MediaType
  /** Plot summary or description. */
  overview?: string
  /** Ratings from various sources. */
  ratings: Ratings
  /** Weighted average of available scores on a 0-100 scale, or null if no scores are available. */
  normalizedScore?: number | null
  /** YouTube video key for the trailer, if available. */
  trailerKey?: string | null
}
