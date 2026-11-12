import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Header, { type NavLink } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/widgets/CartDrawer";
import { GiftProvider } from "@/components/gift/GiftContext";
import { CHOOSER_ID } from "@/components/gift/ids";
import GiftHero from "@/components/gift/GiftHero";
import GiftStory from "@/components/gift/GiftStory";
import GiftOccasions from "@/components/gift/GiftOccasions";
import GiftChooser from "@/components/gift/GiftChooser";
import GiftExperience from "@/components/gift/GiftExperience";
import GiftHowItWorks from "@/components/gift/GiftHowItWorks";
import GiftFaq from "@/components/gift/GiftFaq";
import GiftFinalCta from "@/components/gift/GiftFinalCta";
import GiftStickyCta from "@/components/gift/GiftStickyCta";
import { getGiftCatalog } from "@/lib/gift/catalog";
import { SITE_URL, buildGiftJsonLd, serializeJsonLd } from "@/lib/gift/structured-data";

const TITLE = "PURION GIFT — Para quem ama carros, um presente à altura";
const DESCRIPTION =
  "Presente para quem ama carros: PURION GT, perfume automotivo premium de 60 ml. Escolha Individual ou Duo, escreva uma dedicatória e receba com envio no mesmo dia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/presentes" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/presentes`,
    siteName: "PURION GT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/cenas/cena-estrada-noite.webp", width: 1672, height: 941, alt: "Frasco PURION GT numa estrada à noite" }],
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/cenas/cena-estrada-noite.webp"] },
};

const NAV: NavLink[] = [
  { href: "#ocasioes", label: "Ocasiões" },
  { href: `#${CHOOSER_ID}`, label: "Presentes" },
  { href: "#experiencia-presente", label: "Experiência" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "/", label: "Conheça a PURION GT" },
  { href: `#${CHOOSER_ID}`, label: "Escolher meu presente", primary: true },
];

// Verde-limão da campanha, escopado a esta página (o restante do site segue
// com o token --signal-400).
const PAGE_STYLE = { "--gift-accent": "#D4FC3C" } as CSSProperties;

export default async function PresentesPage() {
  const offers = await getGiftCatalog();
  const jsonLd = buildGiftJsonLd(offers, { title: TITLE, description: DESCRIPTION });

  return (
    <div style={PAGE_STYLE} className="flex min-h-full flex-1 flex-col bg-ink-950 text-paper-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <a
        href="#conteudo"
        className="sr-only z-[120] rounded-full bg-[var(--gift-accent)] px-5 py-3 text-sm font-medium text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Header navLinks={NAV} tone="dark" />
      <GiftProvider offers={offers}>
        <main id="topo" className="flex-1">
          <GiftHero />
          <div id="conteudo" tabIndex={-1} className="outline-none">
            <GiftStory />
            <GiftOccasions />
            <GiftChooser />
            <GiftExperience />
            <GiftHowItWorks />
            <GiftFaq />
            <GiftFinalCta />
          </div>
        </main>
        <GiftStickyCta />
      </GiftProvider>
      <Footer hashBase="/" />
      <CartDrawer />
    </div>
  );
}
