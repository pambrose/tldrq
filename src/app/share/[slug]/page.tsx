import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookmarkCardReadonly } from "@/components/bookmarks/bookmark-card-readonly";
import type { Bookmark, Collection } from "@/types/database";

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch the public collection by share slug
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .single();

  if (!collection) {
    notFound();
  }

  const typedCollection = collection as Collection;

  // Fetch bookmarks in this collection
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("collection_id", typedCollection.id)
    .order("created_at", { ascending: false });

  const typedBookmarks = (bookmarks || []) as Bookmark[];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">
            {typedCollection.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {typedBookmarks.length} bookmark{typedBookmarks.length !== 1 ? "s" : ""} &middot; Shared collection
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        {typedBookmarks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="text-sm text-gray-500">No bookmarks in this collection</p>
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
