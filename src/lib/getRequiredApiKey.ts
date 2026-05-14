import { Effect } from "@/lib/effect"
import type { ApiError } from "@/lib/apiTypes"

/** Return an API key or fail with a typed config error. */
export function getRequiredApiKey(
  /** The explicit key passed by a caller. */
  explicitKey: string | undefined,
  /** The default key read from Vite environment. */
  defaultKey: string | undefined,
  /** The service name to include in error messages. */
  serviceName: string,
) {
  const key = explicitKey ?? defaultKey
  return key ?
      Effect.succeed(key)
    : Effect.fail<ApiError>({ _tag: "ConfigError", message: `Missing ${serviceName} API key` })
}
