import { createClient } from "@/lib/supabase/server";
import { UrlInput } from "@/components/bookmarks/url-input";
import { CollectionTabs } from "@/components/collections/collection-tabs";
import { FilterTabs } from "@/components/bookmarks/filter-tabs";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { CollectionMenu } from "@/components/collections/collection-menu";
import { RefreshButton } from "@/components/bookmarks/refresh-button";
import { ExportButton } from "@/components/bookmarks/export-button";
import { ImportButton } from "@/components/bookmarks/import-button";
import { DeleteAllButton } from "@/components/bookmarks/delete-all-button";
import { ShareButton } from "@/components/share-button";
import { SearchInput } from "@/components/bookmarks/search-input";
import { PRIORITY_LEVELS } from "@/lib/utils/priority";
import type { Bookmark, Collection } from "@/types/database";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; filter?: string; priority?: string; sort?: string; search?: string }>;
}) {
  const { collection, filter, priority, sort, search } = await searchParams;
  const supabase = await createClient();

  // Fetch collections
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: true });

  // Build bookmarks query
  let query = supabase
    .from("bookmarks")
    .select("*");

  if (collection === "uncategorized") {
    query = query.is("collection_id", null);
  } else if (collection) {
    query = query.eq("collection_id", collection);
  }

  if (filter === "unread") {
    query = query.eq("is_read", false);
  } else if (filter === "read") {
    query = query.eq("is_read", true);
  }

  if (priority && (PRIORITY_LEVELS as readonly string[]).includes(priority)) {
    query = query.eq("priority", priority);
  }

  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `title.ilike.${term},description.ilike.${term},url.ilike.${term},site_name.ilike.${term}`
    );
  }

  if (sort === "priority") {
    query = query
      .order("priority_order", { ascending: true })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: bookmarks } = await query;

  const typedCollections = (collections || []) as Collection[];
  const typedBookmarks = (bookmarks || []) as Bookmark[];

  // Find the active collection for the menu
  const activeCollection = collection && collection !== "uncategorized"
    ? typedCollections.find((c) => c.id === collection)
    : null;

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <UrlInput collections={typedCollections} />

      {/* Collapsible filters */}
      <details open={!!(collection || filter || priority || sort || search)} className="group">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400 select-none">
          <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Filters{(collection || filter || priority || sort || search) ? " (active)" : ""}
        </summary>
        <div className="mt-3 space-y-4">
          <SearchInput />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <CollectionTabs collections={typedCollections} />
            </div>
            {activeCollection && <CollectionMenu collection={activeCollection} />}
          </div>
          <FilterTabs />
        </div>
      </details>

      {/* Count + refresh */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {typedBookmarks.length} bookmark{typedBookmarks.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <DeleteAllButton ids={typedBookmarks.map((b) => b.id)} />
          <ImportButton collections={typedCollections} />
          <ExportButton urls={typedBookmarks.map((b) => b.url)} />
          <ShareButton />
          <RefreshButton />
        </div>
      </div>

      {/* Bookmark list */}
      <BookmarkList bookmarks={typedBookmarks} collections={typedCollections} />
    </div>
  );
}
