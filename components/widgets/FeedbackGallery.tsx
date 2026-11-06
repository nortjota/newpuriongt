"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FEEDBACKS } from "@/lib/content/feedbacks";
import Dialog from "@/components/ui/Dialog";

export default function FeedbackGallery() {
  const [openIndex, setOpenIndex] = useState(-1);
  const current = openIndex >= 0 ? FEEDBACKS[openIndex] : null;
  const railRef = useRef<HTMLDivElement>(null);
  const touchPausedRef = useRef(false);

  // Rola sozinho, sem duplicar as fotos (sem truque de marquee em loop) — ao
  // chegar no fim, volta pro início. Só pausa no toque (mobile), pra dar pra
  // clicar; no mouse (desktop) fica rolando sempre, sem parar no hover.
  // Fora da viewport ou com a aba em segundo plano, o requestAnimationFrame é
  // cancelado por completo (não só a mutação) — sem isso ele rodava a 60fps
  // pra sempre, mesmo com o usuário lendo o rodapé ou trocando de aba. A
  // posição (scrollLeft) fica intacta entre pausa e retomada, sem salto.
  useEffect(() => {
    const el = railRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;
    let visible = false;

    function step() {
      if (el && !touchPausedRef.current) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (raf !== null) return; // já rodando — evita loop duplicado
      raf = requestAnimationFrame(step);
    }

    function stop() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    }

    function sync() {
      if (visible && document.visibilityState === "visible") start();
      else stop();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div>
      <span className="mb-3 block text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
        Clientes
      </span>
      <div
        ref={railRef}
        onTouchStart={() => (touchPausedRef.current = true)}
        onTouchEnd={() => {
          setTimeout(() => (touchPausedRef.current = false), 2500);
        }}
        className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FEEDBACKS.map((fb, i) => (
          <button
            key={fb.src}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[3/4] w-[76px] flex-none overflow-hidden rounded-[var(--radius-sm)] bg-paper-100 transition-transform hover:-translate-y-0.5"
          >
            <Image src={fb.src} alt={fb.alt} fill className="object-cover" sizes="76px" />
          </button>
        ))}
      </div>

      <Dialog open={!!current} onClose={() => setOpenIndex(-1)} width={480}>
        {current && (
          <div className="relative mx-auto aspect-[3/4] max-h-[76vh] overflow-hidden rounded-[var(--radius-md)] bg-paper-100">
            <Image src={current.src} alt={current.alt} fill className="object-contain" sizes="480px" />
          </div>
        )}
      </Dialog>
    </div>
  );
}
