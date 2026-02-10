import { IconMovie } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

/** Displays a movie/TV show poster image with a 2:3 aspect ratio and placeholder fallback. */
export function PosterImage({ src, alt, size = "md" }: Props) {
  const sizeClasses = {
    sm: "w-20",
    md: "w-32",
    lg: "w-48",
  }

  const iconSizes = {
    sm: 24,
    md: 36,
    lg: 48,
  }

  return (
    <div className={cn("aspect-2/3 overflow-hidden rounded-md", sizeClasses[size])}>
      {src ?
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      : <div
          aria-label={alt}
          className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center"
        >
          <IconMovie size={iconSizes[size]} stroke={1.5} />
        </div>
      }
    </div>
  )
}

/** Props for the PosterImage component. */
type Props = {
  /** URL of the poster image. When omitted, a placeholder icon is shown. */
  src?: string
  /** Alt text for the image, or accessible label for the placeholder. */
  alt: string
  /** Display size of the poster. */
  size?: "sm" | "md" | "lg"
}
