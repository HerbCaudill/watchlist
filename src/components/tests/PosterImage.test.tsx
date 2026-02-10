import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PosterImage } from "../PosterImage"

describe("PosterImage", () => {
  it("renders an image when src is provided", () => {
    render(<PosterImage src="https://example.com/poster.jpg" alt="Test Movie" />)
    const img = screen.getByRole("img", { name: "Test Movie" })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "https://example.com/poster.jpg")
  })

  it("renders alt text on the image", () => {
    render(<PosterImage src="https://example.com/poster.jpg" alt="My Movie Poster" />)
    const img = screen.getByRole("img", { name: "My Movie Poster" })
    expect(img).toBeInTheDocument()
  })

  it("renders a placeholder when src is not provided", () => {
    render(<PosterImage alt="No Poster" />)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(screen.getByLabelText("No Poster")).toBeInTheDocument()
  })

  it("renders a placeholder when src is undefined", () => {
    render(<PosterImage src={undefined} alt="Missing Poster" />)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Missing Poster")).toBeInTheDocument()
  })

  it("defaults to md size", () => {
    const { container } = render(
      <PosterImage src="https://example.com/poster.jpg" alt="Default Size" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("w-32")
  })

  it("applies sm size classes", () => {
    const { container } = render(
      <PosterImage src="https://example.com/poster.jpg" alt="Small Poster" size="sm" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("w-20")
  })

  it("applies md size classes", () => {
    const { container } = render(
      <PosterImage src="https://example.com/poster.jpg" alt="Medium Poster" size="md" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("w-32")
  })

  it("applies lg size classes", () => {
    const { container } = render(
      <PosterImage src="https://example.com/poster.jpg" alt="Large Poster" size="lg" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("w-48")
  })

  it("maintains 2:3 aspect ratio", () => {
    const { container } = render(
      <PosterImage src="https://example.com/poster.jpg" alt="Aspect Ratio Test" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("aspect-2/3")
  })

  it("maintains 2:3 aspect ratio on placeholder", () => {
    const { container } = render(<PosterImage alt="Placeholder Aspect" />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("aspect-2/3")
  })
})
