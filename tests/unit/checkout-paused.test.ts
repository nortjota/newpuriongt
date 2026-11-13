import { afterEach, describe, expect, it, vi } from "vitest";

// O módulo lê NEXT_PUBLIC_CHECKOUT_PAUSED ao ser importado; cada teste
// reimporta com o ambiente que quer.
async function load(paused: string | undefined) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CHECKOUT_PAUSED", paused as string);
  return {
    links: await import("@/lib/content/checkout-links"),
    discount: await import("@/lib/private/checkout-discount"),
    kits: await import("@/lib/gift/kits-service"),
  };
}

afterEach(() => vi.unstubAllEnvs());

describe("vendas pausadas (estoque esgotado)", () => {
  it("fica pausado quando a variável não está definida", async () => {
    const { links } = await load(undefined);
    expect(links.CHECKOUT_PAUSED).toBe(true);
    expect(links.CHECKOUT_LINK_TARGET).toBeUndefined();
  });

  it("todo link de compra leva a /em-breve, sem parâmetros", async () => {
    const { links } = await load(undefined);
    for (const plan of ["un", "k2", "k3", "sub"] as const) {
      expect(links.baseCheckoutUrl(plan)).toBe("/em-breve");
      expect(links.buildCheckoutUrl(plan, { referralSlug: "parceiro", tracking: { utm_source: "ig" }, giftRef: "PG-1" })).toBe("/em-breve");
    }
  });

  it("não gera link de checkout com benefício", async () => {
    const { discount } = await load(undefined);
    const on = { BENEFITS_CHECKOUT_MODE: "coupon_param", APPMAX_COUPON_PARAM: "coupon" } as unknown as NodeJS.ProcessEnv;
    expect(discount.checkoutUrlWithBenefit("un", "PG15-AAAA-BBBB-CCCC", "r-1", on)).toBeNull();
  });

  it("não monta carrinho de presente nem grava personalização", async () => {
    const { kits } = await load(undefined);
    const insert = vi.fn();
    const deps = { ...kits.defaultDeps, store: () => ({ kind: "memory" as const, insert }) as never };
    const r = await kits.prepareGiftCart({ offerId: "duo", quantity: 1 }, "", deps);
    expect(r).toMatchObject({ ok: false, status: 409, body: { code: "checkout_paused" } });
    expect(insert).not.toHaveBeenCalled();
  });

  it("reabre com NEXT_PUBLIC_CHECKOUT_PAUSED=false", async () => {
    const { links } = await load("false");
    expect(links.CHECKOUT_PAUSED).toBe(false);
    expect(links.baseCheckoutUrl("un")).toMatch(/^https:\/\/pay\.puriongt\.com\.br\/checkout/);
    expect(links.CHECKOUT_LINK_TARGET).toBe("_blank");
  });
});
