import type {Bookmark, Collection} from "@/types/database";
import {BookmarkCard} from "./bookmark-card";

export function BookmarkList({
  bookmarks,
  collections,
}: {
  bookmarks: Bookmark[];
  collections: Collection[];
}) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
        <p className="text-sm text-gray-500 dark:text-gray-400">No bookmarks yet</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Paste a URL above, or drag and drop one onto the page to save your first bookmark
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
