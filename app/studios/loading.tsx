import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="page-shell py-12">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton mt-4 h-5 w-96 max-w-full" />
      <div className="skeleton mt-8 h-24 w-full" />
      <div className="mt-6"><GridSkeleton /></div>
    </div>
  );
}
