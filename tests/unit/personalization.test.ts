import { describe, expect, it } from "vitest";
import {
  DEDICATION_MAX,
  generateReference,
  hasPersonalization,
  parseGiftCartRequest,
  sanitizeText,
  validateDesiredDate,
} from "@/lib/gift/personalization";

const NOW = new Date("2026-11-12T15:00:00Z");

describe("parseGiftCartRequest", () => {
  it("aceita o mínimo (só oferta) com padrões seguros", () => {
    const r = parseGiftCartRequest({ offerId: "duo" }, NOW);
    expect(r).toEqual({
      ok: true,
      value: { offerId: "duo", quantity: 1, occasion: null, deliveryMode: "comprador", dedication: null, recipientFirstName: null, desiredDate: null },
    });
  });
  it("ignora preço/total enviados pelo navegador", () => {
    const r = parseGiftCartRequest({ offerId: "duo", price: 1, total: 0.01, discount: 999 }, NOW);
    expect(r.ok && r.value).not.toHaveProperty("price");
    expect(r.ok && r.value).not.toHaveProperty("total");
  });
  it(`dedicatória: até ${DEDICATION_MAX} caracteres visíveis (emoji conta 1)`, () => {
    const ok = parseGiftCartRequest({ offerId: "duo", dedication: "🚗".repeat(DEDICATION_MAX) }, NOW);
    expect(ok.ok).toBe(true);
    const tooLong = parseGiftCartRequest({ offerId: "duo", dedication: "a".repeat(DEDICATION_MAX + 1) }, NOW);
    expect(tooLong).toEqual({ ok: false, errors: [expect.objectContaining({ field: "dedication" })] });
  });
  it("dedicatória vazia ou só espaços vira null", () => {
    const r = parseGiftCartRequest({ offerId: "duo", dedication: "   \n  " }, NOW);
    expect(r.ok && r.value.dedication).toBeNull();
  });
  it("rejeita ocasião, entrega, quantidade e tipos inválidos", () => {
    const r = parseGiftCartRequest({ offerId: "duo", occasion: "x", deliveryMode: "drone", quantity: -1, recipientFirstName: 42 }, NOW);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.map((e) => e.field).sort()).toEqual(["deliveryMode", "occasion", "quantity", "recipientFirstName"]);
  });
  it("rejeita corpo que não é objeto", () => {
    expect(parseGiftCartRequest(null, NOW).ok).toBe(false);
    expect(parseGiftCartRequest([1], NOW).ok).toBe(false);
  });
});

describe("sanitizeText", () => {
  it("remove caracteres de controle e de direção, normaliza quebras", () => {
    expect(sanitizeText("Oi\u0000 pai‮!\r\n\r\n\r\nTe amo", { multiline: true })).toBe("Oi pai!\n\nTe amo");
    expect(sanitizeText("  Ana \n Maria ", { multiline: false })).toBe("Ana Maria");
  });
});

describe("validateDesiredDate", () => {
  it("aceita de amanhã até 120 dias", () => {
    expect(validateDesiredDate("2026-11-13", NOW)).toBeNull();
    expect(validateDesiredDate("2027-03-12", NOW)).toBeNull();
  });
  it("rejeita hoje, passado, longe demais e datas inexistentes", () => {
    expect(validateDesiredDate("2026-11-12", NOW)).not.toBeNull();
    expect(validateDesiredDate("2026-01-01", NOW)).not.toBeNull();
    expect(validateDesiredDate("2027-06-01", NOW)).not.toBeNull();
    expect(validateDesiredDate("2026-02-30", NOW)).not.toBeNull();
    expect(validateDesiredDate("13/11/2026", NOW)).not.toBeNull();
  });
});

describe("hasPersonalization / generateReference", () => {
  it("entrega ao presenteado conta como personalização", () => {
    const base = { offerId: "duo", quantity: 1, occasion: null, dedication: null, recipientFirstName: null, desiredDate: null } as const;
    expect(hasPersonalization({ ...base, deliveryMode: "comprador" })).toBe(false);
    expect(hasPersonalization({ ...base, deliveryMode: "presenteado" })).toBe(true);
  });
  it("referência PG- com alfabeto sem caracteres ambíguos", () => {
    const ref = generateReference();
    expect(ref).toMatch(/^PG-[2-9A-HJ-NP-Z]{8}$/);
    expect(generateReference(() => new Uint8Array(8))).toBe("PG-22222222");
  });
});
