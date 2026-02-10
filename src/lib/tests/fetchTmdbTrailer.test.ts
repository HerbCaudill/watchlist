import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchTmdbTrailer } from "../fetchTmdbTrailer"

/** Helper to create a mock video entry from the TMDB videos endpoint. */
function makeVideo(overrides: Partial<TmdbVideo> = {}): TmdbVideo {
  return {
    key: "DEFAULT_KEY",
    site: "YouTube",
    type: "Trailer",
    official: false,
    ...overrides,
  }
}

describe("fetchTmdbTrailer", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns the key of an official YouTube trailer", async () => {
    const videos = [
      makeVideo({ key: "abc123", official: true }),
      makeVideo({ key: "other", official: false }),
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: videos }),
    } as Response)

    const result = await fetchTmdbTrailer(12345, "movie", "test-key")
    expect(result).toBe("abc123")
  })

  it("falls back to a non-official YouTube trailer when no official trailer exists", async () => {
    const videos = [
      makeVideo({ key: "non-official", type: "Trailer", official: false }),
      makeVideo({ key: "featurette", type: "Featurette", official: true }),
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: videos }),
    } as Response)

    const result = await fetchTmdbTrailer(99, "tv", "test-key")
    expect(result).toBe("non-official")
  })

  it("falls back to any YouTube video when no trailers exist", async () => {
    const videos = [makeVideo({ key: "featurette-key", type: "Featurette", official: false })]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: videos }),
    } as Response)

    const result = await fetchTmdbTrailer(42, "movie", "test-key")
    expect(result).toBe("featurette-key")
  })

  it("returns null when no YouTube videos exist", async () => {
    const videos = [makeVideo({ key: "vimeo-key", site: "Vimeo", type: "Trailer", official: true })]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: videos }),
    } as Response)

    const result = await fetchTmdbTrailer(42, "movie", "test-key")
    expect(result).toBeNull()
  })

  it("returns null when the results array is empty", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as Response)

    const result = await fetchTmdbTrailer(1, "movie", "test-key")
    expect(result).toBeNull()
  })

  it("returns null when the API returns an error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"))

    const result = await fetchTmdbTrailer(1, "movie", "test-key")
    expect(result).toBeNull()
  })

  it("constructs the correct URL for a movie", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as Response)

    await fetchTmdbTrailer(550, "movie", "my-api-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/movie/550/videos?api_key=my-api-key",
    )
  })

  it("constructs the correct URL for a TV show", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as Response)

    await fetchTmdbTrailer(1399, "tv", "my-api-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/tv/1399/videos?api_key=my-api-key",
    )
  })

  it("prefers official trailer over teaser", async () => {
    const videos = [
      makeVideo({ key: "teaser-key", type: "Teaser", official: true }),
      makeVideo({ key: "official-trailer", type: "Trailer", official: true }),
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: videos }),
    } as Response)

    const result = await fetchTmdbTrailer(1, "movie", "test-key")
    expect(result).toBe("official-trailer")
  })
})

/** Shape of a single video entry from the TMDB videos endpoint. */
type TmdbVideo = {
  key: string
  site: string
  type: string
  official: boolean
}
