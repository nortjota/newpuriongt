import type { Metadata } from "next";
import Header, { type NavLink } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/widgets/CartDrawer";
import { GiftProvider, CHOOSER_ID } from "@/components/gift/GiftContext";
import GiftHero from "@/components/gift/GiftHero";
import GiftStory from "@/components/gift/GiftStory";
import GiftOccasions from "@/components/gift/GiftOccasions";
import GiftChooser from "@/components/gift/GiftChooser";
import GiftExperience from "@/components/gift/GiftExperience";
import GiftHowItWorks from "@/components/gift/GiftHowItWorks";
import GiftDesire from "@/components/gift/GiftDesire";
import GiftFaq from "@/components/gift/GiftFaq";
import GiftFinalCta from "@/components/gift/GiftFinalCta";
import GiftStickyCta from "@/components/gift/GiftStickyCta";
import { GIFTS, GIFT_FAQ } from "@/lib/content/gifts";

const SITE = "https://www.puriongt.com.br";
const TITLE = "PURION GIFT — Para quem ama carros, um presente à altura";
const DESCRIPTION =
  "Presente para quem ama carros: PURION GT, perfume automotivo premium. Escolha entre Individual, Duo ou Trio, escreva sua dedicatória e receba com envio no mesmo dia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/presentes" },
  keywords: [
    "presente para quem ama carros",
    "presente automotivo",
    "perfume automotivo",
    "presente Dia dos Pais",
    "presente para namorado",
    "PURION GT",
  ],
  openGraph: {
    type: "website",
    url: `${SITE}/presentes`,
    siteName: "Purion GT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/cenas/cena-estrada-noite.webp", width: 1672, height: 941, alt: "Frasco PURION GT numa estrada à noite" }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/cenas/cena-estrada-noite.webp"],
  },
};

const NAV: NavLink[] = [
  { href: "#ocasioes", label: "Ocasiões" },
  { href: "#presentear", label: "Experiência" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "/", label: "Conheça o PURION GT" },
  { href: `#${CHOOSER_ID}`, label: "Escolher presente", primary: true },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/presentes`,
      url: `${SITE}/presentes`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "pt-BR",
    },
    {
      "@type": "ItemList",
      name: "PURION GIFT",
      itemListElement: GIFTS.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: g.name,
          description: `${g.units} ${g.units === 1 ? "frasco" : "frascos"} PURION GT 60 ml. ${g.tagline}`,
          image: `${SITE}${g.image.src}`,
          brand: { "@type": "Brand", name: "Purion GT" },
          offers: {
            "@type": "Offer",
            url: `${SITE}/presentes`,
            priceCurrency: "BRL",
            price: g.amount.toFixed(2),
            availability: g.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: GIFT_FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PresentesPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-ink-950 text-paper-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <a
        href="#conteudo"
        className="sr-only z-[120] rounded-full bg-signal-400 px-5 py-3 text-sm font-medium text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Header navLinks={NAV} tone="dark" />
      <GiftProvider>
        <main id="topo" className="flex-1">
          <GiftHero />
          <div id="conteudo" tabIndex={-1} className="outline-none">
            <GiftStory />
            <GiftOccasions />
            <GiftChooser />
            <GiftExperience />
            <GiftHowItWorks />
            <GiftDesire />
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
