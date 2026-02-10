import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { AppShell } from "@/components/AppShell"

describe("AppShell", () => {
  /** Default props for rendering the AppShell in tests. */
  const defaultProps = {
    searchValue: "",
    onSearchChange: vi.fn(),
    onSearchSubmit: vi.fn(),
    onSearchClear: vi.fn(),
    activeTab: "discover" as const,
    onTabChange: vi.fn(),
    mediaType: "movie" as const,
    onMediaTypeChange: vi.fn(),
  }

  it("renders the SearchBar", () => {
    render(<AppShell {...defaultProps}>content</AppShell>)
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })

  it("renders the TabBar with both tabs", () => {
    render(<AppShell {...defaultProps}>content</AppShell>)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /discover/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /watchlist/i })).toBeInTheDocument()
  })

  it("renders the MediaToggle with both options", () => {
    render(<AppShell {...defaultProps}>content</AppShell>)
    expect(screen.getByRole("button", { name: /movies/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /tv shows/i })).toBeInTheDocument()
  })

  it("renders children in the content area", () => {
    render(
      <AppShell {...defaultProps}>
        <div data-testid="child-content">Hello world</div>
      </AppShell>,
    )
    expect(screen.getByTestId("child-content")).toBeInTheDocument()
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("passes search value to SearchBar", () => {
    render(
      <AppShell {...defaultProps} searchValue="batman">
        content
      </AppShell>,
    )
    expect(screen.getByRole("searchbox")).toHaveValue("batman")
  })

  it("passes activeTab to TabBar", () => {
    render(
      <AppShell {...defaultProps} activeTab="watchlist">
        content
      </AppShell>,
    )
    const watchlistTab = screen.getByRole("tab", { name: /watchlist/i })
    expect(watchlistTab).toHaveAttribute("aria-selected", "true")
  })

  it("passes mediaType to MediaToggle", () => {
    render(
      <AppShell {...defaultProps} mediaType="tv">
        content
      </AppShell>,
    )
    const tvButton = screen.getByRole("button", { name: /tv shows/i })
    expect(tvButton).toHaveAttribute("aria-pressed", "true")
  })

  it("calls onSearchChange when typing in the search bar", async () => {
    const onSearchChange = vi.fn()
    render(
      <AppShell {...defaultProps} onSearchChange={onSearchChange}>
        content
      </AppShell>,
    )
    const input = screen.getByRole("searchbox")
    await userEvent.type(input, "a")
    expect(onSearchChange).toHaveBeenCalledWith("a")
  })

  it("calls onTabChange when clicking a tab", async () => {
    const onTabChange = vi.fn()
    render(
      <AppShell {...defaultProps} onTabChange={onTabChange}>
        content
      </AppShell>,
    )
    const watchlistTab = screen.getByRole("tab", { name: /watchlist/i })
    await userEvent.click(watchlistTab)
    expect(onTabChange).toHaveBeenCalledWith("watchlist")
  })

  it("calls onMediaTypeChange when clicking a media toggle", async () => {
    const onMediaTypeChange = vi.fn()
    render(
      <AppShell {...defaultProps} onMediaTypeChange={onMediaTypeChange}>
        content
      </AppShell>,
    )
    const tvButton = screen.getByRole("button", { name: /tv shows/i })
    await userEvent.click(tvButton)
    expect(onMediaTypeChange).toHaveBeenCalledWith("tv")
  })
})
