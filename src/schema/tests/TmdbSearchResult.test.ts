import { describe, it, expect } from "vitest"
import { Schema } from "effect"
import {
  TmdbMovieSearchResponse,
  TmdbTvSearchResponse,
  tmdbMovieResultsToMediaItems,
  tmdbTvResultsToMediaItems,
} from "@/schema/TmdbSearchResult"
import type { MediaItem } from "@/types"

/** Sample TMDB movie search response JSON. */
const movieSearchResponse = {
  page: 1,
  results: [
    {
      id: 550,
      title: "Fight Club",
      release_date: "1999-10-15",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      overview:
        "A ticking-Loss bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
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
    {
      id: 999,
      title: "Some Other Movie",
      release_date: "2023-05-01",
      poster_path: null,
      overview: "",
      adult: false,
      backdrop_path: null,
      genre_ids: [],
      original_language: "en",
      original_title: "Some Other Movie",
      popularity: 1.5,
      video: false,
      vote_average: 5.0,
      vote_count: 10,
    },
  ],
  total_pages: 1,
  total_results: 2,
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
      overview:
        "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer, he becomes consumed by making money for his family's future.",
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
    {
      id: 2000,
      name: "Unknown Show",
      first_air_date: "",
      poster_path: null,
      overview: "A mysterious show.",
      adult: false,
      backdrop_path: null,
      genre_ids: [],
      origin_country: [],
      original_language: "en",
      original_name: "Unknown Show",
      popularity: 0.5,
      vote_average: 0,
      vote_count: 0,
    },
  ],
  total_pages: 1,
  total_results: 2,
}

describe("TmdbSearchResult", () => {
  describe("TmdbMovieSearchResponse", () => {
    it("decodes a valid movie search response", () => {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      expect(decoded.results).toHaveLength(2)
      expect(decoded.results[0].id).toBe(550)
      expect(decoded.results[0].title).toBe("Fight Club")
      expect(decoded.results[0].release_date).toBe("1999-10-15")
      expect(decoded.results[0].poster_path).toBe("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg")
    })

    it("handles null poster_path", () => {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      expect(decoded.results[1].poster_path).toBeNull()
    })

    it("rejects responses missing required fields", () => {
      const bad = { results: [{ title: "No ID" }] }
      expect(() => Schema.decodeUnknownSync(TmdbMovieSearchResponse)(bad)).toThrow()
    })
  })

  describe("TmdbTvSearchResponse", () => {
    it("decodes a valid TV search response", () => {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)
      expect(decoded.results).toHaveLength(2)
      expect(decoded.results[0].id).toBe(1396)
      expect(decoded.results[0].name).toBe("Breaking Bad")
      expect(decoded.results[0].first_air_date).toBe("2008-01-20")
      expect(decoded.results[0].poster_path).toBe("/ggFHVNu6YYI5L9pCfOacjizRGt.jpg")
    })

    it("handles null poster_path and empty first_air_date", () => {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)
      expect(decoded.results[1].poster_path).toBeNull()
      expect(decoded.results[1].first_air_date).toBe("")
    })
  })

  describe("tmdbMovieResultsToMediaItems", () => {
    it("converts decoded movie results to MediaItem array", () => {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      const items = tmdbMovieResultsToMediaItems(decoded)

      expect(items).toHaveLength(2)

      const first = items[0]
      expect(first.id).toBe("movie-550")
      expect(first.tmdbId).toBe(550)
      expect(first.title).toBe("Fight Club")
      expect(first.year).toBe(1999)
      expect(first.posterUrl).toBe(
        "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      )
      expect(first.mediaType).toBe("movie")
      expect(first.overview).toBe(
        "A ticking-Loss bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
      )
      expect(first.ratings).toEqual({})
      expect(first.normalizedScore).toBeUndefined()
    })

    it("handles null poster_path as undefined posterUrl", () => {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      const items = tmdbMovieResultsToMediaItems(decoded)
      expect(items[1].posterUrl).toBeUndefined()
    })

    it("handles empty overview as undefined", () => {
      const decoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      const items = tmdbMovieResultsToMediaItems(decoded)
      expect(items[1].overview).toBeUndefined()
    })
  })

  describe("tmdbTvResultsToMediaItems", () => {
    it("converts decoded TV results to MediaItem array", () => {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)
      const items = tmdbTvResultsToMediaItems(decoded)

      expect(items).toHaveLength(2)

      const first = items[0]
      expect(first.id).toBe("tv-1396")
      expect(first.tmdbId).toBe(1396)
      expect(first.title).toBe("Breaking Bad")
      expect(first.year).toBe(2008)
      expect(first.posterUrl).toBe("https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg")
      expect(first.mediaType).toBe("tv")
      expect(first.overview).toContain("Walter White")
      expect(first.ratings).toEqual({})
    })

    it("handles empty first_air_date as undefined year", () => {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)
      const items = tmdbTvResultsToMediaItems(decoded)
      expect(items[1].year).toBeUndefined()
    })

    it("handles null poster_path as undefined posterUrl", () => {
      const decoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)
      const items = tmdbTvResultsToMediaItems(decoded)
      expect(items[1].posterUrl).toBeUndefined()
    })
  })

  describe("round-trip type correctness", () => {
    it("produces items conforming to MediaItem interface", () => {
      const movieDecoded = Schema.decodeUnknownSync(TmdbMovieSearchResponse)(movieSearchResponse)
      const tvDecoded = Schema.decodeUnknownSync(TmdbTvSearchResponse)(tvSearchResponse)

      const movieItems: MediaItem[] = tmdbMovieResultsToMediaItems(movieDecoded)
      const tvItems: MediaItem[] = tmdbTvResultsToMediaItems(tvDecoded)

      for (const item of [...movieItems, ...tvItems]) {
        expect(item).toHaveProperty("id")
        expect(item).toHaveProperty("tmdbId")
        expect(item).toHaveProperty("title")
        expect(item).toHaveProperty("mediaType")
        expect(item).toHaveProperty("ratings")
        expect(["movie", "tv"]).toContain(item.mediaType)
      }
    })
  })
})
