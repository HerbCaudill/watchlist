import type { Meta, StoryObj } from "@storybook/react"
import { fixtures, movieFixture, tvShowFixture } from "@/lib/fixtures"
import { WatchlistView } from "../WatchlistView"

const meta: Meta<typeof WatchlistView> = {
  title: "Components/WatchlistView",
  component: WatchlistView,
}

export default meta
type Story = StoryObj<typeof WatchlistView>

/** Full watchlist with several items and remove buttons. */
export const Default: Story = {
  args: {
    items: fixtures,
    onRemove: () => {},
    onSelect: () => {},
  },
}

/** Watchlist with only two items. */
export const FewItems: Story = {
  args: {
    items: [movieFixture, tvShowFixture],
    onRemove: () => {},
    onSelect: () => {},
  },
}

/** Empty watchlist showing the placeholder message. */
export const Empty: Story = {
  args: {
    items: [],
  },
}

/** Watchlist without remove buttons (onRemove not provided). */
export const NoRemoveAction: Story = {
  args: {
    items: fixtures,
    onSelect: () => {},
  },
}
