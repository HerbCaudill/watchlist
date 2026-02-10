import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { AppShell } from "@/components/AppShell"
import type { MediaType, Tab } from "@/types"

const meta: Meta<typeof AppShell> = {
  title: "Components/AppShell",
  component: AppShell,
}

export default meta

type Story = StoryObj<typeof AppShell>

/** Wrapper that manages all controlled state so the story is interactive. */
function AppShellDemo({ initialTab = "discover" }: { initialTab?: Tab }) {
  const [searchValue, setSearchValue] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const [mediaType, setMediaType] = useState<MediaType>("movie")

  return (
    <AppShell
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onSearchSubmit={() => alert(`Search: "${searchValue}"`)}
      onSearchClear={() => setSearchValue("")}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      mediaType={mediaType}
      onMediaTypeChange={setMediaType}
    >
      <div className="flex items-center justify-center rounded-lg border border-dashed border-neutral-300 py-20 text-neutral-400">
        Content goes here ({activeTab} / {mediaType})
      </div>
    </AppShell>
  )
}

/** Default app shell with the Discover tab active. */
export const Default: Story = {
  render: () => <AppShellDemo />,
}

/** App shell with the Watchlist tab active. */
export const WatchlistTab: Story = {
  render: () => <AppShellDemo initialTab="watchlist" />,
}
