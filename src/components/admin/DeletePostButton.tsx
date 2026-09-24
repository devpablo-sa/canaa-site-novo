"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Excluir o post "${title}"? Essa ação não pode ser desfeita.`)) return;
    setBusy(true);
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-xs font-semibold text-error hover:underline disabled:opacity-50">
      Excluir
    </button>
  );
}
