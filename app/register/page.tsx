import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage() {
  if (await getUser()) redirect("/");
  return <RegisterForm />;
}
