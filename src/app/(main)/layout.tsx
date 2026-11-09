import { redirect } from "next/navigation";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  // The proxy has already checked this user with Supabase. getClaims verifies the
  // token locally when the project uses asymmetric signing keys, saving a round trip.
  const { data, error } = await supabase.auth.getClaims();

  if (isAuthRetryableFetchError(error)) {
    throw error;
  }

  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        userEmail={claims.email || "User"}
        userName={claims.user_metadata?.full_name || claims.user_metadata?.name || null}
        avatarUrl={claims.user_metadata?.avatar_url || null}
      />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
