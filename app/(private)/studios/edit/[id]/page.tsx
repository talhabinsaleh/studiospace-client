import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import StudioForm from "@/components/StudioForm";
import { getStudio } from "@/lib/server-api";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Update Studio" };

export default async function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/studios/edit/${id}`);
  const studio = await getStudio(id);
  if (!studio) notFound();
  if (studio.ownerEmail !== user.email) redirect("/my-listings");
  return (
    <div className="page-shell max-w-4xl py-12">
      <p className="eyebrow">Edit listing</p>
      <h1 className="section-title">Update {studio.title}</h1>
      <p className="section-text mb-8">Changes appear on your listing as soon as you save.</p>
      <StudioForm owner={{ name: user.name, email: user.email }} studio={studio} />
    </div>
  );
}
