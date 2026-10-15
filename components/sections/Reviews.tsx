import { PenLine, Star } from "lucide-react";
import { REVIEWS_SEED } from "@/lib/content/reviews.seed";

// Estático (Marco 1): o spotlight rotativo, a marquee infinita e o modal de
// depoimento ganham interatividade no Marco 7. Mostra o primeiro depoimento.
export default function Reviews() {
  const spotlight = REVIEWS_SEED[0];

  return (
    <section id="avaliacoes" className="py-[var(--section-y)]">
      <div className="mx-auto grid max-w-[var(--content-max)] items-stretch gap-16 px-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div className="flex flex-col justify-between gap-7">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
              Avaliações verificadas
            </span>
            <div className="flex items-end gap-4.5">
              <span
                className="font-display text-[clamp(120px,14vw,200px)] font-medium leading-[0.8] tracking-[-0.07em]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                4.9
              </span>
              <div className="flex flex-col gap-2 pb-2.5">
                <div className="flex gap-0.5 text-ink-950">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[13px] text-[var(--text-secondary)]">de 5 · mais de 100 avaliações</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 border-t border-[var(--border-strong)] pt-3.5">
              <span className="font-display text-[56px] font-medium leading-[0.9] tracking-[-0.05em]" style={{ fontVariationSettings: "'wdth' 88" }}>
                92%
              </span>
              <span className="text-[13px] text-[var(--text-secondary)]">taxa de recompra</span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-[var(--border-strong)] pt-3.5">
              <span className="font-display text-[56px] font-medium leading-[0.9] tracking-[-0.05em]" style={{ fontVariationSettings: "'wdth' 88" }}>
                100+
              </span>
              <span className="text-[13px] text-[var(--text-secondary)]">motoristas satisfeitos</span>
            </div>
          </div>
          <button className="flex w-fit items-center gap-2.5 rounded-[var(--radius-pill)] bg-ink-950 px-5.5 py-3 text-sm font-medium text-paper-0">
            <PenLine size={16} />
            Deixar meu depoimento
          </button>
        </div>

        <div className="relative flex min-h-[440px] flex-col justify-between gap-9 overflow-hidden rounded-[var(--radius-xl)] bg-ink-950 p-7 text-paper-0 sm:p-12">
          <span
            className="pointer-events-none absolute -top-7 right-6 font-display text-[280px] leading-none text-ink-800"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            &rdquo;
          </span>
          <div className="relative flex items-center justify-between">
            <div className="flex gap-0.5 text-signal-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="font-mono text-xs text-[var(--text-inverse-muted)]">
              01 / {String(REVIEWS_SEED.length).padStart(2, "0")}
            </span>
          </div>
          <figure className="relative m-0 flex flex-col gap-7">
            <blockquote
              className="m-0 font-display text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.18] tracking-[-0.025em]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              &ldquo;{spotlight.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal-400 font-semibold text-ink-950">
                {spotlight.name[0]}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{spotlight.name}</span>
                <span className="font-mono text-xs text-[var(--text-inverse-muted)]">
                  {spotlight.city} · foto enviada pelo cliente
                </span>
              </span>
            </figcaption>
          </figure>
          <div className="relative flex gap-1.5">
            {REVIEWS_SEED.map((r, i) => (
              <span key={r.name} className="h-1 flex-1 overflow-hidden rounded bg-white/16">
                <span className="block h-full bg-paper-0" style={{ width: i === 0 ? "100%" : "0%" }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 overflow-hidden">
        {[REVIEWS_SEED, [...REVIEWS_SEED].reverse()].map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-3 overflow-x-auto px-6">
            {row.map((review) => (
              <div
                key={review.name + rowIdx}
                className="flex w-[340px] flex-none flex-col gap-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-paper-0 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">{review.tag}</span>
                </div>
                <p className="m-0 text-sm leading-relaxed text-ink-800">&ldquo;{review.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-2.5">
                  <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-paper-100 text-xs font-semibold">
                    {review.name[0]}
                  </span>
                  <span className="text-[13px] font-medium">{review.name}</span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">{review.city}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
