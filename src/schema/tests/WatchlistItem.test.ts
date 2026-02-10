import { describe, expect, it } from "vitest"
import { Schema } from "effect"
import { Type } from "@dxos/echo"
import { WatchlistItem } from "../WatchlistItem"

describe("WatchlistItem", () => {
  it("has the correct typename", () => {
    expect(Type.getTypename(WatchlistItem)).toBe("watchlist/type/WatchlistItem")
  })

  it("has the correct version", () => {
    expect(Type.getVersion(WatchlistItem)).toBe("0.1.0")
  })

  it("decodes a valid movie item", () => {
    const input = {
      id: "abc123",
      tmdbId: 550,
      title: "Fight Club",
      year: 1999,
      posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
      mediaType: "movie" as const,
      overview:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
      normalizedScore: 84,
      addedAt: "2025-01-15T12:00:00.000Z",
    }

    const decoded = Schema.decodeUnknownSync(WatchlistItem)(input)
    expect(decoded.id).toBe("abc123")
    expect(decoded.tmdbId).toBe(550)
    expect(decoded.title).toBe("Fight Club")
    expect(decoded.year).toBe(1999)
    expect(decoded.posterUrl).toBe("https://image.tmdb.org/t/p/w500/poster.jpg")
    expect(decoded.mediaType).toBe("movie")
    expect(decoded.overview).toContain("insomniac")
    expect(decoded.normalizedScore).toBe(84)
    expect(decoded.addedAt).toBe("2025-01-15T12:00:00.000Z")
  })

  it("decodes a valid TV item", () => {
    const input = {
      id: "def456",
      tmdbId: 1396,
      title: "Breaking Bad",
      year: 2008,
      mediaType: "tv" as const,
      addedAt: "2025-02-01T08:30:00.000Z",
    }

    const decoded = Schema.decodeUnknownSync(WatchlistItem)(input)
    expect(decoded.tmdbId).toBe(1396)
    expect(decoded.title).toBe("Breaking Bad")
    expect(decoded.mediaType).toBe("tv")
  })

  it("allows optional fields to be omitted", () => {
    const input = {
      id: "ghi789",
      tmdbId: 999,
      title: "Minimal Movie",
      mediaType: "movie" as const,
      addedAt: "2025-03-01T00:00:00.000Z",
    }

    const decoded = Schema.decodeUnknownSync(WatchlistItem)(input)
    expect(decoded.tmdbId).toBe(999)
    expect(decoded.title).toBe("Minimal Movie")
    expect(decoded.year).toBeUndefined()
    expect(decoded.posterUrl).toBeUndefined()
    expect(decoded.overview).toBeUndefined()
    expect(decoded.normalizedScore).toBeUndefined()
  })

  it("allows normalizedScore to be null", () => {
    const input = {
      id: "jkl012",
      tmdbId: 100,
      title: "No Score Movie",
      mediaType: "movie" as const,
      normalizedScore: null,
      addedAt: "2025-04-01T00:00:00.000Z",
    }

    const decoded = Schema.decodeUnknownSync(WatchlistItem)(input)
    expect(decoded.normalizedScore).toBeNull()
  })

  it("rejects an invalid mediaType", () => {
    const input = {
      id: "mno345",
      tmdbId: 1,
      title: "Bad Type",
      mediaType: "documentary",
      addedAt: "2025-01-01T00:00:00.000Z",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(input)).toThrow()
  })

  it("rejects missing required fields", () => {
    const missingTitle = {
      id: "pqr678",
      tmdbId: 1,
      mediaType: "movie",
      addedAt: "2025-01-01T00:00:00.000Z",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(missingTitle)).toThrow()

    const missingTmdbId = {
      id: "stu901",
      title: "No ID",
      mediaType: "movie",
      addedAt: "2025-01-01T00:00:00.000Z",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(missingTmdbId)).toThrow()

    const missingAddedAt = {
      id: "vwx234",
      tmdbId: 1,
      title: "No Date",
      mediaType: "movie",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(missingAddedAt)).toThrow()

    const missingId = {
      tmdbId: 1,
      title: "No ID",
      mediaType: "movie",
      addedAt: "2025-01-01T00:00:00.000Z",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(missingId)).toThrow()
  })

  it("rejects tmdbId that is not a number", () => {
    const input = {
      id: "yza567",
      tmdbId: "not-a-number",
      title: "Bad ID",
      mediaType: "movie",
      addedAt: "2025-01-01T00:00:00.000Z",
    }

    expect(() => Schema.decodeUnknownSync(WatchlistItem)(input)).toThrow()
  })
})
