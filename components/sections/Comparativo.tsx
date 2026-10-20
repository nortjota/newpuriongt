"use client";

import { Check, X } from "lucide-react";
import { COMPARATIVO_TILES } from "@/lib/content/comparativo";
import RevealBar from "@/components/ui/RevealBar";
import Reveal from "@/components/ui/Reveal";

// Agora é uma comparação estática lado a lado (pedido do usuário) em vez de
// um toggle clicável entre dois estados.
export default function Comparativo() {
  return (
    <section id="comparativo" className="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-y)]">
      <div className="mb-10 text-center font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
        <div>Seu carro diz quem você é.</div>
        <div>Qual dos dois quer ser?</div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-xl)] bg-ink-950 text-paper-0">
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-2.5 border-r border-[var(--border-inverse)] p-5 sm:p-10">
            <span className="flex items-center gap-2 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
              <X size={12} />
              Cheirinho comum
            </span>
            <span
              className="font-display text-[clamp(44px,8vw,96px)] font-medium leading-[0.8] tracking-[-0.04em] text-steel-500"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              22
            </span>
            <span className="block h-1.5 overflow-hidden rounded bg-white/10">
              <RevealBar targetWidth="22%" className="block h-full rounded bg-[var(--danger-500)]" />
            </span>
          </div>
          <div className="flex flex-col gap-2.5 p-5 sm:p-10">
            <span className="flex items-center gap-2 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
              <Check size={12} className="text-signal-400" />
              Purion GT
            </span>
            <span
              className="font-display text-[clamp(44px,8vw,96px)] font-medium leading-[0.8] tracking-[-0.04em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              98
            </span>
            <span className="block h-1.5 overflow-hidden rounded bg-white/10">
              <RevealBar targetWidth="98%" className="block h-full rounded bg-signal-400" />
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--border-inverse)] px-5 py-2 sm:px-10">
          {COMPARATIVO_TILES.map((tile) => (
            <Reveal key={tile.key} className="grid grid-cols-2 gap-px border-b border-[var(--border-inverse)] py-4 last:border-0">
              <div className="flex flex-col gap-1 pr-3">
                <span className="text-[10px] uppercase text-[var(--text-inverse-muted)] tracking-[.08em]">{tile.key}</span>
                <span className="text-sm leading-snug text-steel-500 line-through decoration-[var(--danger-500)]/70">
                  {tile.common}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[var(--border-inverse)] pl-3">
                <span className="text-[10px] uppercase text-[var(--text-inverse-muted)] tracking-[.08em]">{tile.key}</span>
                <span className="text-sm font-medium leading-snug">{tile.purion}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-inverse)] p-5 sm:p-10">
          <span className="text-sm text-[var(--text-inverse-muted)]">
            Junte-se a mais de 100 motoristas que elevaram o padrão.
          </span>
          <a
            href="#comprar"
            className="rounded-[var(--radius-pill)] bg-signal-400 px-6 py-4 text-sm font-medium text-ink-950"
          >
            Escolher o Purion GT
          </a>
        </div>
      </div>
    </section>
  );
}
