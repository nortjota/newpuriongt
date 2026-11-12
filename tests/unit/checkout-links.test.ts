import { describe, expect, it } from "vitest";
import { CHECKOUT_URL, buildCheckoutUrl, hasConfirmedCheckout } from "@/lib/content/checkout-links";

describe("checkout links", () => {
  it("só Unidade e Kit 2 têm checkout confirmado", () => {
    expect(hasConfirmedCheckout("un")).toBe(true);
    expect(hasConfirmedCheckout("k2")).toBe(true);
    expect(hasConfirmedCheckout("k3")).toBe(false);
    expect(hasConfirmedCheckout("sub")).toBe(false);
  });
  it("Kit 2 usa link dedicado e Unidade o genérico", () => {
    expect(buildCheckoutUrl("k2")).toContain("5611c8a9-946a-11f1-a1eb-46da4690ad53");
    expect(buildCheckoutUrl("un")).toBe(new URL(CHECKOUT_URL).toString());
  });
  it("anexa ref de afiliado e UTMs", () => {
    const u = new URL(buildCheckoutUrl("k2", { referralSlug: "marcelo10", tracking: { utm_source: "meta", fbclid: "abc" } }));
    expect(u.searchParams.get("ref")).toBe("marcelo10");
    expect(u.searchParams.get("utm_source")).toBe("meta");
    expect(u.searchParams.get("fbclid")).toBe("abc");
  });
});
