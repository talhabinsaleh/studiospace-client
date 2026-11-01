import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "StudioSpace helps creators find rooms for their work and helps owners earn from unused hours.",
};

const VALUES = [
  ["Fair, visible pricing", "The rate, deposit and total are shown before you send a request, with nothing added later."],
  ["Creators on both sides", "Our hosts are photographers, engineers and artists who understand what a session needs."],
  ["Respect for the space", "Clear rules and refundable deposits keep good rooms in good condition for the next person."],
];

export default function AboutPage() {
  return (
    <>
      <div className="page-shell grid items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="section-title">Great rooms should not sit empty while good ideas wait.</h1>
          <p className="section-text">Building a studio is expensive, and most stand unused for much of the week. Meanwhile, independent creators lose momentum because they cannot find or afford the right space.</p>
          <p className="section-text">StudioSpace connects the two. Owners earn from their unused hours, and creators get professional rooms for exactly the time they need.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1558403194-611308249627?w=1200&q=75&auto=format&fit=crop" alt="Creators talking together in a bright studio lounge" className="aspect-[3/2] w-full rounded-box object-cover" />
      </div>
      <section className="border-t border-base-300 bg-base-200/60">
        <div className="page-shell section-gap">
          <p className="eyebrow">What we care about</p>
          <h2 className="section-title">Three promises we build around</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {VALUES.map(([title, text]) => (
              <li key={title} className="border-t-2 border-primary pt-5">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-base-content/72">{text}</p>
              </li>
            ))}
          </ul>
          <Link href="/studios" className="btn btn-primary mt-10">Find your next space</Link>
        </div>
      </section>
    </>
  );
}
