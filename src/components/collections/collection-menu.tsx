"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Collection } from "@/types/database";

export function CollectionMenu({ collection }: { collection: Collection }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(collection.name);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleRename = async () => {
    if (!newName.trim()) return;
    const res = await fetch(`/api/collections/${collection.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) { alert("Failed to rename collection"); return; }
    setIsRenaming(false);
    setMenuOpen(false);
    router.refresh();
  };

  const togglePublic = async () => {
    const res = await fetch(`/api/collections/${collection.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: !collection.is_public }),
    });
    if (!res.ok) { alert("Failed to update sharing"); return; }
    const data = await res.json();
    if (data.share_slug) {
      setShareUrl(`${window.location.origin}/share/${data.share_slug}`);
    } else {
      setShareUrl(null);
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${collection.name}"? Bookmarks will become uncategorized.`)) return;
    const res = await fetch(`/api/collections/${collection.id}`, { method: "DELETE" });
    if (!res.ok) { alert("Failed to delete collection"); return; }
    // Clear collection filter if viewing this collection
    if (searchParams.get("collection") === collection.id) {
      router.push("/");
    } else {
      router.refresh();
    }
  };

  const copyShareUrl = () => {
    const url = shareUrl || `${window.location.origin}/share/${collection.share_slug}`;
    navigator.clipboard.writeText(url);
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRename()}
          autoFocus
          className="w-32 rounded border border-gray-300 px-2 py-0.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button onClick={handleRename} className="text-xs text-blue-600 hover:text-blue-700">Save</button>
        <button onClick={() => setIsRenaming(false)} className="text-xs text-gray-500 dark:text-gray-400">Cancel</button>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        title="Collection settings"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute left-0 top-7 z-10 w-56 rounded-lg border bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <button
            onClick={() => { setIsRenaming(true); setMenuOpen(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Rename
          </button>
          <button
            onClick={togglePublic}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {collection.is_public ? "Make private" : "Share publicly"}
          </button>
          {(collection.is_public && collection.share_slug) && (
            <div className="border-t px-3 py-2 dark:border-gray-600">
              <p className="text-xs text-gray-500 mb-1 dark:text-gray-400">Share URL:</p>
              <div className="flex items-center gap-1">
                <code className="flex-1 truncate text-xs text-blue-600 dark:text-blue-400">
                  /share/{collection.share_slug}
                </code>
                <button
                  onClick={copyShareUrl}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleDelete}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Delete collection
          </button>
        </div>
      )}
    </div>
  );
}
