import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { movieFixture, tvShowFixture } from "@/lib/fixtures"
import { MediaGrid } from "../MediaGrid"

describe("MediaGrid", () => {
  it("shows loading, empty, and error states", () => {
    const { rerender } = render(<MediaGrid items={[]} watchlistIds={new Set()} isLoading />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    rerender(
      <MediaGrid items={[]} watchlistIds={new Set()} error="Couldn’t load discover results" />,
    )
    expect(screen.getByText("Couldn’t load discover results")).toBeInTheDocument()

    rerender(<MediaGrid items={[]} watchlistIds={new Set()} />)
    expect(screen.getByText("No results")).toBeInTheDocument()
  })

  it("renders cards with watchlist state and action callbacks", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()

    render(
      <MediaGrid
        items={[movieFixture, tvShowFixture]}
        watchlistIds={new Set([movieFixture.id])}
        onAction={onAction}
      />,
    )

    expect(screen.getByText(movieFixture.title)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /add/i }))
    expect(onAction).toHaveBeenCalledWith(tvShowFixture)
  })

  it("selects cards while ignoring action-button clicks", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onSelect = vi.fn()

    render(
      <MediaGrid
        items={[movieFixture]}
        watchlistIds={new Set()}
        onAction={onAction}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole("button", { name: /add/i }))
    expect(onAction).toHaveBeenCalledWith(movieFixture)
    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByRole("article"))
    expect(onSelect).toHaveBeenCalledWith(movieFixture)
  })
})
