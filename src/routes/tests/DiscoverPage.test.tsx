import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { movieFixture } from "@/lib/fixtures"

const navigate = vi.fn()
const add = vi.fn()
const remove = vi.fn()

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")
  return {
    ...actual,
    useNavigate: () => navigate,
    useOutletContext: () => ({
      mediaType: "movie",
      watchlist: { add, remove, items: [], isOnWatchlist: () => false },
      watchlistMediaItems: [],
      watchlistIds: new Set(),
    }),
  }
})

vi.mock("@/hooks/useDiscover", () => ({
  useDiscover: () => ({ items: [movieFixture], isLoading: false, error: null }),
}))

import { DiscoverPage } from "../DiscoverPage"

describe("DiscoverPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders discovered items and adds them to the watchlist", async () => {
    const user = userEvent.setup()

    render(<DiscoverPage />)

    expect(screen.getByText(movieFixture.title)).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /add/i }))
    expect(add).toHaveBeenCalledWith(movieFixture)
  })

  it("navigates to detail with the enriched item in router state", async () => {
    const user = userEvent.setup()

    render(<DiscoverPage />)

    await user.click(screen.getByRole("article"))
    expect(navigate).toHaveBeenCalledWith("/movies/550", { state: { item: movieFixture } })
  })
})
