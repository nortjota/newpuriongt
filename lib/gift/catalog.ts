// Catálogo da PURION GIFT — monta as ofertas a partir das fontes reais:
//   • preço e unidades: lib/content/plans.ts (preços confirmados pelo usuário)
//   • disponibilidade: checkout confirmado (lib/content/checkout-links.ts)
//     + trava operacional GIFT_DISABLED_OFFERS (env, servidor)
//
// Não existe fonte de estoque no site hoje (o estoque vive no CRM e não é
// exposto publicamente). Por isso "disponível" significa: tem checkout
// confirmado E não foi desligado pela operação. Nenhum SKU é criado aqui.
import { PLANS, PLAN_AMOUNT, PLAN_UNITS, fmt } from "@/lib/content/plans";
import { hasConfirmedCheckout } from "@/lib/content/checkout-links";
import { GIFT_DEFINITIONS, type GiftDefinition, type GiftId, type Occasion } from "@/lib/content/gifts";

export type Availability =
  | { status: "available" }
  | { status: "unavailable"; reason: "checkout_unconfirmed" | "disabled_by_ops" };

// Serializável (vai do servidor para componentes cliente como prop).
export type GiftOffer = GiftDefinition & {
  units: number;
  amount: number;
  price: string;
  perUnit: string;
  installment: string;
  savingsBadge: string | null;
  availability: Availability;
};

export class GiftCatalogError extends Error {}

export function parseDisabledOffers(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function buildGiftCatalog({
  disabled = new Set<string>(),
  confirmed = hasConfirmedCheckout,
}: { disabled?: Set<string>; confirmed?: typeof hasConfirmedCheckout } = {}): GiftOffer[] {
  return GIFT_DEFINITIONS.map((def) => {
    const plan = PLANS.find((p) => p.id === def.planId);
    const amount = PLAN_AMOUNT[def.planId];
    const units = PLAN_UNITS[def.planId];
    if (!plan || !Number.isFinite(amount) || amount <= 0 || !units) {
      throw new GiftCatalogError(`Plano inválido para a oferta ${def.id}`);
    }
    const availability: Availability = disabled.has(def.id) || disabled.has(def.planId)
      ? { status: "unavailable", reason: "disabled_by_ops" }
      : confirmed(def.planId)
        ? { status: "available" }
        : { status: "unavailable", reason: "checkout_unconfirmed" };

    return {
      ...def,
      units,
      amount,
      price: fmt(amount),
      perUnit: fmt(amount / units),
      installment: fmt(amount / 3),
      savingsBadge: plan.badge ?? null,
      availability,
    };
  });
}

// Ponto único de leitura do catálogo no servidor. Assíncrono de propósito:
// quando houver uma fonte remota (ex.: estoque do CRM), só esta função muda.
export async function getGiftCatalog(): Promise<GiftOffer[]> {
  return buildGiftCatalog({ disabled: parseDisabledOffers(process.env.GIFT_DISABLED_OFFERS) });
}

export function isAvailable(offer: GiftOffer): boolean {
  return offer.availability.status === "available";
}

// Primeira oferta disponível na ordem de preferência da ocasião.
export function suggestOffer(occasion: Occasion, offers: GiftOffer[]): GiftOffer | null {
  for (const id of occasion.preferences) {
    const offer = offers.find((o) => o.id === id);
    if (offer && isAvailable(offer)) return offer;
  }
  return null;
}

export function offerById(offers: GiftOffer[], id: GiftId): GiftOffer | undefined {
  return offers.find((o) => o.id === id);
}

export function toAnalyticsItem(offer: GiftOffer, listName = "PURION GIFT") {
  return {
    item_id: offer.planId,
    item_name: offer.name,
    price: offer.amount,
    quantity: 1,
    item_category: "Perfume automotivo",
    item_list_name: listName,
  };
}
