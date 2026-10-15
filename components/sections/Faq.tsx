"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQ } from "@/lib/content/faq";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="mx-auto grid max-w-[var(--content-max)] items-start gap-16 px-6 pb-[var(--section-y)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))]"
    >
      <div className="flex flex-col gap-6 sm:sticky sm:top-[110px]">
        <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
          FAQ · {String(FAQ.length).padStart(2, "0")} perguntas
        </span>
        <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
          <div>Perguntas</div>
          <div>frequentes.</div>
        </div>
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Não encontrou o que procura? A gente responde rápido no WhatsApp.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-sm font-medium text-ink-950 underline">
          Falar no WhatsApp
        </a>
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
                  <p className="m-0 px-14 pb-6 text-[15px] leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
