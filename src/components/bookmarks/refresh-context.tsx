"use client";

import { createContext, useContext, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";

type RefreshContextType = {
  isPending: boolean;
  refresh: () => void;
};

const RefreshContext = createContext<RefreshContextType>({
  isPending: false,
  refresh: () => {},
});

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);

  const refresh = useCallback(() => {
    setSpinning(true);
    startTransition(() => {
      router.refresh();
    });
    setTimeout(() => setSpinning(false), 600);
  }, [router]);

  return (
    <RefreshContext.Provider value={{ isPending: spinning || isTransitioning, refresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
