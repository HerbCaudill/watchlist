import type { Meta, StoryObj } from "@storybook/react"
import {
  movieFixture,
  tvShowFixture,
  noPosterFixture,
  noRatingsFixture,
  longTitleFixture,
} from "@/lib/fixtures"
import { MediaDetail } from "../MediaDetail"

const meta: Meta<typeof MediaDetail> = {
  title: "Components/MediaDetail",
  component: MediaDetail,
}

export default meta
type Story = StoryObj<typeof MediaDetail>

/** Full detail view of a movie with all sections visible. */
export const Movie: Story = {
  args: {
    item: movieFixture,
    isOnWatchlist: false,
    onAction: () => {},
    onClose: () => {},
  },
}

/** Full detail view of a TV show. */
export const TvShow: Story = {
  args: {
    item: tvShowFixture,
    isOnWatchlist: false,
    onAction: () => {},
    onClose: () => {},
  },
}

/** Detail view when the item is already on the watchlist, showing the remove button. */
export const OnWatchlist: Story = {
  args: {
    item: movieFixture,
    isOnWatchlist: true,
    onAction: () => {},
    onClose: () => {},
  },
}

/** Detail view without action or close buttons. */
export const NoActions: Story = {
  args: {
    item: movieFixture,
  },
}

/** Detail view with a poster placeholder instead of an image. */
export const NoPoster: Story = {
  args: {
    item: noPosterFixture,
    isOnWatchlist: false,
    onAction: () => {},
    onClose: () => {},
  },
}

/** Detail view with no ratings data. */
export const NoRatings: Story = {
  args: {
    item: noRatingsFixture,
    isOnWatchlist: false,
    onAction: () => {},
    onClose: () => {},
  },
}

/** Detail view with a very long title. */
export const LongTitle: Story = {
  args: {
    item: longTitleFixture,
    isOnWatchlist: false,
    onAction: () => {},
    onClose: () => {},
  },
}
