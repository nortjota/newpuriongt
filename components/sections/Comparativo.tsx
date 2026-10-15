import { Check } from "lucide-react";
import { COMPARATIVO_TILES } from "@/lib/content/comparativo";
import RevealBar from "@/components/ui/RevealBar";

// Estado padrão (Marco 1): "Purion GT" venceu (score 98), como no estado de repouso do protótipo.
export default function Comparativo() {
  return (
    <section id="comparativo" className="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-y)]">
      <div className="mb-10 text-center font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
        <div>Seu carro diz quem você é.</div>
        <div>Qual dos dois quer ser?</div>
      </div>

      <div className="mb-7 flex flex-col items-center gap-3">
        <div className="flex gap-1 rounded-[var(--radius-pill)] bg-paper-200 p-1.5">
          <span className="rounded-[var(--radius-pill)] px-6 py-3.5 text-[15px] font-medium text-ink-600">
            Cheirinho comum
          </span>
          <span className="rounded-[var(--radius-pill)] bg-ink-950 px-6 py-3.5 text-[15px] font-medium text-paper-0">
            Purion GT
          </span>
        </div>
        <span className="text-[13px] text-[var(--text-muted)]">Toque e veja a diferença</span>
      </div>

      <div className="relative flex flex-col gap-10 overflow-hidden rounded-[var(--radius-xl)] bg-ink-950 p-6 text-paper-0 sm:p-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[560px] flex-col gap-3.5">
            <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
              Purion GT
            </span>
            <span
              className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              “Que cheiro é esse?”
            </span>
            <span className="text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
              Vidro colecionável, alta perfumaria e uma fragrância só sua.
            </span>
          </div>
          <div className="flex min-w-[260px] flex-1 basis-[360px] flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
                Índice de presença
              </span>
              <span className="font-mono text-xs text-[var(--text-inverse-muted)]">/ 100</span>
            </div>
            <span
              className="font-display text-[clamp(96px,11vw,168px)] font-medium leading-[0.8] tracking-[-0.07em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              98
            </span>
            <span className="block h-2 overflow-hidden rounded bg-white/10">
              <RevealBar targetWidth="98%" className="block h-full rounded bg-signal-400" />
            </span>
          </div>
        </div>

        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          {COMPARATIVO_TILES.map((tile) => (
            <div
              key={tile.key}
              className="flex flex-col gap-3.5 rounded-[var(--radius-md)] border border-[var(--border-inverse)] bg-ink-800 px-5 py-4.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[.08em] text-[var(--text-inverse-muted)]">
                  {tile.key}
                </span>
                <Check size={14} />
              </div>
              <span className="font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em]" style={{ fontVariationSettings: "'wdth' 88" }}>
                {tile.purion}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 flex-1 rounded"
                    style={{ background: i < 5 ? "var(--signal-400)" : "rgba(255,255,255,.1)" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
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
