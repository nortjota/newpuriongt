"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

// Seção nova (não existia no protótipo original) — reforça a garantia de
// 7 dias logo depois da Oferta, no ponto em que a decisão de compra acontece.
// Padrão comprovado de e-commerce para reduzir objeção de risco.
const SPRAY_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  angle: (360 / 8) * i,
  delay: (i % 4) * 0.3,
}));

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
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(10,10,12,.3) 0%, rgba(10,10,12,.62) 45%, rgba(10,10,12,.86) 100%)" }}
        />

        <div className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-ink-950 text-paper-0 transition-transform duration-500 hover:scale-105 sm:h-36 sm:w-36">
          <div className="absolute inset-[6px] animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-paper-0/30" />
          {SPRAY_PARTICLES.map((p, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
              style={{ transform: `rotate(${p.angle}deg)` }}
            >
              <span
                className="absolute block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-signal-400"
                style={{ animation: `pg-spray 2.4s ${p.delay}s ease-out infinite` }}
              />
            </span>
          ))}
          <ShieldCheck size={40} className="sm:hidden" />
          <ShieldCheck size={52} className="hidden sm:block" />
        </div>

        <div className="relative flex max-w-[560px] flex-col gap-4 rounded-[var(--radius-lg)] bg-ink-950/45 px-6 py-5 backdrop-blur-sm sm:px-8 sm:py-6">
          <span className="text-[11px] uppercase text-paper-0/80 tracking-[var(--ls-caps)]">
            Garantia Purion GT
          </span>
          <h2
            className="m-0 font-display text-[clamp(28px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.03em] text-paper-0"
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
