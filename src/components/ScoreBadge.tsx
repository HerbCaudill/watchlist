import { cn } from "@/lib/utils"

/** Displays a numeric score as a colored badge. Green for >= 70, yellow for >= 50, red for < 50. */
export const ScoreBadge = ({ score, size = "md" }: Props) => {
  const color =
    score >= 70 ? "bg-green-600"
    : score >= 50 ? "bg-yellow-500"
    : "bg-red-600"

  const sizeClasses: Record<Props["size"] & string, string> = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-0.5 text-sm",
    lg: "px-3 py-1.5 text-3xl",
  }

  return (
    <span
      data-testid="score-badge"
      className={cn(
        "inline-flex items-center rounded-md font-bold text-white shadow-sm",
        color,
        sizeClasses[size],
      )}
    >
      {score}
    </span>
  )
}

/** Props for the ScoreBadge component. */
type Props = {
  /** Numeric score from 0 to 100. */
  score: number
  /** Badge size variant. */
  size?: "sm" | "md" | "lg"
}
