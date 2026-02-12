import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RatingDisplay } from "../RatingDisplay"

describe("RatingDisplay", () => {
  it("renders label and value", () => {
    render(<RatingDisplay label="IMDb" value="8.5/10" score={85} />)
    expect(screen.getByText("IMDb")).toBeInTheDocument()
    expect(screen.getByText("8.5/10")).toBeInTheDocument()
  })

  it("renders subtext when provided", () => {
    render(<RatingDisplay label="IMDb" value="8.5/10" score={85} subtext="1.2M votes" />)
    expect(screen.getByText("1.2M votes")).toBeInTheDocument()
  })

  it("does not render subtext when omitted", () => {
    render(<RatingDisplay label="IMDb" value="8.5/10" score={85} />)
    expect(screen.queryByText("1.2M votes")).not.toBeInTheDocument()
  })

  it("shows a green indicator for scores >= 70", () => {
    const { container } = render(<RatingDisplay label="RT" value="92%" score={92} />)
    const indicator = container.querySelector("[data-score-indicator]")
    expect(indicator).toHaveClass("bg-green-600")
  })

  it("shows a yellow indicator for scores >= 50 and < 70", () => {
    const { container } = render(<RatingDisplay label="RT" value="65%" score={65} />)
    const indicator = container.querySelector("[data-score-indicator]")
    expect(indicator).toHaveClass("bg-yellow-500")
  })

  it("shows a red indicator for scores < 50", () => {
    const { container } = render(<RatingDisplay label="RT" value="30%" score={30} />)
    const indicator = container.querySelector("[data-score-indicator]")
    expect(indicator).toHaveClass("bg-red-600")
  })

  it("uses text-sm for the score value to keep it visually understated", () => {
    const { container } = render(<RatingDisplay label="IMDb" value="8.5/10" score={85} />)
    const scoreRow = container.querySelector("[data-score-value]")
    expect(scoreRow).toHaveClass("text-sm")
    expect(scoreRow).not.toHaveClass("text-lg")
  })
})
