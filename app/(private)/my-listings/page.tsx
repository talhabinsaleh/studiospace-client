import type { Metadata } from "next";
import MyListings from "@/components/MyListings";

export const metadata: Metadata = { title: "My Studio Listings" };

export default function Page() {
  return <MyListings />;
}
