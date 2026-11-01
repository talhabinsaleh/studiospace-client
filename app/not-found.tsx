import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="page-shell grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404 / Empty set</p>
        <h1 className="section-title">The set is dark. Nothing is filming here.</h1>
        <p className="section-text">This page may have moved, or the link may be wrong. The crew is back at the home page.</p>
        <Link href="/" className="btn btn-primary mt-7">Return to Home</Link>
      </div>
      <svg viewBox="0 0 480 360" className="mx-auto w-full max-w-md" role="img" aria-label="An empty film set with a spotlight shining on a director's chair">
        <path d="M250 62 L120 318 H400 Z" fill="var(--color-primary)" opacity="0.16" />
        <ellipse cx="260" cy="318" rx="140" ry="20" fill="var(--color-primary)" opacity="0.28" />
        <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none">
          <path d="M214 212 V314" /><path d="M306 212 V314" />
          <path d="M214 314 L306 250" /><path d="M306 314 L214 250" />
          <path d="M204 250 H316" />
        </g>
        <rect x="208" y="176" width="104" height="30" rx="4" fill="var(--color-primary)" />
        <text x="260" y="196" textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill="var(--color-primary-content)">404</text>
        <rect x="200" y="28" width="84" height="44" rx="8" fill="currentColor" transform="rotate(-14 242 50)" />
        <path d="M242 0 V28" stroke="currentColor" strokeWidth="6" />
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <path d="M60 318 L90 150" /><path d="M120 318 L90 150" /><path d="M90 150 V318" />
        </g>
        <rect x="58" y="110" width="66" height="44" rx="6" fill="currentColor" />
        <circle cx="136" cy="132" r="14" fill="currentColor" />
        <path d="M30 334 H450" stroke="currentColor" strokeWidth="4" opacity="0.4" />
      </svg>
    </div>
  );
}
