import type { Bookmark, Collection } from "@/types/database";
import { BookmarkCard } from "./bookmark-card";

export function BookmarkList({
  bookmarks,
  collections,
}: {
  bookmarks: Bookmark[];
  collections: Collection[];
}) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
        <p className="text-sm text-gray-500">No bookmarks yet</p>
        <p className="mt-1 text-xs text-gray-400">
          Paste a URL above to save your first bookmark
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          collections={collections}
        />
      ))}
    </div>
  );
}
