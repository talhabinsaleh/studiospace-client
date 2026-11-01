"use client";

import { CalendarDays, Clock, Download, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { formatDate, formatTime, money } from "@/lib/format";
import { downloadInvoice } from "@/lib/invoice";
import type { Booking } from "@/lib/types";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import { RowsSkeleton } from "./Skeletons";
import StatusBadge from "./StatusBadge";
import StudioImage from "./StudioImage";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [target, setTarget] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Booking[]>("/api/bookings/mine").then(setBookings).catch((err) => setLoadError(errorMessage(err)));
  }, []);

  async function confirmCancel() {
    if (!target) return;
    setBusy(true);
    try {
      const updated = await api<Booking>(`/api/bookings/${target._id}/cancel`, { method: "PATCH" });
      setBookings((current) => current?.map((booking) => (booking._id === updated._id ? updated : booking)) ?? null);
      toast.success("Booking cancelled.");
      setTarget(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function invoice(booking: Booking) {
    try {
      await downloadInvoice(booking);
      toast.success("Invoice downloaded.");
    } catch {
      toast.error("We could not create the invoice. Please try again.");
    }
  }

  return (
    <div className="page-shell py-12">
      <p className="eyebrow">Your schedule</p>
      <h1 className="section-title mb-8">My bookings</h1>

      {loadError ? (
        <p role="alert" className="text-error">{loadError}</p>
      ) : !bookings ? (
        <RowsSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No bookings yet" text="Your next session starts with finding the right room." href="/studios" cta="Explore Studios" />
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-200 p-4 sm:flex-row">
              <StudioImage src={booking.studioImage} alt={booking.studioTitle} className="aspect-[3/2] w-full rounded-field object-cover sm:w-44 sm:self-start" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/studios/${booking.studioId}`} className="text-lg font-semibold hover:text-primary">{booking.studioTitle}</Link>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="mt-2 grid gap-x-5 gap-y-1 text-sm text-base-content/75 sm:grid-cols-2">
                  <p className="flex items-center gap-1.5"><CalendarDays className="size-4 shrink-0" /> {formatDate(booking.start)}</p>
                  <p className="flex items-center gap-1.5"><Clock className="size-4 shrink-0" /> {formatTime(booking.start)} to {formatTime(booking.end)} ({booking.hours} hr)</p>
                  <p className="flex items-center gap-1.5"><MapPin className="size-4 shrink-0" /> {booking.location}</p>
                  <p className="flex items-center gap-1.5"><Users className="size-4 shrink-0" /> {booking.guests} {booking.guests === 1 ? "guest" : "guests"}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono font-semibold">{money(booking.total)} <span className="font-sans text-xs font-normal text-base-content/65">including {money(booking.securityDeposit)} deposit</span></p>
                  <div className="flex gap-2">
                    {booking.status === "Pending" && <button type="button" onClick={() => setTarget(booking)} className="btn btn-outline btn-error btn-sm">Cancel Booking</button>}
                    {(booking.status === "Confirmed" || booking.status === "Completed") && <button type="button" onClick={() => invoice(booking)} className="btn btn-outline btn-sm"><Download className="size-4" /> PDF invoice</button>}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal open={Boolean(target)} title="Cancel this booking?" confirmLabel="Cancel booking" busy={busy} onConfirm={confirmCancel} onClose={() => setTarget(null)}>
        Your request for <strong>{target?.studioTitle}</strong> will be cancelled, and the host will no longer see it as pending.
      </ConfirmModal>
    </div>
  );
}
