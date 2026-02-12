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
 * Mock TMDB movie detail response for direct URL access.
 */
const mockTmdbMovieDetailResponse = {
  id: 550,
  title: "Fight Club",
  release_date: "1999-10-15",
  poster_path: "/pB8BM7pdSp6B6Ih7QI4S2t0POoT.jpg",
  overview:
    "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
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

  // Mock TMDB movie detail endpoint (registered after videos to avoid conflicts)
  await page.route("**/api.themoviedb.org/3/movie/**", async route => {
    await route.fulfill({ json: mockTmdbMovieDetailResponse })
  })

  // Mock OMDB
  await page.route("**/omdbapi.com/**", async route => {
    await route.fulfill({ json: mockOmdbResponse })
  })
}

test.describe("initial state", () => {
  test("shows the Watchlist tab with empty watchlist message", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })
  })

  test("shows the search bar with placeholder text", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByPlaceholder("Search movies & TV shows...")).toBeVisible({
      timeout: 30000,
    })
  })

  test("shows Watchlist tab as active by default", async ({ page }) => {
    await page.goto("/")
    const watchlistTab = page.getByRole("tab", { name: "Watchlist" })
    await expect(watchlistTab).toBeVisible({ timeout: 30000 })
    await expect(watchlistTab).toHaveAttribute("aria-selected", "true")
  })

  test("shows Movies toggle as active by default", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    await expect(moviesButton).toBeVisible({ timeout: 30000 })
    await expect(moviesButton).toHaveAttribute("aria-pressed", "true")
  })
})

test.describe("tab switching", () => {
  test("switches to Discover tab and shows 'Coming soon' placeholder", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    await page.getByRole("tab", { name: "Discover" }).click()
    await expect(page.getByText("Coming soon")).toBeVisible()
    await expect(page.getByText("Your watchlist is empty")).not.toBeVisible()
  })

  test("switches back to Watchlist tab from Discover", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    // Go to Discover
    await page.getByRole("tab", { name: "Discover" }).click()
    await expect(page.getByText("Coming soon")).toBeVisible()

    // Go back to Watchlist
    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page.getByText("Your watchlist is empty")).toBeVisible()
    await expect(page.getByText("Coming soon")).not.toBeVisible()
  })

  test("tab aria-selected updates correctly on switch", async ({ page }) => {
    await page.goto("/")
    const discoverTab = page.getByRole("tab", { name: "Discover" })
    const watchlistTab = page.getByRole("tab", { name: "Watchlist" })

    await expect(watchlistTab).toHaveAttribute("aria-selected", "true", { timeout: 30000 })
    await expect(discoverTab).toHaveAttribute("aria-selected", "false")

    await discoverTab.click()
    await expect(discoverTab).toHaveAttribute("aria-selected", "true")
    await expect(watchlistTab).toHaveAttribute("aria-selected", "false")
  })
})

test.describe("media toggle", () => {
  test("switches from Movies to TV shows", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    const tvButton = page.getByRole("button", { name: "TV" })

    await expect(moviesButton).toHaveAttribute("aria-pressed", "true", { timeout: 30000 })
    await expect(tvButton).toHaveAttribute("aria-pressed", "false")

    await tvButton.click()
    await expect(tvButton).toHaveAttribute("aria-pressed", "true")
    await expect(moviesButton).toHaveAttribute("aria-pressed", "false")
  })

  test("switches back from TV shows to Movies", async ({ page }) => {
    await page.goto("/")
    const moviesButton = page.getByRole("button", { name: "Movies" })
    const tvButton = page.getByRole("button", { name: "TV" })

    await expect(moviesButton).toHaveAttribute("aria-pressed", "true", { timeout: 30000 })

    await tvButton.click()
    await expect(tvButton).toHaveAttribute("aria-pressed", "true")

    await moviesButton.click()
    await expect(moviesButton).toHaveAttribute("aria-pressed", "true")
    await expect(tvButton).toHaveAttribute("aria-pressed", "false")
  })

  test("media toggle preserves the active tab in the URL", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/movies\/watchlist/, { timeout: 30000 })

    await page.getByRole("button", { name: "TV" }).click()
    await expect(page).toHaveURL(/\/tv\/watchlist/)

    await page.getByRole("button", { name: "Movies" }).click()
    await expect(page).toHaveURL(/\/movies\/watchlist/)
  })
})

test.describe("search flow", () => {
  test("searching for movies shows results", async ({ page }) => {
    await mockApis(page)
    await page.goto("/movies/discover")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Fight Club")
    await searchInput.press("Enter")

    // Should show movie results from our mock in the dropdown
    await expect(page.getByText("Fight Club")).toBeVisible()
    await expect(page.getByText("The Matrix")).toBeVisible()
  })

  test("searching for TV shows shows results", async ({ page }) => {
    await mockApis(page)
    await page.goto("/tv/discover")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Breaking Bad")

    await expect(page.getByText("Breaking Bad")).toBeVisible()
  })

  test("clearing the search returns to the discover placeholder", async ({ page }) => {
    await mockApis(page)
    await page.goto("/movies/discover")
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

    await page.goto("/movies/discover")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("xyznonexistent")
    await searchInput.press("Enter")

    await expect(page.getByText("No results")).toBeVisible()
  })
})

test.describe("routing", () => {
  test("redirects / to /movies/watchlist", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })
    await expect(page).toHaveURL(/\/movies\/watchlist/)
  })

  test("tab switching updates the URL", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    await page.getByRole("tab", { name: "Discover" }).click()
    await expect(page).toHaveURL(/\/movies\/discover/)

    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page).toHaveURL(/\/movies\/watchlist/)
  })

  test("media toggle updates the URL", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    await page.getByRole("button", { name: "TV" }).click()
    await expect(page).toHaveURL(/\/tv\/watchlist/)

    await page.getByRole("button", { name: "Movies" }).click()
    await expect(page).toHaveURL(/\/movies\/watchlist/)
  })

  test("direct URL access to /tv/watchlist works", async ({ page }) => {
    await page.goto("/tv/watchlist")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    const tvButton = page.getByRole("button", { name: "TV" })
    await expect(tvButton).toHaveAttribute("aria-pressed", "true")
  })

  test("back button navigates between routes", async ({ page }) => {
    await page.goto("/movies/watchlist")
    await expect(page.getByText("Your watchlist is empty")).toBeVisible({ timeout: 30000 })

    await page.getByRole("tab", { name: "Discover" }).click()
    await expect(page.getByText("Coming soon")).toBeVisible()

    await page.goBack()
    await expect(page.getByText("Your watchlist is empty")).toBeVisible()
    await expect(page).toHaveURL(/\/movies\/watchlist/)
  })
})

test.describe("detail view", () => {
  test("hides the tab bar when viewing a detail page", async ({ page }) => {
    await mockApis(page)
    await page.goto("/movies/550")
    await expect(page.getByRole("heading", { name: "Fight Club" })).toBeVisible({ timeout: 30000 })

    // Tab bar should not be visible on the detail page
    await expect(page.getByRole("tablist")).not.toBeVisible()
  })

  test("shows a back button instead of a close button on the detail page", async ({ page }) => {
    await mockApis(page)
    await page.goto("/movies/550")
    await expect(page.getByRole("heading", { name: "Fight Club" })).toBeVisible({ timeout: 30000 })

    // Should have a back button, not a close button
    await expect(page.getByLabel("Back")).toBeVisible()
  })

  test("back button navigates away from the detail page and restores tabs", async ({ page }) => {
    await mockApis(page)
    await page.goto("/movies/550")
    await expect(page.getByRole("heading", { name: "Fight Club" })).toBeVisible({ timeout: 30000 })

    // Click back
    await page.getByLabel("Back").click()

    // Tab bar should be visible again
    await expect(page.getByRole("tablist")).toBeVisible()
  })
})

test.describe("add to watchlist", () => {
  test("add a search result to the watchlist, then see it on the Watchlist tab", async ({
    page,
  }) => {
    await mockApis(page)
    await page.goto("/movies/discover")
    await expect(page.getByText("Coming soon")).toBeVisible({ timeout: 30000 })

    // Search for movies
    const searchInput = page.getByPlaceholder("Search movies & TV shows...")
    await searchInput.fill("Fight Club")

    // Wait for search results to appear in the dropdown, then click the first result
    const fightClubResult = page.locator("[cmdk-item]").filter({ hasText: "Fight Club" })
    await expect(fightClubResult).toBeVisible()
    await fightClubResult.click()

    // Should navigate to the detail page
    await expect(page.getByRole("heading", { name: "Fight Club" })).toBeVisible()

    // Tab bar should be hidden on the detail page
    await expect(page.getByRole("tablist")).not.toBeVisible()

    // Click "Add to watchlist" on the detail page
    await page.getByLabel("Add to watchlist").click()

    // Navigate back from the detail page, then switch to the Watchlist tab
    await page.getByLabel("Back").click()
    await page.getByRole("tab", { name: "Watchlist" }).click()
    await expect(page.getByText("Fight Club").first()).toBeVisible()
    await expect(page.getByText("Your watchlist is empty")).not.toBeVisible()
  })
})
