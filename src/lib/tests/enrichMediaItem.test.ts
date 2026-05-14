import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { enrichMediaItem } from "../enrichMediaItem"
import type { MediaItem } from "@/types"

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
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv("VITE_OMDB_API_KEY", "test-omdb-key")
    vi.stubEnv("VITE_TMDB_API_KEY", "test-tmdb-key")
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns a fully enriched item when all fetches succeed", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            Ratings: [
              { Source: "Rotten Tomatoes", Value: "79%" },
              { Source: "Metacritic", Value: "66/100" },
            ],
            imdbRating: "8.8",
            imdbVotes: "2,200,000",
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            results: [{ key: "dQw4w9WgXcQ", site: "YouTube", type: "Trailer", official: true }],
          }),
      } as Response)

    const result = await enrichMediaItem(bareItem)

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://www.omdbapi.com/?apikey=test-omdb-key&t=Fight%20Club&type=movie&y=1999",
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.themoviedb.org/3/movie/550/videos?api_key=test-tmdb-key",
    )
    expect(result).toEqual({
      ...bareItem,
      ratings: {
        rottenTomatoes: { critics: 79 },
        metacritic: 66,
        imdb: { score: 8.8, votes: 2200000 },
      },
      normalizedScore: expect.any(Number),
      trailerKey: "dQw4w9WgXcQ",
    })
  })

  it("does not mutate the original item", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ Ratings: [], imdbRating: "N/A", imdbVotes: "N/A" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ results: [] }),
      } as Response)

    const original = { ...bareItem }
    await enrichMediaItem(bareItem)

    expect(bareItem).toEqual(original)
  })

  it("works correctly for a TV show", async () => {
    const tvItem: MediaItem = {
      ...bareItem,
      id: "tv-1396",
      tmdbId: 1396,
      title: "Breaking Bad",
      year: 2008,
      mediaType: "tv",
    }
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ Ratings: [], imdbRating: "9.5", imdbVotes: "2,000,000" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            results: [{ key: "xyz789", site: "YouTube", type: "Trailer", official: false }],
          }),
      } as Response)

    const result = await enrichMediaItem(tvItem)

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://www.omdbapi.com/?apikey=test-omdb-key&t=Breaking%20Bad&type=series&y=2008",
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.themoviedb.org/3/tv/1396/videos?api_key=test-tmdb-key",
    )
    expect(result.mediaType).toBe("tv")
    expect(result.ratings).toEqual({ imdb: { score: 9.5, votes: 2000000 } })
    expect(result.trailerKey).toBe("xyz789")
  })
})
