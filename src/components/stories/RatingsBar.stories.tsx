import type { Meta, StoryObj } from "@storybook/react"
import { RatingsBar } from "../RatingsBar"

const meta: Meta<typeof RatingsBar> = {
  title: "Components/RatingsBar",
  component: RatingsBar,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof RatingsBar>

/** All three rating sources present. */
export const AllRatings: Story = {
  args: {
    ratings: {
      rottenTomatoes: { critics: 92, audience: 88 },
      metacritic: 75,
      imdb: { score: 8.5, votes: 1200000 },
    },
  },
}

/** Only Rotten Tomatoes critics score. */
export const OnlyRottenTomatoes: Story = {
  args: {
    ratings: {
      rottenTomatoes: { critics: 45 },
    },
  },
}

/** Only Metacritic score. */
export const OnlyMetacritic: Story = {
  args: {
    ratings: {
      metacritic: 60,
    },
  },
}

/** Only IMDb score with vote count. */
export const OnlyImdb: Story = {
  args: {
    ratings: {
      imdb: { score: 7.2, votes: 50000 },
    },
  },
}

/** No ratings present at all. */
export const NoRatings: Story = {
  args: {
    ratings: {},
  },
}

/** High scores across all sources. */
export const HighScores: Story = {
  args: {
    ratings: {
      rottenTomatoes: { critics: 96, audience: 98 },
      metacritic: 87,
      imdb: { score: 9.5, votes: 2000000 },
    },
  },
}

/** Low scores across all sources. */
export const LowScores: Story = {
  args: {
    ratings: {
      rottenTomatoes: { critics: 25, audience: 30 },
      metacritic: 32,
      imdb: { score: 3.4, votes: 8500 },
    },
  },
}
