"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fadeCollapse } from "@/lib/utils/fade-collapse";
import type { Bookmark, Collection } from "@/types/database";
import { timeAgo } from "@/lib/utils/time";
import { PRIORITY_BORDER, PRIORITY_LEVELS, PRIORITY_LABELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";
import { getDisplayUrl } from "@/lib/utils/ui";
import { PriorityBadge } from "./priority-badge";
import { RepoStats } from "./repo-stats";

export function BookmarkCard({
  bookmark,
  collections,
}: {
  bookmark: Bookmark;
  collections: Collection[];
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleRead = async () => {
    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !bookmark.is_read }),
    });
    if (!res.ok) { alert("Failed to update read status"); return; }
    router.refresh();
  };

  const moveToCollection = async (collectionId: string | null) => {
    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection_id: collectionId }),
    });
    if (!res.ok) { alert("Failed to move bookmark"); return; }
    setMoveMenuOpen(false);
    setMenuOpen(false);
    router.refresh();
  };

  const changePriority = async (newPriority: Priority) => {
    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    if (!res.ok) { alert("Failed to change priority"); return; }
    setPriorityMenuOpen(false);
    setMenuOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this bookmark?")) return;
    setDeleting(true);
    setMenuOpen(false);
    // Run API call and animation concurrently for instant visual feedback
    const [res] = await Promise.all([
      fetch(`/api/bookmarks/${bookmark.id}`, { method: "DELETE" }),
      cardRef.current ? fadeCollapse(cardRef.current) : Promise.resolve(),
    ]);
    if (!res.ok) { alert("Failed to delete bookmark"); }
    router.refresh();
  };

  const collectionName = bookmark.collection_id
    ? collections.find((c) => c.id === bookmark.collection_id)?.name ?? null
    : null;

  const displayUrl = getDisplayUrl(bookmark.url);

  // Priority border takes precedence; normal falls back to unread blue
  const borderClass = (() => {
    if (bookmark.priority !== "normal") return PRIORITY_BORDER[bookmark.priority];
    if (!bookmark.is_read) return "border-l-4 border-l-blue-500";
    return "";
  })();

  return (
    <div
      ref={cardRef}
      className={`relative rounded-lg border bg-white p-4 transition-all duration-300 ease-in-out hover:shadow-md dark:bg-gray-900 dark:border-gray-700 ${borderClass} ${deleting ? "pointer-events-none" : ""}`}
    >
      <div className="flex gap-4">
        {/* OG Image thumbnail */}
        {bookmark.image_url && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={bookmark.image_url}
              alt=""
              className="h-20 w-28 rounded object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 dark:text-gray-100"
          >
            {bookmark.title || bookmark.url}
          </a>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{displayUrl}</p>
          {bookmark.description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
              {bookmark.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {timeAgo(bookmark.created_at)}
            </span>
            {collectionName && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {collectionName}
              </span>
            )}
            <PriorityBadge priority={bookmark.priority} />
            <RepoStats bookmark={bookmark} />
            <button
              onClick={toggleRead}
              className={`text-xs font-medium transition-colors ${
                bookmark.is_read
                  ? "text-gray-400 hover:text-blue-600 dark:text-gray-500"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {bookmark.is_read ? "Mark as unread" : "Mark as read"}
            </button>
          </div>
        </div>

        {/* Overflow menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => { setMenuOpen(!menuOpen); setMoveMenuOpen(false); setPriorityMenuOpen(false); }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <button
                onClick={() => { setPriorityMenuOpen(!priorityMenuOpen); setMoveMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Set priority
              </button>
              {priorityMenuOpen && (
                <div className="border-t dark:border-gray-600">
                  {PRIORITY_LEVELS.map((p) => (
                    <button
                      key={p}
                      onClick={() => changePriority(p)}
                      className={`w-full px-6 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        bookmark.priority === p
                          ? "font-semibold text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {PRIORITY_LABELS[p]}
                      {bookmark.priority === p && " \u2713"}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setMoveMenuOpen(!moveMenuOpen); setPriorityMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Move to collection
              </button>
              {moveMenuOpen && (
                <div className="border-t dark:border-gray-600">
                  <button
                    onClick={() => moveToCollection(null)}
                    className={`w-full px-6 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !bookmark.collection_id
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Uncategorized{!bookmark.collection_id && " \u2713"}
                  </button>
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => moveToCollection(c.id)}
                      className={`w-full px-6 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        bookmark.collection_id === c.id
                          ? "font-semibold text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {c.name}{bookmark.collection_id === c.id && " \u2713"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete button — bottom right */}
      <button
        onClick={handleDelete}
        aria-label="Delete bookmark"
        title="Delete bookmark"
        className="absolute bottom-2 right-2 rounded-lg p-1 text-gray-300 hover:bg-gray-100 hover:text-red-600 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
