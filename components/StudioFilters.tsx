"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/constants";

export default function StudioFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const urlSearch = params.get("search") ?? "";
  const [search, setSearch] = useState(urlSearch);
  const [lastUrlSearch, setLastUrlSearch] = useState(urlSearch);

  // Keep the box in step when the URL changes from outside, such as "Clear filters"
  if (urlSearch !== lastUrlSearch) {
    setLastUrlSearch(urlSearch);
    setSearch(urlSearch);
  }

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  useEffect(() => {
    if (search === urlSearch) return;
    const timer = setTimeout(() => update({ search }), 400);
    return () => clearTimeout(timer);
    // Only a change to the typed text should start a new search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const category = params.get("category") ?? "";
  const hasFilters = ["search", "category"].some((key) => params.get(key));

  return (
    <div className="space-y-4" aria-busy={pending}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" onClick={() => update({ category: "" })} aria-pressed={!category} className={`btn btn-sm ${!category ? "btn-primary" : "btn-outline"}`}>All spaces</button>
        {CATEGORIES.map((item) => (
          <button key={item.value} type="button" onClick={() => update({ category: item.value })} aria-pressed={category === item.value} className={`btn btn-sm ${category === item.value ? "btn-primary" : "btn-outline"}`}>
            <item.icon className="size-4" /> {item.label}
          </button>
        ))}
      </div>

      <label className="input w-full max-w-xl">
        <Search className="size-4 opacity-60" />
        <span className="sr-only">Search studios</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, area or amenity" />
      </label>

      <div className="flex min-h-6 items-center gap-3">
        {pending && <span className="loading loading-spinner loading-xs text-primary" role="status" aria-label="Updating results" />}
        {hasFilters && (
          <button type="button" onClick={() => startTransition(() => router.push(pathname, { scroll: false }))} className="inline-flex items-center gap-1 text-sm text-base-content/70 underline hover:text-primary">
            <X className="size-3.5" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
