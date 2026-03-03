import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchOGMetadata } from "@/lib/utils/metadata";

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
  const { url, collection_id } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Fetch OG metadata server-side
  const metadata = await fetchOGMetadata(url);

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      url,
      collection_id: collection_id || null,
      title: metadata.title,
      description: metadata.description,
      image_url: metadata.image_url,
      site_name: metadata.site_name,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
