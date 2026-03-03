import type { Bookmark } from "@/types/database";
import { PRIORITY_BORDER } from "@/lib/utils/priority";
import { getDisplayUrl } from "@/lib/utils/ui";
import { PriorityBadge } from "./priority-badge";
import { RepoStats } from "./repo-stats";

export function BookmarkCardReadonly({ bookmark }: { bookmark: Bookmark }) {
  const displayUrl = getDisplayUrl(bookmark.url);

  return (
    <div className={`rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${PRIORITY_BORDER[bookmark.priority] || ""}`}>
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
            <PriorityBadge priority={bookmark.priority} />
            <RepoStats bookmark={bookmark} />
          </div>
        </div>
      </div>
    </div>
  );
}
