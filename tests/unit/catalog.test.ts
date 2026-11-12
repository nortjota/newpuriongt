import { describe, expect, it } from "vitest";
import { buildGiftCatalog, isAvailable, parseDisabledOffers, suggestOffer } from "@/lib/gift/catalog";
import { OCCASIONS, getOccasion } from "@/lib/content/gifts";
import { PLAN_AMOUNT } from "@/lib/content/plans";

describe("buildGiftCatalog", () => {
  it("usa preços reais dos planos — sem SKUs novos", () => {
    const offers = buildGiftCatalog();
    expect(offers.map((o) => o.planId)).toEqual(["un", "k2", "k3"]);
    for (const o of offers) expect(o.amount).toBe(PLAN_AMOUNT[o.planId]);
    expect(offers[0].price).toBe("R$ 97,90");
    expect(offers[1].perUnit).toBe("R$ 88,11");
  });
  it("Trio fica inativo enquanto o checkout do Kit 3 não for confirmado", () => {
    const trio = buildGiftCatalog().find((o) => o.id === "trio")!;
    expect(trio.availability).toEqual({ status: "unavailable", reason: "checkout_unconfirmed" });
  });
  it("ativa o Trio quando o checkout for confirmado", () => {
    const trio = buildGiftCatalog({ confirmed: () => true }).find((o) => o.id === "trio")!;
    expect(isAvailable(trio)).toBe(true);
  });
  it("trava operacional desliga ofertas por id ou plano", () => {
    const offers = buildGiftCatalog({ disabled: parseDisabledOffers(" duo , UN ") });
    expect(offers.filter(isAvailable)).toHaveLength(0);
    expect(offers[1].availability).toEqual({ status: "unavailable", reason: "disabled_by_ops" });
  });
});

describe("suggestOffer", () => {
  it("toda ocasião aponta para uma oferta disponível hoje", () => {
    const offers = buildGiftCatalog();
    for (const o of OCCASIONS) {
      const s = suggestOffer(o, offers);
      expect(s, o.id).not.toBeNull();
      expect(isAvailable(s!)).toBe(true);
    }
  });
  it("Natal cai para o Duo se o Trio estiver inativo, e usa o Trio quando ativo", () => {
    const natal = getOccasion("natal")!;
    expect(suggestOffer(natal, buildGiftCatalog())?.id).toBe("duo");
    expect(suggestOffer(natal, buildGiftCatalog({ confirmed: () => true }))?.id).toBe("trio");
  });
  it("retorna null se nada estiver disponível", () => {
    const offers = buildGiftCatalog({ disabled: parseDisabledOffers("individual,duo,trio") });
    expect(suggestOffer(getOccasion("aniversario")!, offers)).toBeNull();
  });
  it("getOccasion ignora valores desconhecidos", () => {
    expect(getOccasion("<script>")).toBeNull();
    expect(getOccasion(null)).toBeNull();
  });
});
