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

/** A second bare movie item. */
const bareMovie2: MediaItem = {
  id: "movie-680",
  tmdbId: 680,
  title: "Pulp Fiction",
  year: 1994,
  posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  mediaType: "movie",
  overview: "The lives of two mob hitmen intertwine in four tales of violence and redemption.",
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

/** An enriched version of bareMovie2 with ratings and trailer. */
const enrichedMovie2: MediaItem = {
  ...bareMovie2,
  ratings: {
    rottenTomatoes: { critics: 92, audience: 96 },
    metacritic: 94,
    imdb: { score: 8.9, votes: 2100000 },
  },
  normalizedScore: 93,
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
    expect(result.current.results).toEqual([])
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
      result.current.search("movie")
    })

    expect(result.current.isLoading).toBe(true)
  })

  it("sets unenriched results immediately for fast display", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([bareMovie, bareMovie2])
    vi.mocked(enrichMediaItem).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(enrichedMovie), 100)),
    )

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search("movie")
    })

    // After searchTmdb resolves, we should have unenriched results
    await waitFor(() => {
      expect(result.current.results.length).toBe(2)
    })

    // Results should initially be the bare (unenriched) items
    expect(result.current.results[0].ratings).toEqual({})
    expect(result.current.results[1].ratings).toEqual({})
  })

  it("enriches results in the background and updates as they come in", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([bareMovie, bareMovie2])

    // Enrichment resolves at different times
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.id === bareMovie.id) return enrichedMovie
      return enrichedMovie2
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search("movie")
    })

    // Wait for all enrichments to complete
    await waitFor(() => {
      expect(result.current.results[0].normalizedScore).toBe(82)
    })

    expect(result.current.results[0]).toEqual(enrichedMovie)
    expect(result.current.results[1]).toEqual(enrichedMovie2)
  })

  it("sets isLoading to false after all enrichments complete", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([bareMovie])
    vi.mocked(enrichMediaItem).mockResolvedValue(enrichedMovie)

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight club")
    })

    await act(async () => {
      result.current.search("movie")
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("passes the query and mediaType to searchTmdb", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([])
    vi.mocked(enrichMediaItem).mockResolvedValue(enrichedMovie)

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("breaking bad")
    })

    await act(async () => {
      result.current.search("tv")
    })

    expect(searchTmdb).toHaveBeenCalledWith("breaking bad", "tv")
  })

  it("handles empty search results", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([])

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("xyznonexistent")
    })

    await act(async () => {
      result.current.search("movie")
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.results).toEqual([])
    expect(enrichMediaItem).not.toHaveBeenCalled()
  })

  it("handles enrichment failure gracefully, keeping the unenriched item", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([bareMovie, bareMovie2])
    vi.mocked(enrichMediaItem).mockImplementation(async (item: MediaItem) => {
      if (item.id === bareMovie.id) throw new Error("OMDB down")
      return enrichedMovie2
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery("fight")
    })

    await act(async () => {
      result.current.search("movie")
    })

    // Wait for enrichment to settle
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // The failed item keeps its unenriched state
    expect(result.current.results[0]).toEqual(bareMovie)
    // The successful item gets enriched
    expect(result.current.results[1]).toEqual(enrichedMovie2)
  })

  it("does not search with an empty query", async () => {
    vi.mocked(searchTmdb).mockResolvedValue([])

    const { result } = renderHook(() => useSearch())

    await act(async () => {
      result.current.search("movie")
    })

    expect(searchTmdb).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("replaces previous results when a new search is performed", async () => {
    vi.mocked(searchTmdb).mockResolvedValueOnce([bareMovie]).mockResolvedValueOnce([bareMovie2])

    vi.mocked(enrichMediaItem)
      .mockResolvedValueOnce(enrichedMovie)
      .mockResolvedValueOnce(enrichedMovie2)

    const { result } = renderHook(() => useSearch())

    // First search
    act(() => {
      result.current.setQuery("fight club")
    })

    await act(async () => {
      result.current.search("movie")
    })

    await waitFor(() => {
      expect(result.current.results[0]?.title).toBe("Fight Club")
    })

    // Second search
    act(() => {
      result.current.setQuery("pulp fiction")
    })

    await act(async () => {
      result.current.search("movie")
    })

    await waitFor(() => {
      expect(result.current.results[0]?.title).toBe("Pulp Fiction")
    })

    expect(result.current.results.length).toBe(1)
  })
})
