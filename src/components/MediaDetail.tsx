import { IconArrowLeft, IconMinus, IconPlus } from "@tabler/icons-react"
import { PosterImage } from "@/components/PosterImage"
import { RatingsBar } from "@/components/RatingsBar"
import { ScoreBadge } from "@/components/ScoreBadge"
import { cx } from "@/lib/utils"
import type { MediaItem } from "@/types"

/** Full detail view for a movie or TV show, with poster, plot, ratings, trailer, and actions. */
export function MediaDetail({ item, isOnWatchlist = false, onAction, onClose }: Props) {
  return (
    <div className="relative max-w-3xl">
      {/* Back button */}
      {onClose && (
        <button
          aria-label="Back"
          onClick={onClose}
          className={cx(
            "absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full",
            "text-muted-foreground hover:bg-muted transition-colors",
          )}
        >
          <IconArrowLeft size={20} stroke={2} />
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

          {/* Action button */}
          {onAction && (
            <button
              aria-label={isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              onClick={() => onAction(item)}
              className={cx(
                "flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors",
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

          {/* Overview */}
          {item.overview && <p className="text-muted-foreground text-sm">{item.overview}</p>}

          {/* Score and ratings row */}
          <div data-testid="ratings-row" className="flex items-center gap-4">
            {item.normalizedScore != null && <ScoreBadge score={item.normalizedScore} size="lg" />}
            <RatingsBar ratings={item.ratings} />
          </div>
        </div>
      </div>

      {/* Trailer */}
      {item.trailerKey && (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            title="Trailer"
            src={`https://www.youtube.com/embed/${item.trailerKey}`}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
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
  /** Callback when the back button is clicked. Button is hidden when not provided. */
  onClose?: () => void
}
