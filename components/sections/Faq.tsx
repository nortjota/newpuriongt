"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Plus } from "lucide-react";
import { FAQ } from "@/lib/content/faq";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <h2
          className="m-0 font-display text-[clamp(40px,6vw,64px)] font-medium leading-[0.95] tracking-[-0.03em] text-ink-950"
          style={{ fontVariationSettings: "'wdth' 88" }}
        >
          FAQ
        </h2>
        <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
          {String(FAQ.length).padStart(2, "0")} perguntas
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`overflow-hidden rounded-[var(--radius-md)] border transition-colors duration-500 ${
                isOpen ? "border-ink-950 bg-ink-950 text-paper-0" : "border-[var(--border-subtle)] bg-paper-0 text-ink-950"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center gap-4.5 px-5.5 py-5.5 text-left transition-[padding] hover:pl-7.5"
              >
                <span className="flex-none font-mono text-xs opacity-55">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="flex-1 font-display text-[clamp(18px,1.6vw,22px)] font-medium leading-tight tracking-[-0.02em]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {item.q}
                </span>
                <span
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full transition-transform duration-700 ${
                    isOpen ? "bg-signal-400 text-ink-950" : "bg-paper-100 text-ink-950"
                  }`}
                  style={{ transform: isOpen ? "rotate(135deg)" : "none" }}
                >
                  <Plus size={16} />
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-700"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 px-14 pb-6 sm:flex-row sm:items-start">
                    <p className="m-0 flex-1 text-[15px] leading-relaxed">{item.a}</p>
                    {"image" in item && item.image && (
                      <div className="relative aspect-square w-full flex-none overflow-hidden rounded-[var(--radius-md)] sm:w-[140px]">
                        <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="140px" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-paper-100 px-6 py-8 text-center">
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Não encontrou o que procura? A gente responde rápido no WhatsApp.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink-950 px-5.5 py-3 text-sm font-medium text-paper-0"
        >
          <MessageCircle size={16} />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}
