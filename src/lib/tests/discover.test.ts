import { describe, expect, it } from "vitest"
import { getDiscoverCacheKey } from "@/lib/getDiscoverCacheKey"
import { getDiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import { rankDiscoverItems } from "@/lib/rankDiscoverItems"
import { dedupeDiscoverItems } from "@/lib/dedupeDiscoverItems"
import type { MediaItem } from "@/types"

/** Create a minimal media item for Discover tests. */
function item(
  /** The item media type. */
  mediaType: MediaItem["mediaType"],
  /** The TMDB ID. */
  tmdbId: number,
  /** The normalized score. */
  normalizedScore?: number | null,
): MediaItem {
  return {
    id: `${mediaType}-${tmdbId}`,
    tmdbId,
    title: `${mediaType} ${tmdbId}`,
    mediaType,
    ratings: {},
    normalizedScore,
  }
}

describe("Discover pure logic", () => {
  it("builds a rolling 12-month date window ending on the provided day", () => {
    expect(getDiscoverDateWindow(new Date("2026-05-14T20:30:00.000Z"))).toEqual({
      fromDate: "2025-05-14",
      toDate: "2026-05-14",
    })
  })

  it("builds cache keys from media type and query date window", () => {
    expect(getDiscoverCacheKey("movie", { fromDate: "2025-05-14", toDate: "2026-05-14" })).toBe(
      "discover:movie:2026-05-14:12mo:popular:v1",
    )
  })

  it("dedupes by media type and TMDB ID", () => {
    expect(
      dedupeDiscoverItems([item("movie", 1, 70), item("movie", 1, 80), item("tv", 1, 90)]),
    ).toEqual([item("movie", 1, 70), item("tv", 1, 90)])
  })

  it("filters out missing scores, sorts best-first, and keeps the top 20", () => {
    const candidates = [
      item("movie", 101, null),
      item("movie", 102),
      ...Array.from({ length: 25 }, (_, index) => item("movie", index, index)),
    ]

    const ranked = rankDiscoverItems(candidates)

    expect(ranked).toHaveLength(20)
    expect(ranked.map(result => result.normalizedScore)).toEqual([
      24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5,
    ])
  })
})
