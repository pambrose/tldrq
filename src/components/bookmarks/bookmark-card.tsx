"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Bookmark, Collection } from "@/types/database";
import { timeAgo } from "@/lib/utils/time";

export function BookmarkCard({
  bookmark,
  collections,
}: {
  bookmark: Bookmark;
  collections: Collection[];
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);

  const toggleRead = async () => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !bookmark.is_read }),
    });
    router.refresh();
  };

  const moveToCollection = async (collectionId: string | null) => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection_id: collectionId }),
    });
    setMoveMenuOpen(false);
    setMenuOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this bookmark?")) return;
    await fetch(`/api/bookmarks/${bookmark.id}`, { method: "DELETE" });
    router.refresh();
  };

  const displayUrl = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div
      className={`relative rounded-lg border bg-white p-4 transition-shadow hover:shadow-md ${
        !bookmark.is_read ? "border-l-4 border-l-blue-500" : ""
      }`}
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
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
          >
            {bookmark.title || bookmark.url}
          </a>
          <p className="mt-0.5 text-xs text-gray-500">{displayUrl}</p>
          {bookmark.description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
              {bookmark.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {timeAgo(bookmark.created_at)}
            </span>
            <button
              onClick={toggleRead}
              className={`text-xs font-medium transition-colors ${
                bookmark.is_read
                  ? "text-gray-400 hover:text-blue-600"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {bookmark.is_read ? "Mark as unread" : "Mark as read"}
            </button>
          </div>
        </div>

        {/* Overflow menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => { setMenuOpen(!menuOpen); setMoveMenuOpen(false); }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border bg-white py-1 shadow-lg">
              <button
                onClick={() => setMoveMenuOpen(!moveMenuOpen)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Move to collection
              </button>
              {moveMenuOpen && (
                <div className="border-t">
                  <button
                    onClick={() => moveToCollection(null)}
                    className="w-full px-6 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Uncategorized
                  </button>
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => moveToCollection(c.id)}
                      className="w-full px-6 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
