"use client";

import { BookMarked, Building2, CalendarClock, CalendarDays, Heart, Inbox, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate, formatTime, money } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import { RowsSkeleton } from "./Skeletons";
import StatusBadge from "./StatusBadge";

interface Stats {
  listings: number;
  saved: number;
  asGuest: { _id: BookingStatus; count: number }[];
}

export default function DashboardView() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<Booking[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [declining, setDeclining] = useState<Booking | null>(null);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    Promise.all([api<Stats>("/api/bookings/stats"), api<Booking[]>("/api/bookings/host")])
      .then(([nextStats, nextRequests]) => {
        setStats(nextStats);
        setRequests(nextRequests);
      })
      .catch((err) => setLoadError(errorMessage(err)));
  }, []);

  async function setStatus(booking: Booking, status: BookingStatus, message: string) {
    setBusyId(booking._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${booking._id}/status`, { method: "PATCH", body: { status } });
      setRequests((current) => current?.map((item) => (item._id === updated._id ? updated : item)) ?? null);
      toast.success(message);
      setDeclining(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  const guestCount = (status: BookingStatus) => stats?.asGuest.find((row) => row._id === status)?.count ?? 0;

  const cards = [
    { label: "My listings", value: stats?.listings ?? 0, icon: Building2, href: "/my-listings" },
    { label: "Upcoming bookings", value: guestCount("Pending") + guestCount("Confirmed"), icon: BookMarked, href: "/my-bookings" },
    { label: "Saved studios", value: stats?.saved ?? 0, icon: Heart, href: "/wishlist" },
  ];

  return (
    <div className="page-shell py-12">
      <p className="eyebrow">Control room</p>
      <h1 className="section-title">Hello, {session?.user.name?.split(" ")[0] ?? "creator"}</h1>
      <p className="section-text">Your bookings, your listings and the requests waiting for your answer.</p>

      {loadError ? (
        <p role="alert" className="mt-8 text-error">{loadError}</p>
      ) : !stats || !requests ? (
        <div className="mt-8"><RowsSkeleton /></div>
      ) : (
        <>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <li key={card.label}>
                <Link href={card.href} className="block h-full rounded-box border border-base-300 bg-base-200 p-5 transition-colors hover:border-primary/60">
                  <card.icon className="size-5 text-primary" />
                  <p className="mt-4 font-mono text-3xl font-semibold">{card.value}</p>
                  <p className="mt-1 text-sm text-base-content/70">{card.label}</p>
                </Link>
              </li>
            ))}
          </ul>

          <section id="requests" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-semibold">Requests for your studios</h2>
            <p className="mt-1 text-sm text-base-content/70">Confirming a request blocks that time for everyone else. Overlapping requests cannot be confirmed.</p>
            <div className="mt-5">
              {requests.length === 0 ? (
                <EmptyState icon={Inbox} title="No requests yet" text="Requests will appear here once creators book your spaces." href={stats.listings ? "/my-listings" : "/add-studio"} cta={stats.listings ? "View my listings" : "List a studio"} />
              ) : (
                <ul className="space-y-3">
                  {requests.map((booking) => {
                    const busy = busyId === booking._id;
                    return (
                      <li key={booking._id} className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-200 p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{booking.studioTitle}</p>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/75">
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" /> {formatDate(booking.start)}</span>
                            <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" /> {formatTime(booking.start)} to {formatTime(booking.end)}</span>
                            <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> {booking.userName}, {booking.guests} {booking.guests === 1 ? "guest" : "guests"}</span>
                            <span className="font-mono">{money(booking.subtotal)}</span>
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {booking.status === "Pending" && (
                            <>
                              <button type="button" disabled={busy} onClick={() => setStatus(booking, "Confirmed", "Booking confirmed.")} className="btn btn-primary btn-sm">Confirm</button>
                              <button type="button" disabled={busy} onClick={() => setDeclining(booking)} className="btn btn-outline btn-error btn-sm">Decline</button>
                            </>
                          )}
                          {booking.status === "Confirmed" && (
                            new Date(booking.end).getTime() <= now ? (
                              <button type="button" disabled={busy} onClick={() => setStatus(booking, "Completed", "Booking marked as completed.")} className="btn btn-outline btn-sm">Mark completed</button>
                            ) : (
                              <button type="button" disabled={busy} onClick={() => setDeclining(booking)} className="btn btn-outline btn-error btn-sm">Cancel</button>
                            )
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      )}

      <ConfirmModal open={Boolean(declining)} title="Cancel this booking?" confirmLabel="Yes, cancel it" busy={Boolean(busyId)} onConfirm={() => declining && setStatus(declining, "Cancelled", "Booking cancelled.")} onClose={() => setDeclining(null)}>
        The booking from <strong>{declining?.userName}</strong> for <strong>{declining?.studioTitle}</strong> will be marked as cancelled.
      </ConfirmModal>
    </div>
  );
}
