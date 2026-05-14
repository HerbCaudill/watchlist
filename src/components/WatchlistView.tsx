import { MediaGrid } from "@/components/MediaGrid"
import type { MediaItem } from "@/types"

/** Grid view displaying the user's watchlist as a responsive grid of MediaCards. */
export function WatchlistView({ items, onRemove, onSelect }: Props) {
  return (
    <MediaGrid
      items={items}
      watchlistIds={new Set(items.map(item => item.id))}
      onAction={onRemove}
      onSelect={onSelect}
      emptyMessage="Your watchlist is empty"
    />
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
