export default function Loading() {
  return (
    <div className="page-shell py-10" role="status" aria-label="Loading studio">
      <div className="skeleton h-10 w-2/3 max-w-lg" />
      <div className="skeleton mt-3 h-5 w-1/2 max-w-sm" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="skeleton aspect-[16/10] w-full" />
        <div className="skeleton h-72 w-full" />
      </div>
    </div>
  );
}
