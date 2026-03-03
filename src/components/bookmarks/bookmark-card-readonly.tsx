import type { Bookmark } from "@/types/database";

export function BookmarkCardReadonly({ bookmark }: { bookmark: Bookmark }) {
  const displayUrl = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex gap-4">
        {bookmark.image_url && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={bookmark.image_url}
              alt=""
              className="h-20 w-28 rounded object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
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
        </div>
      </div>
    </div>
  );
}
