import { useCallback, useMemo } from "react"
import { useSpace, useQuery, Filter } from "@dxos/react-client/echo"
import { live } from "@dxos/react-client/echo"
import { WatchlistItem } from "@/schema/WatchlistItem"
import type { MediaItem } from "@/types"

/**
 * Hook for managing the user's watchlist. Provides reactive access to all
 * watchlist items and methods to add, remove, and check membership.
 */
export function useWatchlist() {
  const space = useSpace()
  const items = useQuery(space, Filter.type(WatchlistItem))

  /** Add a MediaItem to the watchlist by creating a new WatchlistItem in the space. */
  const add = useCallback(
    (/** The media item to add */ item: MediaItem) => {
      if (!space) return
      const watchlistItem = live(WatchlistItem, {
        tmdbId: item.tmdbId,
        title: item.title,
        year: item.year,
        posterUrl: item.posterUrl,
        mediaType: item.mediaType,
        overview: item.overview,
        normalizedScore: item.normalizedScore,
        addedAt: new Date().toISOString(),
      })
      space.db.add(watchlistItem)
    },
    [space],
  )

  /** Remove a watchlist item by its TMDB ID. */
  const remove = useCallback(
    (/** The TMDB ID of the item to remove */ tmdbId: number) => {
      if (!space) return
      const item = items.find(i => i.tmdbId === tmdbId)
      if (item) {
        space.db.remove(item)
      }
    },
    [space, items],
  )

  /** Check whether an item with the given TMDB ID is on the watchlist. */
  const isOnWatchlist = useCallback(
    (/** The TMDB ID to check */ tmdbId: number) => {
      return items.some(i => i.tmdbId === tmdbId)
    },
    [items],
  )

  return useMemo(() => ({ items, add, remove, isOnWatchlist }), [items, add, remove, isOnWatchlist])
}
