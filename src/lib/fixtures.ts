import type { MediaItem } from "@/types"

/** A typical movie with full ratings and metadata. */
export const movieFixture: MediaItem = {
  id: "movie-550",
  tmdbId: 550,
  title: "Fight Club",
  year: 1999,
  posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  mediaType: "movie",
  overview:
    "A ticking-Loss bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  ratings: {
    rottenTomatoes: { critics: 79, audience: 96 },
    metacritic: 66,
    imdb: { score: 8.8, votes: 2200000 },
  },
  normalizedScore: 82,
}

/** A typical TV show with full ratings and metadata. */
export const tvShowFixture: MediaItem = {
  id: "tv-1396",
  tmdbId: 1396,
  title: "Breaking Bad",
  year: 2008,
  posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  mediaType: "tv",
  overview:
    "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
  ratings: {
    rottenTomatoes: { critics: 96, audience: 98 },
    metacritic: 87,
    imdb: { score: 9.5, votes: 2000000 },
  },
  normalizedScore: 95,
}

/** A media item missing its poster image. */
export const noPosterFixture: MediaItem = {
  id: "movie-9999",
  tmdbId: 9999,
  title: "The Obscure Indie Film",
  year: 2014,
  posterUrl: undefined,
  mediaType: "movie",
  overview: "A little-known independent film that never got a proper poster.",
  ratings: {
    imdb: { score: 6.2, votes: 340 },
  },
  normalizedScore: 62,
}

/** A media item with no ratings from any source. */
export const noRatingsFixture: MediaItem = {
  id: "movie-88888",
  tmdbId: 88888,
  title: "Upcoming Unreleased Movie",
  year: 2026,
  posterUrl: "https://image.tmdb.org/t/p/w500/xCHmhHeO7aOCMlzcNukGH6Q7EiD.jpg",
  mediaType: "movie",
  overview: "A film so new that no review aggregators have scored it yet.",
  ratings: {},
  normalizedScore: null,
}

/** A movie with an unusually long title. */
export const longTitleFixture: MediaItem = {
  id: "movie-77777",
  tmdbId: 77777,
  title:
    "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb — The Director's Extended Cut",
  year: 1964,
  posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  mediaType: "movie",
  overview:
    "An insane general triggers a path to nuclear holocaust that a war room full of politicians and generals frantically tries to stop.",
  ratings: {
    rottenTomatoes: { critics: 98, audience: 94 },
    metacritic: 97,
    imdb: { score: 8.4, votes: 500000 },
  },
  normalizedScore: 94,
}

/** A TV show with an unusually long title. */
export const longTitleTvFixture: MediaItem = {
  id: "tv-66666",
  tmdbId: 66666,
  title:
    "The Completely True and Totally Not Exaggerated Adventures of a Small Town Detective in Rural England",
  year: 2021,
  posterUrl: "https://image.tmdb.org/t/p/w500/z9gCSwIObDOD2BEtmUwfasar3xs.jpg",
  mediaType: "tv",
  overview:
    "A quirky British detective series set in a picturesque village where nothing is quite as it seems.",
  ratings: {
    rottenTomatoes: { critics: 88 },
    imdb: { score: 7.6, votes: 12000 },
  },
  normalizedScore: 78,
}

/** All fixture MediaItems collected into a single array. */
export const fixtures: MediaItem[] = [
  movieFixture,
  tvShowFixture,
  noPosterFixture,
  noRatingsFixture,
  longTitleFixture,
  longTitleTvFixture,
]
