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
    <section ref={ref} className="relative w-full overflow-hidden bg-ink-900 px-6 py-24 text-center text-paper-0 sm:py-36">
      <motion.div className="absolute -inset-y-[15%] inset-x-0 will-change-transform" style={{ y }}>
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/cenas/cena-estrada-noite-mobile.webp" />
          <img
            src="/images/cenas/cena-estrada-noite.webp"
            alt="Frasco PURION GT em estrada à noite"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,12,.35), rgba(10,10,12,.78))" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] w-[55vw] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-400/18 blur-[90px]"
      />
      <div className="relative flex flex-col items-center gap-10">
        <Image src="/logo-white.png" alt="Purion GT" width={260} height={64} className="h-12 w-auto sm:h-16" />
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#comprar" className="rounded-[var(--radius-pill)] bg-signal-400 px-7 py-4 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5">
            Quero o meu Purion GT
          </a>
          <a
            href="#quiz"
            className="rounded-[var(--radius-pill)] border border-[var(--border-glass)] bg-white/14 px-7 py-4 text-sm font-medium text-paper-0 backdrop-blur-md transition-transform hover:-translate-y-0.5"
          >
            Descobrir meu perfil
          </a>
        </div>
      </div>
    </section>
  );
}
