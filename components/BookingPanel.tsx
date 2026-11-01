"use client";

import { AlertCircle, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatTime, money } from "@/lib/format";
import type { Studio } from "@/lib/types";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDay(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function atHour(day: string, hour: number) {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date, hour);
}

function hourLabel(hour: number) {
  return formatTime(new Date(2026, 0, 1, hour));
}

export default function BookingPanel({ studio }: { studio: Studio }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [today, setToday] = useState("");
  const [day, setDay] = useState("");
  const [startHour, setStartHour] = useState<number | null>(null);
  const [hours, setHours] = useState(2);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [taken, setTaken] = useState<{ start: string; end: string }[]>([]);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const availabilityKey = open && day ? `${studio._id}|${day}` : "";
  useEffect(() => {
    if (!availabilityKey) return;
    let active = true;
    const from = atHour(day, 0).toISOString();
    const to = atHour(day, 24).toISOString();
    api<{ start: string; end: string }[]>(`/api/studios/${studio._id}/availability?from=${from}&to=${to}`)
      .then((slots) => {
        if (!active) return;
        setTaken(slots);
        setLoadedKey(availabilityKey);
      })
      .catch(() => {
        if (active) setLoadedKey(availabilityKey);
      });
    return () => {
      active = false;
    };
  }, [availabilityKey, day, studio._id]);

  const loading = open && availabilityKey !== loadedKey;

  const isBusy = (hour: number) => {
    if (!day) return false;
    const start = atHour(day, hour).getTime();
    const end = start + 3_600_000;
    return taken.some((slot) => new Date(slot.start).getTime() < end && new Date(slot.end).getTime() > start);
  };
  const isPast = (hour: number) => Boolean(day) && atHour(day, hour).getTime() <= now;

  const startOptions = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, index) => OPEN_HOUR + index);
  const selectedStart = startHour !== null && !isBusy(startHour) && !isPast(startHour) ? startHour : null;
  const maxHours = selectedStart === null ? CLOSE_HOUR - OPEN_HOUR : CLOSE_HOUR - selectedStart;
  const bookedHours = Math.min(hours, maxHours);
  const subtotal = studio.hourlyRate * bookedHours;
  const total = subtotal + studio.securityDeposit;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (selectedStart === null) {
      setError("Please choose a free start time.");
      return;
    }
    setBusy(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: {
          studioId: studio._id,
          start: atHour(day, selectedStart).toISOString(),
          end: atHour(day, selectedStart + bookedHours).toISOString(),
          guests,
          note,
        },
      });
      toast.success("Booking request sent. It is now pending host confirmation.");
      setOpen(false);
      router.push("/my-bookings");
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  // The date is set on opening, since the server and the browser can be in different time zones
  function openModal() {
    const current = new Date();
    const currentDay = localDay(current);
    setNow(current.getTime());
    setToday(currentDay);
    setDay((value) => value || currentDay);
    setOpen(true);
  }

  const isOwner = session?.user.email === studio.ownerEmail;

  return (
    <aside className="rounded-box border border-base-300 bg-base-200 p-6 lg:sticky lg:top-24">
      <p className="font-mono text-3xl font-semibold">{money(studio.hourlyRate)}<span className="text-base font-normal text-base-content/60"> / hr</span></p>
      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-base-content/70">Refundable deposit</dt><dd className="font-medium">{money(studio.securityDeposit)}</dd></div>
        <div className="flex justify-between"><dt className="text-base-content/70">Max capacity</dt><dd className="font-medium">{studio.maxCapacity} people</dd></div>
        <div className="flex justify-between"><dt className="text-base-content/70">Booking hours</dt><dd className="font-medium">8 AM to 10 PM</dd></div>
      </dl>

      {isPending ? (
        <div className="skeleton mt-6 h-10 w-full" />
      ) : isOwner ? (
        <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline mt-6 w-full">This is your listing. Edit it</Link>
      ) : session ? (
        <button type="button" onClick={openModal} className="btn btn-primary mt-6 w-full"><CalendarClock className="size-4" /> Book Workspace Now</button>
      ) : (
        <Link href={`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`} className="btn btn-primary mt-6 w-full"><CalendarClock className="size-4" /> Book Workspace Now</Link>
      )}
      <p className="mt-3 text-center text-xs text-base-content/65">You will not be charged until the host confirms.</p>

      <dialog ref={dialogRef} className="modal" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="modal-box max-w-lg border border-base-300">
          <h2 className="text-xl font-semibold">Book {studio.title}</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Date</span>
              <input type="date" required min={today} value={day} onChange={(event) => { setDay(event.target.value); setStartHour(null); }} className="input w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Guests</span>
              <input type="number" required min={1} max={studio.maxCapacity} value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="input w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Start time</span>
              <select required className="select w-full" value={selectedStart ?? ""} onChange={(event) => setStartHour(event.target.value === "" ? null : Number(event.target.value))}>
                <option value="">Choose a time</option>
                {startOptions.map((hour) => (
                  <option key={hour} value={hour} disabled={isBusy(hour) || isPast(hour)}>
                    {hourLabel(hour)}{isBusy(hour) ? " (booked)" : isPast(hour) ? " (passed)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Hours</span>
              <select className="select w-full" value={bookedHours} onChange={(event) => setHours(Number(event.target.value))}>
                {Array.from({ length: maxHours }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value} {value === 1 ? "hour" : "hours"}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 rounded-field bg-base-200 p-3 text-sm" aria-live="polite">
            <p className="font-medium">Availability on this day</p>
            {loading ? (
              <p className="mt-1 text-base-content/70">Checking the calendar...</p>
            ) : taken.length === 0 ? (
              <p className="mt-1 text-success">No confirmed bookings yet.</p>
            ) : (
              <ul className="mt-1 space-y-0.5 text-base-content/75">
                {taken.map((slot) => <li key={slot.start}>Booked {formatTime(slot.start)} to {formatTime(slot.end)}</li>)}
              </ul>
            )}
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium">Note to host (optional)</span>
            <textarea rows={2} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What are you planning to create?" className="textarea w-full" />
          </label>

          <dl className="mt-4 space-y-1.5 border-t border-base-300 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-base-content/70">{money(studio.hourlyRate)} x {bookedHours} {bookedHours === 1 ? "hour" : "hours"}</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-base-content/70">Refundable deposit</dt><dd>{money(studio.securityDeposit)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="font-mono">{money(total)}</dd></div>
          </dl>

          {error && <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-error"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}

          <div className="modal-action">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} disabled={busy}>Close</button>
            <button className="btn btn-primary btn-sm" disabled={busy}>
              {busy && <span className="loading loading-spinner loading-xs" />} Request booking
            </button>
          </div>
        </form>
        <button type="button" className="modal-backdrop" aria-label="Close dialog" onClick={() => setOpen(false)} />
      </dialog>
    </aside>
  );
}
