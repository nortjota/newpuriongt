"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

export default function WhatsAppFab() {
  const [tipVisible, setTipVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTipVisible(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex items-end gap-3">
      {tipVisible && (
        <div className="relative max-w-[240px] rounded-[18px_18px_4px_18px] border border-[var(--border-subtle)] bg-paper-0 p-3.5 pr-9 shadow-[var(--shadow-md)] animate-[pg-fade-up_.7s_var(--ease-out)_both]">
          <span className="block text-sm font-medium">Dúvidas sobre o Purion GT?</span>
          <span className="block text-[13px] text-[var(--text-secondary)]">Fale com a gente no WhatsApp.</span>
          <button
            onClick={() => setTipVisible(false)}
            aria-label="Fechar"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-paper-100 text-ink-950"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-ink-950 text-paper-0 shadow-[var(--shadow-lg)] transition-transform hover:scale-[1.08]"
      >
        <MessageCircle size={24} />
        <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 animate-[pg-pulse_2s_ease-in-out_infinite] rounded-full border-2 border-ink-950 bg-signal-400" />
      </a>
    </div>
  );
}
