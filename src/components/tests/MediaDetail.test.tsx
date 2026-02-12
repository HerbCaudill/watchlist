import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { movieFixture, noRatingsFixture, noPosterFixture } from "@/lib/fixtures"
import { MediaDetail } from "../MediaDetail"

describe("MediaDetail", () => {
  it("renders the title", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText("Fight Club")).toBeInTheDocument()
  })

  it("renders the year", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText("1999")).toBeInTheDocument()
  })

  it("does not render year when item has no year", () => {
    const itemWithoutYear = { ...movieFixture, year: undefined }
    render(<MediaDetail item={itemWithoutYear} />)
    expect(screen.queryByText("1999")).not.toBeInTheDocument()
  })

  it("renders the poster image", () => {
    render(<MediaDetail item={movieFixture} />)
    const img = screen.getByRole("img", { name: "Fight Club" })
    expect(img).toBeInTheDocument()
  })

  it("renders a poster placeholder when posterUrl is undefined", () => {
    render(<MediaDetail item={noPosterFixture} />)
    expect(screen.getByLabelText("The Obscure Indie Film")).toBeInTheDocument()
  })

  it("renders the overview text", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText(movieFixture.overview!)).toBeInTheDocument()
  })

  it("does not render overview when not provided", () => {
    const itemWithoutOverview = { ...movieFixture, overview: undefined }
    render(<MediaDetail item={itemWithoutOverview} />)
    expect(screen.queryByText(movieFixture.overview!)).not.toBeInTheDocument()
  })

  it("renders the score badge when normalizedScore is present", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText("82")).toBeInTheDocument()
  })

  it("does not render the score badge when normalizedScore is null", () => {
    render(<MediaDetail item={noRatingsFixture} />)
    // The score badge should not be present at all
    const badges = screen.queryAllByText(/^\d+$/)
    // There should be no standalone number badges (the ratings bar has its own format)
    expect(badges.filter(el => el.closest("[data-testid='score-badge']"))).toHaveLength(0)
  })

  it("renders the score badge and ratings bar in the same row", () => {
    const { container } = render(<MediaDetail item={movieFixture} />)
    const ratingsRow = container.querySelector("[data-testid='ratings-row']")
    expect(ratingsRow).toBeInTheDocument()
    // The row should contain both the score badge and the ratings bar
    expect(ratingsRow!.querySelector("[data-testid='score-badge']")).toBeInTheDocument()
    expect(ratingsRow!.textContent).toContain("RT Critics")
  })

  it("renders ratings from the ratings bar", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText("RT Critics")).toBeInTheDocument()
    expect(screen.getByText("Metacritic")).toBeInTheDocument()
    expect(screen.getByText("IMDb")).toBeInTheDocument()
  })

  it("renders the trailer placeholder", () => {
    render(<MediaDetail item={movieFixture} />)
    expect(screen.getByText("Trailer")).toBeInTheDocument()
  })

  describe("close button", () => {
    it("renders a close button", () => {
      render(<MediaDetail item={movieFixture} onClose={() => {}} />)
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument()
    })

    it("calls onClose when the close button is clicked", async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(<MediaDetail item={movieFixture} onClose={onClose} />)
      await user.click(screen.getByRole("button", { name: /close/i }))
      expect(onClose).toHaveBeenCalledOnce()
    })

    it("does not render the close button when onClose is not provided", () => {
      render(<MediaDetail item={movieFixture} />)
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
    })
  })

  describe("action button", () => {
    it("shows add button when not on watchlist", () => {
      render(<MediaDetail item={movieFixture} isOnWatchlist={false} onAction={() => {}} />)
      expect(screen.getByRole("button", { name: /add to watchlist/i })).toBeInTheDocument()
    })

    it("shows remove button when on watchlist", () => {
      render(<MediaDetail item={movieFixture} isOnWatchlist={true} onAction={() => {}} />)
      expect(screen.getByRole("button", { name: /remove from watchlist/i })).toBeInTheDocument()
    })

    it("calls onAction with the item when clicked", async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()
      render(<MediaDetail item={movieFixture} isOnWatchlist={false} onAction={onAction} />)
      await user.click(screen.getByRole("button", { name: /add to watchlist/i }))
      expect(onAction).toHaveBeenCalledOnce()
      expect(onAction).toHaveBeenCalledWith(movieFixture)
    })

    it("does not render the action button when onAction is not provided", () => {
      render(<MediaDetail item={movieFixture} />)
      expect(screen.queryByRole("button", { name: /add to watchlist/i })).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: /remove from watchlist/i }),
      ).not.toBeInTheDocument()
    })
  })
})
