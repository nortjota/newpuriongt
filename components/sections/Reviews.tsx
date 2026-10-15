"use client";

import { useEffect, useRef, useState } from "react";
import { PenLine, Star } from "lucide-react";
import { REVIEWS_SEED } from "@/lib/content/reviews.seed";
import Marquee from "@/components/ui/Marquee";
import ReviewSubmitModal from "@/components/widgets/ReviewSubmitModal";

const SPOTLIGHT_INTERVAL = 6000;

// Anima de 0% a 100% ao montar — remontado (via `key`) a cada vez que o
// spotlight muda, reproduzindo a barra "width 6s linear" do protótipo.
function ScrubProgress({ durationMs }: { durationMs: number }) {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFull(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <span
      className="block h-full bg-paper-0"
      style={{ width: full ? "100%" : "0%", transition: `width ${durationMs}ms linear` }}
    />
  );
}

export default function Reviews() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [spot, setSpot] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSpot((s) => (s + 1) % REVIEWS_SEED.length), SPOTLIGHT_INTERVAL);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function jumpTo(i: number) {
    setSpot(i);
    startTimer();
  }

  const spotlight = REVIEWS_SEED[spot];

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
          <button
            onClick={() => setReviewOpen(true)}
            className="flex w-fit items-center gap-2.5 rounded-[var(--radius-pill)] bg-ink-950 px-5.5 py-3 text-sm font-medium text-paper-0"
          >
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
              {String(spot + 1).padStart(2, "0")} / {String(REVIEWS_SEED.length).padStart(2, "0")}
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
              <button key={r.name} onClick={() => jumpTo(i)} aria-label="Ver depoimento" className="h-[18px] flex-1 py-[7px]">
                <span className="block h-1 overflow-hidden rounded bg-white/16">
                  {i < spot ? (
                    <span className="block h-full w-full bg-paper-0" />
                  ) : i === spot ? (
                    <ScrubProgress key={`${spot}-${i}`} durationMs={SPOTLIGHT_INTERVAL} />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3">
        {[
          { items: REVIEWS_SEED, duration: "70s", reverse: false },
          { items: [...REVIEWS_SEED].reverse(), duration: "80s", reverse: true },
        ].map((row, rowIdx) => (
          <Marquee
            key={rowIdx}
            items={row.items}
            duration={row.duration}
            reverse={row.reverse}
            className="pl-6"
            renderItem={(review) => (
              <div
                key={review.name}
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
            )}
          />
        ))}
      </div>

      <ReviewSubmitModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </section>
  );
}
