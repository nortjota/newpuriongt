"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, reduceMotion ? 0 : 240]);

  return (
    <section
      ref={ref}
      className="relative mx-2 mt-2 w-[calc(100%-16px)] overflow-hidden rounded-[var(--radius-md)] bg-ink-900 sm:m-[10px] sm:w-[calc(100%-20px)] sm:rounded-[var(--radius-lg)]"
      style={{ aspectRatio: "1672/941", minHeight: "clamp(280px,68vw,420px)" }}
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <motion.div
          initial={reduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* No mobile a foto cortava o lado esquerdo - desloca o enquadramento
              pra direita (sem mexer na secao/bordas, só na posição da imagem). */}
          <Image
            src="/hero-banner.png"
            alt=""
            fill
            priority
            className="object-cover object-[30%_center] sm:object-center"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

      <a
        href="#comprar"
        aria-label="Conheça o Purion GT"
        className="absolute rounded-full"
        style={{ left: "5.2%", top: "56.6%", width: "16.8%", height: "7%" }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        className="hidden sm:flex absolute right-6 bottom-6 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-0 backdrop-blur-md border border-[var(--border-glass)] bg-[var(--surface-glass-dark)]"
      >
        <span className="font-mono">4.9</span>
        <span className="opacity-80">· 100+ avaliações verificadas</span>
      </motion.div>
    </section>
  );
}
