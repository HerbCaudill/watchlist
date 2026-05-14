import { beforeEach, describe, expect, it, vi } from "vitest"
import { readCache } from "@/lib/readCache"
import { writeCache } from "@/lib/writeCache"

const key = "cache-test"
const version = 2
const ttlMs = 1_000

describe("versioned TTL cache", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
  })

  it("reads a value written in a versioned TTL envelope", () => {
    writeCache(key, { title: "Fight Club" }, { version, ttlMs })

    expect(readCache<{ title: string }>(key, { version })).toEqual({ title: "Fight Club" })
  })

  it("ignores expired values", () => {
    writeCache(key, { title: "Fight Club" }, { version, ttlMs })
    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"))

    expect(readCache(key, { version })).toBeNull()
  })

  it("ignores wrong-version and corrupted values", () => {
    localStorage.setItem(
      "wrong-version",
      JSON.stringify({ version: 1, savedAt: "x", expiresAt: "2099-01-01T00:00:00.000Z", value: 1 }),
    )
    localStorage.setItem("corrupt", "not json")

    expect(readCache("wrong-version", { version })).toBeNull()
    expect(readCache("corrupt", { version })).toBeNull()
  })

  it("tolerates unavailable storage and quota errors", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    expect(readCache(key, { version })).toBeNull()
    getItem.mockRestore()

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError")
    })
    expect(() => writeCache(key, { ok: true }, { version, ttlMs })).not.toThrow()
  })
})
