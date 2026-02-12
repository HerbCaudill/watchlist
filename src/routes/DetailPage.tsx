import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useOutletContext } from "react-router"
import { MediaDetail } from "@/components/MediaDetail"
import { enrichMediaItem } from "@/lib/enrichMediaItem"
import { fetchTmdbDetails } from "@/lib/fetchTmdbDetails"
import type { MediaItem, MediaType } from "@/types"
import type { LayoutContext } from "@/routes/Layout"

/** Route component for the detail view. Shows full details for a movie or TV show. */
export function DetailPage() {
  const { mediaType: mediaTypeParam, tmdbId: tmdbIdParam } = useParams<{
    mediaType: string
    tmdbId: string
  }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { watchlist } = useOutletContext<LayoutContext>()

  const mediaType: MediaType = mediaTypeParam === "tv" ? "tv" : "movie"
  const tmdbId = Number(tmdbIdParam)

  /** The item passed via router state (from search/watchlist navigation). */
  const stateItem = (location.state as { item?: MediaItem } | null)?.item ?? null

  const [item, setItem] = useState<MediaItem | null>(stateItem)
  const [isLoading, setIsLoading] = useState(!stateItem)

  /** Load item data from TMDB if not provided via router state (e.g. direct URL access). */
  useEffect(() => {
    if (stateItem) {
      setItem(stateItem)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      const fetched = await fetchTmdbDetails(tmdbId, mediaType)
      if (cancelled || !fetched) {
        if (!cancelled) setIsLoading(false)
        return
      }
      setItem(fetched)

      /** Enrich with OMDB ratings and trailer in the background. */
      const enriched = await enrichMediaItem(fetched)
      if (!cancelled) {
        setItem(enriched)
        setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [tmdbId, mediaType, stateItem])

  /** Toggle the item on/off the watchlist. */
  const handleToggleWatchlist = (item: MediaItem) => {
    if (watchlist.isOnWatchlist(item.tmdbId)) {
      watchlist.remove(item.tmdbId)
    } else {
      watchlist.add(item)
    }
  }

  /** Navigate back to the list view for the current media type. */
  const handleClose = () => {
    const urlMediaType = mediaType === "movie" ? "movies" : "tv"
    navigate(`/${urlMediaType}/discover`)
  }

  if (isLoading || !item) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-16">Loading...</div>
    )
  }

  return (
    <MediaDetail
      item={item}
      isOnWatchlist={watchlist.isOnWatchlist(item.tmdbId)}
      onAction={handleToggleWatchlist}
      onClose={handleClose}
    />
  )
}
