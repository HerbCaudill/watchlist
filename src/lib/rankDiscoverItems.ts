import type { MediaItem } from "@/types"

/** Filter Discover items to scored titles, sort by normalized score, and keep the best results. */
export function rankDiscoverItems(
  /** The enriched Discover candidates to rank. */
  items: MediaItem[],
  /** The maximum number of Discover items to return. */
  limit = 20,
): MediaItem[] {
  return [...items]
    .filter(item => item.normalizedScore != null)
    .sort((a, b) => b.normalizedScore! - a.normalizedScore!)
    .slice(0, limit)
}
