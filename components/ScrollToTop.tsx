"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Next.js scrolls to the first element under the sticky header, which leaves a new page
// slightly scrolled with its top hidden. Every new page should open at the very top.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Links like /#about must land on their home page section instead
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
