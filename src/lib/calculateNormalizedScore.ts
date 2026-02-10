import type { Ratings } from "@/types"

/**
 * Average available scores (RT critics, Metacritic, IMDb x 10) on a 0-100 scale.
 * Returns the rounded average of available scores, or `null` if no scores are available.
 */
export function calculateNormalizedScore(
  /** Aggregated ratings from multiple review sources. */
  ratings: Ratings,
): number | null {
  const scores: number[] = []

  if (ratings.rottenTomatoes?.critics != null) {
    scores.push(ratings.rottenTomatoes.critics) // Already 0-100
  }
  if (ratings.metacritic != null) {
    scores.push(ratings.metacritic) // Already 0-100
  }
  if (ratings.imdb?.score != null) {
    scores.push(ratings.imdb.score * 10) // Convert 0-10 to 0-100
  }

  if (scores.length === 0) return null

  const average = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(average)
}
