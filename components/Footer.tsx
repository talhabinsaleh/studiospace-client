"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import Logo from "./Logo";

// The current X mark, drawn here because icon sets are dropping brand logos
const SOCIALS = [
  {
    label: "X",
    href: "https://x.com",
    path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L8.3 3.8H6.4l11.4 16.3Z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M14 8.5V6.7c0-.9.6-1.1 1-1.1h2.5V2h-3.4C10.3 2 9.5 4.800 9.5 6.600v1.900H7V12h2.5v10H14V12h3.100l.4-3.5H14Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-3.400a1.2 1.2 0 1 1 0 2.400 1.2 1.2 0 0 1 0-2.400Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23 7.2a3 3 0 0 0-2.100-2.100C19 4.600 12 4.600 12 4.600s-7 0-8.900.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.800a3 3 0 0 0 2.100 2.100c1.900.5 8.900.5 8.900.5s7 0 8.900-.5a3 3 0 0 0 2.100-2.100 31 31 0 0 0 .5-4.800 31 31 0 0 0-.5-4.800ZM9.800 15.300V8.700l5.700 3.300-5.700 3.300Z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  function subscribe(event: FormEvent) {
    event.preventDefault();
    toast.success("Thanks for subscribing. New studios are on their way to your inbox.");
    setEmail("");
  }

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="page-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-base-content/70">
            We connect creators with the rooms their best work needs, and help studio owners earn from the hours their space sits empty.
          </p>
          <ul className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="btn btn-square btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true"><path d={social.path} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-primary">Navigate</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/studios">Explore Studios</Link></li>
            <li><Link className="hover:text-primary" href="/how-it-works">How It Works</Link></li>
            <li><Link className="hover:text-primary" href="/about">About Us</Link></li>
            <li><Link className="hover:text-primary" href="/terms">Terms of Use</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-primary">Popular spaces</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link className="hover:text-primary" href={`/studios?category=${encodeURIComponent(category.value)}`}>{category.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-primary">Studio notes</h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/70">One email a month with new spaces near you and tips for better sessions.</p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input id="newsletter" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input input-sm min-w-0 flex-1" />
            <button className="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-base-300">
        <div className="page-shell flex flex-col gap-1 py-5 text-xs text-base-content/65 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our <Link href="/terms" className="underline hover:text-primary">terms</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
