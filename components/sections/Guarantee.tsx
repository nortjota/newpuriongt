"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

// Seção nova (não existia no protótipo original) — reforça a garantia de
// 7 dias logo depois da Oferta, no ponto em que a decisão de compra acontece.
// Padrão comprovado de e-commerce para reduzir objeção de risco.
export default function Guarantee() {
  return (
    <section className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <Reveal className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[var(--radius-xl)] px-6 py-14 text-center text-paper-0 sm:py-20">
        <Image
          src="/images/cenas/foto-somente-carro.webp"
          alt="Carro à noite"
          fill
          className="absolute inset-0 object-cover"
          sizes="(min-width: 1024px) 1152px, 100vw"
        />
        <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

        <div className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-ink-950 text-paper-0 transition-transform duration-500 hover:scale-105 sm:h-36 sm:w-36">
          <div className="absolute inset-[6px] animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-paper-0/30" />
          <ShieldCheck size={40} className="sm:hidden" />
          <ShieldCheck size={52} className="hidden sm:block" />
        </div>

        <div className="relative flex max-w-[560px] flex-col gap-4">
          <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            Garantia Purion GT
          </span>
          <h2
            className="m-0 font-display text-[clamp(28px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.03em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            7 dias pra se apaixonar pelo cheiro. Ou seu dinheiro de volta.
          </h2>
        </div>

        <div className="relative grid w-full max-w-[480px] grid-cols-3 gap-4 border-t border-[var(--border-inverse)] pt-8">
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              7
            </span>
            <span className="text-xs text-[var(--text-inverse-muted)]">dias de prazo</span>
          </div>
          <div className="flex flex-col gap-1 border-x border-[var(--border-inverse)]">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              100%
            </span>
            <span className="text-xs text-[var(--text-inverse-muted)]">do valor de volta</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              0
            </span>
            <span className="text-xs text-[var(--text-inverse-muted)]">perguntas feitas</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
