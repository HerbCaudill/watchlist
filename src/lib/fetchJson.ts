import { Effect } from "@/lib/effect"
import type { ApiError } from "@/lib/apiTypes"

/** Fetch a URL and parse its JSON body with typed failures. */
export function fetchJson(
  /** The fully constructed URL. */
  url: string,
) {
  return Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url),
      catch: error =>
        ({
          _tag: "NetworkError",
          message: error instanceof Error ? error.message : String(error),
        }) satisfies ApiError,
    })

    if (!response.ok) {
      return yield* Effect.fail<ApiError>({
        _tag: "StatusError",
        status: response.status,
        message: `HTTP ${response.status}`,
      })
    }

    return yield* Effect.tryPromise({
      try: () => response.json() as Promise<unknown>,
      catch: error =>
        ({
          _tag: "JsonError",
          message: error instanceof Error ? error.message : String(error),
        }) satisfies ApiError,
    })
  })
}
