import { Effect } from "@/lib/effect"
import { getCachedEnrichedMediaItem } from "@/lib/getCachedEnrichedMediaItem"
import type { MediaItem } from "@/types"

/** Enrich a `MediaItem` with OMDB ratings, a normalized score, and a trailer key. */
export async function enrichMediaItem(
  /** The media item to enrich. */
  item: MediaItem,
): Promise<MediaItem> {
  return Effect.runPromise(getCachedEnrichedMediaItem(item))
}
