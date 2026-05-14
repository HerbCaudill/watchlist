import type { CacheEnvelope, WriteCacheOptions } from "@/lib/apiTypes"

/** Write a versioned TTL localStorage cache value, ignoring unavailable storage and quota errors. */
export function writeCache<T>(
  /** The localStorage key to write. */
  key: string,
  /** The value to cache. */
  value: T,
  /** Cache version and TTL options. */
  options: WriteCacheOptions,
): void {
  try {
    const now = Date.now()
    const envelope: CacheEnvelope<T> = {
      version: options.version,
      savedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + options.ttlMs).toISOString(),
      value,
    }
    localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    // Cache writes are best-effort and must not affect API flows.
  }
}
