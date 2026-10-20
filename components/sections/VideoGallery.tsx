"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Video } from "lucide-react";
import { VIDEOS_SEED, VIDEO_TABS } from "@/lib/content/videos.seed";
import Dialog from "@/components/ui/Dialog";

// Toda fonte de video esta vazia de proposito - nenhum video real foi
// fornecido ainda. O modal sempre mostra o placeholder "Espaco para o
// video", igual ao protótipo. Ver PLACEHOLDERS.md.
export default function VideoGallery() {
  const [tab, setTab] = useState<(typeof VIDEO_TABS)[number]>("Todos");
  const [openIndex, setOpenIndex] = useState(-1);
  const railRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  const visible = VIDEOS_SEED.filter((v) => tab === "Todos" || v.tab === tab);
  const current = openIndex >= 0 ? VIDEOS_SEED[openIndex] : null;

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
          // vai até a metade e volta (0 -> peek -> 0), com easing suave
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
    <section id="videos" className="pl-6 pt-[var(--section-y)] pb-[var(--section-y)]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 pr-6">
        <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
          <div>Quem usa,</div>
          <div>mostra.</div>
        </div>
        <div className="flex gap-1 rounded-[var(--radius-pill)] bg-paper-200 p-1 text-sm">
          {VIDEO_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-[var(--radius-pill)] px-4 py-2 transition-colors ${
                tab === t ? "bg-ink-950 text-paper-0" : "text-ink-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={railRef} className="grid auto-cols-[min(300px,72vw)] grid-flow-col gap-3 overflow-x-auto pr-6 [scroll-snap-type:x_mandatory]">
        {visible.map((video) => {
          const idx = VIDEOS_SEED.indexOf(video);
          return (
            <button
              key={video.title}
              onClick={() => setOpenIndex(idx)}
              className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 text-left text-paper-0 [scroll-snap-align:start]"
            >
              <Image src={video.img} alt="" fill className="object-cover" style={{ objectPosition: video.pos }} />
              <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />
              <span className="absolute left-3.5 top-3.5 rounded-[var(--radius-pill)] bg-white/14 px-3 py-1.5 text-[10px] uppercase tracking-[var(--ls-caps)] backdrop-blur-md">
                {video.tab}
              </span>
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 backdrop-blur-md">
                <Play size={20} />
              </span>
              <div className="absolute inset-x-4.5 bottom-4.5 flex flex-col gap-1.5">
                <span
                  className="font-display text-2xl font-medium leading-none tracking-[-0.03em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {video.title}
                </span>
                <span className="font-mono text-xs opacity-75">{video.handle}</span>
              </div>
            </button>
          );
        })}
        </div>
      </div>

      <Dialog open={!!current} onClose={() => setOpenIndex(-1)} width={420}>
        <div className="relative mx-auto flex max-h-[70vh] aspect-[9/16] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[var(--radius-md)] bg-ink-900 text-center text-paper-0">
          <Video size={28} />
          <span className="text-sm">Espaço para o vídeo</span>
          <span className="font-mono text-[11px] opacity-60">MP4 vertical · 9:16</span>
        </div>
      </Dialog>
    </section>
  );
}
