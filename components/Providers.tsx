"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { api, refreshToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";

interface WishlistValue {
  ids: Set<string>;
  loaded: boolean;
  add: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside Providers");
  return value;
}

export default function Providers({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Each login, including Google, gets a fresh JWT cookie before the saved studios are loaded
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        await refreshToken();
        const saved = await api<Studio[]>("/api/wishlist");
        if (active) setIds(new Set(saved.map((studio) => studio._id)));
      } catch {
        // Saved hearts can stay empty if this fails. The action itself will show any error.
      } finally {
        if (active) setLoadedFor(userId);
      }
    })();
    return () => {
      active = false;
      setIds(new Set());
      setLoadedFor(null);
    };
  }, [userId]);

  const add = useCallback(async (id: string) => {
    await api(`/api/wishlist/${id}`, { method: "POST" });
    setIds((current) => new Set(current).add(id));
  }, []);

  const remove = useCallback(async (id: string) => {
    await api(`/api/wishlist/${id}`, { method: "DELETE" });
    setIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const loaded = Boolean(userId) && loadedFor === userId;
  const value = useMemo(() => ({ ids, loaded, add, remove }), [ids, loaded, add, remove]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </WishlistContext.Provider>
  );
}
