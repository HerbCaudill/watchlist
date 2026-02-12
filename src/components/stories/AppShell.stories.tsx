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
function AppShellDemo({
  initialTab = "discover",
  showTabs = true,
}: {
  initialTab?: Tab
  showTabs?: boolean
}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const [mediaType, setMediaType] = useState<MediaType>("movie")

  return (
    <AppShell
      searchSlot={
        <input
          placeholder="Search movies & TV shows..."
          className="h-10 w-full rounded-md border px-3"
        />
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showTabs={showTabs}
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

/** App shell with tabs hidden, as shown on the detail view. */
export const NoTabs: Story = {
  render: () => <AppShellDemo showTabs={false} />,
}
