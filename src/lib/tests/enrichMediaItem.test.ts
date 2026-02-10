import { afterEach, describe, expect, it, vi } from "vitest"
import { enrichMediaItem } from "../enrichMediaItem"
import type { MediaItem, Ratings } from "@/types"

vi.mock("@/lib/fetchOmdbData", () => ({
  fetchOmdbData: vi.fn(),
}))

vi.mock("@/lib/fetchTmdbTrailer", () => ({
  fetchTmdbTrailer: vi.fn(),
}))

vi.mock("@/lib/calculateNormalizedScore", () => ({
  calculateNormalizedScore: vi.fn(),
}))

import { fetchOmdbData } from "@/lib/fetchOmdbData"
import { fetchTmdbTrailer } from "@/lib/fetchTmdbTrailer"
import { calculateNormalizedScore } from "@/lib/calculateNormalizedScore"

/** A bare media item with no ratings, as returned from TMDB search. */
const bareItem: MediaItem = {
  id: "movie-550",
  tmdbId: 550,
  title: "Fight Club",
  year: 1999,
  posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  mediaType: "movie",
  overview: "An insomniac and a soap salesman start an underground fight club.",
  ratings: {},
}

describe("enrichMediaItem", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns a fully enriched item when all fetches succeed", async () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 79, audience: 96 },
      metacritic: 66,
      imdb: { score: 8.8, votes: 2200000 },
    }
    vi.mocked(fetchOmdbData).mockResolvedValue(ratings)
    vi.mocked(fetchTmdbTrailer).mockResolvedValue("dQw4w9WgXcQ")
    vi.mocked(calculateNormalizedScore).mockReturnValue(82)

    const result = await enrichMediaItem(bareItem)

    expect(fetchOmdbData).toHaveBeenCalledWith("Fight Club")
    expect(fetchTmdbTrailer).toHaveBeenCalledWith(550, "movie")
    expect(calculateNormalizedScore).toHaveBeenCalledWith(ratings)
    expect(result).toEqual({
      ...bareItem,
      ratings,
      normalizedScore: 82,
      trailerKey: "dQw4w9WgXcQ",
    })
  })

  it("does not mutate the original item", async () => {
    vi.mocked(fetchOmdbData).mockResolvedValue({ imdb: { score: 7.0, votes: 100 } })
    vi.mocked(fetchTmdbTrailer).mockResolvedValue("abc123")
    vi.mocked(calculateNormalizedScore).mockReturnValue(70)

    const original = { ...bareItem }
    await enrichMediaItem(bareItem)

    expect(bareItem).toEqual(original)
  })

  it("returns partial enrichment when trailer fetch returns null", async () => {
    const ratings: Ratings = { metacritic: 66 }
    vi.mocked(fetchOmdbData).mockResolvedValue(ratings)
    vi.mocked(fetchTmdbTrailer).mockResolvedValue(null)
    vi.mocked(calculateNormalizedScore).mockReturnValue(66)

    const result = await enrichMediaItem(bareItem)

    expect(result.ratings).toEqual(ratings)
    expect(result.normalizedScore).toBe(66)
    expect(result.trailerKey).toBeNull()
  })

  it("returns partial enrichment when OMDB returns empty ratings", async () => {
    vi.mocked(fetchOmdbData).mockResolvedValue({})
    vi.mocked(fetchTmdbTrailer).mockResolvedValue("trailer123")
    vi.mocked(calculateNormalizedScore).mockReturnValue(null)

    const result = await enrichMediaItem(bareItem)

    expect(result.ratings).toEqual({})
    expect(result.normalizedScore).toBeNull()
    expect(result.trailerKey).toBe("trailer123")
  })

  it("handles all fetches failing gracefully", async () => {
    vi.mocked(fetchOmdbData).mockResolvedValue({})
    vi.mocked(fetchTmdbTrailer).mockResolvedValue(null)
    vi.mocked(calculateNormalizedScore).mockReturnValue(null)

    const result = await enrichMediaItem(bareItem)

    expect(result.ratings).toEqual({})
    expect(result.normalizedScore).toBeNull()
    expect(result.trailerKey).toBeNull()
  })

  it("fetches OMDB and trailer in parallel", async () => {
    const callOrder: string[] = []

    vi.mocked(fetchOmdbData).mockImplementation(async () => {
      callOrder.push("omdb-start")
      await new Promise(r => setTimeout(r, 10))
      callOrder.push("omdb-end")
      return {}
    })

    vi.mocked(fetchTmdbTrailer).mockImplementation(async () => {
      callOrder.push("trailer-start")
      await new Promise(r => setTimeout(r, 10))
      callOrder.push("trailer-end")
      return null
    })

    vi.mocked(calculateNormalizedScore).mockReturnValue(null)

    await enrichMediaItem(bareItem)

    // Both should start before either finishes
    expect(callOrder.indexOf("omdb-start")).toBeLessThan(callOrder.indexOf("omdb-end"))
    expect(callOrder.indexOf("trailer-start")).toBeLessThan(callOrder.indexOf("trailer-end"))
    expect(callOrder.indexOf("omdb-start")).toBeLessThan(callOrder.indexOf("omdb-end"))
    expect(callOrder.indexOf("trailer-start")).toBeLessThan(callOrder.indexOf("omdb-end"))
  })

  it("works correctly for a TV show", async () => {
    const tvItem: MediaItem = {
      ...bareItem,
      id: "tv-1396",
      tmdbId: 1396,
      title: "Breaking Bad",
      mediaType: "tv",
    }
    const ratings: Ratings = { imdb: { score: 9.5, votes: 2000000 } }

    vi.mocked(fetchOmdbData).mockResolvedValue(ratings)
    vi.mocked(fetchTmdbTrailer).mockResolvedValue("xyz789")
    vi.mocked(calculateNormalizedScore).mockReturnValue(95)

    const result = await enrichMediaItem(tvItem)

    expect(fetchTmdbTrailer).toHaveBeenCalledWith(1396, "tv")
    expect(result.mediaType).toBe("tv")
    expect(result.ratings).toEqual(ratings)
    expect(result.trailerKey).toBe("xyz789")
  })
})
