"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Collection } from "@/types/database";
import { PRIORITY_LEVELS, PRIORITY_LABELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";
import { BulkImport } from "./bulk-import";

export function UrlInput({ collections }: { collections: Collection[] }) {
  const [url, setUrl] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          collection_id: collectionId || null,
          priority,
        }),
      });

      if (res.ok) {
        setUrl("");
        setPriority("normal");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save bookmark");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        required
        autoFocus
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      <select
        value={collectionId}
        onChange={(e) => setCollectionId(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="">Auto-categorize</option>
        {collections.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {PRIORITY_LEVELS.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setShowBulkImport((v) => !v)}
        title="Import URLs"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
      >
        Import
      </button>
    </form>
    {showBulkImport && (
      <BulkImport
        collections={collections}
        onClose={() => setShowBulkImport(false)}
      />
    )}
    </div>
  );
}
