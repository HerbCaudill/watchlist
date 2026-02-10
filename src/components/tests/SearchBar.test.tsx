import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { SearchBar } from "@/components/SearchBar"

describe("SearchBar", () => {
  it("renders an input with the given value", () => {
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={() => {}} />)
    const input = screen.getByRole("searchbox")
    expect(input).toHaveValue("batman")
  })

  it("calls onChange when the user types", async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} onSubmit={() => {}} />)
    const input = screen.getByRole("searchbox")
    await userEvent.type(input, "a")
    expect(onChange).toHaveBeenCalledWith("a")
  })

  it("calls onSubmit when the user presses Enter", () => {
    const onSubmit = vi.fn()
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={onSubmit} />)
    const input = screen.getByRole("searchbox")
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("does not call onSubmit on other key presses", () => {
    const onSubmit = vi.fn()
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={onSubmit} />)
    const input = screen.getByRole("searchbox")
    fireEvent.keyDown(input, { key: "a" })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("shows a clear button when value is non-empty and onClear is provided", () => {
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={() => {}} onClear={() => {}} />)
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument()
  })

  it("does not show a clear button when value is empty", () => {
    render(<SearchBar value="" onChange={() => {}} onSubmit={() => {}} onClear={() => {}} />)
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument()
  })

  it("does not show a clear button when onClear is not provided", () => {
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={() => {}} />)
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument()
  })

  it("calls onClear when the clear button is clicked", async () => {
    const onClear = vi.fn()
    render(<SearchBar value="batman" onChange={() => {}} onSubmit={() => {}} onClear={onClear} />)
    const clearButton = screen.getByRole("button", { name: /clear/i })
    await userEvent.click(clearButton)
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it("has a search icon", () => {
    render(<SearchBar value="" onChange={() => {}} onSubmit={() => {}} />)
    expect(screen.getByTestId("search-icon")).toBeInTheDocument()
  })

  it("has placeholder text", () => {
    render(<SearchBar value="" onChange={() => {}} onSubmit={() => {}} />)
    const input = screen.getByRole("searchbox")
    expect(input).toHaveAttribute("placeholder")
  })
})
