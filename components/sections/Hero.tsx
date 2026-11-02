"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const SLIDE_INTERVAL_MS = 6000;

// Segunda opção de banner pedida pelo usuário — reaproveita um asset real já
// aprovado (hero-street.png, já usado em outras seções) em vez de inventar
// uma imagem nova. Trocar por um banner dedicado quando houver um.
const SLIDES = [
  { src: "/hero-banner.png", position: "object-[62%_32%] lg:object-center" },
  { src: "/hero-street.png", position: "object-[center_55%]" },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, reduceMotion ? 0 : 240]);

  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(i: number) {
    setSlide(i);
    startTimer();
  }

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-ink-900 min-h-[80svh] lg:min-h-[90svh]"
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {SLIDES.map((s, i) => (
          <motion.div
            key={s.src}
            className="absolute inset-0"
            initial={false}
            animate={{ x: `${(i - slide) * 100}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={reduceMotion || i !== 0 ? false : { scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={s.src}
                alt=""
                fill
                priority={i === 0}
                className={`object-cover ${s.position}`}
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

      {slide === 0 && (
        <a
          href="#comprar"
          aria-label="Conheça o Purion GT"
          className="absolute rounded-full"
          style={{ left: "5.2%", top: "56.6%", width: "16.8%", height: "7%" }}
        />
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        className="hidden sm:flex absolute right-6 bottom-6 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-0 backdrop-blur-md border border-[var(--border-glass)] bg-[var(--surface-glass-dark)]"
      >
        <span className="font-mono">4.9</span>
        <span className="opacity-80">· 100+ avaliações verificadas</span>
      </motion.div>

      {SLIDES.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Banner ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === slide ? 24 : 8, background: i === slide ? "var(--signal-400)" : "rgba(255,255,255,.4)" }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
