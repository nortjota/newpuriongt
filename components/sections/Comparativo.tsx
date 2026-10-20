"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MousePointerClick, X } from "lucide-react";
import { COMPARATIVO_TILES } from "@/lib/content/comparativo";

type Side = "a" | "b";

const COPY: Record<Side, { title: string; sub: string; score: number; foot: string }> = {
  a: {
    title: "Esquecível.",
    sub: "Papelão no retrovisor, cheiro artificial e igual a todo carro.",
    score: 22,
    foot: "Evapora em horas. Você compra de novo na semana seguinte.",
  },
  b: {
    title: "“Que cheiro é esse?”",
    sub: "Vidro colecionável, alta perfumaria e uma fragrância só sua.",
    score: 98,
    foot: "Junte-se a mais de 100 motoristas que elevaram o padrão.",
  },
};

export default function Comparativo() {
  const [side, setSide] = useState<Side>("b");
  const [score, setScore] = useState(COPY.b.score);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const playedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  function animateTo(target: Side) {
    const from = score;
    const to = COPY[target].score;
    const t0 = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      const eased = 1 - Math.pow(1 - k, 4);
      setScore(Math.round(from + (to - from) * eased));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function pick(target: Side) {
    setSide(target);
    animateTo(target);
  }

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        observer.disconnect();
        setSide("a");
        setScore(COPY.a.score);
        const t = setTimeout(() => pick("b"), 1600);
        return () => clearTimeout(t);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const winning = side === "b";
  const copy = COPY[side];

  return (
    <section id="comparativo" className="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-y)]">
      <div className="mb-10 text-center font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
        <div>Seu carro diz quem você é.</div>
        <div>Qual dos dois quer ser?</div>
      </div>

      <div className="mb-7 flex flex-col items-center gap-3">
        <div className="flex gap-2 rounded-[var(--radius-pill)] bg-paper-200 p-2">
          <button
            onClick={() => pick("a")}
            className={`relative rounded-[var(--radius-pill)] px-6 py-3.5 text-[15px] font-medium transition-all duration-300 active:scale-95 ${
              side === "a"
                ? "bg-ink-950 text-paper-0 shadow-[var(--shadow-md)]"
                : "bg-paper-0 text-ink-600 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
            }`}
          >
            Cheirinho comum
            {side !== "a" && (
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-[var(--danger-500)]" />
            )}
          </button>
          <button
            onClick={() => pick("b")}
            className={`relative rounded-[var(--radius-pill)] px-6 py-3.5 text-[15px] font-medium transition-all duration-300 active:scale-95 ${
              side === "b"
                ? "bg-ink-950 text-paper-0 shadow-[var(--shadow-md)]"
                : "bg-paper-0 text-ink-600 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
            }`}
          >
            Purion GT
            {side !== "b" && (
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-signal-400" />
            )}
          </button>
        </div>
        <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)]">
          <MousePointerClick size={14} className="animate-bounce" />
          Toque e veja a diferença
        </span>
      </div>

      <div
        ref={sectionRef}
        className={`relative flex flex-col gap-10 overflow-hidden rounded-[var(--radius-xl)] p-6 transition-colors duration-700 sm:p-14 ${
          winning ? "bg-ink-950 text-paper-0" : "bg-paper-200 text-ink-600"
        }`}
      >
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[560px] flex-col gap-3.5">
            <span
              className={`text-[11px] uppercase tracking-[var(--ls-caps)] ${winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"}`}
            >
              {winning ? "Purion GT" : "Cheirinho comum"}
            </span>
            <span
              className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              {copy.title}
            </span>
            <span className={`text-[15px] leading-relaxed ${winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"}`}>
              {copy.sub}
            </span>
          </div>
          <div className="flex min-w-[260px] flex-1 basis-[360px] flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span
                className={`text-[11px] uppercase tracking-[var(--ls-caps)] ${winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"}`}
              >
                Índice de presença
              </span>
              <span className={`font-mono text-xs ${winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"}`}>/ 100</span>
            </div>
            <span
              className="font-display text-[clamp(96px,11vw,168px)] font-medium leading-[0.8] tracking-[-0.07em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              {score}
            </span>
            <span className={`block h-2 overflow-hidden rounded ${winning ? "bg-white/10" : "bg-ink-950/8"}`}>
              <span
                className={`block h-full rounded ${winning ? "bg-signal-400" : "bg-[var(--danger-500)]"}`}
                style={{ width: `${score}%`, transition: "width 1.2s var(--ease-out)" }}
              />
            </span>
          </div>
        </div>

        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          {COMPARATIVO_TILES.map((tile) => {
            const filled = winning ? 5 : tile.strength;
            return (
              <div
                key={tile.key}
                className={`flex flex-col gap-3.5 rounded-[var(--radius-md)] border px-5 py-4.5 transition-colors duration-700 ${
                  winning ? "border-[var(--border-inverse)] bg-ink-800" : "border-[var(--border-subtle)] bg-white/45"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[.08em] ${
                      winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"
                    }`}
                  >
                    {tile.key}
                  </span>
                  {winning ? <Check size={14} /> : <X size={14} />}
                </div>
                <span
                  className="font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em]"
                  style={{
                    fontVariationSettings: "'wdth' 88",
                    textDecoration: winning ? "none" : "line-through",
                  }}
                >
                  {winning ? tile.purion : tile.common}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 flex-1 rounded transition-colors duration-500"
                      style={{
                        background: i < filled
                          ? winning ? "var(--signal-400)" : "var(--danger-500)"
                          : winning ? "rgba(255,255,255,.1)" : "rgba(11,12,14,.08)",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className={`text-sm ${winning ? "text-[var(--text-inverse-muted)]" : "text-steel-500"}`}>{copy.foot}</span>
          <a
            href="#comprar"
            className={`rounded-[var(--radius-pill)] px-6 py-4 text-sm font-medium ${
              winning ? "bg-signal-400 text-ink-950" : "bg-ink-950 text-paper-0"
            }`}
          >
            Escolher o Purion GT
          </a>
        </div>
      </div>
    </section>
  );
}
