"use client";

import { ArrowRight } from "lucide-react";
import { OCCASIONS, getGift } from "@/lib/content/gifts";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import { scrollToChooser, useGift } from "./GiftContext";

// 3. Ocasiões — cada card seleciona a ocasião e leva o visitante à seção de
// presentes com a sugestão real destacada (os três presentes continuam
// visíveis; nada é filtrado ou escondido).
export default function GiftOccasions() {
  const { occasion, selectOccasion } = useGift();

  return (
    <section
      id="ocasioes"
      aria-labelledby="gift-occasions-title"
      className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-[var(--section-y)] sm:px-10"
    >
      <Reveal>
        <SectionHeading id="gift-occasions-title" eyebrow="Ocasiões" title="Para cada momento, o presente certo.">
          <p className="m-0">Escolha a ocasião e mostramos qual PURION GIFT combina com ela.</p>
        </SectionHeading>
      </Reveal>

      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:grid-cols-3">
        {OCCASIONS.map((o, i) => {
          const active = occasion?.id === o.id;
          const suggestion = getGift(o.suggestion);
          return (
            <li key={o.id}>
              <Reveal delay={i * 60} className="h-full">
                <button
                  type="button"
                  aria-pressed={active}
                  aria-describedby={`occ-${o.id}-hint`}
                  onClick={() => {
                    selectOccasion(o.id);
                    scrollToChooser();
                  }}
                  className={`group flex h-full w-full flex-col gap-5 rounded-[var(--radius-md)] border p-4 text-left transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal-400 motion-safe:hover:-translate-y-1 sm:gap-6 sm:p-7 ${
                    active
                      ? "border-signal-400/70 bg-white/[0.07]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-xs text-paper-0/40">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-500 ${
                        active
                          ? "border-transparent bg-signal-400 text-ink-950"
                          : "border-white/15 text-paper-0/70 group-hover:border-white/40 group-hover:text-paper-0"
                      }`}
                    >
                      <ArrowRight size={15} />
                    </span>
                  </span>
                  <span className="flex flex-col gap-2">
                    <span
                      className="font-display text-[clamp(19px,2.4vw,30px)] font-medium leading-[1.02] tracking-[-0.03em] text-paper-0"
                      style={{ fontVariationSettings: "'wdth' 92" }}
                    >
                      {o.label}
                    </span>
                    <span className="text-[13px] leading-relaxed text-paper-0/60 sm:text-[14px]">{o.line}</span>
                  </span>
                  <span id={`occ-${o.id}-hint`} className="mt-auto text-[11px] uppercase tracking-[0.1em] sm:text-[12px] sm:tracking-[0.12em] text-paper-0/45">
                    Sugestão: {suggestion.name.replace("PURION GIFT ", "")}
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
