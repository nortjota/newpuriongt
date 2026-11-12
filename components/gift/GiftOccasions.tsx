"use client";

import { ArrowRight } from "lucide-react";
import { OCCASIONS } from "@/lib/content/gifts";
import { suggestOffer } from "@/lib/gift/catalog";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import { useGift } from "./GiftContext";

// 3. Seletor de ocasiões — cada opção direciona para a oferta REAL sugerida
// (primeira disponível na ordem de preferência) e grava ?ocasiao= na URL.
export default function GiftOccasions() {
  const { offers, occasion, selectOccasion } = useGift();

  return (
    <section
      id="ocasioes"
      aria-labelledby="gift-occasions-title"
      className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-[var(--section-y)] sm:px-10"
    >
      <Reveal>
        <SectionHeading id="gift-occasions-title" eyebrow="Ocasiões" title="Qual é a ocasião?">
          <p className="m-0">Escolha o momento e levamos você direto ao presente que combina com ele.</p>
        </SectionHeading>
      </Reveal>

      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:grid-cols-3">
        {OCCASIONS.map((o, i) => {
          const active = occasion?.id === o.id;
          const suggestion = suggestOffer(o, offers);
          return (
            <li key={o.id}>
              <button
                type="button"
                aria-pressed={active}
                aria-describedby={`occ-${o.id}-hint`}
                disabled={!suggestion}
                onClick={() => selectOccasion(o.id)}
                className={`group flex h-full w-full flex-col gap-5 rounded-[var(--radius-md)] border p-4 text-left transition-[border-color,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--gift-accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-6 sm:p-7 ${
                  active
                    ? "border-[var(--gift-accent)]/70 bg-white/[0.07]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-xs text-paper-0/40">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 sm:h-9 sm:w-9 ${
                      active
                        ? "border-transparent bg-[var(--gift-accent)] text-ink-950"
                        : "border-white/15 text-paper-0/70 group-hover:border-white/40 group-hover:text-paper-0"
                    }`}
                  >
                    <ArrowRight size={15} />
                  </span>
                </span>
                <span className="flex flex-col gap-2">
                  <span
                    className="font-display text-[clamp(18px,2.4vw,28px)] font-medium leading-[1.05] tracking-[-0.03em] text-paper-0"
                    style={{ fontVariationSettings: "'wdth' 92" }}
                  >
                    {o.label}
                  </span>
                  <span className="text-[13px] leading-relaxed text-paper-0/60 sm:text-[14px]">{o.line}</span>
                </span>
                <span id={`occ-${o.id}-hint`} className="mt-auto text-[11px] uppercase tracking-[0.1em] text-paper-0/45 sm:text-[12px]">
                  {suggestion ? `Sugestão: ${suggestion.name.replace("PURION ", "")}` : "Indisponível no momento"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
