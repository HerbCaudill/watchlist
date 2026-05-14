import { MediaCard } from "@/components/MediaCard"
import type { MediaItem } from "@/types"

/** Responsive grid of MediaCards with consistent loading, error, empty, action, and selection behavior. */
export function MediaGrid({
  items,
  watchlistIds,
  onAction,
  onSelect,
  isLoading = false,
  error,
  emptyMessage = "No results",
  loadingMessage = "Loading...",
}: Props) {
  if (isLoading) {
    return <p className="text-muted-foreground py-8 text-center text-sm">{loadingMessage}</p>
  }

  if (error) {
    return <p className="text-muted-foreground py-8 text-center text-sm">{error}</p>
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground py-8 text-center text-sm">{emptyMessage}</p>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
      {items.map(item => (
        <div
          key={item.id}
          className={onSelect ? "cursor-pointer" : undefined}
          onClick={event => {
            if ((event.target as HTMLElement).closest("button")) return
            onSelect?.(item)
          }}
          role="article"
        >
          <MediaCard
            item={item}
            isOnWatchlist={watchlistIds.has(item.id)}
            onAction={onAction ? () => onAction(item) : undefined}
          />
        </div>
      ))}
    </div>
  )
}

/** Props for the MediaGrid component. */
type Props = {
  /** The media items to display in the grid. */
  items: MediaItem[]
  /** Set of media item IDs that are already on the user's watchlist. */
  watchlistIds: Set<string>
  /** Callback when the add/remove button is clicked on a card. */
  onAction?: (item: MediaItem) => void
  /** Callback when a card is clicked, excluding action-button clicks. */
  onSelect?: (item: MediaItem) => void
  /** Whether the grid is currently loading. */
  isLoading?: boolean
  /** Error message to display instead of the grid. */
  error?: string | null
  /** Message to display when no items are available. */
  emptyMessage?: string
  /** Message to display while loading. */
  loadingMessage?: string
}
