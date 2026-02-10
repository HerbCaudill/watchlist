import { IconMinus, IconPlus, IconX } from "@tabler/icons-react"
import { PosterImage } from "@/components/PosterImage"
import { RatingsBar } from "@/components/RatingsBar"
import { ScoreBadge } from "@/components/ScoreBadge"
import { cx } from "@/lib/utils"
import type { MediaItem } from "@/types"

/** Full detail view for a movie or TV show, with poster, plot, ratings, trailer, and actions. */
export function MediaDetail({ item, isOnWatchlist = false, onAction, onClose }: Props) {
  return (
    <div className="relative max-w-3xl">
      {/* Close button */}
      {onClose && (
        <button
          aria-label="Close"
          onClick={onClose}
          className={cx(
            "absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full",
            "text-muted-foreground hover:bg-muted transition-colors",
          )}
        >
          <IconX size={20} stroke={2} />
        </button>
      )}

      {/* Header: poster + info side by side */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Poster */}
        <div className="shrink-0">
          <PosterImage src={item.posterUrl} alt={item.title} size="lg" />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Title and year */}
          <div>
            <h2 className="text-2xl font-bold">{item.title}</h2>
            {item.year != null && (
              <p className="text-muted-foreground mt-0.5 text-sm">{item.year}</p>
            )}
          </div>

          {/* Score badge */}
          {item.normalizedScore != null && <ScoreBadge score={item.normalizedScore} />}

          {/* Overview */}
          {item.overview && <p className="text-muted-foreground text-sm">{item.overview}</p>}

          {/* Ratings bar */}
          <RatingsBar ratings={item.ratings} />
        </div>
      </div>

      {/* Trailer placeholder */}
      <div className="bg-muted mt-6 flex aspect-video w-full items-center justify-center rounded-lg">
        <span className="text-muted-foreground text-sm">Trailer</span>
      </div>

      {/* Action button */}
      {onAction && (
        <button
          aria-label={isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          onClick={() => onAction(item)}
          className={cx(
            "mt-6 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors",
            isOnWatchlist ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
          )}
        >
          {isOnWatchlist ?
            <>
              <IconMinus size={16} stroke={2.5} />
              Remove from watchlist
            </>
          : <>
              <IconPlus size={16} stroke={2.5} />
              Add to watchlist
            </>
          }
        </button>
      )}
    </div>
  )
}

/** Props for the MediaDetail component. */
type Props = {
  /** The media item to display in detail. */
  item: MediaItem
  /** Whether this item is already on the user's watchlist. Controls action button text. */
  isOnWatchlist?: boolean
  /** Callback when the action button is clicked. Button is hidden when not provided. */
  onAction?: (item: MediaItem) => void
  /** Callback when the close button is clicked. Button is hidden when not provided. */
  onClose?: () => void
}
