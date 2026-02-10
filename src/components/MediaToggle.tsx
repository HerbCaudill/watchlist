import { cx } from "@/lib/utils"
import type { MediaType } from "@/types"

/** Toggle between Movies and TV shows media types. */
export function MediaToggle({ value, onChange }: Props) {
  return (
    <div className="bg-muted inline-flex items-center gap-1 rounded-lg p-1" role="group">
      <ToggleButton label="Movies" isActive={value === "movie"} onClick={() => onChange("movie")} />
      <ToggleButton label="TV shows" isActive={value === "tv"} onClick={() => onChange("tv")} />
    </div>
  )
}

/** A single button within the toggle group. */
function ToggleButton({
  /** The visible label for this button. */
  label,
  /** Whether this button represents the currently selected option. */
  isActive,
  /** Called when the button is clicked. */
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="button"
      aria-pressed={isActive}
      onClick={() => {
        if (!isActive) onClick()
      }}
      className={cx(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive ?
          "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

/** Props for the MediaToggle component. */
type Props = {
  /** The currently selected media type. */
  value: MediaType
  /** Called with the new media type when the user clicks a toggle. */
  onChange: (value: MediaType) => void
}
