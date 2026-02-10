import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { DiscoverPlaceholder } from "../DiscoverPlaceholder"

describe("DiscoverPlaceholder", () => {
  it("renders 'Coming soon' text", () => {
    render(<DiscoverPlaceholder />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })

  it("renders an icon", () => {
    const { container } = render(<DiscoverPlaceholder />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
