import type { Meta, StoryObj } from "@storybook/react"
import { ScoreBadge } from "../ScoreBadge"

const meta: Meta<typeof ScoreBadge> = {
  title: "Components/ScoreBadge",
  component: ScoreBadge,
  argTypes: {
    score: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
}

export default meta

type Story = StoryObj<typeof ScoreBadge>

/** High score (green, >= 70). */
export const HighScore: Story = {
  args: { score: 85 },
}

/** Medium score (yellow, >= 50 and < 70). */
export const MediumScore: Story = {
  args: { score: 62 },
}

/** Low score (red, < 50). */
export const LowScore: Story = {
  args: { score: 35 },
}

/** Small size variant. */
export const SmallSize: Story = {
  args: { score: 90, size: "sm" },
}

/** All color thresholds side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ScoreBadge score={92} />
      <ScoreBadge score={70} />
      <ScoreBadge score={65} />
      <ScoreBadge score={50} />
      <ScoreBadge score={42} />
      <ScoreBadge score={15} />
    </div>
  ),
}

/** Large size variant. */
export const LargeSize: Story = {
  args: { score: 90, size: "lg" },
}

/** All three sizes compared. */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ScoreBadge score={85} size="sm" />
      <ScoreBadge score={85} size="md" />
      <ScoreBadge score={85} size="lg" />
    </div>
  ),
}
