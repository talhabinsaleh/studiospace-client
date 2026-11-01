import { ArrowRight, BadgeCheck, CalendarCheck, Clapperboard, Headset, MousePointerClick, Search, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HeroSlider from "@/components/HeroSlider";
import { GridSkeleton } from "@/components/Skeletons";
import StudioCard from "@/components/StudioCard";
import StudioImage from "@/components/StudioImage";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryCounts, getFeaturedStudios } from "@/lib/server-api";

const STEPS = [
  { icon: Search, title: "Discover Spaces", text: "Search by name or area and filter by category until you find the right room." },
  { icon: MousePointerClick, title: "Select Shoot Hours", text: "See which hours are already taken, then choose your date and session length." },
  { icon: CalendarCheck, title: "Book Instantly", text: "Send your request with the full price shown. The host confirms it from their dashboard." },
  { icon: Clapperboard, title: "Create & Produce", text: "Download your invoice, arrive on time and make the thing you came to make." },
];

const GUARANTEES = [
  { icon: ShieldCheck, title: "Liability protection", text: "Every session is covered by clear rules on damage and refundable deposits." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Hosts and creators sign in with a real account, so you know who you are working with." },
  { icon: Wrench, title: "Equipment safety", text: "Hosts list the gear they provide and keep it tested and ready for each booking." },
  { icon: Headset, title: "24/7 host support", text: "If something goes wrong mid-session, our support team is reachable at any hour." },
];

async function Featured() {
  const studios = await getFeaturedStudios();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => <StudioCard key={studio._id} studio={studio} />)}
    </div>
  );
}

async function Categories() {
  const counts = await getCategoryCounts();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CATEGORIES.map((category) => {
        const count = counts.find((item) => item._id === category.value)?.count ?? 0;
        return (
          <Link key={category.value} href={`/studios?category=${encodeURIComponent(category.value)}`} className="group relative block h-64 overflow-hidden rounded-box bg-black text-white">
            <StudioImage src={category.image} alt="" className="absolute inset-0 size-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <category.icon className="size-5 text-[#ff8a63]" />
              <h3 className="mt-2 text-lg font-semibold">{category.label}</h3>
              <p className="mt-1 text-sm leading-snug text-white/80">{category.blurb}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-white/70">{count} {count === 1 ? "space" : "spaces"}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="page-shell section-gap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Top of the call sheet</p>
            <h2 className="section-title">Featured studios</h2>
            <p className="section-text">The highest-rated spaces creators keep coming back to.</p>
          </div>
          <Link href="/studios" className="btn btn-outline">See all studios <ArrowRight className="size-4" /></Link>
        </div>
        <Suspense fallback={<GridSkeleton />}><Featured /></Suspense>
      </section>

      <section className="border-y border-base-300 bg-base-200/60">
        <div className="page-shell section-gap">
          <div className="mb-10">
            <p className="eyebrow">Pick your format</p>
            <h2 className="section-title">Browse by studio category</h2>
            <p className="section-text">Each discipline needs a different room. Start with what you are making today.</p>
          </div>
          <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{CATEGORIES.map((c) => <div key={c.value} className="skeleton h-64" />)}</div>}>
            <Categories />
          </Suspense>
        </div>
      </section>

      <section className="page-shell section-gap">
        <p className="eyebrow">Four steps to rolling</p>
        <h2 className="section-title">How booking works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t-2 border-primary pt-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-base-content/65">0{index + 1}</span>
                <step.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-base-content/72">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-neutral text-neutral-content">
        <div className="page-shell section-gap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">For hosts and creators</p>
            <h2 className="section-title">Host guarantee & creator support</h2>
            <p className="mt-3 max-w-md leading-relaxed text-neutral-content/80">Sharing a room full of expensive gear takes trust. These assurances protect both sides of every booking.</p>
            <Link href="/add-studio" className="btn btn-primary mt-7">List your space</Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2">
            {GUARANTEES.map((item) => (
              <li key={item.title}>
                <item.icon className="size-6 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-neutral-content/80">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
