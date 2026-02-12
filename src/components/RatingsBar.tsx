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
          value={`${ratings.imdb.score}`}
          score={ratings.imdb.score * 10}
        />
      )}
    </div>
  )
}

/** Props for the RatingsBar component. */
type Props = {
  /** Aggregated ratings from multiple review sources. */
  ratings: Ratings
}
