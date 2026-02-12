import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { AppShell } from "@/components/AppShell"

describe("AppShell", () => {
  /** Default props for rendering the AppShell in tests. */
  const defaultProps = {
    searchSlot: <input role="searchbox" placeholder="Search..." />,
    activeTab: "discover" as const,
    onTabChange: vi.fn(),
    mediaType: "movie" as const,
    onMediaTypeChange: vi.fn(),
  }

  it("renders the search slot", () => {
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
    expect(screen.getByRole("button", { name: /tv/i })).toBeInTheDocument()
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
    const tvButton = screen.getByRole("button", { name: /tv/i })
    expect(tvButton).toHaveAttribute("aria-pressed", "true")
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
    const tvButton = screen.getByRole("button", { name: /tv/i })
    await userEvent.click(tvButton)
    expect(onMediaTypeChange).toHaveBeenCalledWith("tv")
  })

  describe("showTabs prop", () => {
    it("shows the tab bar by default", () => {
      render(<AppShell {...defaultProps}>content</AppShell>)
      expect(screen.getByRole("tablist")).toBeInTheDocument()
    })

    it("shows the tab bar when showTabs is true", () => {
      render(
        <AppShell {...defaultProps} showTabs={true}>
          content
        </AppShell>,
      )
      expect(screen.getByRole("tablist")).toBeInTheDocument()
    })

    it("hides the tab bar when showTabs is false", () => {
      render(
        <AppShell {...defaultProps} showTabs={false}>
          content
        </AppShell>,
      )
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
    })

    it("renders without activeTab and onTabChange when showTabs is false", () => {
      render(
        <AppShell
          searchSlot={<input role="searchbox" placeholder="Search..." />}
          mediaType="movie"
          onMediaTypeChange={vi.fn()}
          showTabs={false}
        >
          content
        </AppShell>,
      )
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
      expect(screen.getByText("content")).toBeInTheDocument()
    })
  })
})
