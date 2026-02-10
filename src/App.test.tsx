import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { App } from "./App"

/** Mock the useSearch hook. */
const mockSearch = vi.fn()
const mockSetQuery = vi.fn()

vi.mock("@/hooks/useSearch", () => ({
  useSearch: () => ({
    query: "",
    setQuery: mockSetQuery,
    search: mockSearch,
    results: [],
    isLoading: false,
  }),
}))

/** Mock the useWatchlist hook. */
vi.mock("@/hooks/useWatchlist", () => ({
  useWatchlist: () => ({
    items: [],
    add: vi.fn(),
    remove: vi.fn(),
    isOnWatchlist: () => false,
  }),
}))

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the discover tab with placeholder by default", () => {
    render(<App />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })

  it("renders a search input", () => {
    render(<App />)
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })

  it("renders Discover and Watchlist tabs", () => {
    render(<App />)
    expect(screen.getByRole("tab", { name: /discover/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /watchlist/i })).toBeInTheDocument()
  })

  it("switches to watchlist tab showing empty state", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole("tab", { name: /watchlist/i }))
    expect(screen.getByText("Your watchlist is empty")).toBeInTheDocument()
  })
})
