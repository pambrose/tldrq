import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifySlackUserLogin } from "@/lib/utils/slack";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure default collections exist for the user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const defaultCollections = ["Videos", "Tweets", "Articles", "Repos"];
        const { data: existing } = await supabase
          .from("collections")
          .select("name")
          .eq("user_id", user.id)
          .in("name", defaultCollections);
        const existingNames = new Set((existing || []).map((c) => c.name));
        const missing = defaultCollections.filter((name) => !existingNames.has(name));
        if (missing.length > 0) {
          await supabase
            .from("collections")
            .insert(missing.map((name) => ({ user_id: user.id, name })));
        }
        await notifySlackUserLogin({
          email: user.email,
          name: user.user_metadata?.full_name,
          provider: user.app_metadata?.provider,
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login page with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
