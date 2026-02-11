import { useEffect, useState } from "react"

/** Returns a debounced version of the given value, updating only after the specified delay. */
export function useDebounce<T>(
  /** The value to debounce. */
  value: T,
  /** Delay in milliseconds before the debounced value updates. */
  delay: number,
): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
