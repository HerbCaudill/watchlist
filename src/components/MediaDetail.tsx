import { IconArrowLeft, IconMinus, IconPlus } from "@tabler/icons-react"
import { PosterImage } from "@/components/PosterImage"
import { RatingsBar } from "@/components/RatingsBar"
import { ScoreBadge } from "@/components/ScoreBadge"
import { cx } from "@/lib/utils"
import type { MediaItem } from "@/types"

/** Full detail view for a movie or TV show, with poster, plot, ratings, trailer, and actions. */
export function MediaDetail({ item, isOnWatchlist = false, onAction, onClose }: Props) {
  return (
    <div className="max-w-3xl">
      {/* Top bar: back button + action button */}
      <div className="mb-4 flex items-center justify-between">
        {onClose && (
          <button
            aria-label="Back"
            onClick={onClose}
            className={cx(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "text-muted-foreground hover:bg-muted transition-colors",
            )}
          >
            <IconArrowLeft size={20} stroke={2} />
          </button>
        )}
        {onAction && (
          <button
            aria-label={isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            onClick={() => onAction(item)}
            className={cx(
              "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors",
              isOnWatchlist ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
            )}
          >
            {isOnWatchlist ?
              <IconMinus size={18} stroke={2.5} />
            : <IconPlus size={18} stroke={2.5} />}
          </button>
        )}
      </div>

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

          {/* Score and ratings */}
          <div data-testid="ratings-row" className="flex items-center gap-4">
            {item.normalizedScore != null && <ScoreBadge score={item.normalizedScore} size="lg" />}
            <RatingsBar ratings={item.ratings} />
          </div>

          {/* Overview */}
          {item.overview && <p className="text-muted-foreground text-sm">{item.overview}</p>}
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
