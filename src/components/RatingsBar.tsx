import { RatingDisplay } from "@/components/RatingDisplay"
import type { Ratings } from "@/types"

/** Display a row of RatingDisplay components for each available rating source. */
export function RatingsBar({ ratings }: Props) {
  return (
    <div className="flex items-start gap-6">
      {ratings.rottenTomatoes && (
        <RatingDisplay
          label="RT Critics"
          value={`${ratings.rottenTomatoes.critics}%`}
          score={ratings.rottenTomatoes.critics}
        />
      )}
      {ratings.metacritic !== undefined && (
        <RatingDisplay
          label="Metacritic"
          value={`${ratings.metacritic}`}
          score={ratings.metacritic}
        />
      )}
      {ratings.imdb && (
        <RatingDisplay
          label="IMDb"
          value={`${ratings.imdb.score}/10`}
          score={ratings.imdb.score * 10}
          subtext={formatVotes(ratings.imdb.votes)}
        />
      )}
    </div>
  )
}

/** Format a vote count into a human-readable string (e.g. "1.2M votes", "340K votes", "340 votes"). */
function formatVotes(
  /** The raw number of votes. */
  votes: number,
): string {
  if (votes >= 1_000_000) {
    const millions = votes / 1_000_000
    const formatted =
      Number.isInteger(millions) ? `${millions}M` : `${parseFloat(millions.toFixed(1))}M`
    return `${formatted} votes`
  }
  if (votes >= 1_000) {
    const thousands = votes / 1_000
    const formatted =
      Number.isInteger(thousands) ? `${thousands}K` : `${parseFloat(thousands.toFixed(1))}K`
    return `${formatted} votes`
  }
  return `${votes} votes`
}

/** Props for the RatingsBar component. */
type Props = {
  /** Aggregated ratings from multiple review sources. */
  ratings: Ratings
}
