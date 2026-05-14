import { MediaGrid } from "@/components/MediaGrid"
import type { MediaItem } from "@/types"

/** Responsive grid of MediaCards for displaying search results. */
export function SearchResults({ items, watchlistIds, onAdd, isLoading = false }: Props) {
  return (
    <MediaGrid items={items} watchlistIds={watchlistIds} onAction={onAdd} isLoading={isLoading} />
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
