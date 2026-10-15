"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 px-6 py-24 text-center text-paper-0 sm:py-36">
      <motion.div className="absolute -inset-y-[15%] inset-x-0 opacity-42 will-change-transform" style={{ y }}>
        <Image src="/hero-street.png" alt="" fill className="object-cover" style={{ objectPosition: "center 70%" }} />
      </motion.div>
      <div className="relative flex flex-col items-center gap-7">
        <Image src="/logo-mark.png" alt="" width={28} height={28} className="h-7 w-auto" />
        <div
          className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)]"
          style={{ fontVariationSettings: "'wdth' 88" }}
        >
          <div className="text-white/62">Seu carro nunca mais</div>
          <div>vai cheirar ao mesmo.</div>
        </div>
        <p className="m-0 max-w-[440px] text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
          Junte-se a mais de 100 motoristas que elevaram o padrão.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#comprar" className="rounded-[var(--radius-pill)] bg-signal-400 px-6 py-4 text-sm font-medium text-ink-950">
            Quero o meu Purion GT
          </a>
          <a
            href="#quiz"
            className="rounded-[var(--radius-pill)] border border-[var(--border-glass)] bg-white/14 px-6 py-4 text-sm font-medium text-paper-0 backdrop-blur-md"
          >
            Descobrir meu perfil
          </a>
        </div>
      </div>
    </section>
  );
}
