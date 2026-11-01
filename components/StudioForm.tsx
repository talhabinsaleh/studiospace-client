"use client";

import { ImageUp, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import type { Studio, StudioFormValues } from "@/lib/types";
import StudioImage from "./StudioImage";

const CATEGORY_LIST = CATEGORIES.map((category) => category.value);

interface Props {
  owner: { name: string; email: string };
  studio?: Studio;
}

export default function StudioForm({ owner, studio }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(studio?.title ?? "");
  const [category, setCategory] = useState(studio?.category ?? "");
  const [hourlyRate, setHourlyRate] = useState(studio ? String(studio.hourlyRate) : "");
  const [securityDeposit, setSecurityDeposit] = useState(studio ? String(studio.securityDeposit) : "");
  const [maxCapacity, setMaxCapacity] = useState(studio ? String(studio.maxCapacity) : "");
  const [location, setLocation] = useState(studio?.location ?? "");
  const [image, setImage] = useState(studio?.image ?? "");
  const [galleryText, setGalleryText] = useState(studio?.gallery.join("\n") ?? "");
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [overview, setOverview] = useState(studio?.overview ?? "");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const amenityOptions = [...new Set([...AMENITIES, ...amenities])];

  function toggleAmenity(name: string) {
    setAmenities((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  function addCustomAmenity() {
    const value = customAmenity.trim();
    if (!value) return;
    setAmenities((current) => (current.includes(value) ? current : [...current, value]));
    setCustomAmenity("");
  }

  function onCustomKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomAmenity();
    }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Upload failed. Please try again.");
      setImage(data.url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (amenities.length === 0) {
      toast.error("Please choose at least one amenity.");
      return;
    }
    const values: StudioFormValues = {
      title,
      category,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit),
      maxCapacity: Number(maxCapacity),
      location,
      image,
      gallery: galleryText.split("\n").map((line) => line.trim()).filter(Boolean),
      amenities,
      overview,
    };
    setBusy(true);
    try {
      if (studio) {
        await api(`/api/studios/${studio._id}`, { method: "PUT", body: values });
        toast.success("Studio updated.");
      } else {
        await api("/api/studios", { method: "POST", body: values });
        toast.success("Studio added to StudioSpace.");
      }
      router.push("/my-listings");
      router.refresh();
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  }

  const labelClass = "mb-1 block text-sm font-medium";

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-box border border-base-300 bg-base-200 p-5 sm:grid-cols-2 sm:p-8">
      <label className="block sm:col-span-2">
        <span className={labelClass}>Title</span>
        <input required minLength={4} maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Daylight Cyc Wall Loft" className="input w-full" />
      </label>
      <label className="block">
        <span className={labelClass}>Category</span>
        <select required value={category} onChange={(event) => setCategory(event.target.value)} className="select w-full">
          <option value="" disabled>Choose a category</option>
          {CATEGORY_LIST.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="block">
        <span className={labelClass}>Location / Address</span>
        <input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Banani, Dhaka" className="input w-full" />
      </label>
      <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Hourly Rate ($)</span>
          <input required type="number" min={1} step="0.01" value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} className="input w-full" />
        </label>
        <label className="block">
          <span className={labelClass}>Security Deposit ($)</span>
          <input required type="number" min={0} step="0.01" value={securityDeposit} onChange={(event) => setSecurityDeposit(event.target.value)} className="input w-full" />
        </label>
        <label className="block">
          <span className={labelClass}>Max Capacity</span>
          <input required type="number" min={1} step={1} value={maxCapacity} onChange={(event) => setMaxCapacity(event.target.value)} className="input w-full" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="image-url" className={labelClass}>Image URL</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input id="image-url" required type="url" value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." className="input w-full flex-1" />
          <label className={`btn btn-outline ${uploading ? "btn-disabled" : ""}`}>
            {uploading ? <span className="loading loading-spinner loading-xs" /> : <ImageUp className="size-4" />}
            {uploading ? "Uploading" : "Upload to imgbb"}
            <input type="file" accept="image/*" onChange={upload} className="sr-only" disabled={uploading} />
          </label>
        </div>
        {image && <StudioImage src={image} alt="Selected studio" className="mt-3 aspect-[3/2] w-48 rounded-field object-cover" />}
      </div>

      <label className="block sm:col-span-2">
        <span className={labelClass}>Extra gallery image URLs (optional, one per line)</span>
        <textarea rows={2} value={galleryText} onChange={(event) => setGalleryText(event.target.value)} className="textarea w-full" />
      </label>

      <fieldset className="sm:col-span-2">
        <legend className={labelClass}>Amenities</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {amenityOptions.map((name) => (
            <label key={name} className={`inline-flex cursor-pointer items-center gap-2 rounded-field border px-3 py-1.5 text-sm ${amenities.includes(name) ? "border-primary bg-primary/10" : "border-base-300"}`}>
              <input type="checkbox" checked={amenities.includes(name)} onChange={() => toggleAmenity(name)} className="checkbox checkbox-xs checkbox-primary" />
              {name}
            </label>
          ))}
        </div>
        <div className="mt-3 flex max-w-md gap-2">
          <input aria-label="Add another amenity" value={customAmenity} onChange={(event) => setCustomAmenity(event.target.value)} onKeyDown={onCustomKey} placeholder="Add another amenity" className="input input-sm min-w-0 flex-1" />
          <button type="button" onClick={addCustomAmenity} className="btn btn-outline btn-sm"><Plus className="size-4" /> Add</button>
        </div>
        {amenities.length > 0 && (
          <p className="mt-2 flex items-center gap-1 text-xs text-base-content/65"><X className="size-3" /> Untick an amenity to remove it.</p>
        )}
      </fieldset>

      <label className="block sm:col-span-2">
        <span className={labelClass}>Detailed Overview</span>
        <textarea required minLength={20} rows={5} value={overview} onChange={(event) => setOverview(event.target.value)} placeholder="What makes this space good to work in? What gear is included?" className="textarea w-full" />
      </label>

      <label className="block">
        <span className={labelClass}>Host Name</span>
        <input readOnly value={studio?.ownerName ?? owner.name} className="input w-full cursor-not-allowed bg-base-300" />
      </label>
      <label className="block">
        <span className={labelClass}>Host Email</span>
        <input readOnly value={studio?.ownerEmail ?? owner.email} className="input w-full cursor-not-allowed bg-base-300" />
      </label>

      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost" disabled={busy}>Cancel</button>
        <button className="btn btn-primary" disabled={busy || uploading}>
          {busy && <span className="loading loading-spinner loading-xs" />} {studio ? "Save changes" : "Publish studio"}
        </button>
      </div>
    </form>
  );
}
