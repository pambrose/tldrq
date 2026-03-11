"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function DesktopAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Signing in...");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) return;

    const isElectron = navigator.userAgent.includes("Electron");

    if (isElectron) {
      // Running inside Electron — set the session and redirect to dashboard
      const supabase = createClient();
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          router.replace("/");
        });
    } else {
      // Running in the system browser — try to hand off to the Electron app
      const protocolUrl = `tldrq://auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
      window.location.href = protocolUrl;
      setTimeout(() => {
        setStatus("Sign-in successful! You can close this tab and return to the tldrq app.");
      }, 1500);
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-300">
      <p>{status}</p>
    </div>
  );
}

export default function DesktopAuthPage() {
  return (
    <Suspense>
      <DesktopAuthContent />
    </Suspense>
  );
}
