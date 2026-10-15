"use client";

import Image from "next/image";
import { Calendar, Flower2, Gauge, Layers, Leaf, Moon, Snowflake, Sun, SunMedium } from "lucide-react";
import { ACCORDS, FRAGRANCE_LAYERS, NOTE_COLORS, PERFORMANCE, SEASONS } from "@/lib/content/fragrance";
import RevealBar from "@/components/ui/RevealBar";
import { usePurion } from "@/lib/store/PurionProvider";

const SEASON_ICONS: Record<string, typeof Snowflake> = {
  snowflake: Snowflake,
  "flower-2": Flower2,
  sun: Sun,
  leaf: Leaf,
  "sun-medium": SunMedium,
  moon: Moon,
};

function SeasonIcon({ name }: { name: string }) {
  const Icon = SEASON_ICONS[name] ?? Sun;
  return <Icon size={20} />;
}

export default function FragrancePyramid() {
  const { state, setPyramidLevel } = usePurion();
  const level = state.pyramidLevel;
  const isAll = level === 0;
  const active = isAll ? null : FRAGRANCE_LAYERS[level - 1];
  const glow = isAll
    ? `linear-gradient(90deg,${FRAGRANCE_LAYERS.map((l) => l.glow).join(",")})`
    : active!.glow;

  return (
    <section
      id="fragrancia"
      className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 py-[var(--section-y)] text-paper-0"
    >
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <div className="flex flex-col gap-6">
          <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            Pirâmide olfativa
          </span>
          <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
            <div>Construído</div>
            <div>em três tempos.</div>
          </div>
          <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
            Inspirada nas grandes casas de perfumaria. Toque em cada camada do frasco ou veja a pirâmide completa.
          </p>
        </div>

        <div className="relative flex h-[540px] justify-center">
          <div className="relative aspect-[300/540] h-full overflow-hidden rounded-[var(--radius-xl)] bg-ink-800">
            <div className="absolute inset-0 z-[1] flex flex-col">
              {FRAGRANCE_LAYERS.map((layer, i) => {
                const on = isAll || level === i + 1;
                return (
                  <button
                    key={layer.key}
                    onClick={() => setPyramidLevel(level === i + 1 ? 0 : ((i + 1) as 1 | 2 | 3))}
                    className="flex flex-1 items-start justify-between border-t border-[var(--border-inverse)] px-4 py-3.5 text-left font-mono text-[11px] uppercase tracking-[.08em] transition-colors"
                    style={{ background: on ? layer.band : "transparent" }}
                  >
                    <span>{layer.key}</span>
                    <span style={{ opacity: on ? 1 : 0.4 }}>0{i + 1}</span>
                  </button>
                );
              })}
            </div>
            <div
              className="absolute inset-x-[12%] bottom-[9%] z-[2] h-[16%] rounded-full opacity-95 blur-[26px] transition-[background] duration-700"
              style={{ background: glow }}
            />
            <Image
              src="/bottle.png"
              alt="Frasco Purion GT"
              width={200}
              height={360}
              className="absolute left-1/2 top-1/2 z-[3] h-[86%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_30px_24px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6.5">
          <div className="flex gap-1 rounded-[var(--radius-pill)] bg-white/10 p-1 text-sm">
            <button
              onClick={() => setPyramidLevel(0)}
              className={`rounded-[var(--radius-pill)] px-4 py-1.5 ${isAll ? "bg-paper-0 text-ink-950" : "text-[var(--text-inverse-muted)]"}`}
            >
              Completo
            </button>
            {FRAGRANCE_LAYERS.map((layer, i) => (
              <button
                key={layer.key}
                onClick={() => setPyramidLevel((i + 1) as 1 | 2 | 3)}
                className={`rounded-[var(--radius-pill)] px-4 py-1.5 ${
                  level === i + 1 ? "bg-paper-0 text-ink-950" : "text-[var(--text-inverse-muted)]"
                }`}
              >
                {layer.key}
              </button>
            ))}
          </div>
          <p className="m-0 min-h-[50px] text-[17px] leading-snug text-[var(--text-inverse-muted)]">
            {isAll ? "A pirâmide inteira: da abertura frutada ao fundo de couro e âmbar." : active!.text}
          </p>
          {isAll ? (
            <div className="flex flex-col gap-5">
              {FRAGRANCE_LAYERS.map((layer, i) => (
                <div key={layer.key} className="flex flex-col gap-2.5 border-b border-[var(--border-inverse)] pb-4.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-2xl font-medium tracking-[-0.03em]"
                      style={{ fontVariationSettings: "'wdth' 88" }}
                    >
                      {layer.key}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-inverse-muted)]">
                      0{i + 1} · {layer.notes.length} notas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.notes.map((note) => (
                      <span
                        key={note}
                        className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-inverse)] bg-white/6 py-1.5 pl-2 pr-3.5 text-sm"
                      >
                        <span className="h-3 w-3 rounded-full" style={{ background: NOTE_COLORS[note] }} />
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {active!.notes.map((note, i) => (
                <div key={note} className="flex items-baseline justify-between border-b border-[var(--border-inverse)] py-3">
                  <span className="flex items-center gap-3.5">
                    <span
                      className="h-3.5 w-3.5 flex-none rounded-full"
                      style={{ background: NOTE_COLORS[note], boxShadow: "0 0 0 4px rgba(255,255,255,.06)" }}
                    />
                    <span
                      className="font-display text-[clamp(28px,3vw,40px)] font-medium leading-none tracking-[-0.04em]"
                      style={{ fontVariationSettings: "'wdth' 88" }}
                    >
                      {note}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-[var(--text-inverse-muted)]">0{i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[var(--content-max)] gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <div className="flex flex-col gap-5.5 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-7">
          <div className="flex items-center gap-3 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <Layers size={14} />
            <span>Acordes principais</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          </div>
          <div className="flex flex-col gap-1">
            {ACCORDS.map((a) => (
              <div key={a.key} className="flex h-[34px]">
                <RevealBar
                  targetWidth={`${a.pct}%`}
                  className="flex items-center justify-center overflow-hidden whitespace-nowrap rounded-r-xl text-sm font-medium"
                  style={{ background: a.color, color: a.dark ? "var(--ink-950)" : "var(--paper-0)" }}
                >
                  {a.key}
                </RevealBar>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5.5 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-7">
          <div className="flex items-center gap-3 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <Calendar size={14} />
            <span>Quando usar</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          </div>
          <div className="grid grid-cols-3 gap-5 gap-x-4">
            {SEASONS.map((s) => (
              <div key={s.key} className="flex flex-col items-center gap-2.5 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/6" style={{ color: s.color }}>
                  <SeasonIcon name={s.icon} />
                </span>
                <span className="text-[13px]">{s.key}</span>
                <span className="block h-[5px] w-full overflow-hidden rounded-full bg-white/10">
                  <RevealBar targetWidth={`${s.pct}%`} className="block h-full rounded-full" style={{ background: s.color }} />
                </span>
                <span className="font-mono text-[11px] text-[var(--text-inverse-muted)]">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5.5 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-7">
          <div className="flex items-center gap-3 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <Gauge size={14} />
            <span>Performance</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          </div>
          <div className="flex flex-col gap-4.5">
            {PERFORMANCE.map((p) => (
              <div key={p.key} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm">{p.key}</span>
                  <span className="font-mono text-xs text-[var(--text-inverse-muted)]">{p.label}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-2 flex-1 rounded"
                      style={{ background: i < p.segments ? "var(--signal-400)" : "rgba(255,255,255,.1)" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-[var(--border-inverse)] pt-4.5">
            <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">Família</span>
            <span className="font-display text-[26px] font-medium tracking-[-0.03em]" style={{ fontVariationSettings: "'wdth' 88" }}>
              Amadeirado frutado
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
