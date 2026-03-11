"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginDesktopContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get("provider") as "google" | "github" | null;
    if (provider) {
      const supabase = createClient();
      supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback-desktop`,
        },
      });
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Redirecting to sign in...</p>
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
