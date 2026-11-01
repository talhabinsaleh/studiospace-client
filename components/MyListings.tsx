"use client";

import { Building2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { money } from "@/lib/format";
import type { Studio } from "@/lib/types";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import { RowsSkeleton } from "./Skeletons";
import { RatingBadge } from "./StudioCard";
import StudioImage from "./StudioImage";

export default function MyListings() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [target, setTarget] = useState<Studio | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Studio[]>("/api/studios/mine").then(setStudios).catch((err) => setLoadError(errorMessage(err)));
  }, []);

  async function confirmDelete() {
    if (!target) return;
    setBusy(true);
    try {
      await api(`/api/studios/${target._id}`, { method: "DELETE" });
      setStudios((current) => current?.filter((studio) => studio._id !== target._id) ?? null);
      toast.success(`${target.title} was deleted.`);
      setTarget(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your spaces</p>
          <h1 className="section-title">My studio listings</h1>
        </div>
        <Link href="/add-studio" className="btn btn-primary"><Plus className="size-4" /> Add New Studio</Link>
      </div>

      {loadError ? (
        <p role="alert" className="text-error">{loadError}</p>
      ) : !studios ? (
        <RowsSkeleton />
      ) : studios.length === 0 ? (
        <EmptyState icon={Building2} title="You have not listed a space yet" text="Turn your empty studio hours into income. It only takes a few minutes." href="/add-studio" cta="Add your first studio" />
      ) : (
        <ul className="space-y-4">
          {studios.map((studio) => (
            <li key={studio._id} className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-200 p-4 sm:flex-row sm:items-center">
              <StudioImage src={studio.image} alt={studio.title} className="aspect-[3/2] w-full rounded-field object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{studio.category}</p>
                <Link href={`/studios/${studio._id}`} className="mt-1 block text-lg font-semibold hover:text-primary">{studio.title}</Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/70">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {studio.location}</span>
                  <span className="font-mono">{money(studio.hourlyRate)} / hr</span>
                  <RatingBadge rating={studio.rating} count={studio.reviewCount} />
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline btn-sm flex-1 sm:flex-none"><Pencil className="size-3.5" /> Update</Link>
                <button type="button" onClick={() => setTarget(studio)} className="btn btn-outline btn-error btn-sm flex-1 sm:flex-none"><Trash2 className="size-3.5" /> Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal open={Boolean(target)} title="Delete this studio?" confirmLabel="Delete studio" busy={busy} onConfirm={confirmDelete} onClose={() => setTarget(null)}>
        <strong>{target?.title}</strong> and its reviews will be permanently removed. Pending requests for it will be cancelled.
      </ConfirmModal>
    </div>
  );
}
