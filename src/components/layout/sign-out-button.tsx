"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    // Local scope: end only this browser's session, not the user's sessions on other devices
    await supabase.auth.signOut({ scope: "local" });
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      title="Sign out"
      className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
    >
      Sign out
    </button>
  );
}
