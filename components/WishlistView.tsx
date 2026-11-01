"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { Studio } from "@/lib/types";
import EmptyState from "./EmptyState";
import { useWishlist } from "./Providers";
import { GridSkeleton } from "./Skeletons";
import StudioCard from "./StudioCard";

export default function WishlistView() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const { ids, loaded } = useWishlist();

  useEffect(() => {
    api<Studio[]>("/api/wishlist").then(setStudios).catch((err) => setLoadError(errorMessage(err)));
  }, []);

  // A studio leaves this page as soon as its heart is switched off
  const shown = studios && loaded ? studios.filter((studio) => ids.has(studio._id)) : null;

  return (
    <div className="page-shell py-12">
      <p className="eyebrow">Your shortlist</p>
      <h1 className="section-title mb-8">Saved studios</h1>
      {loadError ? (
        <p role="alert" className="text-error">{loadError}</p>
      ) : !shown ? (
        <GridSkeleton count={3} />
      ) : shown.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet" text="Tap the heart on any studio to keep it here while you compare." href="/studios" cta="Explore Studios" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((studio) => <StudioCard key={studio._id} studio={studio} />)}
        </div>
      )}
    </div>
  );
}
