"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Hand, Play, Video } from "lucide-react";
import { VIDEOS_SEED, VIDEO_TABS } from "@/lib/content/videos.seed";
import Dialog from "@/components/ui/Dialog";

// Toda fonte de video esta vazia de proposito - nenhum video real foi
// fornecido ainda. O modal sempre mostra o placeholder "Espaco para o
// video", igual ao protótipo. Ver PLACEHOLDERS.md.
export default function VideoGallery() {
  const [tab, setTab] = useState<(typeof VIDEO_TABS)[number]>("Todos");
  const [openIndex, setOpenIndex] = useState(-1);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const railRef = useRef<HTMLDivElement>(null);

  const visible = VIDEOS_SEED.filter((v) => tab === "Todos" || v.tab === tab);
  const current = openIndex >= 0 ? VIDEOS_SEED[openIndex] : null;

  function scrollRail(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * 312, behavior: "smooth" });
  }

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const hide = () => setShowSwipeHint(false);
    el.addEventListener("scroll", hide, { once: true, passive: true });
    const t = setTimeout(hide, 4500);
    return () => {
      el.removeEventListener("scroll", hide);
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="videos" className="pl-6 pt-[var(--section-y)]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 pr-6">
        <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
          <div>Quem usa,</div>
          <div>mostra.</div>
        </div>
        <div className="flex flex-col items-end gap-4.5">
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
          <div className="flex gap-2">
            <button
              aria-label="Anterior"
              onClick={() => scrollRail(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)]"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              aria-label="Próximo"
              onClick={() => scrollRail(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)]"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {showSwipeHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center lg:hidden">
            <span className="flex animate-[swipe-hint_1.6s_ease-in-out_infinite] items-center gap-2 rounded-[var(--radius-pill)] bg-ink-950/85 px-4 py-2 text-xs text-paper-0 backdrop-blur-md">
              <Hand size={14} />
              Arraste para o lado
            </span>
          </div>
        )}
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
