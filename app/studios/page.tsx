import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import StudioCard from "@/components/StudioCard";
import StudioFilters from "@/components/StudioFilters";
import { getStudios } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Explore Studios",
  description: "Search creative spaces and filter them by category.",
};

type Params = Record<string, string | string[] | undefined>;

function toQuery(params: Params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string" && value) query.set(key, value);
  });
  return query;
}

async function Results({ params }: { params: Params }) {
  const { items, total } = await getStudios(toQuery(params).toString());

  if (items.length === 0) {
    return <EmptyState icon={SearchX} title="No studios match your search" text="Try another search word or category. New spaces are added often." href="/studios" cta="Clear all filters" />;
  }

  return (
    <>
      <p className="mb-5 font-mono text-xs uppercase tracking-wider text-base-content/65" aria-live="polite">{total} {total === 1 ? "space" : "spaces"} available</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((studio) => <StudioCard key={studio._id} studio={studio} />)}
      </div>
    </>
  );
}

export default async function StudiosPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  return (
    <div className="page-shell py-12">
      <p className="eyebrow">The full roster</p>
      <h1 className="section-title">Explore studios</h1>
      <p className="section-text">Every room on the roster, with its real rate and reviews. Book only the hours you need.</p>
      <div className="mt-8"><Suspense><StudioFilters /></Suspense></div>
      <div className="mt-6">
        <Suspense key={toQuery(params).toString()} fallback={<GridSkeleton count={6} />}>
          <Results params={params} />
        </Suspense>
      </div>
    </div>
  );
}
