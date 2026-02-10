import { IconMinus, IconPlus } from "@tabler/icons-react"
import { PosterImage } from "@/components/PosterImage"
import { ScoreBadge } from "@/components/ScoreBadge"
import { cx } from "@/lib/utils"
import type { MediaItem } from "@/types"

/** Card displaying a movie or TV show with poster, title, year, score badge, and action button. */
export function MediaCard({ item, onAction, isOnWatchlist = false }: Props) {
  return (
    <div className="group relative flex flex-col">
      {/* Poster with score overlay */}
      <div className="relative">
        <PosterImage src={item.posterUrl} alt={item.title} size="md" />

        {item.normalizedScore != null && (
          <div className="absolute bottom-1.5 left-1.5">
            <ScoreBadge score={item.normalizedScore} size="sm" />
          </div>
        )}

        {onAction && (
          <button
            aria-label={isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            onClick={() => onAction(item)}
            className={cx(
              "absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full",
              "text-white shadow-md transition-opacity",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              isOnWatchlist ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
            )}
          >
            {isOnWatchlist ?
              <IconMinus size={16} stroke={2.5} />
            : <IconPlus size={16} stroke={2.5} />}
          </button>
        )}
      </div>

      {/* Text info */}
      <div className="mt-1.5 w-32">
        <p className="line-clamp-2 text-sm leading-tight font-medium">{item.title}</p>
        {item.year != null && <p className="text-muted-foreground mt-0.5 text-xs">{item.year}</p>}
      </div>
    </div>
  )
}

/** Props for the MediaCard component. */
type Props = {
  /** The media item to display. */
  item: MediaItem
  /** Callback when the action button is clicked. Button is hidden when not provided. */
  onAction?: (item: MediaItem) => void
  /** Whether this item is already on the user's watchlist. Controls the action button icon. */
  isOnWatchlist?: boolean
}
