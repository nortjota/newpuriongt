"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { usePurion } from "@/lib/store/PurionProvider";

export default function Toast() {
  const { state, clearToast } = usePurion();

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(clearToast, 2800);
    return () => clearTimeout(t);
  }, [state.toast, clearToast]);

  if (!state.toast) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-[90] flex justify-center">
      <div className="flex items-center gap-3 rounded-[var(--radius-pill)] bg-ink-950 px-5 py-3.5 text-sm text-paper-0 shadow-[var(--shadow-md)] animate-[pg-fade-up_.6s_var(--ease-out)_both]">
        <Check size={16} className="text-signal-400" />
        <span>{state.toast}</span>
        <a href="#comprar" className="font-medium underline underline-offset-2">
          Ver
        </a>
      </div>
    </div>
  );
}
