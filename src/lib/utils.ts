import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combine Tailwind class names, merging conflicts. */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Combine Tailwind class names, merging conflicts. Alias for `cx`. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
