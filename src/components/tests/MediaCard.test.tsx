import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { movieFixture, noRatingsFixture, noPosterFixture } from "@/lib/fixtures"
import { MediaCard } from "../MediaCard"

describe("MediaCard", () => {
  it("renders the title", () => {
    render(<MediaCard item={movieFixture} />)
    expect(screen.getByText("Fight Club")).toBeInTheDocument()
  })

  it("renders the year", () => {
    render(<MediaCard item={movieFixture} />)
    expect(screen.getByText("1999")).toBeInTheDocument()
  })

  it("renders the poster image", () => {
    render(<MediaCard item={movieFixture} />)
    const img = screen.getByRole("img", { name: "Fight Club" })
    expect(img).toBeInTheDocument()
  })

  it("renders the score badge when normalizedScore is present", () => {
    render(<MediaCard item={movieFixture} />)
    expect(screen.getByText("82")).toBeInTheDocument()
  })

  it("does not render the score badge when normalizedScore is null", () => {
    render(<MediaCard item={noRatingsFixture} />)
    expect(screen.queryByTestId("score-badge")).not.toBeInTheDocument()
  })

  it("renders a poster placeholder when posterUrl is undefined", () => {
    render(<MediaCard item={noPosterFixture} />)
    expect(screen.getByLabelText("The Obscure Indie Film")).toBeInTheDocument()
  })

  describe("action button", () => {
    it("shows add button when not on watchlist", () => {
      render(<MediaCard item={movieFixture} isOnWatchlist={false} onAction={() => {}} />)
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
    })

    it("shows remove button when on watchlist", () => {
      render(<MediaCard item={movieFixture} isOnWatchlist={true} onAction={() => {}} />)
      expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument()
    })

    it("calls onAction with the item when clicked", async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()
      render(<MediaCard item={movieFixture} isOnWatchlist={false} onAction={onAction} />)
      await user.click(screen.getByRole("button", { name: /add/i }))
      expect(onAction).toHaveBeenCalledOnce()
      expect(onAction).toHaveBeenCalledWith(movieFixture)
    })

    it("does not render the action button when onAction is not provided", () => {
      render(<MediaCard item={movieFixture} />)
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })
  })

  it("does not render year when item has no year", () => {
    const itemWithoutYear = { ...movieFixture, year: undefined }
    render(<MediaCard item={itemWithoutYear} />)
    expect(screen.queryByText("1999")).not.toBeInTheDocument()
  })
})
