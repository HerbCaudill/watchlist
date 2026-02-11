import type { MediaType, Tab } from "@/types"
import { SearchBar } from "@/components/SearchBar"
import { TabBar } from "@/components/TabBar"
import { MediaToggle } from "@/components/MediaToggle"

/** Overall app layout shell. Renders the search bar, tab bar, media toggle, and a content area for children. */
export function AppShell({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  activeTab,
  onTabChange,
  mediaType,
  onMediaTypeChange,
  children,
}: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <div className="px-4 pt-4 pb-3">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onClear={onSearchClear}
        />
      </div>
      <div className="flex flex-1 flex-col rounded-t-xl bg-white">
        <header className="flex flex-col gap-3 px-4 pt-4">
          <TabBar activeTab={activeTab} onTabChange={onTabChange} />
          <MediaToggle value={mediaType} onChange={onMediaTypeChange} />
        </header>
        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
    </div>
  )
}

/** Props for the AppShell component. */
type Props = {
  /** The current search input value. */
  searchValue: string
  /** Called with the new value when the search input changes. */
  onSearchChange: (value: string) => void
  /** Called when the user submits the search (presses Enter). */
  onSearchSubmit: () => void
  /** Called when the user clears the search input. If undefined, no clear button is shown. */
  onSearchClear?: () => void
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
