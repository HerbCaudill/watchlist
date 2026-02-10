import { cn } from "@/lib/utils"

/** Display a single rating source (RT, IMDb, etc.) with label, value, score indicator, and optional subtext. */
export function RatingDisplay({ label, value, score, subtext }: Props) {
  return (
    <div>
      <div className="text-muted-foreground flex gap-1 text-xs">
        <span>{label}</span>
        {subtext && <span className="text-muted-foreground text-xs">{subtext}</span>}
      </div>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span data-score-indicator className={cn("h-3 w-3 rounded-full", getScoreColor(score))} />
        {value}
      </div>
    </div>
  )
}

/**
 * Return a Tailwind background-color class based on the score.
 * Green >= 70, yellow >= 50, red < 50.
 */
function getScoreColor(
  /** Normalized score from 0 to 100. */
  score: number,
): string {
  if (score >= 70) return "bg-green-600"
  if (score >= 50) return "bg-yellow-500"
  return "bg-red-600"
}

/** Props for the RatingDisplay component. */
type Props = {
  /** The name of the rating source (e.g. "IMDb", "RT Critics"). */
  label: string
  /** The display value (e.g. "8.5/10", "92%"). */
  value: string
  /** Normalized score from 0 to 100, used to color the indicator dot. */
  score: number
  /** Optional secondary text (e.g. vote count). */
  subtext?: string
}
