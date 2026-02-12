import { cx } from "@/lib/utils"
import type { Tab } from "@/types"

/** Tab bar for switching between the Discover and Watchlist views. */
export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div role="tablist" className="border-border flex border-b">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onTabChange(id)}
          className={cx(
            "flex-1 px-4 py-2 text-sm font-medium transition-colors",
            activeTab === id ?
              "border-primary text-foreground border-b-2"
            : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** The available tabs with their display labels. */
const tabs: { id: Tab; label: string }[] = [
  { id: "watchlist", label: "Watchlist" },
  { id: "discover", label: "Discover" },
]

/** Props for the TabBar component. */
type Props = {
  /** The currently active tab. */
  activeTab: Tab
  /** Called when the user clicks a tab. */
  onTabChange: (tab: Tab) => void
}
