import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SearchBar } from "@/components/SearchBar"

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
}

export default meta

type Story = StoryObj<typeof SearchBar>

/** Wrapper that manages controlled state so the story is interactive. */
function SearchBarDemo({
  initialValue = "",
  withClear = false,
}: {
  initialValue?: string
  withClear?: boolean
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className="w-96">
      <SearchBar
        value={value}
        onChange={setValue}
        onSubmit={() => alert(`Search: "${value}"`)}
        onClear={withClear ? () => setValue("") : undefined}
      />
    </div>
  )
}

/** Empty search bar, ready for input. */
export const Empty: Story = {
  render: () => <SearchBarDemo withClear />,
}

/** Search bar with a pre-filled value and a clear button. */
export const WithValue: Story = {
  render: () => <SearchBarDemo initialValue="The Dark Knight" withClear />,
}

/** Search bar without a clear button. */
export const WithoutClear: Story = {
  render: () => <SearchBarDemo initialValue="Inception" />,
}
