import { renderHook, act } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { movieFixture, tvShowFixture } from "@/lib/fixtures"

/**
 * Mock the DXOS hooks used by useWatchlist. We mock the entire
 * `@dxos/react-client/echo` module so useSpace and useQuery
 * return controllable values.
 */

const mockAdd = vi.fn()
const mockRemove = vi.fn()

/** Simulated watchlist items stored in the mock space. */
let mockItems: any[] = []

/** The mock space object with a db that has add and remove methods. */
const mockSpace = {
  db: {
    add: mockAdd,
    remove: mockRemove,
  },
}

let mockSpaceReturn: any = mockSpace

vi.mock("@dxos/react-client/echo", () => ({
  useSpace: () => mockSpaceReturn,
  useQuery: () => mockItems,
  Filter: {
    type: vi.fn(),
  },
  live: (_schema: any, data: any) => data,
}))

describe("useWatchlist", () => {
  /** Import lazily so the module-level mock is in place. */
  let useWatchlist: typeof import("../useWatchlist").useWatchlist

  beforeEach(async () => {
    mockItems = []
    mockSpaceReturn = mockSpace
    vi.clearAllMocks()
    const mod = await import("../useWatchlist")
    useWatchlist = mod.useWatchlist
  })

  it("returns an empty items array when no items exist", () => {
    const { result } = renderHook(() => useWatchlist())
    expect(result.current.items).toEqual([])
  })

  it("returns items from the query", () => {
    mockItems = [
      { tmdbId: 550, title: "Fight Club", mediaType: "movie", addedAt: "2025-01-01T00:00:00.000Z" },
      {
        tmdbId: 1396,
        title: "Breaking Bad",
        mediaType: "tv",
        addedAt: "2025-01-02T00:00:00.000Z",
      },
    ]

    const { result } = renderHook(() => useWatchlist())
    expect(result.current.items).toHaveLength(2)
    expect(result.current.items[0].title).toBe("Fight Club")
    expect(result.current.items[1].title).toBe("Breaking Bad")
  })

  it("isOnWatchlist returns true for an item that exists", () => {
    mockItems = [
      { tmdbId: 550, title: "Fight Club", mediaType: "movie", addedAt: "2025-01-01T00:00:00.000Z" },
    ]

    const { result } = renderHook(() => useWatchlist())
    expect(result.current.isOnWatchlist(550)).toBe(true)
  })

  it("isOnWatchlist returns false for an item that does not exist", () => {
    mockItems = [
      { tmdbId: 550, title: "Fight Club", mediaType: "movie", addedAt: "2025-01-01T00:00:00.000Z" },
    ]

    const { result } = renderHook(() => useWatchlist())
    expect(result.current.isOnWatchlist(999)).toBe(false)
  })

  it("add creates a new WatchlistItem in the space from a MediaItem", () => {
    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.add(movieFixture)
    })

    expect(mockAdd).toHaveBeenCalledTimes(1)

    const addedObject = mockAdd.mock.calls[0][0]
    expect(addedObject.tmdbId).toBe(movieFixture.tmdbId)
    expect(addedObject.title).toBe(movieFixture.title)
    expect(addedObject.year).toBe(movieFixture.year)
    expect(addedObject.posterUrl).toBe(movieFixture.posterUrl)
    expect(addedObject.mediaType).toBe(movieFixture.mediaType)
    expect(addedObject.overview).toBe(movieFixture.overview)
    expect(addedObject.normalizedScore).toBe(movieFixture.normalizedScore)
    expect(addedObject.addedAt).toBeDefined()
  })

  it("add sets addedAt to a valid ISO date string", () => {
    const { result } = renderHook(() => useWatchlist())

    const before = new Date().toISOString()
    act(() => {
      result.current.add(movieFixture)
    })
    const after = new Date().toISOString()

    const addedAt = mockAdd.mock.calls[0][0].addedAt
    expect(addedAt >= before).toBe(true)
    expect(addedAt <= after).toBe(true)
  })

  it("add handles a TV show MediaItem", () => {
    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.add(tvShowFixture)
    })

    expect(mockAdd).toHaveBeenCalledTimes(1)
    const addedObject = mockAdd.mock.calls[0][0]
    expect(addedObject.tmdbId).toBe(tvShowFixture.tmdbId)
    expect(addedObject.title).toBe(tvShowFixture.title)
    expect(addedObject.mediaType).toBe("tv")
  })

  it("remove finds and removes the item with the given tmdbId", () => {
    const itemToRemove = {
      tmdbId: 550,
      title: "Fight Club",
      mediaType: "movie",
      addedAt: "2025-01-01T00:00:00.000Z",
    }
    mockItems = [
      itemToRemove,
      {
        tmdbId: 1396,
        title: "Breaking Bad",
        mediaType: "tv",
        addedAt: "2025-01-02T00:00:00.000Z",
      },
    ]

    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.remove(550)
    })

    expect(mockRemove).toHaveBeenCalledTimes(1)
    expect(mockRemove).toHaveBeenCalledWith(itemToRemove)
  })

  it("remove does nothing if the tmdbId is not found", () => {
    mockItems = [
      { tmdbId: 550, title: "Fight Club", mediaType: "movie", addedAt: "2025-01-01T00:00:00.000Z" },
    ]

    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.remove(999)
    })

    expect(mockRemove).not.toHaveBeenCalled()
  })

  it("handles undefined space gracefully", () => {
    mockSpaceReturn = undefined

    const { result } = renderHook(() => useWatchlist())
    expect(result.current.items).toEqual([])
  })

  it("add is a no-op when space is undefined", () => {
    mockSpaceReturn = undefined

    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.add(movieFixture)
    })

    expect(mockAdd).not.toHaveBeenCalled()
  })

  it("remove is a no-op when space is undefined", () => {
    mockSpaceReturn = undefined

    const { result } = renderHook(() => useWatchlist())

    act(() => {
      result.current.remove(550)
    })

    expect(mockRemove).not.toHaveBeenCalled()
  })
})
