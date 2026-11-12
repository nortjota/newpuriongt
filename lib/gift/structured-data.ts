import { GIFT_FAQ, PRODUCT_DESCRIPTION } from "@/lib/content/gifts";
import { isAvailable, type GiftOffer } from "./catalog";

export const SITE_URL = "https://www.puriongt.com.br";

// JSON-LD coerente com as ofertas reais: só entram no ItemList as ofertas
// DISPONÍVEIS, com o preço do plano real. Ofertas inativas não são anunciadas.
export function buildGiftJsonLd(
  offers: GiftOffer[],
  { title, description, path = "/presentes", faq = GIFT_FAQ }: { title: string; description: string; path?: string; faq?: { q: string; a: string }[] }
) {
  const url = `${SITE_URL}${path}`;
  const available = offers.filter(isAvailable);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, inLanguage: "pt-BR" },
      {
        "@type": "ItemList",
        name: "PURION GIFT",
        itemListElement: available.map((o, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: o.name,
            description: `${o.units} ${o.units === 1 ? "frasco" : "frascos"}. ${PRODUCT_DESCRIPTION}`,
            image: `${SITE_URL}${o.image.src}`,
            brand: { "@type": "Brand", name: "PURION GT" },
            offers: {
              "@type": "Offer",
              url: `${url}#oferta-${o.id}`,
              priceCurrency: "BRL",
              price: o.amount.toFixed(2),
              availability: "https://schema.org/InStock",
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
