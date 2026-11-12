"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import type { GiftOffer } from "@/lib/gift/catalog";
import { GiftButton, GiftLink } from "./GiftButton";

// Card de oferta. Preço/parcela/desconto vêm do plano real; o botão de
// compra só existe quando a oferta está disponível operacionalmente.
export default function GiftCard({
  offer,
  highlighted,
  highlightLabel,
  onChoose,
}: {
  offer: GiftOffer;
  highlighted?: boolean;
  highlightLabel?: string;
  onChoose: () => void;
}) {
  const shortName = offer.name.replace("PURION ", "");
  const titleId = `oferta-${offer.id}-title`;
  const available = offer.availability.status === "available";
  const askUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Quero saber quando o ${offer.name} estará disponível para presente.`)}`;

  return (
    <article
      id={`oferta-${offer.id}`}
      tabIndex={-1}
      aria-labelledby={titleId}
      data-available={available}
      className={`relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-ink-900 outline-none transition-[border-color,box-shadow] duration-500 ${
        highlighted
          ? "border-[var(--gift-accent)]/80 shadow-[0_0_0_1px_rgba(212,252,60,.22),0_40px_80px_-40px_rgba(212,252,60,.22)]"
          : "border-white/10"
      }`}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink-800 lg:aspect-[4/4.2]">
        <Image
          src={offer.image.src}
          alt={offer.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className={`object-cover object-[50%_30%] ${available ? "" : "grayscale-[60%] opacity-60"}`}
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {highlighted && highlightLabel && (
            <span className="rounded-full bg-[var(--gift-accent)] px-3 py-1 text-[11px] font-medium text-ink-950">{highlightLabel}</span>
          )}
          {offer.savingsBadge && available && (
            <span className="rounded-full border border-white/20 bg-ink-950/60 px-3 py-1 font-mono text-[11px] text-paper-0 backdrop-blur-md">
              {offer.savingsBadge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/45">{offer.idealFor}</span>
          <h3
            id={titleId}
            className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.02] tracking-[-0.03em] text-paper-0"
            style={{ fontVariationSettings: "'wdth' 92" }}
          >
            {offer.name}
          </h3>
          <p className="m-0 text-[14px] leading-relaxed text-paper-0/60">{offer.tagline}</p>
          <p className="m-0 text-[13px] text-paper-0/45">
            {offer.units} {offer.units === 1 ? "frasco" : "frascos"} PURION GT · 60 ml cada
          </p>
        </div>

        {available ? (
          <>
            <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-5">
              <span className="font-mono text-[30px] tracking-[-0.03em] text-paper-0">{offer.price}</span>
              <span className="text-[13px] text-paper-0/55">
                ou 3× de <span className="font-mono">{offer.installment}</span> sem juros
                {offer.units > 1 && (
                  <>
                    {" "}
                    · <span className="font-mono">{offer.perUnit}</span> por frasco
                  </>
                )}
              </span>
              <span className="mt-1 flex items-center gap-2 text-[12px] text-paper-0/55">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
                Disponível · envio no mesmo dia
              </span>
            </div>
            <GiftButton
              variant={highlighted ? "accent" : "light"}
              onClick={onChoose}
              aria-label={`Presentear com ${offer.name} por ${offer.price}`}
              className="w-full"
            >
              Presentear com o {shortName}
            </GiftButton>
          </>
        ) : (
          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5">
            <p className="m-0 text-[14px] text-paper-0/70" role="status">
              Indisponível para presente no momento.
            </p>
            <GiftLink href={askUrl} target="_blank" rel="noreferrer" variant="ghost" className="w-full">
              <MessageCircle size={15} aria-hidden />
              Avisar quando disponível
            </GiftLink>
          </div>
        )}
      </div>
    </article>
  );
}
