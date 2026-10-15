"use client";

import { ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

// Seção nova (não existia no protótipo original) — reforça a garantia de
// 7 dias logo depois da Oferta, no ponto em que a decisão de compra acontece.
// Padrão comprovado de e-commerce para reduzir objeção de risco.
export default function Guarantee() {
  return (
    <section className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <Reveal className="flex flex-col items-center gap-8 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-paper-0 px-6 py-14 text-center sm:py-20">
        <div className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-ink-950 text-paper-0 transition-transform duration-500 hover:scale-105 sm:h-36 sm:w-36">
          <div className="absolute inset-[6px] animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-paper-0/30" />
          <ShieldCheck size={40} className="sm:hidden" />
          <ShieldCheck size={52} className="hidden sm:block" />
        </div>

        <div className="flex max-w-[560px] flex-col gap-4">
          <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
            Garantia Purion GT
          </span>
          <h2
            className="m-0 font-display text-[clamp(28px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.03em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            7 dias pra se apaixonar pelo cheiro. Ou seu dinheiro de volta.
          </h2>
          <p className="m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Borrife no seu carro, viva com ele por uma semana. Se não for a presença que você esperava, devolvemos
            100% do valor — sem formulário, sem letra miúda, só uma mensagem no WhatsApp.
          </p>
        </div>

        <div className="grid w-full max-w-[480px] grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-8">
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              7
            </span>
            <span className="text-xs text-[var(--text-muted)]">dias de prazo</span>
          </div>
          <div className="flex flex-col gap-1 border-x border-[var(--border-subtle)]">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              100%
            </span>
            <span className="text-xs text-[var(--text-muted)]">do valor de volta</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              0
            </span>
            <span className="text-xs text-[var(--text-muted)]">perguntas feitas</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
