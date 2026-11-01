import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getUser } from "@/lib/session";

// Reads the real session on the server, so a reload keeps a logged-in user on their page
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  if (!(await getUser())) redirect("/login");
  return children;
}
