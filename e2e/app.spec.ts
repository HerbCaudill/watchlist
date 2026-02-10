import { test, expect, type Page } from "@playwright/test"

/**
 * Mock TMDB search response for movies. Returns two fake movie results so we can
 * verify that the search results grid renders correctly.
 */
const mockTmdbMovieSearchResponse = {
  page: 1,
  results: [
    {
      id: 550,
      title: "Fight Club",
      release_date: "1999-10-15",
      poster_path: "/pB8BM7pdSp6B6Ih7QI4S2t0POoT.jpg",
      overview:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
      vote_average: 8.4,
    },
    {
      id: 551,
      title: "The Matrix",
      release_date: "1999-03-31",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      overview: "A computer programmer discovers a mysterious world.",
      vote_average: 8.7,
    },
  ],
  total_pages: 1,
  total_results: 2,
}

/**
 * Mock TMDB search response for TV shows.
 */
const mockTmdbTvSearchResponse = {
  page: 1,
  results: [
    {
      id: 1399,
      name: "Breaking Bad",
      first_air_date: "2008-01-20",
      poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      overview:
        "A chemistry teacher diagnosed with terminal lung cancer teams up with a former student.",
      vote_average: 8.9,
    },
  ],
  total_pages: 1,
  total_results: 1,
}

/**
 * Mock OMDB response for enrichment.
 */
const mockOmdbResponse = {
  Response: "True",
  Title: "Fight Club",
  Year: "1999",
  Ratings: [
    { Source: "Internet Movie Database", Value: "8.8/10" },
    { Source: "Rotten Tomatoes", Value: "79%" },
    { Source: "Metacritic", Value: "66/100" },
  ],
  imdbRating: "8.8",
  imdbVotes: "2,000,000",
}

/**
 * Mock TMDB videos/trailer response.
 */
const mockTmdbTrailerResponse = {
  id: 550,
  results: [
    {
      key: "SUXWAEX2jlg",
      site: "YouTube",
      type: "Trailer",
      official: true,
    },
  ],
}

/**
 * Set up API route mocks on the page. Intercepts all external API calls
 * to TMDB and OMDB so that tests are deterministic and don't require API keys.
 */
async function mockApis(page: Page) {
  // Mock TMDB movie search
  await page.route("**/api.themoviedb.org/3/search/movie**", async route => {
    await route.fulfill({ json: mockTmdbMovieSearchResponse })
  })

  // Mock TMDB TV search
  await page.route("**/api.themoviedb.org/3/search/tv**", async route => {
    await route.fulfill({ json: mockTmdbTvSearchResponse })
  })

  // Mock TMDB trailer/videos endpoint
  await page.route("**/api.themoviedb.org/3/**/videos**", async route => {
    await route.fulfill({ json: mockTmdbTrailerResponse })
  })

  // Mock OMDB
  await page.route("**/omdbapi.com/**", async route => {
    await route.fulfill({ json: mockOmdbResponse })
  })
}

test.describe("initial state", () => {
  test("shows the Discover tab with 'Coming soon' placeholder", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })
  })

  test("shows the search bar with placeholder text", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByPlaceholder("Search movies & TV shows...")).toBeVisible({
      timeout: 30000,
    })
  })

  test("shows Discover tab as active by default", async ({ page }) => {
    await page.goto("/")
    const discoverTab = page.getByRole("tab", { name: "Discover" })
    await expect(discoverTab).toBeVisible({ timeout: 30000 })
    await expect(discoverTab).toHaveAttribute("aria-selected", "true")
  })

  test("shows Movies toggle as active by default", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    await expect(moviesButton).toBeVisible({ timeout: 30000 })
    await expect(moviesButton).toHaveAttribute("aria-pressed", "true")
  })
})

test.describe("tab switching", () => {
  test("switches to Watchlist tab and shows empty message", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page.getByText("Your watchlist is empty")).toBeVisible()
    await expect(page.getByText("Coming soon")).not.toBeVisible()
  })

  test("switches back to Discover tab from Watchlist", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    // Go to Watchlist
    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page.getByText("Your watchlist is empty")).toBeVisible()

    // Go back to Discover
    await page.getByRole("tab", { name: "Discover" }).click()
    await expect(page.getByText("Coming soon")).toBeVisible()
    await expect(page.getByText("Your watchlist is empty")).not.toBeVisible()
  })

  test("tab aria-selected updates correctly on switch", async ({ page }) => {
    await page.goto("/")
    const discoverTab = page.getByRole("tab", { name: "Discover" })
    const watchlistTab = page.getByRole("tab", { name: "Watchlist" })

    await expect(discoverTab).toHaveAttribute("aria-selected", "true", { timeout: 30000 })
    await expect(watchlistTab).toHaveAttribute("aria-selected", "false")

    await watchlistTab.click()
    await expect(watchlistTab).toHaveAttribute("aria-selected", "true")
    await expect(discoverTab).toHaveAttribute("aria-selected", "false")
  })
})

test.describe("media toggle", () => {
  test("switches from Movies to TV shows", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    const tvButton = page.getByRole("button", { name: "TV shows" })

    await expect(moviesButton).toHaveAttribute("aria-pressed", "true", { timeout: 30000 })
    await expect(tvButton).toHaveAttribute("aria-pressed", "false")

    await tvButton.click()
    await expect(tvButton).toHaveAttribute("aria-pressed", "true")
    await expect(moviesButton).toHaveAttribute("aria-pressed", "false")
  })

  test("switches back from TV shows to Movies", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    const tvButton = page.getByRole("button", { name: "TV shows" })

    await expect(moviesButton).toHaveAttribute("aria-pressed", "true", { timeout: 30000 })

    await tvButton.click()
    await expect(tvButton).toHaveAttribute("aria-pressed", "true")

    await moviesButton.click()
    await expect(moviesButton).toHaveAttribute("aria-pressed", "true")
    await expect(tvButton).toHaveAttribute("aria-pressed", "false")
  })
})

test.describe("search flow", () => {
  test("searching for movies shows results", async ({ page }) => {
    await mockApis(page)
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Fight Club")
    await searchInput.press("Enter")

    // Should show movie results from our mock
    await expect(page.getByText("Fight Club")).toBeVisible()
    await expect(page.getByText("The Matrix")).toBeVisible()

    // "Coming soon" should no longer be visible
    await expect(page.getByText("Coming soon")).not.toBeVisible()
  })

  test("searching for TV shows shows results", async ({ page }) => {
    await mockApis(page)
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    // Switch to TV shows first
    await page.getByRole("button", { name: "TV shows" }).click()

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Breaking Bad")
    await searchInput.press("Enter")

    await expect(page.getByText("Breaking Bad")).toBeVisible()
  })

  test("clearing the search returns to the discover placeholder", async ({ page }) => {
    await mockApis(page)
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Fight Club")
    await searchInput.press("Enter")

    await expect(page.getByText("Fight Club")).toBeVisible()

    // Click the clear button
    await page.getByLabel("Clear search").click()

    // Should return to the "Coming soon" placeholder
    await expect(page.getByText("Coming soon")).toBeVisible()
  })

  test("empty search results show 'No results'", async ({ page }) => {
    // Mock TMDB to return no results
    await page.route("**/api.themoviedb.org/3/search/movie**", async route => {
      await route.fulfill({
        json: { page: 1, results: [], total_pages: 0, total_results: 0 },
      })
    })

    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("xyznonexistent")
    await searchInput.press("Enter")

    await expect(page.getByText("No results")).toBeVisible()
  })
})

test.describe("add to watchlist", () => {
  test("add a search result to the watchlist, then see it on the Watchlist tab", async ({
    page,
  }) => {
    await mockApis(page)
    await page.goto("/")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    // Search for movies
    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Fight Club")
    await searchInput.press("Enter")
    await expect(page.getByText("Fight Club")).toBeVisible()

    // Hover over the first card to reveal the action button, then click "Add to watchlist"
    const addButton = page.getByLabel("Add to watchlist").first()
    await addButton.click({ force: true })

    // Switch to Watchlist tab to verify the item was added
    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page.getByText("Fight Club")).toBeVisible()
    await expect(page.getByText("Your watchlist is empty")).not.toBeVisible()
  })
})
