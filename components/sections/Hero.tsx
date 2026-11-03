"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const SLIDE_INTERVAL_MS = 6000;

// Os 2 banners do carrossel já têm o texto embutido na própria imagem — por
// isso não há headline/CTA sobreposto aqui, só o badge de avaliação (chrome
// de UI, não copy de marketing) e os indicadores de slide.
const SLIDES = [
  {
    desktop: "/images/slideshow/slideshow-1.webp",
    mobile: "/images/slideshow/slideshow-1-mobile.webp",
    alt: 'Homem segura o frasco Purion GT cercado de frutas e flores, carro branco ao fundo — "Seu carro também tem assinatura."',
  },
  {
    desktop: "/images/slideshow/slideshow-2.webp",
    mobile: "/images/slideshow/slideshow-2-mobile.webp",
    alt: 'Frasco Purion GT sobre o console de um carro premium — "O perfume automotivo premium do Brasil."',
  },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Os banners mobile são quadrados (1:1) — numa seção alta tipo "min-h-80svh"
  // o object-cover cortava boa parte da imagem (e do texto embutido nela).
  // Em telas <768px a seção vira aspect-square (mostra a imagem inteira) e o
  // parallax de scroll fica desligado, já que não sobra margem de corte.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const y = useTransform(scrollY, [0, 1200], [0, reduceMotion || isMobile ? 0 : 240]);

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
      className="relative w-full overflow-hidden bg-ink-900 aspect-square md:aspect-auto md:min-h-[90svh]"
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {SLIDES.map((s, i) => (
          <motion.div
            key={s.desktop}
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
              <picture>
                <source media="(max-width: 767px)" srcSet={s.mobile} />
                <img
                  src={s.desktop}
                  alt={s.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        className="hidden sm:flex absolute right-6 bottom-6 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-0 backdrop-blur-md border border-[var(--border-glass)] bg-[var(--surface-glass-dark)]"
      >
        <span className="font-mono">4.9</span>
        <span className="opacity-80">· 450+ avaliações verificadas</span>
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
