import { notFound } from "next/navigation";
import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { BookmarkCardReadonly } from "@/components/bookmarks/bookmark-card-readonly";
import type { Bookmark, Collection, SharedView } from "@/types/database";

// `.single()` reports "no rows" as this error code, and that case is a normal 404.
const NO_ROWS = "PGRST116";

// Without this, a failed read would look like a missing share or an empty list.
function throwIfReadFailed(error: PostgrestError | null) {
  if (error && error.code !== NO_ROWS) {
    throw new Error(`Failed to load shared page: ${error.message}`);
  }
}

function buildViewLabel(view: SharedView, collectionName: string | null): string {
  const parts: string[] = [];
  if (collectionName) parts.push(collectionName);
  else if (view.collection_uncategorized) parts.push("Uncategorized");
  if (view.priority) parts.push(view.priority);
  if (view.filter) parts.push(view.filter);
  if (view.search) parts.push(`Search: ${view.search}`);

  return parts.length > 0 ? parts.join(" · ") : "All bookmarks";
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try shared_views first
  const { data: sharedView, error: sharedViewError } = await supabase
    .from("shared_views")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  throwIfReadFailed(sharedViewError);

  if (sharedView) {
    const typedView = sharedView as SharedView;

    // Fetch bookmarks via the security definer function
    const { data: bookmarks, error: bookmarksError } = await supabase.rpc("get_shared_bookmarks", {
      view_slug: slug,
    });
    throwIfReadFailed(bookmarksError);
    const typedBookmarks = (bookmarks || []) as Bookmark[];

    // Get collection name if applicable
    let collectionName: string | null = null;
    if (typedView.collection_id) {
      const { data: col } = await supabase
        .from("collections")
        .select("name")
        .eq("id", typedView.collection_id)
        .single();
      if (col) collectionName = (col as Collection).name;
    }

    const label = typedView.title || buildViewLabel(typedView, collectionName);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {label}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {typedBookmarks.length} bookmark{typedBookmarks.length !== 1 ? "s" : ""} &middot; Shared view
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">
          {typedBookmarks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">No bookmarks match this view</p>
            </div>
          ) : (
            <div className="space-y-3">
              {typedBookmarks.map((bookmark) => (
                <BookmarkCardReadonly key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Fall back to legacy collection share slug
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .single();

  throwIfReadFailed(collectionError);

  if (!collection) {
    notFound();
  }

  const typedCollection = collection as Collection;

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("collection_id", typedCollection.id)
    .order("created_at", { ascending: false });

  throwIfReadFailed(bookmarksError);

  const typedBookmarks = (bookmarks || []) as Bookmark[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {typedCollection.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {typedBookmarks.length} bookmark{typedBookmarks.length !== 1 ? "s" : ""} &middot; Shared collection
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        {typedBookmarks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">No bookmarks in this collection</p>
          </div>
        ) : (
          <div className="space-y-3">
            {typedBookmarks.map((bookmark) => (
              <BookmarkCardReadonly key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
