"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Reveal from "@/components/ui/Reveal";

function RevealWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const color = useTransform(progress, (p) => ((index + 1) / total <= p ? "var(--ink-950)" : "var(--steel-300)"));
  return <motion.span style={{ color }}>{word}</motion.span>;
}

const MANIFESTO_WORDS =
  "Você gasta horas cuidando do seu carro. Polimento, detalhamento, acessórios premium. E o cheiro? Aceita qualquer coisa pendurada no retrovisor. A Purion GT nasceu para acabar com essa contradição.".split(
    " "
  );

const STATS = [
  { value: "2 anos", label: "estudando grandes casas de perfumaria" },
  { value: "700", label: "borrifadas em cada frasco" },
  { value: "0%", label: "resíduo no retrovisor" },
];

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.1"] });
  // Preso ao proprio paragrafo (nao a secao inteira) - no mobile a secao fica
  // muito mais alta que o paragrafo (imagem empilha embaixo), e usar o scroll
  // da secao inteira fazia a animacao nunca terminar de colorir o texto.
  const { scrollYProgress: wordsProgress } = useScroll({ target: wordsRef, offset: ["start 0.85", "start 0.3"] });
  const tileY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40]);
  const tileRotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [-6, -6] : [-9, -3]);
  const bottleY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);

  return (
    <section
      ref={ref}
      className="relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-paper-100 px-6 py-[var(--section-y)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6%] -top-[8%] select-none font-display text-[clamp(220px,34vw,520px)] font-medium leading-none tracking-[-0.07em] text-ink-950/[0.035]"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        GT
      </div>

      <div className="relative mx-auto max-w-[var(--content-max)]">
        <div className="grid items-center gap-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
          <div className="flex flex-col gap-9">
            <div className="flex items-center gap-4 text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
              <span>Sobre a marca</span>
              <span className="h-px flex-1 bg-[var(--border-strong)]" />
              <span className="font-mono">BR</span>
            </div>
            <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
              <div>Nascemos da</div>
              <div>insatisfação.</div>
            </div>
            <p
              ref={wordsRef}
              className="m-0 flex flex-wrap gap-x-[0.26em] border-l-2 border-signal-400 pl-5 font-display text-[clamp(22px,2.4vw,34px)] font-medium leading-[1.22] tracking-[-0.02em]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {MANIFESTO_WORDS.map((word, i) => (
                <RevealWord key={i} word={word} index={i} total={MANIFESTO_WORDS.length} progress={wordsProgress} />
              ))}
            </p>
            <p className="m-0 max-w-[420px] text-sm leading-relaxed text-[var(--text-muted)]">
              Somos brasileiros, apaixonados por carros e pela ciência das fragrâncias. O Purion GT finalmente está à
              altura do cuidado que você tem com o seu veículo.
            </p>
          </div>

          <div className="relative flex min-h-[460px] items-center justify-center sm:min-h-[560px]">
            <div
              aria-hidden
              className="absolute h-[280px] w-[280px] rounded-full bg-signal-400/25 blur-[70px] sm:h-[360px] sm:w-[360px]"
            />
            <motion.div
              style={{ y: tileY, rotate: tileRotate }}
              className="relative flex aspect-[380/500] w-[min(340px,78%)] items-center justify-center rounded-[var(--radius-xl)] bg-paper-0 shadow-[var(--shadow-lg)] will-change-transform sm:w-[min(380px,80%)]"
            >
              <motion.div style={{ y: bottleY }} className="will-change-transform">
                <Image
                  src="/bottle.png"
                  alt="Frasco Purion GT"
                  width={260}
                  height={430}
                  className="h-[320px] w-auto drop-shadow-[0_30px_30px_rgba(11,12,14,0.25)] sm:h-[380px]"
                />
              </motion.div>
            </motion.div>
            <div className="absolute bottom-4 left-0 flex h-[130px] w-[130px] flex-col items-center justify-center gap-0.5 rounded-full bg-ink-950 p-4 text-center text-paper-0 sm:bottom-6 sm:h-[168px] sm:w-[168px]">
              <span
                className="font-display text-3xl font-medium leading-none tracking-[-0.05em] sm:text-[44px]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                0%
              </span>
              <span className="text-[11px] text-[var(--text-inverse-muted)] sm:text-xs">resíduo no retrovisor</span>
            </div>
          </div>
        </div>

        <Reveal className="mt-14 grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-9 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <span
                className="font-display text-[clamp(28px,4vw,48px)] font-medium leading-none tracking-[-0.03em] text-ink-950"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {s.value}
              </span>
              <span className="text-xs leading-snug text-[var(--text-muted)] sm:text-sm">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
