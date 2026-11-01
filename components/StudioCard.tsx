import { MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Studio } from "@/lib/types";
import HeartButton from "./HeartButton";
import StudioImage from "./StudioImage";

export function RatingBadge({ rating, count }: { rating: number; count?: number }) {
  if (!rating) return <span className="badge badge-sm badge-outline">New</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <Star className="size-3.5 fill-secondary text-secondary" />
      {rating.toFixed(1)}
      {count !== undefined && <span className="font-normal text-base-content/60">({count})</span>}
    </span>
  );
}

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-200 transition-colors hover:border-primary/60">
      <div className="relative aspect-[3/2] overflow-hidden">
        <StudioImage src={studio.image} alt={studio.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-selector bg-black/70 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-white">{studio.category}</span>
        <HeartButton studioId={studio._id} title={studio.title} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug">{studio.title}</h3>
          <div className="shrink-0 pt-1"><RatingBadge rating={studio.rating} /></div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-base-content/70">
          <MapPin className="size-4 shrink-0" /> <span className="truncate">{studio.location}</span>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/70">
          <Users className="size-4 shrink-0" /> Up to {studio.maxCapacity} people
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="font-mono text-lg font-semibold">
            {money(studio.hourlyRate)}<span className="text-sm font-normal text-base-content/60"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
