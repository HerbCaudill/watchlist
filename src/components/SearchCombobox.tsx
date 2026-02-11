import { useRef, useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import { IconCheck, IconMovie, IconSearch, IconX } from "@tabler/icons-react"
import { cx } from "@/lib/utils"
import { ScoreBadge } from "@/components/ScoreBadge"
import type { MediaItem } from "@/types"

/** Search input with a dropdown of results. Keyboard-navigable: arrow keys to browse, Enter to add. */
export function SearchCombobox({
  query,
  onQueryChange,
  results,
  isLoading,
  watchlistIds,
  onAdd,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /** Whether the dropdown should be visible. */
  const showDropdown = open && query.trim().length > 0

  /** Handle item selection — add to watchlist if not already there. */
  const handleSelect = (itemId: string) => {
    const item = results.find(r => r.id === itemId)
    if (item && !watchlistIds.has(item.id)) {
      onAdd(item)
    }
  }

  /** Handle clearing the search input. */
  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
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
            {isLoading && results.length === 0 ?
              <div className="text-muted-foreground py-6 text-center text-sm">Searching...</div>
            : results.length === 0 ?
              <CommandPrimitive.Empty className="text-muted-foreground py-6 text-center text-sm">
                No results found
              </CommandPrimitive.Empty>
            : <CommandPrimitive.Group>
                {results.map(item => {
                  const onWatchlist = watchlistIds.has(item.id)
                  return (
                    <CommandPrimitive.Item
                      key={item.id}
                      value={item.id}
                      disabled={onWatchlist}
                      onSelect={() => handleSelect(item.id)}
                      className={cx(
                        "flex cursor-default items-center gap-3 px-3 py-2 text-sm select-none",
                        "data-[selected=true]:bg-accent",
                        onWatchlist && "opacity-50",
                      )}
                    >
                      {/* Left: title + metadata */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {onWatchlist && (
                            <IconCheck className="size-4 shrink-0 text-green-600" stroke={2} />
                          )}
                          <span className="truncate font-medium">{item.title}</span>
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                          {item.year != null && <span>{item.year}</span>}
                          {item.normalizedScore != null && (
                            <ScoreBadge score={item.normalizedScore} size="sm" />
                          )}
                        </div>
                      </div>

                      {/* Right: poster thumbnail */}
                      <div className="aspect-2/3 w-10 shrink-0 overflow-hidden rounded">
                        {item.posterUrl ?
                          <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
                        : <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
                            <IconMovie size={16} stroke={1.5} />
                          </div>
                        }
                      </div>
                    </CommandPrimitive.Item>
                  )
                })}
              </CommandPrimitive.Group>
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
  /** Search results to display in the dropdown. */
  results: MediaItem[]
  /** Whether a search is currently in progress. */
  isLoading: boolean
  /** Set of media item IDs already on the watchlist. */
  watchlistIds: Set<string>
  /** Called when the user selects an item to add to the watchlist. */
  onAdd: (item: MediaItem) => void
  /** Called when the user clears the search input. */
  onClear: () => void
}
