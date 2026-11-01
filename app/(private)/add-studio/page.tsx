import type { Metadata } from "next";
import StudioForm from "@/components/StudioForm";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Add New Studio" };

export default async function AddStudioPage() {
  const user = await requireUser("/add-studio");
  return (
    <div className="page-shell max-w-4xl py-12">
      <p className="eyebrow">Host your space</p>
      <h1 className="section-title">Add a new studio</h1>
      <p className="section-text mb-8">Good photos and an honest overview get the most bookings.</p>
      <StudioForm owner={{ name: user.name, email: user.email }} />
    </div>
  );
}
