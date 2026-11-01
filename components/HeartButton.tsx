"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useWishlist } from "./Providers";

export default function HeartButton({ studioId, title, className = "" }: { studioId: string; title: string; className?: string }) {
  const { data: session } = useSession();
  const { ids, add, remove } = useWishlist();
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const saved = ids.has(studioId);

  async function toggle() {
    if (!session) {
      toast.info("Please log in to save studios.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    try {
      if (saved) {
        await remove(studioId);
        toast.success("Removed from saved studios.");
      } else {
        await add(studioId);
        toast.success("Saved to your studios.");
      }
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved studios` : `Save ${title}`}
      className={`btn btn-circle btn-sm border-0 bg-black/60 text-white hover:bg-black/80 ${className}`}
    >
      <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
    </button>
  );
}
