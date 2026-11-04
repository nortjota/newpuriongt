"use client";

import Image from "next/image";
import { Briefcase, Calendar, Clock, Cloud, Gauge, Heart, Layers, MapPin, SunMedium } from "lucide-react";
import { ACCORDS, FRAGRANCE_FAMILY, FRAGRANCE_LAYERS, NOTE_COLORS, OCCASIONS, PERFORMANCE } from "@/lib/content/fragrance";
import RevealBar from "@/components/ui/RevealBar";
import { usePurion } from "@/lib/store/PurionProvider";
import { useCheckoutUrl } from "@/lib/content/checkout";

const OCCASION_ICONS: Record<string, typeof SunMedium> = {
  "sun-medium": SunMedium,
  briefcase: Briefcase,
  "map-pin": MapPin,
  heart: Heart,
  cloud: Cloud,
  clock: Clock,
};

function OccasionIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = OCCASION_ICONS[name] ?? SunMedium;
  return <Icon size={size} />;
}

export default function FragrancePyramid() {
  const { state, setPyramidLevel } = usePurion();
  const checkoutUrl = useCheckoutUrl();
  const level = state.pyramidLevel;
  const isAll = level === 0;
  const active = isAll ? null : FRAGRANCE_LAYERS[level - 1];
  const glow = isAll
    ? `linear-gradient(90deg,${FRAGRANCE_LAYERS.map((l) => l.glow).join(",")})`
    : active!.glow;

  return (
    <section
      id="fragrancia"
      className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 py-14 text-paper-0 sm:py-20"
    >
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-base font-semibold uppercase text-paper-0 tracking-[var(--ls-caps)] sm:text-[11px] sm:font-normal sm:text-[var(--text-inverse-muted)]">
            Pirâmide olfativa
          </span>
          <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-ink-950">
            <div>Construído</div>
            <div>em três tempos.</div>
          </div>
          <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
            Inspirada nas grandes casas de perfumaria. Toque em cada camada do frasco ou veja a pirâmide completa.
          </p>
        </div>

        <div className="relative flex h-[340px] justify-center sm:h-[420px]">
          <div className="relative aspect-[300/540] h-full overflow-hidden rounded-[var(--radius-xl)] bg-ink-800">
            <div className="absolute inset-0 z-[1] flex flex-col">
              {FRAGRANCE_LAYERS.map((layer, i) => {
                const on = isAll || level === i + 1;
                return (
                  <button
                    key={layer.key}
                    onClick={() => setPyramidLevel(level === i + 1 ? 0 : ((i + 1) as 1 | 2 | 3))}
                    className="flex flex-1 items-start justify-between border-t border-[var(--border-inverse)] px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-[.08em] transition-colors"
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
              className="absolute left-1/2 top-1/2 z-[3] h-[84%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_30px_24px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
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
            {isAll ? "A pirâmide inteira: da abertura frutada ao fundo de couro e ambergris." : active!.text}
          </p>
          {isAll ? (
            <div className="flex flex-col gap-5">
              {FRAGRANCE_LAYERS.map((layer, i) => (
                <div key={layer.key} className="flex flex-col gap-2.5 border-b border-[var(--border-inverse)] pb-4.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-lg font-medium tracking-[-0.03em]"
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
                        className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-inverse)] bg-white/6 py-1 pl-1.5 pr-3 text-xs"
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: NOTE_COLORS[note] }} />
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900">
                <Image src={active!.image.src} alt={active!.image.alt} fill className="object-cover" sizes="160px" />
              </div>
              {active!.notes.map((note, i) => (
                <div key={note} className="flex items-baseline justify-between border-b border-[var(--border-inverse)] py-2.5">
                  <span className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 flex-none rounded-full"
                      style={{ background: NOTE_COLORS[note], boxShadow: "0 0 0 4px rgba(255,255,255,.06)" }}
                    />
                    <span
                      className="font-display text-[clamp(18px,2vw,24px)] font-medium leading-none tracking-[-0.03em]"
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

      <div className="mx-auto mt-8 flex max-w-[var(--content-max)] flex-col gap-2 sm:gap-3">
        <div className="flex flex-col gap-2 sm:gap-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-4 sm:gap-4 sm:p-6">
          <div className="flex items-center gap-3 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <Layers size={14} />
            <span>Acordes principais</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          </div>
          <div className="flex flex-col gap-1">
            {ACCORDS.map((a) => (
              <div key={a.key} className="flex h-[22px] sm:h-[26px]">
                <RevealBar
                  targetWidth={`${a.pct}%`}
                  className="flex items-center justify-center overflow-hidden whitespace-nowrap rounded-r-lg text-[10px] font-medium sm:text-xs"
                  style={{ background: a.color, color: a.dark ? "var(--ink-950)" : "var(--paper-0)", minWidth: 58 }}
                >
                  {a.key}
                </RevealBar>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-4 sm:gap-4 sm:p-6">
          <div className="flex items-center gap-3 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <Gauge size={14} />
            <span>Performance</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-3.5">
            {PERFORMANCE.map((p) => (
              <div key={p.key} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm">{p.key}</span>
                  <span className="font-mono text-[10px] text-[var(--text-inverse-muted)] sm:text-xs">{p.label}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 flex-1 rounded sm:h-2"
                      style={{ background: i < p.segments ? "var(--signal-400)" : "rgba(255,255,255,.1)" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-[var(--border-inverse)] pt-3">
            <span className="text-[10px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">Família</span>
            <span className="font-display text-base font-medium tracking-[-0.03em] sm:text-xl" style={{ fontVariationSettings: "'wdth' 88" }}>
              {FRAGRANCE_FAMILY}
            </span>
          </div>
        </div>
        </div>

        <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--border-inverse)] bg-ink-900 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)] sm:flex-none">
            <Calendar size={13} />
            <span className="whitespace-nowrap">Quando usar</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {OCCASIONS.map((o) => (
              <span
                key={o.key}
                className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-inverse)] bg-white/6 py-0.5 pl-0.5 pr-2.5 text-[11px]"
              >
                <span className="flex h-4.5 w-4.5 flex-none items-center justify-center rounded-full bg-signal-400/15 text-signal-400">
                  <OccasionIcon name={o.icon} size={11} />
                </span>
                {o.key}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[var(--text-inverse-muted)] sm:ml-auto">
            Pode usar sempre, em qualquer ocasião.
          </span>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-[var(--content-max)] justify-center">
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-[var(--radius-pill)] bg-signal-400 px-7 py-3.5 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          Comprar agora
        </a>
      </div>
    </section>
  );
}
