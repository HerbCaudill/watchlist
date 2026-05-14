import type { MediaType } from "@/types"

/** A failure caused by missing API configuration. */
export type ConfigError = { _tag: "ConfigError"; message: string }

/** A failure caused by the browser fetch call itself. */
export type NetworkError = { _tag: "NetworkError"; message: string }

/** A failure caused by a non-2xx HTTP status. */
export type StatusError = { _tag: "StatusError"; status: number; message: string }

/** A failure caused by JSON parsing. */
export type JsonError = { _tag: "JsonError"; message: string }

/** A failure caused by external JSON not matching its schema. */
export type SchemaError = { _tag: "SchemaError"; message: string }

/** A typed API failure from an external metadata service. */
export type ApiError = ConfigError | NetworkError | StatusError | JsonError | SchemaError

/** Options for a cache read. */
export type ReadCacheOptions = { version: number; allowExpired?: boolean }

/** Options for a cache write. */
export type WriteCacheOptions = { version: number; ttlMs: number }

/** A versioned TTL localStorage cache envelope. */
export type CacheEnvelope<T> = { version: number; savedAt: string; expiresAt: string; value: T }

/** Shared OMDB lookup input. */
export type OmdbLookup = { title: string; mediaType?: MediaType; year?: number; apiKey?: string }

/** Discover query options. */
export type DiscoverOptions = { apiKey?: string; page?: number; fromDate?: string; toDate?: string }

/** Explicit API keys for compatibility and tests. */
export type ApiKeys = { tmdbApiKey?: string; omdbApiKey?: string }
