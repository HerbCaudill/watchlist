import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ScoreBadge } from "../ScoreBadge"

describe("ScoreBadge", () => {
  it("renders the score without a percent sign", () => {
    render(<ScoreBadge score={85} />)
    expect(screen.getByText("85")).toBeInTheDocument()
    expect(screen.queryByText("85%")).not.toBeInTheDocument()
  })

  it("renders a score of 0", () => {
    render(<ScoreBadge score={0} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("renders a score of 100", () => {
    render(<ScoreBadge score={100} />)
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  describe("color coding", () => {
    it("uses green for scores >= 70", () => {
      const { container } = render(<ScoreBadge score={70} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-green/)
    })

    it("uses green for high scores", () => {
      const { container } = render(<ScoreBadge score={95} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-green/)
    })

    it("uses yellow for scores >= 50 and < 70", () => {
      const { container } = render(<ScoreBadge score={50} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-yellow/)
    })

    it("uses yellow for scores at 69", () => {
      const { container } = render(<ScoreBadge score={69} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-yellow/)
    })

    it("uses red for scores < 50", () => {
      const { container } = render(<ScoreBadge score={49} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-red/)
    })

    it("uses red for very low scores", () => {
      const { container } = render(<ScoreBadge score={10} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/bg-red/)
    })
  })

  describe("size prop", () => {
    it("defaults to md size", () => {
      const { container } = render(<ScoreBadge score={75} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/text-sm/)
    })

    it("renders sm size", () => {
      const { container } = render(<ScoreBadge score={75} size="sm" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/text-xs/)
    })

    it("renders md size", () => {
      const { container } = render(<ScoreBadge score={75} size="md" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/text-sm/)
    })

    it("renders lg size", () => {
      const { container } = render(<ScoreBadge score={75} size="lg" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toMatch(/text-3xl/)
    })
  })
})
