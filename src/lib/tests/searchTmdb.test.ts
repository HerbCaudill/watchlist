import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { searchTmdb } from "../searchTmdb"

/** Sample TMDB movie search response JSON. */
const movieSearchResponse = {
  page: 1,
  results: [
    {
      id: 550,
      title: "Fight Club",
      release_date: "1999-10-15",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      overview: "An insomniac office worker and a soap salesman build a global organization.",
      adult: false,
      backdrop_path: "/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
      genre_ids: [18],
      original_language: "en",
      original_title: "Fight Club",
      popularity: 61.416,
      video: false,
      vote_average: 8.433,
      vote_count: 26280,
    },
  ],
  total_pages: 1,
  total_results: 1,
}

/** Sample TMDB TV search response JSON. */
const tvSearchResponse = {
  page: 1,
  results: [
    {
      id: 1396,
      name: "Breaking Bad",
      first_air_date: "2008-01-20",
      poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      overview: "A chemistry teacher diagnosed with cancer turns to making meth.",
      adult: false,
      backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      genre_ids: [18, 80],
      origin_country: ["US"],
      original_language: "en",
      original_name: "Breaking Bad",
      popularity: 200.5,
      vote_average: 8.9,
      vote_count: 12000,
    },
  ],
  total_pages: 1,
  total_results: 1,
}

/** Sample empty TMDB search response JSON. */
const emptySearchResponse = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
}

describe("searchTmdb", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(emptySearchResponse),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("constructs the correct URL for a movie search", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptySearchResponse),
    } as Response)

    await searchTmdb("fight club", "movie", "test-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/movie?api_key=test-key&query=fight%20club",
    )
  })

  it("constructs the correct URL for a TV search", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptySearchResponse),
    } as Response)

    await searchTmdb("breaking bad", "tv", "test-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/tv?api_key=test-key&query=breaking%20bad",
    )
  })

  it("returns MediaItem[] for a movie search", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(movieSearchResponse),
    } as Response)

    const results = await searchTmdb("fight club", "movie", "test-key")

    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: "movie-550",
      tmdbId: 550,
      title: "Fight Club",
      year: 1999,
      posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      mediaType: "movie",
      overview: "An insomniac office worker and a soap salesman build a global organization.",
      ratings: {},
    })
  })

  it("returns MediaItem[] for a TV search", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(tvSearchResponse),
    } as Response)

    const results = await searchTmdb("breaking bad", "tv", "test-key")

    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: "tv-1396",
      tmdbId: 1396,
      title: "Breaking Bad",
      year: 2008,
      posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      mediaType: "tv",
      overview: "A chemistry teacher diagnosed with cancer turns to making meth.",
      ratings: {},
    })
  })

  it("returns an empty array when there are no results", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptySearchResponse),
    } as Response)

    const results = await searchTmdb("xyznonexistent", "movie", "test-key")

    expect(results).toEqual([])
  })

  it("returns an empty array when fetch throws a network error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"))

    const results = await searchTmdb("fight club", "movie", "test-key")

    expect(results).toEqual([])
  })

  it("returns an empty array when the response JSON is malformed", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ bad: "data" }),
    } as Response)

    const results = await searchTmdb("fight club", "movie", "test-key")

    expect(results).toEqual([])
  })

  it("URL-encodes special characters in the query", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptySearchResponse),
    } as Response)

    await searchTmdb("the lord of the rings: the two towers", "movie", "test-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/movie?api_key=test-key&query=the%20lord%20of%20the%20rings%3A%20the%20two%20towers",
    )
  })
})
