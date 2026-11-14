// Serviço da /presentes/kits — tudo que decide preço, composição, estoque e
// disponibilidade roda AQUI, no servidor. O navegador só envia ids e textos.
import { CHECKOUT_MAX_QUANTITY, CHECKOUT_PAUSED, buildCheckoutUrl } from "@/lib/content/checkout-links";
import { getGiftCatalog, isAvailable, type GiftOffer } from "./catalog";
import { computeSummary, type PriceSummary } from "./pricing";
import { generateReference, hasPersonalization, parseGiftCartRequest, type ValidationError } from "./personalization";
import { buildRecord, getPersonalizationStore, type PersonalizationStore } from "./personalization-store";
import { kitsFromStock, readBottleStock, type StockReading } from "./stock";
import { parseTrackingParams } from "@/lib/tracking/utm";

export type KitAvailability = {
  offerId: string;
  available: boolean;
  reason: null | "checkout_unconfirmed" | "disabled_by_ops" | "out_of_stock";
  maxQuantity: number; // 0 quando indisponível
  stockKnown: boolean;
};

export type AvailabilityResponse = {
  kits: KitAvailability[];
  personalizationEnabled: boolean;
  checkoutMaxQuantity: number;
};

export type Deps = {
  catalog: () => Promise<GiftOffer[]>;
  readStock: () => Promise<StockReading>;
  store: () => PersonalizationStore | null;
  reference: () => string;
  now: () => Date;
};

export const defaultDeps: Deps = {
  catalog: getGiftCatalog,
  readStock: readBottleStock,
  store: getPersonalizationStore,
  reference: () => generateReference(),
  now: () => new Date(),
};

export function availabilityFor(offer: GiftOffer, stock: StockReading): KitAvailability {
  if (!isAvailable(offer)) {
    const reason = offer.availability.status === "unavailable" ? offer.availability.reason : null;
    return { offerId: offer.id, available: false, reason, maxQuantity: 0, stockKnown: stock.bottles !== null };
  }
  const fromStock = kitsFromStock(stock.bottles, offer.units);
  const max = fromStock === null ? CHECKOUT_MAX_QUANTITY : Math.min(CHECKOUT_MAX_QUANTITY, fromStock);
  return {
    offerId: offer.id,
    available: max > 0,
    reason: max > 0 ? null : "out_of_stock",
    maxQuantity: Math.max(0, max),
    stockKnown: stock.bottles !== null,
  };
}

export async function getKitAvailability(deps: Deps = defaultDeps): Promise<AvailabilityResponse> {
  const [offers, stock] = await Promise.all([deps.catalog(), deps.readStock()]);
  return {
    kits: offers.map((o) => availabilityFor(o, stock)),
    personalizationEnabled: deps.store() !== null,
    checkoutMaxQuantity: CHECKOUT_MAX_QUANTITY,
  };
}

export type PrepareResult =
  | {
      ok: true;
      status: 200;
      body: { reference: string | null; offerId: string; planId: string; quantity: number; summary: PriceSummary; checkoutUrl: string };
    }
  | { ok: false; status: 400 | 409 | 503; body: { code: string; message: string; errors?: ValidationError[] } };

// Valida o pedido de carrinho, revalida preço/composição/estoque e, se houver
// personalização, persiste com uma referência. NÃO cria pedido nem cobra nada.
export async function prepareGiftCart(rawBody: unknown, search: string, deps: Deps = defaultDeps): Promise<PrepareResult> {
  const parsed = parseGiftCartRequest(rawBody, deps.now());
  if (!parsed.ok) return { ok: false, status: 400, body: { code: "invalid_request", message: "Revise os campos destacados.", errors: parsed.errors } };
  const req = parsed.value;

  // Vendas pausadas: não monta carrinho nem grava personalização de um pedido
  // que não pode ser concluído.
  if (CHECKOUT_PAUSED) {
    return { ok: false, status: 409, body: { code: "checkout_paused", message: "Nosso estoque esgotou. Em breve voltamos com novos presentes." } };
  }

  const offers = await deps.catalog();
  const offer = offers.find((o) => o.id === req.offerId);
  if (!offer) return { ok: false, status: 400, body: { code: "unknown_offer", message: "Presente não encontrado." } };

  const availability = availabilityFor(offer, await deps.readStock());
  if (!availability.available) {
    return { ok: false, status: 409, body: { code: availability.reason ?? "unavailable", message: "Este presente está indisponível no momento." } };
  }
  if (req.quantity > availability.maxQuantity) {
    return {
      ok: false,
      status: 409,
      body: { code: "quantity_exceeded", message: `Quantidade máxima por pedido: ${availability.maxQuantity}.` },
    };
  }

  const summary = computeSummary(offer, req.quantity);
  let reference: string | null = null;

  if (hasPersonalization(req)) {
    const store = deps.store();
    if (!store) {
      return {
        ok: false,
        status: 503,
        body: { code: "personalization_unavailable", message: "Não conseguimos salvar a personalização agora. Você pode seguir sem ela." },
      };
    }
    reference = deps.reference();
    // Origem de campanha: a que o navegador guardou (sanitizada aqui) ou a do referer.
    const sent = (rawBody as { tracking?: unknown }).tracking;
    const fromBody = sent && typeof sent === "object" && !Array.isArray(sent)
      ? parseTrackingParams(new URLSearchParams(Object.entries(sent as Record<string, unknown>).filter(([, v]) => typeof v === "string") as [string, string][]).toString())
      : {};
    const tracking = (Object.keys(fromBody).length ? fromBody : parseTrackingParams(search)) as Record<string, string>;
    try {
      await store.insert(buildRecord(reference, req, { offerId: offer.id, planId: offer.planId }, summary, tracking, deps.now()));
    } catch {
      return {
        ok: false,
        status: 503,
        body: { code: "personalization_unavailable", message: "Não conseguimos salvar a personalização agora. Tente de novo ou siga sem ela." },
      };
    }
  }

  return {
    ok: true,
    status: 200,
    body: {
      reference,
      offerId: offer.id,
      planId: offer.planId,
      quantity: req.quantity,
      summary,
      checkoutUrl: buildCheckoutUrl(offer.planId, { giftRef: reference }),
    },
  };
}
