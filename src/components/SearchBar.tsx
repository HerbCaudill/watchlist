import { IconSearch, IconX } from "@tabler/icons-react"
import { cx } from "@/lib/utils"

/** Text input for searching movies and TV shows. Submits on Enter and optionally shows a clear button. */
export function SearchBar({ value, onChange, onSubmit, onClear }: Props) {
  /** Handle key presses on the input -- submit on Enter. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <div className="relative flex items-center">
      <IconSearch
        data-testid="search-icon"
        className="text-muted-foreground pointer-events-none absolute left-3 size-5"
        stroke={1.5}
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search movies & TV shows..."
        className={cx(
          "border-input bg-background h-10 w-full rounded-md border py-2 pl-10 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          onClear && value ? "pr-10" : "pr-3",
        )}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground absolute right-2 flex size-6 items-center justify-center rounded-sm"
        >
          <IconX className="size-4" stroke={1.5} />
        </button>
      )}
    </div>
  )
}

/** Props for the SearchBar component. */
type Props = {
  /** The current search input value. */
  value: string
  /** Called with the new value whenever the input text changes. */
  onChange: (value: string) => void
  /** Called when the user presses Enter to submit the search. */
  onSubmit: () => void
  /** If provided, a clear button is shown when the input is non-empty. Called when the user clicks clear. */
  onClear?: () => void
}
