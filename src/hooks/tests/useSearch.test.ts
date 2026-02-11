import { afterEach, describe, expect, it, vi } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { MediaItem } from "@/types"

vi.mock("@/lib/searchTmdb", () => ({
  searchTmdb: vi.fn(),
}))

vi.mock("@/lib/enrichMediaItem", () => ({
  enrichMediaItem: vi.fn(),
}))

import { searchTmdb } from "@/lib/searchTmdb"
import { enrichMediaItem } from "@/lib/enrichMediaItem"
import { useSearch } from "../useSearch"

/** A bare movie item as returned by TMDB search (no ratings). */
const bareMovie: MediaItem = {
  id: "movie-550",
  tmdbId: 550,
  title: "Fight Club",
  year: 1999,
  posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  mediaType: "movie",
  overview: "An insomniac and a soap salesman start an underground fight club.",
  ratings: {},
}

/** A bare TV item. */
const bareTvShow: MediaItem = {
  id: "tv-1396",
  tmdbId: 1396,
  title: "Breaking Bad",
  year: 2008,
  posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  mediaType: "tv",
  overview: "A high school chemistry teacher turned meth manufacturer.",
  ratings: {},
}

/** An enriched version of bareMovie with ratings and trailer. */
const enrichedMovie: MediaItem = {
  ...bareMovie,
  ratings: {
    rottenTomatoes: { critics: 79, audience: 96 },
    metacritic: 66,
    imdb: { score: 8.8, votes: 2200000 },
  },
  normalizedScore: 82,
  trailerKey: "dQw4w9WgXcQ",
}

/** An enriched version of bareTvShow. */
const enrichedTvShow: MediaItem = {
  ...bareTvShow,
  ratings: {
    rottenTomatoes: { critics: 96, audience: 96 },
    metacritic: 87,
    imdb: { score: 9.5, votes: 2000000 },
  },
  normalizedScore: 95,
  trailerKey: "abc123",
}

describe("useSearch", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it("returns initial state with empty query, no results, and not loading", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.query).toBe("")
    expect(result.current.movieResults).toEqual([])
    expect(result.current.tvResults).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("updates query via setQuery", () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight club")
    })

    expect(result.current.query).toBe("fight club")
  })

  it("sets isLoading to true when search starts", async () => {
    vi.mocked(searchTmdb).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([bareMovie]), 100)),
    )
    vi.mocked(enrichMediaItem).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(enrichedMovie), 200)),
    )

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight club")
    })

    act(() => {
      result.current.search()
    })

    expect(result.current.isLoading).toBe(true)
  })

  it("searches both movies and TV shows in parallel", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return [bareTvShow]
    })
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.mediaType === "movie") return enrichedMovie
      return enrichedTvShow
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search()
    })

    expect(searchTmdb).toHaveBeenCalledWith("fight", "movie")
    expect(searchTmdb).toHaveBeenCalledWith("fight", "tv")

    await waitFor(() => {
      expect(result.current.movieResults.length).toBe(1)
      expect(result.current.tvResults.length).toBe(1)
    })
  })

  it("sets unenriched results immediately for fast display", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return [bareTvShow]
    })
    vi.mocked(enrichMediaItem).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(enrichedMovie), 100)),
    )

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.movieResults.length).toBe(1)
    })

    expect(result.current.movieResults[0].ratings).toEqual({})
    expect(result.current.tvResults[0].ratings).toEqual({})
  })

  it("enriches results in the background and updates as they come in", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return [bareTvShow]
    })
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.mediaType === "movie") return enrichedMovie
      return enrichedTvShow
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.movieResults[0].normalizedScore).toBe(82)
      expect(result.current.tvResults[0].normalizedScore).toBe(95)
    })

    expect(result.current.movieResults[0]).toEqual(enrichedMovie)
    expect(result.current.tvResults[0]).toEqual(enrichedTvShow)
  })

  it("sets isLoading to false after all enrichments complete", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return []
    })
    vi.mocked(enrichMediaItem).mockResolvedValue(enrichedMovie)

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight club")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("handles empty search results", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([])

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("xyznonexistent")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.movieResults).toEqual([])
    expect(result.current.tvResults).toEqual([])
    expect(enrichMediaItem).not.toHaveBeenCalled()
  })

  it("handles enrichment failure gracefully, keeping the unenriched item", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return [bareTvShow]
    })
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.mediaType === "movie") throw new Error("OMDB down")
      return enrichedTvShow
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.movieResults[0]).toEqual(bareMovie)
    expect(result.current.tvResults[0]).toEqual(enrichedTvShow)
  })

  it("does not search with an empty query", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([])

    const { result } = renderHook(() => useSearch())

    await act(async () => {
      result.current.search()
    })

    expect(searchTmdb).not.toHaveBeenCalled()
    expect(result.current.movieResults).toEqual([])
    expect(result.current.tvResults).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("clears results when clear is called", async () => {
    vi.mocked(searchTmdb).mockImplementation(async (_query, mediaType) => {
      if (mediaType === "movie") return [bareMovie]
      return [bareTvShow]
    })
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.mediaType === "movie") return enrichedMovie
      return enrichedTvShow
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search()
    })

    await waitFor(() => {
      expect(result.current.movieResults.length).toBe(1)
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.movieResults).toEqual([])
    expect(result.current.tvResults).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })
})
