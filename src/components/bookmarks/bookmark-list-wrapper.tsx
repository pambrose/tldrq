"use client";

import { useRefresh } from "./refresh-context";

export function BookmarkListWrapper({ children }: { children: React.ReactNode }) {
  const { isPending } = useRefresh();

  return (
    <div className={`transition-opacity duration-200 ${isPending ? "opacity-0" : "opacity-100"}`}>
      {children}
    </div>
  );
}
