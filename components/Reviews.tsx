"use client";

import { MessageSquareText, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";
import Avatar from "./Avatar";

export default function Reviews({ studioId, ownerEmail, reviews }: { studioId: string; ownerEmail: string; reviews: Review[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api(`/api/studios/${studioId}/reviews`, { method: "POST", body: { rating, comment } });
      toast.success("Thanks. Your review is live.");
      setComment("");
      router.refresh();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-semibold">Reviews ({reviews.length})</h2>

      {session && session.user.email !== ownerEmail && (
        <form onSubmit={submit} className="mt-5 rounded-box border border-base-300 bg-base-200 p-5">
          <fieldset>
            <legend className="text-sm font-medium">Your rating</legend>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} out of 5`} aria-pressed={rating === value} className="p-0.5">
                  <Star className={`size-6 ${value <= rating ? "fill-secondary text-secondary" : "text-base-content/35"}`} />
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium">Your review</span>
            <textarea required minLength={10} maxLength={800} rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="How was your session in this space?" className="textarea w-full" />
          </label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-base-content/65">Reviews are open to creators with a confirmed booking here.</p>
            <button className="btn btn-primary btn-sm" disabled={busy}>{busy && <span className="loading loading-spinner loading-xs" />} Post review</button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="mt-5 flex items-center gap-2 text-base-content/70"><MessageSquareText className="size-5" /> No reviews yet. This space is waiting for its first session.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {reviews.map((review) => (
            <li key={review._id} className="flex gap-4 border-b border-base-300 pb-6 last:border-0">
              <Avatar name={review.userName} src={review.userPhoto} />
              <div className="min-w-0">
                <p className="font-semibold">{review.userName}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-base-content/65">
                  <span className="flex" aria-label={`Rated ${review.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((value) => <Star key={value} className={`size-3.5 ${value <= review.rating ? "fill-secondary text-secondary" : "text-base-content/30"}`} />)}
                  </span>
                  {formatDate(review.createdAt)}
                </p>
                <p className="mt-2 leading-relaxed text-base-content/85">{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
