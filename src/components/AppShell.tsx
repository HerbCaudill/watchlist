import type { MediaType, Tab } from "@/types"
import { TabBar } from "@/components/TabBar"
import { MediaToggle } from "@/components/MediaToggle"

/** Overall app layout shell. Renders the search area with media toggle, tab bar, and a content area for children. */
export function AppShell({
  searchSlot,
  activeTab,
  onTabChange,
  mediaType,
  onMediaTypeChange,
  children,
}: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-2">
      <div className="relative flex items-center gap-2 py-1">
        <div className="min-w-0 flex-1">{searchSlot}</div>
        <MediaToggle value={mediaType} onChange={onMediaTypeChange} />
      </div>
      <div className="flex flex-1 flex-col rounded-t-xl bg-white">
        <header className="px-4 pt-4">
          <TabBar activeTab={activeTab} onTabChange={onTabChange} />
        </header>
        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
    </div>
  )
}

/** Props for the AppShell component. */
type Props = {
  /** The search UI rendered at the top of the shell. */
  searchSlot: React.ReactNode
  /** The currently active tab. */
  activeTab: Tab
  /** Called when the user switches tabs. */
  onTabChange: (tab: Tab) => void
  /** The currently selected media type. */
  mediaType: MediaType
  /** Called when the user toggles the media type. */
  onMediaTypeChange: (mediaType: MediaType) => void
  /** The content to render in the main area below the header. */
  children: React.ReactNode
}
