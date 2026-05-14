import { useNavigate, useOutletContext } from "react-router"
import { MediaGrid } from "@/components/MediaGrid"
import { useDiscover } from "@/hooks/useDiscover"
import type { LayoutContext } from "@/routes/Layout"

/** Route component for the Discover tab. Displays recent, highly rated titles for the selected media type. */
export function DiscoverPage() {
  const navigate = useNavigate()
  const { mediaType, watchlist, watchlistIds } = useOutletContext<LayoutContext>()
  const { items, isLoading, error } = useDiscover(mediaType)

  return (
    <MediaGrid
      items={items}
      watchlistIds={watchlistIds}
      isLoading={isLoading}
      error={error ? "Couldn’t load discover results" : null}
      onAction={item => {
        if (watchlistIds.has(item.id)) {
          watchlist.remove(item.tmdbId)
        } else {
          watchlist.add(item)
        }
      }}
      onSelect={item => {
        const urlMediaType = item.mediaType === "movie" ? "movies" : "tv"
        navigate(`/${urlMediaType}/${item.tmdbId}`, { state: { item } })
      }}
    />
  )
}
