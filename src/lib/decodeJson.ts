import { Schema } from "effect"
import { Effect } from "@/lib/effect"
import type { ApiError } from "@/lib/apiTypes"

/** Decode unknown JSON with an Effect Schema and return typed schema failures. */
export function decodeJson<A, I>(
  /** The schema to decode with. */
  schema: Schema.Schema<A, I>,
  /** The unknown JSON value to decode. */
  value: unknown,
) {
  return Effect.try({
    try: () => Schema.decodeUnknownSync(schema)(value),
    catch: error =>
      ({
        _tag: "SchemaError",
        message: error instanceof Error ? error.message : String(error),
      }) satisfies ApiError,
  })
}
