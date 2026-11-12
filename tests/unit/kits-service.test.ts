import { describe, expect, it } from "vitest";
import { buildGiftCatalog, parseDisabledOffers } from "@/lib/gift/catalog";
import { getKitAvailability, prepareGiftCart, type Deps } from "@/lib/gift/kits-service";
import { MemoryStore, type PersonalizationStore } from "@/lib/gift/personalization-store";
import type { StockReading } from "@/lib/gift/stock";

function deps(over: Partial<Deps> & { stock?: StockReading; storeImpl?: PersonalizationStore | null } = {}): Deps & { mem: MemoryStore } {
  const mem = new MemoryStore();
  const store = over.storeImpl === undefined ? mem : over.storeImpl;
  return {
    mem,
    catalog: over.catalog ?? (async () => buildGiftCatalog()),
    readStock: over.readStock ?? (async () => over.stock ?? { bottles: null, source: "unknown" }),
    store: over.store ?? (() => store),
    reference: over.reference ?? (() => "PG-TESTE234"),
    now: over.now ?? (() => new Date("2026-11-12T12:00:00Z")),
  };
}

describe("getKitAvailability", () => {
  it("estoque desconhecido: limite = checkout (1); Trio sem checkout confirmado", async () => {
    const r = await getKitAvailability(deps());
    expect(r.checkoutMaxQuantity).toBe(1);
    expect(r.kits).toEqual([
      { offerId: "individual", available: true, reason: null, maxQuantity: 1, stockKnown: false },
      { offerId: "duo", available: true, reason: null, maxQuantity: 1, stockKnown: false },
      { offerId: "trio", available: false, reason: "checkout_unconfirmed", maxQuantity: 0, stockKnown: false },
    ]);
  });
  it("bundle virtual: 3 frascos em estoque permitem Individual e Duo; 1 frasco só Individual", async () => {
    const three = await getKitAvailability(deps({ stock: { bottles: 3, source: "crm" } }));
    expect(three.kits.map((k) => k.available)).toEqual([true, true, false]);
    const one = await getKitAvailability(deps({ stock: { bottles: 1, source: "crm" } }));
    expect(one.kits[1]).toMatchObject({ available: false, reason: "out_of_stock" });
  });
  it("sem armazenamento, personalização fica desligada", async () => {
    expect((await getKitAvailability(deps({ storeImpl: null }))).personalizationEnabled).toBe(false);
  });
});

describe("prepareGiftCart", () => {
  it("sem personalização: não grava nada e devolve resumo do servidor", async () => {
    const d = deps();
    const r = await prepareGiftCart({ offerId: "duo", price: 0.01 }, "", d);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.body.reference).toBeNull();
      expect(r.body.summary.total).toBe(176.22);
      expect(r.body.checkoutUrl).toContain("5611c8a9-946a-11f1-a1eb-46da4690ad53");
      expect(r.body.checkoutUrl).not.toContain("gift_ref");
    }
    expect(d.mem.records).toHaveLength(0);
  });
  it("com dedicatória: grava personalização pendente (não pedido) e leva a referência ao checkout", async () => {
    const d = deps();
    const r = await prepareGiftCart(
      {
        offerId: "duo",
        occasion: "pai",
        deliveryMode: "presenteado",
        recipientFirstName: "Carlos",
        dedication: "Feliz dia, pai!",
        desiredDate: "2026-11-20",
        tracking: { utm_source: "meta", evil: "x" },
      },
      "",
      d
    );
    expect(r.ok && r.body.reference).toBe("PG-TESTE234");
    expect(r.ok && new URL(r.body.checkoutUrl).searchParams.get("gift_ref")).toBe("PG-TESTE234");
    expect(d.mem.records[0]).toMatchObject({
      reference: "PG-TESTE234",
      plan_id: "k2",
      status: "pendente_checkout",
      kit_price: 176.22,
      discount: 19.58,
      dedication: "Feliz dia, pai!",
      delivery_mode: "presenteado",
      desired_date: "2026-11-20",
      tracking: { utm_source: "meta" },
    });
  });
  it("bloqueia oferta sem checkout confirmado (Trio) e oferta desligada pela operação", async () => {
    const trio = await prepareGiftCart({ offerId: "trio" }, "", deps());
    expect(trio).toMatchObject({ ok: false, status: 409, body: { code: "checkout_unconfirmed" } });
    const off = await prepareGiftCart({ offerId: "duo" }, "", deps({ catalog: async () => buildGiftCatalog({ disabled: parseDisabledOffers("duo") }) }));
    expect(off).toMatchObject({ ok: false, status: 409, body: { code: "disabled_by_ops" } });
  });
  it("bloqueia sem estoque e quantidade acima do limite", async () => {
    expect(await prepareGiftCart({ offerId: "duo" }, "", deps({ stock: { bottles: 1, source: "crm" } }))).toMatchObject({ status: 409, body: { code: "out_of_stock" } });
    expect(await prepareGiftCart({ offerId: "duo", quantity: 2 }, "", deps())).toMatchObject({ status: 409, body: { code: "quantity_exceeded" } });
  });
  it("oferta desconhecida e campos inválidos → 400", async () => {
    expect(await prepareGiftCart({ offerId: "quarteto" }, "", deps())).toMatchObject({ status: 400, body: { code: "unknown_offer" } });
    const bad = await prepareGiftCart({ offerId: "duo", dedication: "x".repeat(181) }, "", deps());
    expect(bad).toMatchObject({ status: 400, body: { code: "invalid_request" } });
  });
  it("personalização sem armazenamento ou com falha → 503, sem fingir que salvou", async () => {
    const none = await prepareGiftCart({ offerId: "duo", dedication: "oi" }, "", deps({ storeImpl: null }));
    expect(none).toMatchObject({ status: 503, body: { code: "personalization_unavailable" } });
    const failing: PersonalizationStore = { kind: "memory", insert: async () => { throw new Error("db down"); } };
    const fail = await prepareGiftCart({ offerId: "duo", dedication: "oi" }, "", deps({ storeImpl: failing }));
    expect(fail).toMatchObject({ status: 503, body: { code: "personalization_unavailable" } });
  });
});
