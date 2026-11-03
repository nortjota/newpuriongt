"use client";

import { useState } from "react";
import Image from "next/image";
import { FEEDBACKS } from "@/lib/content/feedbacks";
import Dialog from "@/components/ui/Dialog";

export default function FeedbackGallery() {
  const [openIndex, setOpenIndex] = useState(-1);
  const current = openIndex >= 0 ? FEEDBACKS[openIndex] : null;

  return (
    <div className="mt-16">
      <span className="mb-4 block text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
        Prints de clientes reais
      </span>
      <div className="grid auto-cols-[min(220px,56vw)] grid-flow-col gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-4 sm:overflow-visible lg:grid-cols-6 [scroll-snap-type:x_mandatory]">
        {FEEDBACKS.map((fb, i) => (
          <button
            key={fb.src}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-paper-100 [scroll-snap-align:start]"
          >
            <Image src={fb.src} alt={fb.alt} fill className="object-cover" sizes="(min-width: 1024px) 220px, (min-width: 640px) 25vw, 56vw" />
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
