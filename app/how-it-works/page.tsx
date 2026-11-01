import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How creators book studios and how hosts manage requests on StudioSpace.",
};

const CREATOR = [
  ["Find your room", "Search by name or area, then filter by category, rate, capacity and rating. Every listing shows its hourly rate and deposit up front."],
  ["Check the calendar", "Open the booking window and choose a date. Hours that are already confirmed are marked, so you only pick from free slots."],
  ["Send your request", "Your request is saved as Pending, with the price breakdown attached. You can cancel it at any time while it is pending."],
  ["Create and review", "Once the host confirms, download your PDF invoice. After your session, leave a review to help the next creator."],
];

const HOST = [
  ["List your space", "Add photos, your rate, deposit, capacity and amenities. Your listing is visible as soon as you publish it."],
  ["Confirm requests", "New requests appear on your dashboard. StudioSpace blocks any confirmation that would overlap a booking you already accepted."],
  ["Host the session", "Welcome your guests and keep the gear ready. Mark the booking as completed once the session is over."],
  ["Keep it up to date", "Change your rate or details whenever you like, or remove a listing that has no upcoming confirmed bookings."],
];

function Steps({ label, title, steps }: { label: string; title: string; steps: string[][] }) {
  return (
    <section>
      <p className="eyebrow">{label}</p>
      <h2 className="section-title">{title}</h2>
      <ol className="mt-8 space-y-7">
        {steps.map(([heading, text], index) => (
          <li key={heading} className="flex gap-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary font-mono text-sm text-primary">{index + 1}</span>
            <div>
              <h3 className="text-lg font-semibold">{heading}</h3>
              <p className="mt-1 leading-relaxed text-base-content/72">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="page-shell py-14">
      <p className="eyebrow">The process</p>
      <h1 className="section-title">Simple for creators. Safe for hosts.</h1>
      <p className="section-text">Every booking moves through the same clear stages: Pending, Confirmed and Completed.</p>
      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        <Steps label="If you are booking" title="For creators" steps={CREATOR} />
        <Steps label="If you own a space" title="For hosts" steps={HOST} />
      </div>
      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        <Link href="/add-studio" className="btn btn-outline">List your space</Link>
      </div>
    </div>
  );
}
