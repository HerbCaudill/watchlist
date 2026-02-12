import { useEffect, useMemo } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router"
import { AppShell } from "@/components/AppShell"
import { SearchCombobox } from "@/components/SearchCombobox"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearch } from "@/hooks/useSearch"
import { useWatchlist } from "@/hooks/useWatchlist"
import { watchlistItemToMediaItem } from "@/lib/watchlistItemToMediaItem"
import type { MediaType, Tab } from "@/types"

/** Route layout component. Renders the shared chrome (search, toggle, tabs) and an Outlet for child routes. */
export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mediaType: mediaTypeParam } = useParams<{ mediaType: string }>()

  /** Derive mediaType from URL param (URL uses "movies", internal type uses "movie"). */
  const mediaType: MediaType = mediaTypeParam === "tv" ? "tv" : "movie"

  /** Derive the active tab and detail-view state from the current path segment. */
  const pathSegments = location.pathname.split("/")
  const lastSegment = pathSegments[2] ?? "discover"
  const isDetailView = lastSegment !== "discover" && lastSegment !== "watchlist"
  const activeTab: Tab = lastSegment === "watchlist" ? "watchlist" : "discover"

  const { query, setQuery, search, movieResults, tvResults, isLoading, clear } = useSearch()
  const watchlist = useWatchlist()

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

  /** Navigate to a different media type, preserving the current tab. */
  const handleMediaTypeChange = (newMediaType: MediaType) => {
    const urlMediaType = newMediaType === "movie" ? "movies" : "tv"
    navigate(`/${urlMediaType}/${activeTab}`)
  }

  /** Navigate to a different tab, preserving the current media type. */
  const handleTabChange = (newTab: Tab) => {
    const urlMediaType = mediaType === "movie" ? "movies" : "tv"
    navigate(`/${urlMediaType}/${newTab}`)
  }

  return (
    <AppShell
      searchSlot={
        <SearchCombobox
          query={query}
          onQueryChange={setQuery}
          results={mediaType === "movie" ? movieResults : tvResults}
          isLoading={isLoading}
          watchlistIds={watchlistIds}
          onSelect={item => {
            const urlMediaType = item.mediaType === "movie" ? "movies" : "tv"
            navigate(`/${urlMediaType}/${item.tmdbId}`, { state: { item } })
          }}
          onAdd={item => watchlist.add(item)}
          onClear={handleSearchClear}
        />
      }
      activeTab={activeTab}
      onTabChange={handleTabChange}
      showTabs={!isDetailView}
      mediaType={mediaType}
      onMediaTypeChange={handleMediaTypeChange}
    >
      <Outlet context={{ watchlist, watchlistMediaItems, mediaType } satisfies LayoutContext} />
    </AppShell>
  )
}

/** Context passed from the Layout to child routes via Outlet. */
export type LayoutContext = {
  watchlist: ReturnType<typeof useWatchlist>
  watchlistMediaItems: ReturnType<typeof watchlistItemToMediaItem>[]
  mediaType: MediaType
}
