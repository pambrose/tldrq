/** Pill button class string used by filter and collection tabs */
export function pillClass(active: boolean): string {
  return `rounded-full px-3 py-1 text-sm font-medium transition-colors ${
    active
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
  }`;
}

/** Extract display hostname from a URL, falling back to the raw string */
export function getDisplayUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
