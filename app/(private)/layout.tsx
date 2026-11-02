import { headers } from "next/headers";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/session";

// Reads the real session on the server, so a reload keeps a logged-in user on their page
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  await requireUser((await headers()).get("x-return-to") ?? "/dashboard");
  return children;
}
