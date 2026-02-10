import { describe, expect, it } from "vitest"
import { calculateNormalizedScore } from "../calculateNormalizedScore"
import type { Ratings } from "@/types"

describe("calculateNormalizedScore", () => {
  it("averages all three sources", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 90 },
      metacritic: 80,
      imdb: { score: 7, votes: 1000 },
    }
    // (90 + 80 + 70) / 3 = 80
    expect(calculateNormalizedScore(ratings)).toBe(80)
  })

  it("returns RT critics score alone", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 85 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(85)
  })

  it("returns Metacritic score alone", () => {
    const ratings: Ratings = {
      metacritic: 72,
    }
    expect(calculateNormalizedScore(ratings)).toBe(72)
  })

  it("returns IMDb score alone (scaled to 0-100)", () => {
    const ratings: Ratings = {
      imdb: { score: 8.5, votes: 500 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(85)
  })

  it("averages RT critics and Metacritic", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 90 },
      metacritic: 70,
    }
    // (90 + 70) / 2 = 80
    expect(calculateNormalizedScore(ratings)).toBe(80)
  })

  it("averages RT critics and IMDb", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 80 },
      imdb: { score: 6, votes: 200 },
    }
    // (80 + 60) / 2 = 70
    expect(calculateNormalizedScore(ratings)).toBe(70)
  })

  it("averages Metacritic and IMDb", () => {
    const ratings: Ratings = {
      metacritic: 60,
      imdb: { score: 8, votes: 300 },
    }
    // (60 + 80) / 2 = 70
    expect(calculateNormalizedScore(ratings)).toBe(70)
  })

  it("returns null when no scores are available", () => {
    const ratings: Ratings = {}
    expect(calculateNormalizedScore(ratings)).toBeNull()
  })

  it("handles zero scores", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 0 },
      metacritic: 0,
      imdb: { score: 0, votes: 0 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(0)
  })

  it("rounds to nearest integer", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 91 },
      metacritic: 80,
      imdb: { score: 7.3, votes: 100 },
    }
    // (91 + 80 + 73) / 3 = 81.333...
    expect(calculateNormalizedScore(ratings)).toBe(81)
  })

  it("rounds up at 0.5", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 91 },
      metacritic: 80,
    }
    // (91 + 80) / 2 = 85.5
    expect(calculateNormalizedScore(ratings)).toBe(86)
  })

  it("ignores RT audience score (only uses critics)", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 50, audience: 99 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(50)
  })

  it("ignores IMDb votes", () => {
    const ratings: Ratings = {
      imdb: { score: 5, votes: 999999 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(50)
  })

  it("handles perfect scores", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 100 },
      metacritic: 100,
      imdb: { score: 10, votes: 1000 },
    }
    expect(calculateNormalizedScore(ratings)).toBe(100)
  })
})
