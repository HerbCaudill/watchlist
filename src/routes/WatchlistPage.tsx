import { useNavigate } from "react-router"
import { useOutletContext } from "react-router"
import { WatchlistView } from "@/components/WatchlistView"
import type { LayoutContext } from "@/routes/Layout"

/** Route component for the Watchlist tab. Displays the user's saved items as a card grid. */
export function WatchlistPage() {
  const navigate = useNavigate()
  const { watchlist, watchlistMediaItems } = useOutletContext<LayoutContext>()

  return (
    <WatchlistView
      items={watchlistMediaItems}
      onRemove={item => watchlist.remove(item.tmdbId)}
      onSelect={item => {
        const urlMediaType = item.mediaType === "movie" ? "movies" : "tv"
        navigate(`/${urlMediaType}/${item.tmdbId}`, { state: { item } })
      }}
    />
  )
}
