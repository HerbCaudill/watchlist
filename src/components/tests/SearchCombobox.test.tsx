import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { movieFixture, tvShowFixture } from "@/lib/fixtures"
import { SearchCombobox } from "../SearchCombobox"

/** Polyfill ResizeObserver for jsdom (required by cmdk). */
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
})

/** Default props for rendering SearchCombobox in tests. */
const defaultProps = {
  query: "fight",
  onQueryChange: vi.fn(),
  results: [movieFixture, tvShowFixture],
  isLoading: false,
  watchlistIds: new Set<string>(),
  onSelect: vi.fn(),
  onAdd: vi.fn(),
  onClear: vi.fn(),
}

/** Render SearchCombobox with the dropdown open (requires query + focus). */
function renderWithDropdown(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides }
  const result = render(<SearchCombobox {...props} />)
  return result
}

describe("SearchCombobox", () => {
  describe("add to watchlist button", () => {
    it("shows an add button for items NOT on the watchlist", () => {
      renderWithDropdown({ watchlistIds: new Set<string>() })
      const addButtons = screen.getAllByRole("button", { name: /add to watchlist/i })
      expect(addButtons).toHaveLength(2)
    })

    it("shows a checkmark (no add button) for items already on the watchlist", () => {
      renderWithDropdown({ watchlistIds: new Set([movieFixture.id, tvShowFixture.id]) })
      expect(screen.queryByRole("button", { name: /add to watchlist/i })).not.toBeInTheDocument()
    })

    it("shows add button only for items not on watchlist in a mixed list", () => {
      renderWithDropdown({ watchlistIds: new Set([movieFixture.id]) })
      const addButtons = screen.getAllByRole("button", { name: /add to watchlist/i })
      expect(addButtons).toHaveLength(1)
    })

    it("calls onAdd with the item when the add button is clicked", async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      renderWithDropdown({ onAdd, watchlistIds: new Set<string>() })
      const addButtons = screen.getAllByRole("button", { name: /add to watchlist/i })
      await user.click(addButtons[0])
      expect(onAdd).toHaveBeenCalledOnce()
      expect(onAdd).toHaveBeenCalledWith(movieFixture)
    })

    it("does not call onSelect when the add button is clicked", async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      const onAdd = vi.fn()
      renderWithDropdown({ onSelect, onAdd, watchlistIds: new Set<string>() })
      const addButtons = screen.getAllByRole("button", { name: /add to watchlist/i })
      await user.click(addButtons[0])
      expect(onSelect).not.toHaveBeenCalled()
    })

    it("does not show add buttons when onAdd is not provided", () => {
      const props = { ...defaultProps }
      delete (props as any).onAdd
      render(<SearchCombobox {...props} onAdd={undefined} />)
      expect(screen.queryByRole("button", { name: /add to watchlist/i })).not.toBeInTheDocument()
    })
  })
})
