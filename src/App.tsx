import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/AppShell"
import { DiscoverPlaceholder } from "@/components/DiscoverPlaceholder"
import { MediaDetail } from "@/components/MediaDetail"
import { SearchCombobox } from "@/components/SearchCombobox"
import { WatchlistView } from "@/components/WatchlistView"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearch } from "@/hooks/useSearch"
import { useWatchlist } from "@/hooks/useWatchlist"
import { watchlistItemToMediaItem } from "@/lib/watchlistItemToMediaItem"
import type { MediaItem, MediaType, Tab } from "@/types"

/** Root application component. Wires search, watchlist, and navigation state into the AppShell. */
export function App() {
  const { query, setQuery, search, movieResults, tvResults, isLoading, clear } = useSearch()
  const watchlist = useWatchlist()

  const [activeTab, setActiveTab] = useState<Tab>("discover")
  const [mediaType, setMediaType] = useState<MediaType>("movie")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  /** Debounced query for triggering search after the user stops typing. */
  const debouncedQuery = useDebounce(query, 300)

  /** Auto-search when the debounced query changes. */
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search()
    } else {
      clear()
    }
  }, [debouncedQuery])

  /** Convert DXOS WatchlistItems to MediaItems for the UI. */
  const watchlistMediaItems = useMemo(
    () => watchlist.items.map(watchlistItemToMediaItem),
    [watchlist.items],
  )

  /** Set of MediaItem IDs on the watchlist, for marking items in search results. */
  const watchlistIds = useMemo(
    () => new Set(watchlistMediaItems.map(item => item.id)),
    [watchlistMediaItems],
  )

  /** Clear the search query and results. */
  const handleSearchClear = () => {
    setQuery("")
    clear()
  }

  /** Toggle a media item on/off the watchlist. */
  const handleToggleWatchlist = (item: MediaItem) => {
    if (watchlist.isOnWatchlist(item.tmdbId)) {
      watchlist.remove(item.tmdbId)
    } else {
      watchlist.add(item)
    }
  }

  /** Render the content area based on active tab and app state. */
  const renderContent = () => {
    if (selectedItem) {
      return (
        <MediaDetail
          item={selectedItem}
          isOnWatchlist={watchlist.isOnWatchlist(selectedItem.tmdbId)}
          onAction={handleToggleWatchlist}
          onClose={() => setSelectedItem(null)}
        />
      )
    }

    if (activeTab === "watchlist") {
      return (
        <WatchlistView
          items={watchlistMediaItems}
          onRemove={item => watchlist.remove(item.tmdbId)}
          onSelect={setSelectedItem}
        />
      )
    }

    return <DiscoverPlaceholder />
  }

  return (
    <AppShell
      searchSlot={
        <SearchCombobox
          query={query}
          onQueryChange={setQuery}
          movieResults={movieResults}
          tvResults={tvResults}
          isLoading={isLoading}
          watchlistIds={watchlistIds}
          onSelect={setSelectedItem}
          onClear={handleSearchClear}
        />
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
      mediaType={mediaType}
      onMediaTypeChange={setMediaType}
    >
      {renderContent()}
    </AppShell>
  )
}
