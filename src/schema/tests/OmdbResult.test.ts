import { describe, expect, it } from "vitest"
import { Schema } from "effect"
import { OmdbResult } from "@/schema/OmdbResult"
import type { Ratings } from "@/types"

/** Decode raw OMDB JSON into a Ratings object. */
const decode = (input: unknown): Ratings => Schema.decodeUnknownSync(OmdbResult)(input)

describe("OmdbResult", () => {
  it("decodes a full OMDB response with all ratings", () => {
    const input = {
      Title: "Fight Club",
      Year: "1999",
      Ratings: [
        { Source: "Internet Movie Database", Value: "8.8/10" },
        { Source: "Rotten Tomatoes", Value: "79%" },
        { Source: "Metacritic", Value: "66/100" },
      ],
      imdbRating: "8.8",
      imdbVotes: "2,295,769",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 79 },
      metacritic: 66,
      imdb: { score: 8.8, votes: 2295769 },
    })
  })

  it("decodes a response with only IMDb ratings", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [{ Source: "Internet Movie Database", Value: "7.5/10" }],
      imdbRating: "7.5",
      imdbVotes: "1,000",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      imdb: { score: 7.5, votes: 1000 },
    })
  })

  it("decodes a response with only Rotten Tomatoes", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [{ Source: "Rotten Tomatoes", Value: "92%" }],
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 92 },
    })
  })

  it("decodes a response with only Metacritic", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [{ Source: "Metacritic", Value: "85/100" }],
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      metacritic: 85,
    })
  })

  it("decodes a response with no ratings at all", () => {
    const input = {
      Title: "Unreleased Movie",
      Year: "2026",
      Ratings: [],
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({})
  })

  it("decodes a response with missing Ratings array", () => {
    const input = {
      Title: "Minimal Movie",
      Year: "2020",
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({})
  })

  it("handles imdbVotes with no commas", () => {
    const input = {
      Title: "Small Movie",
      Year: "2020",
      Ratings: [],
      imdbRating: "6.0",
      imdbVotes: "500",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      imdb: { score: 6.0, votes: 500 },
    })
  })

  it("handles a 100% Rotten Tomatoes score", () => {
    const input = {
      Title: "Perfect Movie",
      Year: "2020",
      Ratings: [{ Source: "Rotten Tomatoes", Value: "100%" }],
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 100 },
    })
  })

  it("handles missing imdbRating and imdbVotes fields entirely", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [{ Source: "Rotten Tomatoes", Value: "50%" }],
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 50 },
    })
  })

  it("ignores unknown rating sources in the Ratings array", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [
        { Source: "Some Unknown Source", Value: "4/5" },
        { Source: "Rotten Tomatoes", Value: "72%" },
      ],
      imdbRating: "N/A",
      imdbVotes: "N/A",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 72 },
    })
  })

  it("handles imdbRating of 'N/A' with valid imdbVotes", () => {
    const input = {
      Title: "Some Movie",
      Year: "2020",
      Ratings: [],
      imdbRating: "N/A",
      imdbVotes: "1,000",
      Response: "True",
    }

    const result = decode(input)

    // IMDb is only present when both score and votes are valid
    expect(result).toEqual({})
  })

  it("decodes a response with all three rating sources plus IMDb fields", () => {
    const input = {
      Title: "Breaking Bad",
      Year: "2008",
      Ratings: [
        { Source: "Internet Movie Database", Value: "9.5/10" },
        { Source: "Rotten Tomatoes", Value: "96%" },
        { Source: "Metacritic", Value: "87/100" },
      ],
      imdbRating: "9.5",
      imdbVotes: "2,000,000",
      Response: "True",
    }

    const result = decode(input)

    expect(result).toEqual({
      rottenTomatoes: { critics: 96 },
      metacritic: 87,
      imdb: { score: 9.5, votes: 2000000 },
    })
  })
})
