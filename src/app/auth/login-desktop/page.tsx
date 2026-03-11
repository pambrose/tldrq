"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginDesktopContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get("provider") as "google" | "github" | null;
    const port = searchParams.get("port");
    if (provider && port) {
      const supabase = createClient();
      // Clear any stale session/PKCE state before starting fresh OAuth
      supabase.auth.signOut().finally(() => {
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback-desktop?port=${port}`,
          },
        });
      });
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-300">
      <p>Redirecting to sign in...</p>
    </div>
  );
}

export default function LoginDesktopPage() {
  return (
    <Suspense>
      <LoginDesktopContent />
    </Suspense>
  );
}
