import type { DiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import type { MediaType } from "@/types"

/** Build the versioned cache key for a Discover result list. */
export function getDiscoverCacheKey(
  /** The media type for the Discover list. */
  mediaType: MediaType,
  /** The rolling Discover date window. */
  window: DiscoverDateWindow,
): string {
  return `discover:${mediaType}:${window.toDate}:12mo:popular:v1`
}
