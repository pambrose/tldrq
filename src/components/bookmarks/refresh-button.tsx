"use client";

import { useRefresh } from "./refresh-context";

export function RefreshButton() {
  const { isPending, refresh } = useRefresh();

  return (
    <button
      onClick={refresh}
      aria-label="Refresh displayed URLs"
      title="Refresh displayed URLs"
      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <svg
        className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0113.292-3.293M20 15a8 8 0 01-13.292 3.293" />
      </svg>
    </button>
  );
}
