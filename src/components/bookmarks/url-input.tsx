"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Collection } from "@/types/database";
import { PRIORITY_LEVELS, PRIORITY_LABELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";


function extractUrl(dataTransfer: DataTransfer): string | null {
  const uriList = dataTransfer.getData("text/uri-list");
  if (uriList) {
    const firstUrl = uriList.split("\n").find((line) => line.startsWith("http"));
    if (firstUrl) return firstUrl.trim();
  }
  const text = dataTransfer.getData("text/plain");
  if (text) {
    const trimmed = text.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
  }
  return null;
}

export function UrlInput({ collections }: { collections: Collection[] }) {
  const [url, setUrl] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();

  const saveBookmark = useCallback(async (bookmarkUrl: string) => {
    if (!bookmarkUrl.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: bookmarkUrl.trim(),
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
  }, [collectionId, priority, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBookmark(url);
  };

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (dragCounter === 1) setIsDragOver(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragOver(false);
      if (e.dataTransfer) {
        const droppedUrl = extractUrl(e.dataTransfer);
        if (droppedUrl) {
          setUrl(droppedUrl);
          saveBookmark(droppedUrl);
        }
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [saveBookmark]);

  return (
    <div className="space-y-2">
    {isDragOver && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm pointer-events-none">
        <div className="rounded-2xl border-2 border-dashed border-blue-500 bg-white/90 px-12 py-8 shadow-lg dark:bg-gray-900/90">
          <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
            Drop URL to save bookmark
          </p>
        </div>
      </div>
    )}
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
        title="Save URL"
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
    </form>
    </div>
  );
}
