"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteAllButton({ ids }: { ids: string[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (ids.length === 0) return;

    const confirmed = confirm(
      `Delete ${ids.length} bookmark${ids.length !== 1 ? "s" : ""}?`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      for (const id of ids) {
        await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDeleteAll}
      disabled={deleting || ids.length === 0}
      aria-label="Delete displayed bookmarks"
      title="Delete displayed URLs"
      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      {deleting ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}
