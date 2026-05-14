import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Effect } from "@/lib/effect"
import { discoverTmdb } from "@/lib/discoverTmdb"
import { fetchOmdbDataEffect } from "@/lib/fetchOmdbDataEffect"
import { getCachedEnrichedMediaItem } from "@/lib/getCachedEnrichedMediaItem"
import { isRetryableApiError } from "@/lib/isRetryableApiError"
import type { MediaItem } from "@/types"

const bareMovie: MediaItem = {
  id: "movie-550",
  tmdbId: 550,
  title: "Fight Club",
  year: 1999,
  mediaType: "movie",
  ratings: {},
}

describe("Effect data layer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("constructs TMDB movie and TV discover URLs with media-specific date filters", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ page: 1, results: [], total_pages: 1, total_results: 0 }),
    } as Response)

    await Effect.runPromise(
      discoverTmdb("movie", {
        apiKey: "tmdb-key",
        page: 2,
        fromDate: "2026-01-01",
        toDate: "2026-12-31",
      }),
    )
    await Effect.runPromise(
      discoverTmdb("tv", {
        apiKey: "tmdb-key",
        page: 3,
        fromDate: "2026-01-01",
        toDate: "2026-12-31",
      }),
    )

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://api.themoviedb.org/3/discover/movie?api_key=tmdb-key&page=2&sort_by=popularity.desc&vote_count.gte=100&include_adult=false&language=en-US&include_video=false&primary_release_date.gte=2026-01-01&primary_release_date.lte=2026-12-31",
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.themoviedb.org/3/discover/tv?api_key=tmdb-key&page=3&sort_by=popularity.desc&vote_count.gte=100&include_adult=false&language=en-US&first_air_date.gte=2026-01-01&first_air_date.lte=2026-12-31",
    )
  })

  it("constructs OMDB lookup parameters from title, media type, and year", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ Ratings: [], imdbRating: "N/A", imdbVotes: "N/A" }),
    } as Response)

    await Effect.runPromise(
      fetchOmdbDataEffect({
        title: "Breaking Bad",
        mediaType: "tv",
        year: 2008,
        apiKey: "omdb-key",
      }),
    )

    expect(fetch).toHaveBeenCalledWith(
      "https://www.omdbapi.com/?apikey=omdb-key&t=Breaking%20Bad&type=series&y=2008",
    )
  })

  it("classifies transient failures as retryable and config/schema failures as non-retryable", () => {
    expect(isRetryableApiError({ _tag: "NetworkError", message: "offline" })).toBe(true)
    expect(isRetryableApiError({ _tag: "StatusError", status: 503, message: "unavailable" })).toBe(
      true,
    )
    expect(isRetryableApiError({ _tag: "StatusError", status: 404, message: "missing" })).toBe(
      false,
    )
    expect(isRetryableApiError({ _tag: "ConfigError", message: "missing key" })).toBe(false)
    expect(isRetryableApiError({ _tag: "SchemaError", message: "bad shape" })).toBe(false)
  })

  it("retries transient status failures before succeeding", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      } as Response)

    await expect(Effect.runPromise(discoverTmdb("movie", { apiKey: "tmdb-key" }))).resolves.toEqual(
      [],
    )
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("fails with a typed schema error when decoded JSON has the wrong shape", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ bad: "data" }),
    } as Response)

    await expect(
      Effect.runPromise(Effect.flip(discoverTmdb("movie", { apiKey: "tmdb-key" }))),
    ).resolves.toMatchObject({ _tag: "SchemaError" })
  })

  it("returns cached enriched media items and refreshes cache after enrichment", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            Ratings: [{ Source: "Metacritic", Value: "66/100" }],
            imdbRating: "8.8",
            imdbVotes: "2,295,769",
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            results: [{ key: "abc123", site: "YouTube", type: "Trailer", official: true }],
          }),
      } as Response)

    const enriched = await Effect.runPromise(
      getCachedEnrichedMediaItem(bareMovie, { omdbApiKey: "omdb-key", tmdbApiKey: "tmdb-key" }),
    )
    const cached = await Effect.runPromise(
      getCachedEnrichedMediaItem(bareMovie, { omdbApiKey: "omdb-key", tmdbApiKey: "tmdb-key" }),
    )

    expect(enriched).toMatchObject({
      ratings: { metacritic: 66 },
      normalizedScore: expect.any(Number),
      trailerKey: "abc123",
    })
    expect(cached).toEqual(enriched)
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
