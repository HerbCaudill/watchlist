import { Effect } from "@/lib/effect"
import { isRetryableApiError } from "@/lib/isRetryableApiError"
import type { ApiError } from "@/lib/apiTypes"

/** Retry an Effect operation for transient API failures only. */
export function retryTransient<A, R>(
  /** The operation to retry. */
  effect: Effect.Effect<A, ApiError, R>,
): Effect.Effect<A, ApiError, R> {
  return Effect.retry(effect, { times: 2, while: isRetryableApiError })
}
