import { useMemo, useState } from "react"
import { AppShell } from "@/components/AppShell"
import { DiscoverPlaceholder } from "@/components/DiscoverPlaceholder"
import { MediaDetail } from "@/components/MediaDetail"
import { SearchResults } from "@/components/SearchResults"
import { WatchlistView } from "@/components/WatchlistView"
import { useSearch } from "@/hooks/useSearch"
import { useWatchlist } from "@/hooks/useWatchlist"
import { watchlistItemToMediaItem } from "@/lib/watchlistItemToMediaItem"
import type { MediaItem, MediaType, Tab } from "@/types"

/** Root application component. Wires search, watchlist, and navigation state into the AppShell. */
export function App() {
  const { query, setQuery, search, results, isLoading } = useSearch()
  const watchlist = useWatchlist()

  const [activeTab, setActiveTab] = useState<Tab>("discover")
  const [mediaType, setMediaType] = useState<MediaType>("movie")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  /** Whether the user has submitted at least one search. */
  const [hasSearched, setHasSearched] = useState(false)

  /** Convert DXOS WatchlistItems to MediaItems for the UI. */
  const watchlistMediaItems = useMemo(
    () => watchlist.items.map(watchlistItemToMediaItem),
    [watchlist.items],
  )

  /** Set of MediaItem IDs on the watchlist, for marking cards in search results. */
  const watchlistIds = useMemo(
    () => new Set(watchlistMediaItems.map(item => item.id)),
    [watchlistMediaItems],
  )

  /** Submit the current search query. */
  const handleSearchSubmit = () => {
    setHasSearched(true)
    search(mediaType)
  }

  /** Clear the search query and results. */
  const handleSearchClear = () => {
    setQuery("")
    setHasSearched(false)
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

    // Discover tab
    if (!hasSearched) {
      return <DiscoverPlaceholder />
    }

    return (
      <SearchResults
        items={results}
        watchlistIds={watchlistIds}
        onAdd={handleToggleWatchlist}
        isLoading={isLoading}
      />
    )
  }

  return (
    <AppShell
      searchValue={query}
      onSearchChange={setQuery}
      onSearchSubmit={handleSearchSubmit}
      onSearchClear={query ? handleSearchClear : undefined}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      mediaType={mediaType}
      onMediaTypeChange={setMediaType}
    >
      {renderContent()}
    </AppShell>
  )
}
