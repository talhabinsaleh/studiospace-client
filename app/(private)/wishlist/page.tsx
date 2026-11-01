import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = { title: "Saved Studios" };

export default function Page() {
  return <WishlistView />;
}
