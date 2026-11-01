"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/constants";

// Studio photos can be any pasted link, so a broken one falls back to a placeholder
export default function StudioImage({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <img
      src={failedSrc === src ? FALLBACK_IMAGE : src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailedSrc(src)}
    />
  );
}
