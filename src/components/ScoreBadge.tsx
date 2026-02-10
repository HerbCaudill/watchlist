import { cn } from "@/lib/utils"

/** Displays a numeric score as a colored badge. Green for >= 70, yellow for >= 50, red for < 50. */
export const ScoreBadge = ({ score, size = "md" }: Props) => {
  const color =
    score >= 70 ? "bg-green-600"
    : score >= 50 ? "bg-yellow-500"
    : "bg-red-600"

  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-sm"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-bold text-white shadow-sm",
        color,
        sizeClass,
      )}
    >
      {score}%
    </span>
  )
}

/** Props for the ScoreBadge component. */
type Props = {
  /** Numeric score from 0 to 100. */
  score: number
  /** Badge size variant. */
  size?: "sm" | "md"
}
