import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RatingsBar } from "../RatingsBar"
import type { Ratings } from "@/types"

describe("RatingsBar", () => {
  it("renders all three rating sources when all are present", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 92, audience: 88 },
      metacritic: 75,
      imdb: { score: 8.5, votes: 1200000 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("RT Critics")).toBeInTheDocument()
    expect(screen.getByText("92%")).toBeInTheDocument()
    expect(screen.getByText("Metacritic")).toBeInTheDocument()
    expect(screen.getByText("75")).toBeInTheDocument()
    expect(screen.getByText("IMDb")).toBeInTheDocument()
    expect(screen.getByText("8.5/10")).toBeInTheDocument()
  })

  it("renders only Rotten Tomatoes when only that rating is present", () => {
    const ratings: Ratings = {
      rottenTomatoes: { critics: 45 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("RT Critics")).toBeInTheDocument()
    expect(screen.getByText("45%")).toBeInTheDocument()
    expect(screen.queryByText("Metacritic")).not.toBeInTheDocument()
    expect(screen.queryByText("IMDb")).not.toBeInTheDocument()
  })

  it("renders only Metacritic when only that rating is present", () => {
    const ratings: Ratings = {
      metacritic: 60,
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("Metacritic")).toBeInTheDocument()
    expect(screen.getByText("60")).toBeInTheDocument()
    expect(screen.queryByText("RT Critics")).not.toBeInTheDocument()
    expect(screen.queryByText("IMDb")).not.toBeInTheDocument()
  })

  it("renders only IMDb when only that rating is present", () => {
    const ratings: Ratings = {
      imdb: { score: 7.2, votes: 50000 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("IMDb")).toBeInTheDocument()
    expect(screen.getByText("7.2/10")).toBeInTheDocument()
    expect(screen.queryByText("RT Critics")).not.toBeInTheDocument()
    expect(screen.queryByText("Metacritic")).not.toBeInTheDocument()
  })

  it("renders nothing when no ratings are present", () => {
    const ratings: Ratings = {}
    const { container } = render(<RatingsBar ratings={ratings} />)
    expect(container.firstChild?.childNodes.length ?? 0).toBe(0)
  })

  it("shows IMDb vote count as subtext", () => {
    const ratings: Ratings = {
      imdb: { score: 8.8, votes: 2200000 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("2.2M votes")).toBeInTheDocument()
  })

  it("formats vote counts under 1M with K suffix", () => {
    const ratings: Ratings = {
      imdb: { score: 6.5, votes: 340000 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("340K votes")).toBeInTheDocument()
  })

  it("formats small vote counts without suffix", () => {
    const ratings: Ratings = {
      imdb: { score: 6.2, votes: 340 },
    }
    render(<RatingsBar ratings={ratings} />)
    expect(screen.getByText("340 votes")).toBeInTheDocument()
  })
})
