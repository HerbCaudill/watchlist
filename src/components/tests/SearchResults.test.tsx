import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { movieFixture, tvShowFixture, noPosterFixture, fixtures } from "@/lib/fixtures"
import { SearchResults } from "../SearchResults"

describe("SearchResults", () => {
  describe("grid rendering", () => {
    it("renders a MediaCard for each item", () => {
      render(<SearchResults items={fixtures} watchlistIds={new Set()} />)
      for (const item of fixtures) {
        expect(screen.getByText(item.title)).toBeInTheDocument()
      }
    })

    it("renders no cards when items is empty and not loading", () => {
      render(<SearchResults items={[]} watchlistIds={new Set()} />)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })
  })

  describe("watchlist state", () => {
    it("marks items as on watchlist when their id is in watchlistIds", () => {
      const watchlistIds = new Set([movieFixture.id])
      render(
        <SearchResults
          items={[movieFixture, tvShowFixture]}
          watchlistIds={watchlistIds}
          onAdd={() => {}}
        />,
      )
      expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
    })

    it("marks all items as not on watchlist when watchlistIds is empty", () => {
      render(
        <SearchResults
          items={[movieFixture, tvShowFixture]}
          watchlistIds={new Set()}
          onAdd={() => {}}
        />,
      )
      const addButtons = screen.getAllByRole("button", { name: /add/i })
      expect(addButtons).toHaveLength(2)
    })
  })

  describe("onAdd callback", () => {
    it("passes onAdd as onAction to MediaCard", async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SearchResults items={[movieFixture]} watchlistIds={new Set()} onAdd={onAdd} />)
      await user.click(screen.getByRole("button", { name: /add/i }))
      expect(onAdd).toHaveBeenCalledOnce()
      expect(onAdd).toHaveBeenCalledWith(movieFixture)
    })

    it("hides action buttons when onAdd is not provided", () => {
      render(<SearchResults items={[movieFixture]} watchlistIds={new Set()} />)
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })
  })

  describe("loading state", () => {
    it("shows loading indicator when isLoading is true", () => {
      render(<SearchResults items={[]} watchlistIds={new Set()} isLoading={true} />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it("does not show loading indicator when isLoading is false", () => {
      render(<SearchResults items={[]} watchlistIds={new Set()} isLoading={false} />)
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  describe("empty state", () => {
    it("shows empty message when items is empty and not loading", () => {
      render(<SearchResults items={[]} watchlistIds={new Set()} />)
      expect(screen.getByText(/no results/i)).toBeInTheDocument()
    })

    it("does not show empty message when loading", () => {
      render(<SearchResults items={[]} watchlistIds={new Set()} isLoading={true} />)
      expect(screen.queryByText(/no results/i)).not.toBeInTheDocument()
    })

    it("does not show empty message when items are present", () => {
      render(<SearchResults items={[movieFixture]} watchlistIds={new Set()} />)
      expect(screen.queryByText(/no results/i)).not.toBeInTheDocument()
    })
  })
})
