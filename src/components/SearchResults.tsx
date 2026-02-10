import { MediaCard } from "@/components/MediaCard"
import type { MediaItem } from "@/types"

/** Responsive grid of MediaCards for displaying search results. */
export function SearchResults({ items, watchlistIds, onAdd, isLoading = false }: Props) {
  if (isLoading) {
    return <p className="text-muted-foreground py-8 text-center text-sm">Loading...</p>
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground py-8 text-center text-sm">No results</p>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
      {items.map(item => (
        <MediaCard
          key={item.id}
          item={item}
          isOnWatchlist={watchlistIds.has(item.id)}
          onAction={onAdd}
        />
      ))}
    </div>
  )
}

/** Props for the SearchResults component. */
type Props = {
  /** The media items to display in the grid. */
  items: MediaItem[]
  /** Set of media item IDs that are already on the user's watchlist. */
  watchlistIds: Set<string>
  /** Callback when the add/remove button is clicked on a card. */
  onAdd?: (item: MediaItem) => void
  /** Whether search results are currently being fetched. */
  isLoading?: boolean
}
