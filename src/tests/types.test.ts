import { describe, expect, it } from "vitest"
import type { MediaType, Tab, Ratings, MediaItem } from "@/types"

describe("types", () => {
  describe("MediaType", () => {
    it("accepts 'movie'", () => {
      const mediaType: MediaType = "movie"
      expect(mediaType).toBe("movie")
    })

    it("accepts 'tv'", () => {
      const mediaType: MediaType = "tv"
      expect(mediaType).toBe("tv")
    })
  })

  describe("Tab", () => {
    it("accepts 'discover'", () => {
      const tab: Tab = "discover"
      expect(tab).toBe("discover")
    })

    it("accepts 'watchlist'", () => {
      const tab: Tab = "watchlist"
      expect(tab).toBe("watchlist")
    })
  })

  describe("Ratings", () => {
    it("accepts an empty ratings object", () => {
      const ratings: Ratings = {}
      expect(ratings).toEqual({})
    })

    it("accepts ratings with all fields", () => {
      const ratings: Ratings = {
        rottenTomatoes: { critics: 92, audience: 85 },
        metacritic: 78,
        imdb: { score: 8.1, votes: 250000 },
      }
      expect(ratings.rottenTomatoes?.critics).toBe(92)
      expect(ratings.rottenTomatoes?.audience).toBe(85)
      expect(ratings.metacritic).toBe(78)
      expect(ratings.imdb?.score).toBe(8.1)
      expect(ratings.imdb?.votes).toBe(250000)
    })

    it("accepts ratings with only some fields", () => {
      const ratings: Ratings = {
        rottenTomatoes: { critics: 72 },
      }
      expect(ratings.rottenTomatoes?.critics).toBe(72)
      expect(ratings.rottenTomatoes?.audience).toBeUndefined()
      expect(ratings.metacritic).toBeUndefined()
      expect(ratings.imdb).toBeUndefined()
    })
  })

  describe("MediaItem", () => {
    it("accepts a minimal media item", () => {
      const item: MediaItem = {
        id: "movie-123",
        tmdbId: 123,
        title: "Test Movie",
        mediaType: "movie",
        ratings: {},
      }
      expect(item.id).toBe("movie-123")
      expect(item.tmdbId).toBe(123)
      expect(item.title).toBe("Test Movie")
      expect(item.mediaType).toBe("movie")
      expect(item.year).toBeUndefined()
      expect(item.posterUrl).toBeUndefined()
      expect(item.overview).toBeUndefined()
      expect(item.normalizedScore).toBeUndefined()
    })

    it("accepts a fully populated media item", () => {
      const item: MediaItem = {
        id: "tv-456",
        tmdbId: 456,
        title: "Test TV Show",
        year: 2024,
        posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
        mediaType: "tv",
        overview: "A great TV show about testing.",
        ratings: {
          rottenTomatoes: { critics: 95, audience: 90 },
          metacritic: 88,
          imdb: { score: 9.0, votes: 500000 },
        },
        normalizedScore: 91,
      }
      expect(item.id).toBe("tv-456")
      expect(item.year).toBe(2024)
      expect(item.posterUrl).toBe("https://image.tmdb.org/t/p/w500/poster.jpg")
      expect(item.overview).toBe("A great TV show about testing.")
      expect(item.normalizedScore).toBe(91)
    })

    it("accepts null for normalizedScore", () => {
      const item: MediaItem = {
        id: "movie-789",
        tmdbId: 789,
        title: "No Score Movie",
        mediaType: "movie",
        ratings: {},
        normalizedScore: null,
      }
      expect(item.normalizedScore).toBeNull()
    })
  })
})
