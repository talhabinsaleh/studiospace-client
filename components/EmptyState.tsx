import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function EmptyState({ icon: Icon, title, text, href, cta }: { icon: LucideIcon; title: string; text: string; href: string; cta: string }) {
  return (
    <div className="rounded-box border border-dashed border-base-300 px-6 py-16 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-base-200 text-primary"><Icon className="size-6" /></span>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-base-content/70">{text}</p>
      <Link href={href} className="btn btn-primary btn-sm mt-6">{cta}</Link>
    </div>
  );
}
