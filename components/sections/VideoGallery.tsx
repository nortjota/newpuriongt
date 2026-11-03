"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Volume2, VolumeX } from "lucide-react";
import { VIDEOS } from "@/lib/content/videos";
import Dialog from "@/components/ui/Dialog";

export default function VideoGallery() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [muted, setMuted] = useState(true);
  const railRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  const current = openIndex >= 0 ? VIDEOS[openIndex] : null;

  useEffect(() => {
    if (current) setMuted(true);
  }, [current]);

  // Demonstra que dá pra arrastar: quando a estante entra na tela pela
  // primeira vez, desliza um pouco pra direita e volta sozinha.
  useEffect(() => {
    const el = railRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        observer.disconnect();
        const t0 = performance.now();
        const duration = 1400;
        const peek = 86;
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = k < 0.5 ? Math.sin(k * Math.PI) : Math.sin(k * Math.PI);
          el.scrollLeft = eased * peek;
          if (k < 1) requestAnimationFrame(step);
          else el.scrollLeft = 0;
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="videos" className="pl-6 pt-10 pb-10 sm:pt-14 sm:pb-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 pr-6">
        <div className="relative font-display text-[clamp(48px,11vw,80px)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-ink-950">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 top-2 h-14 w-14 rounded-full bg-signal-400/60 blur-xl sm:h-20 sm:w-20"
            style={{ animation: "pg-float-orb 5s ease-in-out infinite" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[38%] bottom-0 h-9 w-9 rounded-full bg-signal-400/45 blur-lg sm:h-12 sm:w-12"
            style={{ animation: "pg-float-orb 6.5s ease-in-out .7s infinite" }}
          />
          <div className="relative">Quem usa,</div>
          <div className="relative">mostra.</div>
        </div>
      </div>

      <div className="relative">
        <div ref={railRef} className="grid auto-cols-[min(260px,66vw)] grid-flow-col gap-3 overflow-x-auto pr-6 [scroll-snap-type:x_mandatory]">
        {VIDEOS.map((video, idx) => {
          return (
            <button
              key={video.arquivo}
              onClick={() => setOpenIndex(idx)}
              className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 text-left text-paper-0 [scroll-snap-align:start]"
            >
              <Image
                src={video.poster}
                alt={video.titulo || (video.categoria === "parceiro" ? "Vídeo de parceiro PURION GT" : "Vídeo de cliente PURION GT")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />
              <span className="absolute left-3.5 top-3.5 rounded-[var(--radius-pill)] bg-white/14 px-3 py-1.5 text-[10px] uppercase tracking-[var(--ls-caps)] backdrop-blur-md">
                {video.categoria === "parceiro" ? "Parceiros" : "Clientes"}
              </span>
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 backdrop-blur-md">
                <Play size={20} />
              </span>
              {(video.titulo || video.handle) && (
                <div className="absolute inset-x-4.5 bottom-4.5 flex flex-col gap-1.5">
                  {video.titulo && (
                    <span
                      className="font-display text-2xl font-medium leading-none tracking-[-0.03em]"
                      style={{ fontVariationSettings: "'wdth' 88" }}
                    >
                      {video.titulo}
                    </span>
                  )}
                  {video.handle && <span className="font-mono text-xs opacity-75">{video.handle}</span>}
                </div>
              )}
            </button>
          );
        })}
        </div>
      </div>

      <Dialog open={!!current} onClose={() => setOpenIndex(-1)} width={420}>
        {current && (
          <div className="relative mx-auto aspect-[9/16] max-h-[70vh] overflow-hidden rounded-[var(--radius-md)] bg-ink-900">
            <video
              key={current.arquivo}
              src={current.arquivo}
              poster={current.poster}
              muted={muted}
              autoPlay
              loop
              playsInline
              preload="none"
              onClick={() => setMuted((m) => !m)}
              className="h-full w-full cursor-pointer object-cover"
            />
            <span className="pointer-events-none absolute bottom-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/14 text-paper-0 backdrop-blur-md">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </span>
          </div>
        )}
      </Dialog>
    </section>
  );
}
