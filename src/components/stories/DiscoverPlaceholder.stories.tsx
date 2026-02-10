import type { Meta, StoryObj } from "@storybook/react"
import { DiscoverPlaceholder } from "../DiscoverPlaceholder"

const meta: Meta<typeof DiscoverPlaceholder> = {
  title: "Components/DiscoverPlaceholder",
  component: DiscoverPlaceholder,
}

export default meta

type Story = StoryObj<typeof DiscoverPlaceholder>

/** Default placeholder state. */
export const Default: Story = {}
