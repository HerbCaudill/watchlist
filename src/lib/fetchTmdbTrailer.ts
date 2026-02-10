import type { MediaType } from "@/types"

/**
 * Fetch the best YouTube trailer key for a given TMDB media item.
 * Prefers official YouTube trailers, then any YouTube trailer, then any YouTube video.
 * Returns the YouTube video key (string) or `null` if none is found.
 */
export async function fetchTmdbTrailer(
  /** The TMDB ID of the media item. */
  tmdbId: number,
  /** Whether this is a movie or TV show. */
  mediaType: MediaType,
  /** TMDB API key. Defaults to the `VITE_TMDB_API_KEY` environment variable. */
  apiKey: string = import.meta.env.VITE_TMDB_API_KEY,
): Promise<string | null> {
  try {
    const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/videos?api_key=${apiKey}`
    const response = await fetch(url)
    const data: TmdbVideosResponse = await response.json()

    if (!data.results || data.results.length === 0) {
      return null
    }

    const youtubeVideos = data.results.filter(v => v.site === "YouTube")

    // Priority: official trailer > any trailer > any YouTube video
    const officialTrailer = youtubeVideos.find(v => v.type === "Trailer" && v.official)
    if (officialTrailer) return officialTrailer.key

    const trailer = youtubeVideos.find(v => v.type === "Trailer")
    if (trailer) return trailer.key

    if (youtubeVideos.length > 0) {
      return youtubeVideos[0].key
    }

    return null
  } catch (error) {
    console.error("Failed to fetch TMDB trailer:", error)
    return null
  }
}

/** Shape of the TMDB `/videos` endpoint response. */
interface TmdbVideosResponse {
  results: Array<{
    key: string
    site: string
    type: string
    official: boolean
  }>
}
