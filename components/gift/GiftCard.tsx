"use client";

import Image from "next/image";
import type { Gift } from "@/lib/content/gifts";
import { GiftButton } from "./GiftButton";

// Card de presente reutilizável. Preço, parcela e desconto vêm do plano real
// (lib/content/plans.ts) — ver lib/content/gifts.ts.
export default function GiftCard({
  gift,
  highlighted,
  highlightLabel,
  onChoose,
}: {
  gift: Gift;
  highlighted?: boolean;
  highlightLabel?: string;
  onChoose: () => void;
}) {
  const shortName = gift.name.replace("PURION GIFT ", "");
  const titleId = `gift-${gift.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-[border-color,box-shadow] duration-500 ${
        highlighted
          ? "border-signal-400/80 bg-ink-900 shadow-[0_0_0_1px_rgba(214,255,61,.25),0_40px_80px_-40px_rgba(214,255,61,.25)]"
          : "border-white/10 bg-ink-900"
      }`}
    >
      <div className="relative aspect-[16/12] w-full overflow-hidden bg-ink-800 lg:aspect-[4/4.4]">
        <Image
          src={gift.image.src}
          alt={gift.image.alt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover object-[50%_30%]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {highlighted && highlightLabel && (
            <span className="rounded-full bg-signal-400 px-3 py-1 text-[11px] font-medium text-ink-950">{highlightLabel}</span>
          )}
          {gift.savingsBadge && (
            <span className="rounded-full border border-white/20 bg-ink-950/60 px-3 py-1 font-mono text-[11px] text-paper-0 backdrop-blur-md">
              {gift.savingsBadge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/45">{gift.idealFor}</span>
          <h3
            id={titleId}
            className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.02] tracking-[-0.03em] text-paper-0"
            style={{ fontVariationSettings: "'wdth' 92" }}
          >
            {gift.name}
          </h3>
          <p className="m-0 text-[14px] leading-relaxed text-paper-0/60">{gift.tagline}</p>
          <p className="m-0 text-[13px] text-paper-0/45">
            {gift.units} {gift.units === 1 ? "frasco" : "frascos"} PURION GT · 60 ml cada
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-5">
          <span className="font-mono text-[30px] tracking-[-0.03em] text-paper-0">{gift.price}</span>
          <span className="text-[13px] text-paper-0/55">
            ou 3× de <span className="font-mono">{gift.installment}</span> sem juros
            {gift.units > 1 && (
              <>
                {" "}
                · <span className="font-mono">{gift.perUnit}</span> por frasco
              </>
            )}
          </span>
        </div>

        {gift.available ? (
          <GiftButton
            variant={highlighted ? "accent" : "light"}
            onClick={onChoose}
            aria-label={`Presentear com ${gift.name} por ${gift.price}`}
            className="w-full"
          >
            Presentear com o {shortName}
          </GiftButton>
        ) : (
          <p className="m-0 rounded-[var(--radius-pill)] border border-white/15 py-3.5 text-center text-sm text-paper-0/60">
            Indisponível no momento
          </p>
        )}
      </div>
    </article>
  );
}
