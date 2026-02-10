import { describe, expect, it } from "vitest"
import {
  movieFixture,
  tvShowFixture,
  noPosterFixture,
  noRatingsFixture,
  longTitleFixture,
  longTitleTvFixture,
  fixtures,
} from "@/lib/fixtures"
import type { MediaItem } from "@/types"

/** Helper to assert a value satisfies the MediaItem interface at runtime. */
const assertMediaItem = (item: MediaItem) => {
  expect(item.id).toBeTypeOf("string")
  expect(item.id.length).toBeGreaterThan(0)
  expect(item.tmdbId).toBeTypeOf("number")
  expect(item.title).toBeTypeOf("string")
  expect(item.title.length).toBeGreaterThan(0)
  expect(["movie", "tv"]).toContain(item.mediaType)
  expect(item.ratings).toBeDefined()
  expect(typeof item.ratings).toBe("object")
}

describe("fixtures", () => {
  it("movieFixture is a valid movie MediaItem", () => {
    assertMediaItem(movieFixture)
    expect(movieFixture.mediaType).toBe("movie")
    expect(movieFixture.year).toBeTypeOf("number")
    expect(movieFixture.posterUrl).toBeTypeOf("string")
    expect(movieFixture.overview).toBeTypeOf("string")
  })

  it("tvShowFixture is a valid TV MediaItem", () => {
    assertMediaItem(tvShowFixture)
    expect(tvShowFixture.mediaType).toBe("tv")
    expect(tvShowFixture.year).toBeTypeOf("number")
    expect(tvShowFixture.posterUrl).toBeTypeOf("string")
    expect(tvShowFixture.overview).toBeTypeOf("string")
  })

  it("noPosterFixture has no posterUrl", () => {
    assertMediaItem(noPosterFixture)
    expect(noPosterFixture.posterUrl).toBeUndefined()
  })

  it("noRatingsFixture has empty ratings", () => {
    assertMediaItem(noRatingsFixture)
    expect(noRatingsFixture.ratings.rottenTomatoes).toBeUndefined()
    expect(noRatingsFixture.ratings.metacritic).toBeUndefined()
    expect(noRatingsFixture.ratings.imdb).toBeUndefined()
  })

  it("longTitleFixture has a title longer than 60 characters", () => {
    assertMediaItem(longTitleFixture)
    expect(longTitleFixture.title.length).toBeGreaterThan(60)
    expect(longTitleFixture.mediaType).toBe("movie")
  })

  it("longTitleTvFixture has a long title and is a TV show", () => {
    assertMediaItem(longTitleTvFixture)
    expect(longTitleTvFixture.title.length).toBeGreaterThan(60)
    expect(longTitleTvFixture.mediaType).toBe("tv")
  })

  it("movieFixture has ratings from all sources", () => {
    expect(movieFixture.ratings.rottenTomatoes).toBeDefined()
    expect(movieFixture.ratings.rottenTomatoes!.critics).toBeTypeOf("number")
    expect(movieFixture.ratings.metacritic).toBeTypeOf("number")
    expect(movieFixture.ratings.imdb).toBeDefined()
    expect(movieFixture.ratings.imdb!.score).toBeTypeOf("number")
    expect(movieFixture.ratings.imdb!.votes).toBeTypeOf("number")
  })

  it("movieFixture has a normalizedScore", () => {
    expect(movieFixture.normalizedScore).toBeTypeOf("number")
  })

  it("noRatingsFixture has normalizedScore as null", () => {
    expect(noRatingsFixture.normalizedScore).toBeNull()
  })

  it("all fixtures have unique ids", () => {
    const ids = fixtures.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("fixtures array contains all named exports", () => {
    expect(fixtures).toContain(movieFixture)
    expect(fixtures).toContain(tvShowFixture)
    expect(fixtures).toContain(noPosterFixture)
    expect(fixtures).toContain(noRatingsFixture)
    expect(fixtures).toContain(longTitleFixture)
    expect(fixtures).toContain(longTitleTvFixture)
  })

  it("fixtures array has at least 6 items", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(6)
  })

  it("all fixtures in the array are valid MediaItems", () => {
    for (const fixture of fixtures) {
      assertMediaItem(fixture)
    }
  })
})
