/** Select the best YouTube trailer key from TMDB video results. */
export function selectBestTrailerKey(
  /** The TMDB video results. */
  videos: readonly TmdbVideo[],
): string | null {
  const youtubeVideos = videos.filter(video => video.site === "YouTube")
  return (
    youtubeVideos.find(video => video.type === "Trailer" && video.official)?.key ??
    youtubeVideos.find(video => video.type === "Trailer")?.key ??
    youtubeVideos[0]?.key ??
    null
  )
}

/** A TMDB video result used for trailer selection. */
type TmdbVideo = { key: string; site: string; type: string; official: boolean }
