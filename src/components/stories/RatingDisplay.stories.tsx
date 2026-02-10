import type { Meta, StoryObj } from "@storybook/react"
import { RatingDisplay } from "../RatingDisplay"

const meta: Meta<typeof RatingDisplay> = {
  title: "Components/RatingDisplay",
  component: RatingDisplay,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    score: { control: { type: "range", min: 0, max: 100 } },
  },
}

export default meta
type Story = StoryObj<typeof RatingDisplay>

/** High-scoring Rotten Tomatoes critics rating. */
export const HighScore: Story = {
  args: {
    label: "RT Critics",
    value: "92%",
    score: 92,
  },
}

/** Medium-scoring Metacritic rating in the yellow range. */
export const MediumScore: Story = {
  args: {
    label: "Metacritic",
    value: "65",
    score: 65,
  },
}

/** Low-scoring rating in the red range. */
export const LowScore: Story = {
  args: {
    label: "RT Audience",
    value: "35%",
    score: 35,
  },
}

/** IMDb rating with vote count as subtext. */
export const WithSubtext: Story = {
  args: {
    label: "IMDb",
    value: "8.5/10",
    score: 85,
    subtext: "1.2M votes",
  },
}

/** Boundary case: score at exactly 70 (green). */
export const BoundaryGreen: Story = {
  args: {
    label: "RT Critics",
    value: "70%",
    score: 70,
  },
}

/** Boundary case: score at exactly 50 (yellow). */
export const BoundaryYellow: Story = {
  args: {
    label: "Metacritic",
    value: "50",
    score: 50,
  },
}
