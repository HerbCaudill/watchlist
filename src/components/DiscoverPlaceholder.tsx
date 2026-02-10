import { IconCompass } from "@tabler/icons-react"

/** Placeholder for the Discover tab, displaying a "Coming soon" message with an icon. */
export const DiscoverPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-400">
      <IconCompass size={48} stroke={1.5} />
      <p className="text-lg font-medium">Coming soon</p>
    </div>
  )
}
