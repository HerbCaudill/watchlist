import { useEffect, useState } from "react"
import { Effect } from "@/lib/effect"
import { loadDiscoverItems } from "@/lib/loadDiscoverItems"
import type { ApiError, ApiKeys } from "@/lib/apiTypes"
import type { MediaItem, MediaType } from "@/types"

/** Hook for loading recent, highly rated Discover items for the selected media type. */
export function useDiscover(
  /** The media type to discover. */
  mediaType: MediaType,
  /** Optional explicit API keys for tests and compatibility. */
  options?: ApiKeys,
): DiscoverState {
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    let isActive = true

    setIsLoading(true)
    setError(null)

    Effect.runPromiseExit(loadDiscoverItems(mediaType, options)).then(exit => {
      if (!isActive) return

      if (exit._tag === "Success") {
        setItems(exit.value)
        setError(null)
      } else {
        setItems([])
        setError(exit.cause._tag === "Fail" ? exit.cause.error : null)
      }

      setIsLoading(false)
    })

    return () => {
      isActive = false
    }
  }, [mediaType, options])

  return { items, isLoading, error }
}

/** State returned by useDiscover. */
type DiscoverState = {
  /** The loaded Discover items. */
  items: MediaItem[]
  /** Whether Discover is currently loading. */
  isLoading: boolean
  /** The typed API error from the failed Discover request, if any. */
  error: ApiError | null
}
