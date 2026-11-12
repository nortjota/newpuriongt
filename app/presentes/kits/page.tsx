import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Header, { type NavLink } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/widgets/CartDrawer";
import Accordion from "@/components/gift/Accordion";
import SectionHeading from "@/components/gift/SectionHeading";
import KitBuilder from "@/components/gift/kits/KitBuilder";
import { getGiftCatalog } from "@/lib/gift/catalog";
import { buildGiftJsonLd, serializeJsonLd, SITE_URL } from "@/lib/gift/structured-data";
import { KITS_FAQ } from "@/lib/content/gift-kits";

const TITLE = "Kits para presentear — PURION GIFT";
const DESCRIPTION =
  "Compare PURION Individual, Duo e Trio, escolha a ocasião, escreva uma dedicatória e decida se o presente vai para você ou direto para quem vai ganhar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/presentes/kits" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/presentes/kits`,
    siteName: "PURION GT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/kits/kit-3.webp", width: 1122, height: 1402, alt: "Frascos PURION GT 60 ml" }],
    locale: "pt_BR",
  },
};

const NAV: NavLink[] = [
  { href: "/presentes", label: "Presentes" },
  { href: "#montar", label: "Montar presente" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "/", label: "Conheça a PURION GT" },
  { href: "#montar", label: "Montar meu presente", primary: true },
];

const PAGE_STYLE = { "--gift-accent": "#D4FC3C" } as CSSProperties;

export default async function KitsPage() {
  const offers = await getGiftCatalog();
  const jsonLd = buildGiftJsonLd(offers, { title: TITLE, description: DESCRIPTION, path: "/presentes/kits", faq: KITS_FAQ });

  return (
    <div style={PAGE_STYLE} className="flex min-h-full flex-1 flex-col bg-ink-950 text-paper-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Header navLinks={NAV} tone="dark" />
      <main id="topo" className="flex-1">
        <section aria-labelledby="kits-title" className="mx-auto max-w-[var(--content-max)] px-6 pb-12 pt-28 sm:px-10 sm:pt-32">
          <div className="flex max-w-[760px] flex-col gap-5">
            <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/60">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
              PURION GIFT · Kits
            </span>
            <h1
              id="kits-title"
              className="m-0 text-balance font-display text-[clamp(36px,5.4vw,72px)] font-medium leading-[0.96] tracking-[-0.04em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              Monte o presente para quem ama carros.
            </h1>
            <p className="m-0 max-w-[52ch] text-[16px] leading-relaxed text-paper-0/65 sm:text-[18px]">
              Compare as opções, escolha a ocasião e, se quiser, deixe uma dedicatória. Preço, estoque e entrega são confirmados antes do checkout.
            </p>
          </div>
        </section>

        <section id="montar" aria-label="Montar presente" className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-[var(--section-y)] sm:px-10">
          <KitBuilder offers={offers} />
        </section>

        <section
          id="duvidas"
          aria-labelledby="kits-faq-title"
          className="mx-auto grid max-w-[var(--content-max)] scroll-mt-20 gap-12 border-t border-white/10 px-6 py-[var(--section-y)] sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20"
        >
          <SectionHeading id="kits-faq-title" eyebrow="Presentes e entrega" title="Antes de finalizar.">
            <p className="m-0">Como funcionam dedicatória, entrega, prazos e trocas.</p>
          </SectionHeading>
          <Accordion items={KITS_FAQ} />
        </section>
      </main>
      <Footer hashBase="/" />
      <CartDrawer />
    </div>
  );
}
