import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { movieFixture, tvShowFixture, noPosterFixture } from "@/lib/fixtures"
import { WatchlistView } from "../WatchlistView"

describe("WatchlistView", () => {
  const items = [movieFixture, tvShowFixture, noPosterFixture]

  describe("grid rendering", () => {
    it("renders a card for each item", () => {
      render(<WatchlistView items={items} />)
      expect(screen.getByText("Fight Club")).toBeInTheDocument()
      expect(screen.getByText("Breaking Bad")).toBeInTheDocument()
      expect(screen.getByText("The Obscure Indie Film")).toBeInTheDocument()
    })

    it("renders all items as on-watchlist (remove buttons)", () => {
      render(<WatchlistView items={items} onRemove={() => {}} />)
      const removeButtons = screen.getAllByRole("button", { name: /remove/i })
      expect(removeButtons).toHaveLength(3)
    })
  })

  describe("remove action", () => {
    it("calls onRemove with the item when the remove button is clicked", async () => {
      const user = userEvent.setup()
      const onRemove = vi.fn()
      render(<WatchlistView items={items} onRemove={onRemove} />)
      const removeButtons = screen.getAllByRole("button", { name: /remove/i })
      await user.click(removeButtons[0])
      expect(onRemove).toHaveBeenCalledOnce()
      expect(onRemove).toHaveBeenCalledWith(movieFixture)
    })

    it("does not render remove buttons when onRemove is not provided", () => {
      render(<WatchlistView items={items} />)
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument()
    })
  })

  describe("select behavior", () => {
    it("calls onSelect with the item when a card is clicked", async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(<WatchlistView items={items} onSelect={onSelect} />)
      await user.click(screen.getByText("Fight Club"))
      expect(onSelect).toHaveBeenCalledOnce()
      expect(onSelect).toHaveBeenCalledWith(movieFixture)
    })

    it("does not throw when a card is clicked without onSelect", async () => {
      const user = userEvent.setup()
      render(<WatchlistView items={items} />)
      await user.click(screen.getByText("Fight Club"))
      // no error expected
    })

    it("does not call onSelect when the remove button is clicked", async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      const onRemove = vi.fn()
      render(<WatchlistView items={items} onSelect={onSelect} onRemove={onRemove} />)
      const removeButtons = screen.getAllByRole("button", { name: /remove/i })
      await user.click(removeButtons[0])
      expect(onRemove).toHaveBeenCalledOnce()
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe("empty state", () => {
    it("shows an empty message when items is empty", () => {
      render(<WatchlistView items={[]} />)
      expect(screen.getByText(/your watchlist is empty/i)).toBeInTheDocument()
    })

    it("does not show the empty message when items are present", () => {
      render(<WatchlistView items={items} />)
      expect(screen.queryByText(/your watchlist is empty/i)).not.toBeInTheDocument()
    })
  })
})
