import type { Meta, StoryObj } from "@storybook/react"
import { fixtures, movieFixture, tvShowFixture } from "@/lib/fixtures"
import { SearchResults } from "../SearchResults"

const meta: Meta<typeof SearchResults> = {
  title: "Components/SearchResults",
  component: SearchResults,
}

export default meta
type Story = StoryObj<typeof SearchResults>

/** Full grid with a mix of movies and TV shows. */
export const Default: Story = {
  args: {
    items: fixtures,
    watchlistIds: new Set([movieFixture.id]),
    onAdd: () => {},
  },
}

/** Grid where all items are already on the watchlist. */
export const AllOnWatchlist: Story = {
  args: {
    items: fixtures,
    watchlistIds: new Set(fixtures.map(f => f.id)),
    onAdd: () => {},
  },
}

/** Grid where no items are on the watchlist. */
export const NoneOnWatchlist: Story = {
  args: {
    items: fixtures,
    watchlistIds: new Set(),
    onAdd: () => {},
  },
}

/** Loading state shown while fetching results. */
export const Loading: Story = {
  args: {
    items: [],
    watchlistIds: new Set(),
    isLoading: true,
  },
}

/** Empty state when search returns no results. */
export const Empty: Story = {
  args: {
    items: [],
    watchlistIds: new Set(),
  },
}

/** Grid with only two items. */
export const FewResults: Story = {
  args: {
    items: [movieFixture, tvShowFixture],
    watchlistIds: new Set([tvShowFixture.id]),
    onAdd: () => {},
  },
}
