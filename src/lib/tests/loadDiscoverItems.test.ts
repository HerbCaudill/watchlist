import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Effect } from "@/lib/effect"
import { getDiscoverDateWindow } from "@/lib/getDiscoverDateWindow"
import { writeDiscoverCache } from "@/lib/writeDiscoverCache"
import { movieFixture, noRatingsFixture, tvShowFixture } from "@/lib/fixtures"
import type { ApiError } from "@/lib/apiTypes"
import type { MediaItem } from "@/types"

vi.mock("@/lib/discoverTmdb", () => ({
  discoverTmdb: vi.fn(),
}))

vi.mock("@/lib/getCachedEnrichedMediaItem", () => ({
  getCachedEnrichedMediaItem: vi.fn(),
}))

import { discoverTmdb } from "@/lib/discoverTmdb"
import { getCachedEnrichedMediaItem } from "@/lib/getCachedEnrichedMediaItem"
import { loadDiscoverItems } from "@/lib/loadDiscoverItems"

/** A typed network error used to simulate failed enrichment. */
const networkError: ApiError = { _tag: "NetworkError", message: "offline" }

describe("loadDiscoverItems", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it("returns fresh Discover-list cache without calling TMDB", async () => {
    writeDiscoverCache("movie", getDiscoverDateWindow(), [movieFixture])

    await expect(Effect.runPromise(loadDiscoverItems("movie"))).resolves.toEqual([movieFixture])
    expect(discoverTmdb).not.toHaveBeenCalled()
  })

  it("skips failed enrichments and caches the final ranked list", async () => {
    vi.mocked(discoverTmdb).mockImplementation((_mediaType, options) => {
      return Effect.succeed(
        options?.page === 1 ? [noRatingsFixture, movieFixture] : [tvShowFixture],
      )
    })
    vi.mocked(getCachedEnrichedMediaItem).mockImplementation((candidate: MediaItem) => {
      if (candidate.tmdbId === noRatingsFixture.tmdbId) return Effect.fail(networkError)
      return Effect.succeed(candidate)
    })

    await expect(Effect.runPromise(loadDiscoverItems("movie"))).resolves.toEqual([
      tvShowFixture,
      movieFixture,
    ])

    vi.clearAllMocks()

    await expect(Effect.runPromise(loadDiscoverItems("movie"))).resolves.toEqual([
      tvShowFixture,
      movieFixture,
    ])
    expect(discoverTmdb).not.toHaveBeenCalled()
  })
})
