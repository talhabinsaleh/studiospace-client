"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <p className="eyebrow">Cut. Technical difficulty</p>
        <h1 className="section-title">That take did not work.</h1>
        <p className="section-text mx-auto">We could not load this page just now. Please try again in a moment.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary"><RotateCcw className="size-4" /> Try again</button>
          <Link href="/" className="btn btn-outline">Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
