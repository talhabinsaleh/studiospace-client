import { Check, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import BookingPanel from "@/components/BookingPanel";
import Gallery from "@/components/Gallery";
import HeartButton from "@/components/HeartButton";
import Reviews from "@/components/Reviews";
import { RatingBadge } from "@/components/StudioCard";
import { getReviews, getStudio } from "@/lib/server-api";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const studio = await getStudio((await params).id);
  return studio ? { title: studio.title, description: studio.overview.slice(0, 155) } : { title: "Studio not found" };
}

export default async function StudioDetailsPage({ params }: Props) {
  const { id } = await params;
  const [studio, reviews] = await Promise.all([getStudio(id), getReviews(id)]);
  if (!studio) notFound();

  return (
    <div className="page-shell py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{studio.category}</p>
          <h1 className="section-title">{studio.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-base-content/75">
            <RatingBadge rating={studio.rating} count={studio.reviewCount} />
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {studio.location}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> Up to {studio.maxCapacity} people</span>
          </p>
        </div>
        <HeartButton studioId={studio._id} title={studio.title} />
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <Gallery images={[studio.image, ...studio.gallery]} title={studio.title} />

          <section>
            <h2 className="text-2xl font-semibold">About this space</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/85">{studio.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2.5"><Check className="size-4 shrink-0 text-primary" /> {amenity}</li>
              ))}
            </ul>
          </section>

          <section className="flex items-center gap-4 rounded-box border border-base-300 bg-base-200 p-5">
            <Avatar name={studio.ownerName} src={studio.ownerPhoto} className="size-14 text-lg" />
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-wider text-base-content/65">Your host</p>
              <h2 className="text-lg font-semibold">{studio.ownerName}</h2>
              <p className="truncate text-sm text-base-content/70">{studio.ownerEmail}</p>
            </div>
          </section>

          <Reviews studioId={studio._id} ownerEmail={studio.ownerEmail} reviews={reviews} />
        </div>

        <BookingPanel studio={studio} />
      </div>
    </div>
  );
}
