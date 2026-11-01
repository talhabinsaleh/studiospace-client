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
  { icon: Search, title: "Discover Spaces", text: "Search the roster by name or area, or jump straight to the kind of room you need." },
  { icon: MousePointerClick, title: "Select Shoot Hours", text: "Pick a day and see which hours are already taken before you commit to anything." },
  { icon: CalendarCheck, title: "Book Instantly", text: "Send the request with the full cost in front of you. Your host answers from their dashboard." },
  { icon: Clapperboard, title: "Create & Produce", text: "Keep your invoice handy, turn up on time and make the thing you came to make." },
];

const GUARANTEES = [
  { icon: ShieldCheck, title: "Liability protection", text: "A refundable deposit and plain rules on damage mean nobody argues after the session." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Everyone signs in with a real account, so you can see exactly who is using your room." },
  { icon: Wrench, title: "Equipment safety", text: "Hosts say what gear is included and keep it tested, so a session never starts with repairs." },
  { icon: Headset, title: "24/7 host support", text: "A problem at midnight on a shoot still reaches a person who can help you sort it." },
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
    <div className="overflow-hidden rounded-box">
      <div className="sprockets" aria-hidden="true" />
      <div className="film-frame grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const count = counts.find((item) => item._id === category.value)?.count ?? 0;
          return (
            <Link key={category.value} href={`/studios?category=${encodeURIComponent(category.value)}`} className="group relative block h-72 overflow-hidden bg-black text-white">
              <StudioImage src={category.image} alt="" className="absolute inset-0 size-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span className="absolute left-3 top-2 font-mono text-[11px] text-[#ff8a63]">{index + 1}A</span>
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
      <div className="sprockets" aria-hidden="true" />
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
            <p className="eyebrow">This week&apos;s call sheet</p>
            <h2 className="section-title">Featured rooms creators keep rebooking</h2>
            <p className="section-text">Six spaces with the strongest reviews from people who actually worked in them.</p>
          </div>
          <Link href="/studios" className="btn btn-outline">See the full roster <ArrowRight className="size-4" /></Link>
        </div>
        <Suspense fallback={<GridSkeleton />}><Featured /></Suspense>
      </section>

      <section className="border-y border-base-300 bg-base-200/60">
        <div className="page-shell section-gap">
          <div className="mb-10">
            <p className="eyebrow">Choose your frame</p>
            <h2 className="section-title">Start with what you are making</h2>
            <p className="section-text">A podcast and a pottery class need very different rooms. Pick one and see what is free.</p>
          </div>
          <Suspense fallback={<div className="skeleton h-80 w-full" />}>
            <Categories />
          </Suspense>
        </div>
      </section>

      <section id="how-it-works" className="page-shell section-gap">
        <p className="eyebrow">The shooting schedule</p>
        <h2 className="section-title">How booking works, scene by scene</h2>
        <ol className="mt-10 border-t border-base-300">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid items-center gap-x-8 gap-y-2 border-b border-base-300 py-6 md:grid-cols-[8rem_1fr_1.6fr_auto]">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Scene 0{index + 1}</span>
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-base-content/72">{step.text}</p>
              <step.icon className="hidden size-6 text-primary md:block" />
            </li>
          ))}
        </ol>
      </section>

      <section id="about" className="border-t border-base-300 bg-base-200/60">
        <div className="page-shell section-gap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">About us</p>
            <h2 className="section-title">We keep the lights on in empty studios.</h2>
            <p className="section-text">A proper studio costs a fortune to build, then sits dark for most of the week. Across town, someone with a good idea is recording in a cupboard.</p>
            <p className="section-text">StudioSpace introduces them. Owners get paid for hours that were going to waste, and creators get a real room for just as long as the work takes.</p>
          </div>
          <StudioImage src="/photos/stone-live-room.jpg" alt="Empty stone-walled live room with microphones set up" className="aspect-[3/2] w-full rounded-box object-cover" />
        </div>
      </section>

      <section className="bg-neutral text-neutral-content">
        <div className="page-shell section-gap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">For hosts and creators</p>
            <h2 className="section-title">Host guarantee and creator support</h2>
            <p className="mt-3 max-w-md leading-relaxed text-neutral-content/80">Handing a stranger the keys to expensive gear takes trust. Here is what stands behind every booking.</p>
            <Link href="/add-studio" className="btn btn-primary mt-7">Put your room on the roster</Link>
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
