import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { TabBar } from "@/components/TabBar"
import type { Tab } from "@/types"

const meta: Meta<typeof TabBar> = {
  title: "Components/TabBar",
  component: TabBar,
}

export default meta

type Story = StoryObj<typeof TabBar>

/** Wrapper that manages controlled state so the story is interactive. */
function TabBarDemo({ initialTab = "discover" }: { initialTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  return (
    <div className="w-96">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

/** Discover tab active by default. */
export const DiscoverActive: Story = {
  render: () => <TabBarDemo initialTab="discover" />,
}

/** Watchlist tab active by default. */
export const WatchlistActive: Story = {
  render: () => <TabBarDemo initialTab="watchlist" />,
}
