import { IconDeviceTv, IconMovie } from "@tabler/icons-react"
import { cx } from "@/lib/utils"
import type { MediaType } from "@/types"

/** Toggle between Movies and TV shows media types. Shows icons only on mobile, icons + labels on larger screens. */
export function MediaToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg p-1" role="group">
      <ToggleButton
        icon={<IconMovie size={16} stroke={1.5} />}
        label="Movies"
        isActive={value === "movie"}
        onClick={() => onChange("movie")}
      />
      <ToggleButton
        icon={<IconDeviceTv size={16} stroke={1.5} />}
        label="TV"
        isActive={value === "tv"}
        onClick={() => onChange("tv")}
      />
    </div>
  )
}

/** A single button within the toggle group. */
function ToggleButton({
  /** The icon element to render. */
  icon,
  /** The visible label (hidden on small screens). */
  label,
  /** Whether this button represents the currently selected option. */
  isActive,
  /** Called when the button is clicked. */
  onClick,
}: {
  icon: React.ReactNode
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
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        isActive ? "text-foreground bg-white shadow-sm" : "text-white/70 hover:text-white",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
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
