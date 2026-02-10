import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchOmdbData } from "../fetchOmdbData"

describe("fetchOmdbData", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns a full Ratings object when all ratings are present", async () => {
    const omdbResponse = {
      Ratings: [
        { Source: "Rotten Tomatoes", Value: "93%" },
        { Source: "Metacritic", Value: "84/100" },
      ],
      imdbRating: "8.8",
      imdbVotes: "2,295,769",
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(omdbResponse),
    } as Response)

    const result = await fetchOmdbData("Inception", "test-key")

    expect(result).toEqual({
      rottenTomatoes: { critics: 93 },
      metacritic: 84,
      imdb: { score: 8.8, votes: 2295769 },
    })
  })

  it("returns partial Ratings when only some ratings are present", async () => {
    const omdbResponse = {
      Ratings: [{ Source: "Rotten Tomatoes", Value: "79%" }],
      imdbRating: "N/A",
      imdbVotes: "N/A",
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(omdbResponse),
    } as Response)

    const result = await fetchOmdbData("Some Movie", "test-key")

    expect(result).toEqual({
      rottenTomatoes: { critics: 79 },
    })
  })

  it("returns empty Ratings when the API returns an error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"))

    const result = await fetchOmdbData("Nonexistent", "test-key")

    expect(result).toEqual({})
  })

  it("returns empty Ratings when the response is invalid JSON", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response)

    const result = await fetchOmdbData("Bad Response", "test-key")

    expect(result).toEqual({})
  })

  it("constructs the correct URL with encoded title", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    await fetchOmdbData("The Dark Knight", "my-api-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://www.omdbapi.com/?apikey=my-api-key&t=The%20Dark%20Knight",
    )
  })

  it("returns empty Ratings when the response has no ratings fields", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ Title: "Something", Year: "2020" }),
    } as Response)

    const result = await fetchOmdbData("Something", "test-key")

    expect(result).toEqual({})
  })

  it("handles special characters in the title", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    await fetchOmdbData("Amélie & Friends: Part 2", "test-key")

    expect(fetch).toHaveBeenCalledWith(
      "https://www.omdbapi.com/?apikey=test-key&t=Am%C3%A9lie%20%26%20Friends%3A%20Part%202",
    )
  })
})
