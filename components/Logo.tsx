import Link from "next/link";

export function ApertureMark({ className = "size-8", spin = false }: { className?: string; spin?: boolean }) {
  const blades = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
      <g className={spin ? "aperture-spin" : undefined} style={{ transformBox: "view-box" }}>
        {blades.map((angle) => (
          <path
            key={angle}
            d="M24 24 L24 5 L39 15 Z"
            fill="currentColor"
            opacity={0.35 + angle / 600}
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
      </g>
      <circle cx="24" cy="24" r="6.5" fill="var(--color-base-100)" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="StudioSpace home">
      <ApertureMark className="size-8 text-primary" />
      <span className="font-display text-xl font-bold tracking-tight">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
