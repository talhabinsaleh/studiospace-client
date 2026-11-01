import type { Metadata } from "next";
import MyBookings from "@/components/MyBookings";

export const metadata: Metadata = { title: "My Bookings" };

export default function Page() {
  return <MyBookings />;
}
