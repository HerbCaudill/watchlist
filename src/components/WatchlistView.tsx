import { MediaCard } from "@/components/MediaCard"
import type { MediaItem } from "@/types"

/** Grid view displaying the user's watchlist as a responsive grid of MediaCards. */
export function WatchlistView({ items, onRemove, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">Your watchlist is empty</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
      {items.map(item => (
        <div
          key={item.id}
          className="cursor-pointer"
          onClick={e => {
            /** Ignore clicks that originated from a button (e.g. the remove action). */
            if ((e.target as HTMLElement).closest("button")) return
            onSelect?.(item)
          }}
          role="article"
        >
          <MediaCard
            item={item}
            isOnWatchlist
            onAction={onRemove ? () => onRemove(item) : undefined}
          />
        </div>
      ))}
    </div>
  )
}

/** Props for the WatchlistView component. */
type Props = {
  /** The list of media items on the watchlist. */
  items: MediaItem[]
  /** Callback when the remove button is clicked on a card. */
  onRemove?: (item: MediaItem) => void
  /** Callback when a card is clicked (not the action button). */
  onSelect?: (item: MediaItem) => void
}
