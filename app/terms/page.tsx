import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

const TERMS = [
  ["Bookings", "A request stays pending until the host confirms it. Creators can cancel a pending request at any time. Hosts can decline a request or cancel a confirmed booking if the space becomes unavailable."],
  ["Deposits", "The security deposit is shown on each listing and is meant to be returned after the session, unless the space or its equipment was damaged."],
  ["Hosts", "Hosts are responsible for describing their space honestly and keeping listed equipment safe and in working order."],
  ["Creators", "Creators agree to stay within the listed capacity, follow the host's house rules and leave the space as they found it."],
  ["Your account", "Please keep your login details private. You are responsible for activity on your account."],
];

export default function TermsPage() {
  return (
    <div className="page-shell max-w-3xl py-14">
      <p className="eyebrow">The fine print</p>
      <h1 className="section-title">Terms of use</h1>
      <p className="section-text">These short terms explain what hosts and creators can expect from each other on StudioSpace.</p>
      <div className="mt-10 space-y-8">
        {TERMS.map(([title, text]) => (
          <section key={title}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 leading-relaxed text-base-content/78">{text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
