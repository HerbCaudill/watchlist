import type { ApiError } from "@/lib/apiTypes"

/** Return true when an API failure is transient enough to retry. */
export function isRetryableApiError(
  /** The API error to classify. */
  error: ApiError,
): boolean {
  return (
    error._tag === "NetworkError" ||
    error._tag === "JsonError" ||
    (error._tag === "StatusError" && error.status >= 500)
  )
}
