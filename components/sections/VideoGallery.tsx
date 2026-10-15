import Image from "next/image";
import { ArrowLeft, ArrowRight, Play, Video } from "lucide-react";
import { VIDEOS_SEED, VIDEO_TABS } from "@/lib/content/videos.seed";

// Estático (Marco 1): a estante com arraste/filtro/modal e os controles prev/next
// ganham interatividade no Marco 7. Todo vídeo usa o placeholder "Espaço para o
// vídeo" porque nenhuma fonte real foi fornecida ainda — ver PLACEHOLDERS.md.
export default function VideoGallery() {
  return (
    <section id="videos" className="pl-6 pt-[var(--section-y)]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 pr-6">
        <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
          <div>Quem usa,</div>
          <div>mostra.</div>
        </div>
        <div className="flex flex-col items-end gap-4.5">
          <div className="flex gap-1 rounded-[var(--radius-pill)] bg-paper-200 p-1 text-sm">
            {VIDEO_TABS.map((tab) => (
              <span
                key={tab}
                className={`rounded-[var(--radius-pill)] px-4 py-2 ${
                  tab === "Todos" ? "bg-ink-950 text-paper-0" : "text-ink-600"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)]">
              <ArrowLeft size={16} />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)]">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="grid auto-cols-[min(300px,72vw)] grid-flow-col gap-3 overflow-x-auto pr-6">
        {VIDEOS_SEED.map((video) => (
          <div
            key={video.title}
            className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 text-paper-0"
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
          </div>
        ))}
        <div className="flex aspect-[9/16] flex-col items-center justify-center gap-2.5 rounded-[var(--radius-lg)] bg-ink-900 text-paper-0">
          <Video size={28} />
          <span className="text-sm">Espaço para o vídeo</span>
          <span className="font-mono text-[11px] opacity-60">MP4 vertical · 9:16</span>
        </div>
      </div>
    </section>
  );
}
