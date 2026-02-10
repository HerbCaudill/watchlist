import type { Meta, StoryObj } from "@storybook/react"
import {
  movieFixture,
  tvShowFixture,
  noPosterFixture,
  noRatingsFixture,
  longTitleFixture,
} from "@/lib/fixtures"
import { MediaCard } from "../MediaCard"

const meta: Meta<typeof MediaCard> = {
  title: "Components/MediaCard",
  component: MediaCard,
}

export default meta
type Story = StoryObj<typeof MediaCard>

/** A movie card with poster, score, and add button. */
export const Movie: Story = {
  args: {
    item: movieFixture,
    isOnWatchlist: false,
    onAction: () => {},
  },
}

/** A TV show card with poster, score, and add button. */
export const TvShow: Story = {
  args: {
    item: tvShowFixture,
    isOnWatchlist: false,
    onAction: () => {},
  },
}

/** Card showing the remove button when already on the watchlist. */
export const OnWatchlist: Story = {
  args: {
    item: movieFixture,
    isOnWatchlist: true,
    onAction: () => {},
  },
}

/** Card without an action button (no onAction handler). */
export const NoAction: Story = {
  args: {
    item: movieFixture,
  },
}

/** Card with a placeholder instead of a poster image. */
export const NoPoster: Story = {
  args: {
    item: noPosterFixture,
    isOnWatchlist: false,
    onAction: () => {},
  },
}

/** Card with no score badge (normalizedScore is null). */
export const NoRatings: Story = {
  args: {
    item: noRatingsFixture,
    isOnWatchlist: false,
    onAction: () => {},
  },
}

/** Card with a very long title that gets clamped. */
export const LongTitle: Story = {
  args: {
    item: longTitleFixture,
    isOnWatchlist: false,
    onAction: () => {},
  },
}

/** Multiple cards side by side showing variety. */
export const Grid: Story = {
  render: () => (
    <div className="flex gap-4">
      <MediaCard item={movieFixture} isOnWatchlist={false} onAction={() => {}} />
      <MediaCard item={tvShowFixture} isOnWatchlist={true} onAction={() => {}} />
      <MediaCard item={noPosterFixture} isOnWatchlist={false} onAction={() => {}} />
      <MediaCard item={noRatingsFixture} onAction={() => {}} />
      <MediaCard item={longTitleFixture} isOnWatchlist={false} onAction={() => {}} />
    </div>
  ),
}
