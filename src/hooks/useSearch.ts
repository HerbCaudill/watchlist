import { useCallback, useState } from "react"
import type { MediaItem } from "@/types"
import { searchTmdb } from "@/lib/searchTmdb"
import { enrichMediaItem } from "@/lib/enrichMediaItem"

/**
 * Hook for searching movies and TV shows via TMDB, with background OMDB enrichment.
 * Searches both movies and TV shows in parallel, returning separate result lists.
 * Results appear immediately (unenriched), then update as enrichment data arrives.
 */
export function useSearch() {
  const [query, setQuery] = useState("")
  const [movieResults, setMovieResults] = useState<MediaItem[]>([])
  const [tvResults, setTvResults] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /** Trigger a search for both movies and TV shows, enriching results in the background. */
  const search = useCallback(async () => {
    if (!query.trim()) return

    setIsLoading(true)

    const [movies, tvShows] = await Promise.all([
      searchTmdb(query, "movie"),
      searchTmdb(query, "tv"),
    ])

    setMovieResults(movies)
    setTvResults(tvShows)

    const allItems = [
      ...movies.map((item, index) => ({ item, index, setter: setMovieResults })),
      ...tvShows.map((item, index) => ({ item, index, setter: setTvResults })),
    ]

    if (allItems.length === 0) {
      setIsLoading(false)
      return
    }

    const enrichmentPromises = allItems.map(async ({ item, index, setter }) => {
      try {
        const enriched = await enrichMediaItem(item)
        setter(prev => prev.map((r, i) => (i === index ? enriched : r)))
      } catch {
        // Keep the unenriched item on failure
      }
    })

    await Promise.all(enrichmentPromises)
    setIsLoading(false)
  }, [query])

  /** Clear all search results. */
  const clear = useCallback(() => {
    setMovieResults([])
    setTvResults([])
    setIsLoading(false)
  }, [])

  return { query, setQuery, search, movieResults, tvResults, isLoading, clear }
}
