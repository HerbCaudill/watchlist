import type { CacheEnvelope, ReadCacheOptions } from "@/lib/apiTypes"

/** Read a versioned TTL localStorage cache value, ignoring all storage and parse failures. */
export function readCache<T>(
  /** The localStorage key to read. */
  key: string,
  /** Cache version and expiry options. */
  options: ReadCacheOptions,
): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const envelope = JSON.parse(raw) as Partial<CacheEnvelope<T>>
    if (envelope.version !== options.version) return null
    if (
      !options.allowExpired &&
      typeof envelope.expiresAt === "string" &&
      Date.parse(envelope.expiresAt) <= Date.now()
    )
      return null
    if (!("value" in envelope)) return null

    return envelope.value as T
  } catch {
    return null
  }
}
