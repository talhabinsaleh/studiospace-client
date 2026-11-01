"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function InfoModal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box border border-base-300">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-3 leading-relaxed text-base-content/75">{children}</p>
        <div className="modal-action"><button type="button" className="btn btn-primary btn-sm" onClick={onClose}>Got it</button></div>
      </div>
      <button type="button" className="modal-backdrop" aria-label="Close dialog" onClick={onClose} />
    </dialog>
  );
}
