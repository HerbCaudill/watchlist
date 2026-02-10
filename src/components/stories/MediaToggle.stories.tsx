import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { MediaToggle } from "@/components/MediaToggle"
import type { MediaType } from "@/types"

const meta: Meta<typeof MediaToggle> = {
  title: "Components/MediaToggle",
  component: MediaToggle,
}

export default meta

type Story = StoryObj<typeof MediaToggle>

/** Wrapper that manages controlled state so the story is interactive. */
function MediaToggleDemo({ initialValue = "movie" }: { initialValue?: MediaType }) {
  const [value, setValue] = useState<MediaType>(initialValue)
  return <MediaToggle value={value} onChange={setValue} />
}

/** Toggle with Movies selected by default. */
export const Movies: Story = {
  render: () => <MediaToggleDemo initialValue="movie" />,
}

/** Toggle with TV shows selected by default. */
export const TVShows: Story = {
  render: () => <MediaToggleDemo initialValue="tv" />,
}
