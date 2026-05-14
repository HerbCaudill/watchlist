import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Effect } from "@/lib/effect"
import { movieFixture } from "@/lib/fixtures"
import type { ApiError } from "@/lib/apiTypes"
import type { MediaType } from "@/types"

vi.mock("@/lib/loadDiscoverItems", () => ({
  loadDiscoverItems: vi.fn(),
}))

import { loadDiscoverItems } from "@/lib/loadDiscoverItems"
import { useDiscover } from "../useDiscover"

describe("useDiscover", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it("loads discover items automatically", async () => {
    vi.mocked(loadDiscoverItems).mockReturnValue(Effect.succeed([movieFixture]))

    const { result } = renderHook(() => useDiscover("movie"))

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toEqual([movieFixture])
    expect(result.current.error).toBeNull()
  })

  it("exposes an error when loading fails", async () => {
    const error: ApiError = { _tag: "NetworkError", message: "offline" }
    vi.mocked(loadDiscoverItems).mockReturnValue(Effect.fail(error))

    const { result } = renderHook(() => useDiscover("movie"))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toEqual([])
    expect(result.current.error).toBe(error)
  })

  it("refetches when media type changes", async () => {
    vi.mocked(loadDiscoverItems).mockReturnValue(Effect.succeed([]))

    const { rerender } = renderHook(
      ({ mediaType }: { mediaType: MediaType }) => useDiscover(mediaType),
      {
        initialProps: { mediaType: "movie" },
      },
    )

    await waitFor(() => expect(loadDiscoverItems).toHaveBeenCalledWith("movie", undefined))

    await act(async () => {
      rerender({ mediaType: "tv" })
    })

    await waitFor(() => expect(loadDiscoverItems).toHaveBeenCalledWith("tv", undefined))
  })
})
