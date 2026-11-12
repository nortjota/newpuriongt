import { getImageProps } from "next/image";
import { ChevronDown } from "lucide-react";
import { GiftLink } from "./GiftButton";
import { CHOOSER_ID } from "./GiftContext";

// Hero acima da dobra: imagem editorial oficial (frasco real numa estrada
// molhada à noite) com direção de arte mobile/desktop, carregada com
// fetchPriority alta — é o LCP da página. Sem JS: renderiza no servidor.
export default function GiftHero() {
  const common = {
    alt: "Frasco PURION GT sobre o capô de um carro numa estrada molhada à noite",
    sizes: "100vw",
    quality: 75,
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/cenas/cena-estrada-noite.webp", width: 1672, height: 941 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: "/images/cenas/cena-estrada-noite-mobile.webp",
    width: 1122,
    height: 1402,
    fetchPriority: "high",
    loading: "eager",
  });

  return (
    <section
      aria-labelledby="gift-hero-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-ink-950"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img
          {...rest}
          alt={common.alt}
          className="absolute inset-x-0 top-0 -z-10 h-[64%] w-full object-cover object-[50%_30%] motion-safe:animate-[pg-scale-in_2.4s_var(--ease-out)_both] md:h-full md:object-[50%_40%]"
        />
      </picture>
      {/* Mobile: a foto ocupa o topo e funde no preto, para o título não
          ficar por cima do rótulo do frasco. Desktop: foto em tela cheia. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,12,14,.5) 0%, rgba(11,12,14,0) 18%, rgba(11,12,14,0) 38%, #0B0C0E 64%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,12,14,.55) 0%, rgba(11,12,14,.05) 30%, rgba(11,12,14,.35) 55%, rgba(11,12,14,.96) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[var(--content-max)] px-6 pb-12 pt-32 sm:px-10 sm:pb-20">
        <div className="flex max-w-[760px] flex-col gap-6 motion-safe:animate-[pg-fade-up_1.1s_var(--ease-out)_.15s_both]">
          <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/70">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal-400" />
            PURION GIFT
          </span>
          <h1
            id="gift-hero-title"
            className="m-0 text-balance font-display text-[clamp(42px,8.4vw,112px)] font-medium leading-[0.92] tracking-[-0.045em] text-paper-0"
            style={{ fontVariationSettings: "'wdth' 86" }}
          >
            Para quem ama carros, um presente à altura.
          </h1>
          <p className="m-0 max-w-[44ch] text-[17px] leading-relaxed text-paper-0/75 sm:text-[19px]">
            Algumas paixões merecem mais do que um presente comum.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <GiftLink href={`#${CHOOSER_ID}`} variant="accent">
              Escolher presente
            </GiftLink>
            <GiftLink href="#experiencia" variant="ghost">
              Descobrir a experiência
            </GiftLink>
          </div>
        </div>
      </div>

      <a
        href="#experiencia"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 right-6 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper-0/70 transition-colors hover:text-paper-0 focus-visible:outline-2 focus-visible:outline-signal-400 sm:flex"
      >
        <ChevronDown size={18} className="motion-safe:animate-[pg-bounce-hint_2.4s_ease-in-out_infinite]" />
      </a>
    </section>
  );
}
