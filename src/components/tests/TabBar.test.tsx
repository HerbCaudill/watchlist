import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TabBar } from "@/components/TabBar"

describe("TabBar", () => {
  it("renders both Discover and Watchlist tabs", () => {
    render(<TabBar activeTab="discover" onTabChange={() => {}} />)
    expect(screen.getByRole("tab", { name: /discover/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /watchlist/i })).toBeInTheDocument()
  })

  it("marks the active tab as selected", () => {
    render(<TabBar activeTab="discover" onTabChange={() => {}} />)
    expect(screen.getByRole("tab", { name: /discover/i })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tab", { name: /watchlist/i })).toHaveAttribute(
      "aria-selected",
      "false",
    )
  })

  it("marks the watchlist tab as selected when activeTab is watchlist", () => {
    render(<TabBar activeTab="watchlist" onTabChange={() => {}} />)
    expect(screen.getByRole("tab", { name: /discover/i })).toHaveAttribute("aria-selected", "false")
    expect(screen.getByRole("tab", { name: /watchlist/i })).toHaveAttribute("aria-selected", "true")
  })

  it("calls onTabChange with 'watchlist' when the Watchlist tab is clicked", async () => {
    const onTabChange = vi.fn()
    render(<TabBar activeTab="discover" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole("tab", { name: /watchlist/i }))
    expect(onTabChange).toHaveBeenCalledWith("watchlist")
  })

  it("calls onTabChange with 'discover' when the Discover tab is clicked", async () => {
    const onTabChange = vi.fn()
    render(<TabBar activeTab="watchlist" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole("tab", { name: /discover/i }))
    expect(onTabChange).toHaveBeenCalledWith("discover")
  })

  it("renders inside a tablist role", () => {
    render(<TabBar activeTab="discover" onTabChange={() => {}} />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })

  it("renders Watchlist tab before Discover tab", () => {
    render(<TabBar activeTab="watchlist" onTabChange={() => {}} />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs[0]).toHaveTextContent("Watchlist")
    expect(tabs[1]).toHaveTextContent("Discover")
  })
})
