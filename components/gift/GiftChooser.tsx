"use client";

import { X } from "lucide-react";
import { GIFTS } from "@/lib/content/gifts";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import GiftCard from "./GiftCard";
import { CHOOSER_ID, useGift } from "./GiftContext";

// 4. Escolha seu presente — os três kits reais, ligados ao carrinho.
export default function GiftChooser() {
  const { occasion, selectOccasion, addGift } = useGift();

  return (
    <section
      id={CHOOSER_ID}
      tabIndex={-1}
      aria-labelledby="gift-chooser-title"
      className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-[var(--section-y)] outline-none sm:px-10"
    >
      {/* Âncoras de compatibilidade: Toast ("Ver") e o carrinho vazio
          ("Ver o produto") são widgets globais que apontam para #comprar e
          #comprar-topo — aqui as duas levam aos presentes. */}
      <span id="comprar" aria-hidden className="block scroll-mt-20" />
      <span id="comprar-topo" aria-hidden className="block scroll-mt-20" />

      <Reveal>
        <SectionHeading id="gift-chooser-title" eyebrow="Escolha seu presente" title="Três formas de presentear.">
          <p className="m-0">O mesmo PURION GT 60 ml — você escolhe quantos frascos vão no presente.</p>
        </SectionHeading>
      </Reveal>

      <div aria-live="polite" className="mt-8 min-h-0">
        {occasion && (
          <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[15px] leading-relaxed text-paper-0/80">
              <span className="font-medium text-paper-0">{occasion.label}:</span> {occasion.reason}
            </p>
            <button
              type="button"
              onClick={() => selectOccasion(null)}
              className="inline-flex flex-none items-center gap-1.5 self-start rounded-full px-3 py-2 text-[13px] text-paper-0/60 transition-colors hover:text-paper-0 focus-visible:outline-2 focus-visible:outline-signal-400 sm:self-auto"
            >
              <X size={14} aria-hidden />
              Limpar ocasião
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
        {GIFTS.map((gift, i) => (
          <Reveal key={gift.id} delay={i * 80} className="h-full">
            <GiftCard
              gift={gift}
              highlighted={occasion ? occasion.suggestion === gift.id : false}
              highlightLabel={occasion ? `Sugerido para ${occasion.label}` : undefined}
              onChoose={() => addGift(gift.id)}
            />
          </Reveal>
        ))}
      </div>

      <p className="m-0 mt-6 text-center text-[13px] text-paper-0/45">
        Envio no mesmo dia · Rastreio liberado na hora · Garantia de 7 dias
      </p>
    </section>
  );
}
