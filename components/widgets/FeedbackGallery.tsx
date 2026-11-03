"use client";

import { useState } from "react";
import Image from "next/image";
import { FEEDBACKS } from "@/lib/content/feedbacks";
import Dialog from "@/components/ui/Dialog";
import Marquee from "@/components/ui/Marquee";

export default function FeedbackGallery() {
  const [openIndex, setOpenIndex] = useState(-1);
  const current = openIndex >= 0 ? FEEDBACKS[openIndex] : null;

  return (
    <div className="mt-16">
      <span className="mb-4 block text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
        Clientes
      </span>
      <Marquee
        items={FEEDBACKS}
        duration="46s"
        itemClassName="gap-3"
        className="gap-3"
        renderItem={(fb, i) => (
          <button
            key={`${fb.src}-${i}`}
            onClick={() => setOpenIndex(FEEDBACKS.indexOf(fb))}
            className="relative aspect-[3/4] w-[132px] flex-none overflow-hidden rounded-[var(--radius-md)] bg-paper-100 transition-transform hover:-translate-y-0.5"
          >
            <Image src={fb.src} alt={fb.alt} fill className="object-cover" sizes="132px" />
          </button>
        )}
      />

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
