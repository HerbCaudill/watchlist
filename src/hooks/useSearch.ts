import { useCallback, useState } from "react"
import type { MediaItem, MediaType } from "@/types"
import { searchTmdb } from "@/lib/searchTmdb"
import { enrichMediaItem } from "@/lib/enrichMediaItem"

/**
 * Hook for searching movies and TV shows via TMDB, with background OMDB enrichment.
 * Returns unenriched results immediately for fast display, then updates each item
 * as enrichment data (ratings, trailer) arrives.
 */
export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /** Trigger a search using the current query, enriching results in the background. */
  const search = useCallback(
    async (
      /** Whether to search for movies or TV shows. */
      mediaType: MediaType,
    ) => {
      if (!query.trim()) return

      setIsLoading(true)

      const items = await searchTmdb(query, mediaType)
      setResults(items)

      if (items.length === 0) {
        setIsLoading(false)
        return
      }

      const enrichmentPromises = items.map(async (item, index) => {
        try {
          const enriched = await enrichMediaItem(item)
          setResults(prev => prev.map((r, i) => (i === index ? enriched : r)))
        } catch {
          // Keep the unenriched item on failure
        }
      })

      await Promise.all(enrichmentPromises)
      setIsLoading(false)
    },
    [query],
  )

  /** Clear all search results. */
  const clear = useCallback(() => {
    setResults([])
    setIsLoading(false)
  }, [])

  return { query, setQuery, search, results, isLoading, clear }
}
