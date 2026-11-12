import { describe, expect, it } from "vitest";
import { computeSummary } from "@/lib/gift/pricing";
import { buildGiftCatalog } from "@/lib/gift/catalog";
import { KIT_PRICE_PROPOSALS } from "@/lib/gift/kit-proposals";

const [individual, duo, trio] = buildGiftCatalog();

describe("computeSummary", () => {
  it("Individual não tem desconto", () => {
    expect(computeSummary(individual, 1)).toMatchObject({ listPrice: 97.9, kitPrice: 97.9, discount: 0, total: 97.9, shipping: null });
  });
  it("Duo: desconto do kit é a diferença para 2 avulsos — e só ele", () => {
    const s = computeSummary(duo, 1);
    expect(s).toMatchObject({ totalBottles: 2, listPrice: 195.8, kitPrice: 176.22, discount: 19.58, total: 176.22 });
    expect(s.total).toBeCloseTo(s.listPrice - s.discount, 2);
  });
  it("quantidade multiplica sem aplicar desconto duas vezes", () => {
    const s = computeSummary(trio, 2);
    expect(s).toMatchObject({ totalBottles: 6, listPrice: 587.4, kitPrice: 499.3, discount: 88.1, total: 499.3 });
  });
  it("frete nunca é inventado", () => {
    expect(computeSummary(duo, 1).shipping).toBeNull();
  });
  it("rejeita quantidade inválida", () => {
    expect(() => computeSummary(duo, 0)).toThrow();
    expect(() => computeSummary(duo, 1.5)).toThrow();
  });
  it("preços sugeridos (hipóteses) não são usados no preço publicado", () => {
    const proposedDuo = KIT_PRICE_PROPOSALS.find((p) => p.offerId === "duo")!.proposedPrice;
    expect(duo.amount).not.toBe(proposedDuo);
    expect(KIT_PRICE_PROPOSALS.every((p) => p.status === "hipotese")).toBe(true);
  });
});
