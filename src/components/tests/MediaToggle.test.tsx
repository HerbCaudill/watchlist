import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { MediaToggle } from "@/components/MediaToggle"

describe("MediaToggle", () => {
  it("renders Movies and TV buttons", () => {
    render(<MediaToggle value="movie" onChange={() => {}} />)
    expect(screen.getByRole("button", { name: /movies/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /tv/i })).toBeInTheDocument()
  })

  it("shows the Movies button as active when value is 'movie'", () => {
    render(<MediaToggle value="movie" onChange={() => {}} />)
    const moviesButton = screen.getByRole("button", { name: /movies/i })
    const tvButton = screen.getByRole("button", { name: /tv/i })
    expect(moviesButton).toHaveAttribute("aria-pressed", "true")
    expect(tvButton).toHaveAttribute("aria-pressed", "false")
  })

  it("shows the TV button as active when value is 'tv'", () => {
    render(<MediaToggle value="tv" onChange={() => {}} />)
    const moviesButton = screen.getByRole("button", { name: /movies/i })
    const tvButton = screen.getByRole("button", { name: /tv/i })
    expect(moviesButton).toHaveAttribute("aria-pressed", "false")
    expect(tvButton).toHaveAttribute("aria-pressed", "true")
  })

  it("calls onChange with 'tv' when clicking TV while Movies is active", async () => {
    const onChange = vi.fn()
    render(<MediaToggle value="movie" onChange={onChange} />)
    const tvButton = screen.getByRole("button", { name: /tv/i })
    await userEvent.click(tvButton)
    expect(onChange).toHaveBeenCalledWith("tv")
  })

  it("calls onChange with 'movie' when clicking Movies while TV is active", async () => {
    const onChange = vi.fn()
    render(<MediaToggle value="tv" onChange={onChange} />)
    const moviesButton = screen.getByRole("button", { name: /movies/i })
    await userEvent.click(moviesButton)
    expect(onChange).toHaveBeenCalledWith("movie")
  })

  it("does not call onChange when clicking the already-active button", async () => {
    const onChange = vi.fn()
    render(<MediaToggle value="movie" onChange={onChange} />)
    const moviesButton = screen.getByRole("button", { name: /movies/i })
    await userEvent.click(moviesButton)
    expect(onChange).not.toHaveBeenCalled()
  })
})
