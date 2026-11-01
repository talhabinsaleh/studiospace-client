import { ApertureMark } from "./Logo";

export function PageLoader({ label = "Setting up the shot" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <div className="text-center">
        <ApertureMark className="mx-auto size-14 text-primary" spin />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-base-content/65">{label}</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-200" aria-hidden="true">
      <div className="skeleton aspect-[3/2] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-4 w-3/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="flex justify-between pt-4"><div className="skeleton h-7 w-20" /><div className="skeleton h-8 w-24" /></div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading studios">
      {Array.from({ length: count }, (_, index) => <CardSkeleton key={index} />)}
    </div>
  );
}

export function RowsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => <div key={index} className="skeleton h-32 w-full" />)}
    </div>
  );
}
