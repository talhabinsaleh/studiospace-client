import type { Review, Studio, StudioList } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`);
  return res.json();
}

export async function getFeaturedStudios() {
  return (await get<Studio[]>("/studios/featured")) ?? [];
}

export async function getCategoryCounts() {
  return (await get<{ _id: string; count: number; minRate: number }[]>("/studios/categories")) ?? [];
}

export async function getStudios(query: string) {
  return (await get<StudioList>(`/studios?${query}`)) ?? { items: [], total: 0, page: 1, pages: 1 };
}

export function getStudio(id: string) {
  return get<Studio>(`/studios/${encodeURIComponent(id)}`);
}

export async function getReviews(id: string) {
  return (await get<Review[]>(`/studios/${encodeURIComponent(id)}/reviews`)) ?? [];
}
