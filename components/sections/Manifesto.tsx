"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

function RevealWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const color = useTransform(progress, (p) => ((index + 1) / total <= p ? "var(--ink-950)" : "var(--steel-300)"));
  return <motion.span style={{ color }}>{word}</motion.span>;
}

const MANIFESTO_WORDS =
  "Você gasta horas cuidando do seu carro. Polimento, detalhamento, acessórios premium. E o cheiro? Aceita qualquer coisa pendurada no retrovisor. A Purion GT nasceu para acabar com essa contradição.".split(
    " "
  );

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Reproduz a formula original: progresso vai de 0 (secao a 80% da tela) a 1
  // (secao subiu 70% da sua altura) - cada palavra acende quando o progresso
  // passa da sua posicao na frase.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.1"] });
  const tileY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40]);
  const tileRotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [-6, -6] : [-9, -3]);
  const bottleY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);

  return (
    <section ref={ref} className="mx-auto grid max-w-[var(--content-max)] items-center gap-12 px-6 py-[var(--section-y)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
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
          className="m-0 flex flex-wrap gap-x-[0.26em] font-display text-[clamp(22px,2.2vw,32px)] font-medium leading-[1.22] tracking-[-0.02em]"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {MANIFESTO_WORDS.map((word, i) => (
            <RevealWord key={i} word={word} index={i} total={MANIFESTO_WORDS.length} progress={scrollYProgress} />
          ))}
        </p>
        <p className="m-0 max-w-[440px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Somos brasileiros, apaixonados por carros e pela ciência das fragrâncias. O Purion GT finalmente está à
          altura do cuidado que você tem com o seu veículo.
        </p>
      </div>

      <div className="relative flex min-h-[560px] items-center justify-center">
        <motion.div
          style={{ y: tileY, rotate: tileRotate }}
          className="flex aspect-[380/500] w-[min(380px,80%)] items-center justify-center rounded-[var(--radius-xl)] bg-paper-0 shadow-[var(--shadow-lg)] will-change-transform"
        >
          <motion.div style={{ y: bottleY }} className="will-change-transform">
            <Image
              src="/bottle.png"
              alt="Frasco Purion GT"
              width={260}
              height={430}
              className="h-[380px] w-auto drop-shadow-[0_30px_30px_rgba(11,12,14,0.25)]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute bottom-6 left-0 flex h-[168px] w-[168px] flex-col items-center justify-center gap-0.5 rounded-full bg-paper-0 p-5 text-center">
          <span
            className="font-display text-[44px] font-medium leading-none tracking-[-0.05em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            0%
          </span>
          <span className="text-xs text-[var(--text-secondary)]">resíduo no retrovisor</span>
        </div>
      </div>
    </section>
  );
}
