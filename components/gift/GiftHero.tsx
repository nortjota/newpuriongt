import { getImageProps } from "next/image";
import { PRODUCT_DESCRIPTION } from "@/lib/content/gifts";
import { GiftLink } from "./GiftButton";
import { CHOOSER_ID, EXPERIENCE_ID } from "./ids";

// Hero mobile-first: texto e CTAs primeiro; a fotografia oficial (frasco real
// numa estrada molhada à noite) vem contida, sem tomar a dobra inteira.
// Desktop: duas colunas. A imagem é o LCP → fetchPriority alta, sem lazy.
export default function GiftHero() {
  const alt = `Frasco PURION GT sobre o capô de um carro numa estrada molhada à noite. ${PRODUCT_DESCRIPTION}`;
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    alt,
    src: "/images/cenas/cena-estrada-noite-mobile.webp",
    width: 1122,
    height: 1402,
    sizes: "(min-width: 1024px) 44vw, 100vw",
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    alt,
    src: "/images/cenas/cena-estrada-noite.webp",
    width: 1672,
    height: 941,
    sizes: "100vw",
    fetchPriority: "high",
    loading: "eager",
  });

  return (
    <section aria-labelledby="gift-hero-title" className="relative isolate overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.07] blur-[110px]"
        style={{ background: "var(--gift-accent)" }}
      />
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-10 px-6 pb-14 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pb-24">
        <div className="flex flex-col gap-6 motion-safe:animate-[pg-fade-up_.9s_var(--ease-out)_both]">
          <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/60">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
            PURION GIFT · uma experiência PURION GT
          </span>
          <h1
            id="gift-hero-title"
            className="m-0 text-balance font-display text-[clamp(40px,6.6vw,92px)] font-medium leading-[0.94] tracking-[-0.045em] text-paper-0"
            style={{ fontVariationSettings: "'wdth' 86" }}
          >
            Para quem ama carros, um presente à altura.
          </h1>
          <p className="m-0 max-w-[46ch] text-[17px] leading-relaxed text-paper-0/70 sm:text-[19px]">
            Transforme cada trajeto em uma experiência especial. Presenteie com PURION GT.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <GiftLink href={`#${CHOOSER_ID}`} variant="accent">
              Escolher meu presente
            </GiftLink>
            <GiftLink href={`#${EXPERIENCE_ID}`} variant="ghost">
              Conhecer a experiência
            </GiftLink>
          </div>
        </div>

        <figure className="relative m-0 overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 aspect-[16/10] lg:aspect-[4/5] lg:max-h-[78vh]">
          <picture>
            <source media="(min-width: 1024px)" srcSet={desktop} sizes="44vw" />
            <source srcSet={mobile} sizes="100vw" />
            <img {...rest} alt={alt} className="absolute inset-0 h-full w-full object-cover object-[50%_45%]" />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,12,14,.55))]" />
          <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/75">
            <span>PURION GT · 60 ml</span>
            <span className="font-mono normal-case tracking-normal">Auto parfum</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
