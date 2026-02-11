import { useRef, useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import { IconCheck, IconMovie, IconSearch, IconX } from "@tabler/icons-react"
import { cx } from "@/lib/utils"
import { ScoreBadge } from "@/components/ScoreBadge"
import type { MediaItem } from "@/types"

/** Search input with a dropdown of results. Keyboard-navigable: arrow keys to browse, Enter to open detail. */
export function SearchCombobox({
  query,
  onQueryChange,
  movieResults,
  tvResults,
  isLoading,
  watchlistIds,
  onSelect,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /** Whether the dropdown should be visible. */
  const hasResults = movieResults.length > 0 || tvResults.length > 0
  const showDropdown = open && query.trim().length > 0

  /** Handle keyboard shortcuts on the input. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  /** Handle item selection — open detail view and close dropdown. */
  const handleSelect = (itemId: string) => {
    const allResults = [...movieResults, ...tvResults]
    const item = allResults.find(r => r.id === itemId)
    if (item) {
      setOpen(false)
      onSelect(item)
    }
  }

  /** Handle clearing the search input. */
  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
  }

  /** Render a single result item row. */
  const renderItem = (item: MediaItem) => {
    const onWatchlist = watchlistIds.has(item.id)
    return (
      <CommandPrimitive.Item
        key={item.id}
        value={item.id}
        onSelect={() => handleSelect(item.id)}
        className={cx(
          "flex cursor-default items-center gap-3 px-3 py-1.5 text-sm select-none",
          "data-[selected=true]:bg-accent",
        )}
      >
        {/* Left: poster thumbnail */}
        <div className="aspect-2/3 w-8 shrink-0 overflow-hidden rounded">
          {item.posterUrl ?
            <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
          : <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
              <IconMovie size={14} stroke={1.5} />
            </div>
          }
        </div>

        {/* Middle: title + metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{item.title}</span>
          </div>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
            {item.year != null && <span>{item.year}</span>}
            {item.normalizedScore != null && <ScoreBadge score={item.normalizedScore} size="sm" />}
          </div>
        </div>

        {/* Right: checkmark if on watchlist */}
        {onWatchlist && <IconCheck className="size-4 shrink-0 text-green-600" stroke={2} />}
      </CommandPrimitive.Item>
    )
  }

  return (
    <CommandPrimitive shouldFilter={false} className="relative">
      {/* Search input */}
      <div className="relative flex items-center">
        <IconSearch
          className="text-muted-foreground pointer-events-none absolute left-3 size-5"
          stroke={1.5}
        />
        <CommandPrimitive.Input
          ref={inputRef}
          value={query}
          onValueChange={onQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search movies & TV shows..."
          className={cx(
            "border-input bg-background h-10 w-full rounded-md border py-2 pl-10 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            query ? "pr-10" : "pr-3",
          )}
        />
        {query && (
          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute right-2 flex size-6 items-center justify-center rounded-sm"
          >
            <IconX className="size-4" stroke={1.5} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1">
          <CommandPrimitive.List className="max-h-80 overflow-y-auto rounded-md border bg-white shadow-lg">
            {isLoading && !hasResults ?
              <div className="text-muted-foreground py-6 text-center text-sm">Searching...</div>
            : !hasResults ?
              <CommandPrimitive.Empty className="text-muted-foreground py-6 text-center text-sm">
                No results found
              </CommandPrimitive.Empty>
            : <>
                {movieResults.length > 0 && (
                  <CommandPrimitive.Group
                    heading="Movies"
                    className="text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                  >
                    {movieResults.map(renderItem)}
                  </CommandPrimitive.Group>
                )}
                {tvResults.length > 0 && (
                  <CommandPrimitive.Group
                    heading="TV shows"
                    className="text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                  >
                    {tvResults.map(renderItem)}
                  </CommandPrimitive.Group>
                )}
              </>
            }
          </CommandPrimitive.List>
        </div>
      )}
    </CommandPrimitive>
  )
}

/** Props for the SearchCombobox component. */
type Props = {
  /** The current search query text. */
  query: string
  /** Called when the user types in the search input. */
  onQueryChange: (value: string) => void
  /** Movie search results to display in the dropdown. */
  movieResults: MediaItem[]
  /** TV show search results to display in the dropdown. */
  tvResults: MediaItem[]
  /** Whether a search is currently in progress. */
  isLoading: boolean
  /** Set of media item IDs already on the watchlist. */
  watchlistIds: Set<string>
  /** Called when the user selects an item to view its detail. */
  onSelect: (item: MediaItem) => void
  /** Called when the user clears the search input. */
  onClear: () => void
}
