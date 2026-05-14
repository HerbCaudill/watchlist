/** Build the rolling 12-month Discover date window ending on the given date. */
export function getDiscoverDateWindow(
  /** The date to use as the end of the Discover window. */
  now: Date = new Date(),
): DiscoverDateWindow {
  const toDate = formatDate(now)
  const from = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()))
  return { fromDate: formatDate(from), toDate }
}

/** Format a Date as YYYY-MM-DD using UTC calendar fields. */
function formatDate(
  /** The date to format. */
  date: Date,
): string {
  return date.toISOString().slice(0, 10)
}

/** A Discover date range in TMDB query format. */
export type DiscoverDateWindow = {
  /** The first date included in the Discover query. */
  fromDate: string
  /** The last date included in the Discover query. */
  toDate: string
}
