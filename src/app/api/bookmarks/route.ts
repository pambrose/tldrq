import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchOGMetadata, isYouTubeUrl, isTwitterUrl, isVimeoUrl, isTikTokUrl, isGitHubUrl, isGitLabUrl } from "@/lib/utils/metadata";
import { PRIORITY_LEVELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get("collection_id");
  const isRead = searchParams.get("is_read");

  let query = supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (collectionId === "uncategorized") {
    query = query.is("collection_id", null);
  } else if (collectionId) {
    query = query.eq("collection_id", collectionId);
  }

  if (isRead === "true") {
    query = query.eq("is_read", true);
  } else if (isRead === "false") {
    query = query.eq("is_read", false);
  }

  const priorityFilter = searchParams.get("priority");
  if (priorityFilter && (PRIORITY_LEVELS as readonly string[]).includes(priorityFilter)) {
    query = query.eq("priority", priorityFilter);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { url, collection_id, priority } = body;
  const safePriority: Priority = (PRIORITY_LEVELS as readonly string[]).includes(priority) ? priority : "normal";

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Fetch OG metadata server-side
  const metadata = await fetchOGMetadata(url);

  // Auto-assign URLs to collections based on site (defaults to "Articles")
  let resolvedCollectionId = collection_id || null;
  if (!resolvedCollectionId) {
    const autoCollection =
      (isYouTubeUrl(url) || isVimeoUrl(url) || isTikTokUrl(url)) ? "Videos" :
      isTwitterUrl(url) ? "Tweets" :
      (isGitHubUrl(url) || isGitLabUrl(url)) ? "Repos" : "Articles";
    const { data: existing } = await supabase
      .from("collections")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", autoCollection)
      .single();

    if (existing) {
      resolvedCollectionId = existing.id;
    } else {
      const { data: created } = await supabase
        .from("collections")
        .insert({ user_id: user.id, name: autoCollection })
        .select("id")
        .single();
      if (created) resolvedCollectionId = created.id;
    }
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      url,
      collection_id: resolvedCollectionId,
      priority: safePriority,
      title: metadata.title,
      description: metadata.description,
      image_url: metadata.image_url,
      site_name: metadata.site_name,
      repo_stars: metadata.repo_stars ?? null,
      repo_forks: metadata.repo_forks ?? null,
      repo_language: metadata.repo_language ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
