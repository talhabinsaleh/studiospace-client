"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Next.js scrolls to the first element under the sticky header, which leaves a new page
// slightly scrolled with its top hidden. Every new page should open at the very top,
// and links like /#about should land on their home page section.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Home page data streams in, so the section can appear late and then move.
    // Keep it in place for a moment, unless the visitor starts scrolling.
    let tries = 0;
    const timer = setInterval(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      tries += 1;
      if (tries >= 20) stop();
    }, 150);
    function stop() {
      clearInterval(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    }
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    return stop;
  }, [pathname]);

  return null;
}
