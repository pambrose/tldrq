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
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const metadata = await fetchOGMetadata(url);
  return NextResponse.json(metadata);
}
