import Image from "next/image";
import { GiftLink } from "./GiftButton";
import { CHOOSER_ID } from "./GiftContext";

// 9. CTA final.
export default function GiftFinalCta() {
  return (
    <section aria-labelledby="gift-final-title" className="relative isolate overflow-hidden px-6 py-28 text-center sm:py-40">
      <Image
        src="/images/produto/produto-frente.webp"
        alt=""
        fill
        loading="lazy"
        sizes="100vw"
        className="-z-10 object-cover object-[50%_60%] opacity-45"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #0B0C0E 0%, rgba(11,12,14,.55) 45%, #0B0C0E 100%)" }}
      />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8">
        <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/60">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal-400" />
          PURION GIFT
        </span>
        <h2
          id="gift-final-title"
          className="m-0 text-balance font-display text-[clamp(40px,7vw,96px)] font-medium leading-[0.95] tracking-[-0.04em] text-paper-0"
          style={{ fontVariationSettings: "'wdth' 86" }}
        >
          Surpreenda quem é apaixonado por carros.
        </h2>
        <GiftLink href={`#${CHOOSER_ID}`} variant="accent">
          Escolher presente
        </GiftLink>
      </div>
    </section>
  );
}
