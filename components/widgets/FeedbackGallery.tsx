"use client";

import { useState } from "react";
import Image from "next/image";
import { FEEDBACKS } from "@/lib/content/feedbacks";
import Dialog from "@/components/ui/Dialog";

export default function FeedbackGallery() {
  const [openIndex, setOpenIndex] = useState(-1);
  const current = openIndex >= 0 ? FEEDBACKS[openIndex] : null;

  return (
    <div>
      <span className="mb-3 block text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
        Clientes
      </span>
      {/* Rail simples sem duplicar itens (sem marquee em loop) — as 17 fotos
          reais, uma vez cada, bem juntas. */}
      <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FEEDBACKS.map((fb, i) => (
          <button
            key={fb.src}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[3/4] w-[76px] flex-none overflow-hidden rounded-[var(--radius-sm)] bg-paper-100 transition-transform hover:-translate-y-0.5"
          >
            <Image src={fb.src} alt={fb.alt} fill className="object-cover" sizes="76px" />
          </button>
        ))}
      </div>

      <Dialog open={!!current} onClose={() => setOpenIndex(-1)} width={480}>
        {current && (
          <div className="relative mx-auto aspect-[3/4] max-h-[76vh] overflow-hidden rounded-[var(--radius-md)] bg-paper-100">
            <Image src={current.src} alt={current.alt} fill className="object-contain" sizes="480px" />
          </div>
        )}
      </Dialog>
    </div>
  );
}
