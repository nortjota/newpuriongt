import { describe, expect, it } from "vitest";
import { generateReferralCode, isReferralCode, normalizeReferralCode, referralLink, whatsappShareUrl } from "@/lib/indicacoes/service";

describe("código de indicação", () => {
  it("8 caracteres sem ambíguos, aleatório e sem colisão em 10 mil", () => {
    const set = new Set(Array.from({ length: 10_000 }, generateReferralCode));
    expect(set.size).toBe(10_000);
    for (const c of Array.from(set).slice(0, 50)) expect(c).toMatch(/^[2-9A-HJ-NP-Z]{8}$/);
  });
  it("normaliza caixa e rejeita formato inválido", () => {
    expect(normalizeReferralCode(" k7q3m9xa ")).toBe("K7Q3M9XA");
    expect(normalizeReferralCode("K7Q3M9X0")).toBeNull(); // 0 não existe no alfabeto
    expect(normalizeReferralCode("../admin")).toBeNull();
    expect(normalizeReferralCode(42)).toBeNull();
  });
  it("link curto sem dado pessoal", () => {
    expect(referralLink("https://www.puriongt.com.br/", "K7Q3M9XA")).toBe("https://www.puriongt.com.br/i/K7Q3M9XA");
  });
});

describe("compartilhamento no WhatsApp", () => {
  it("abre o app com texto pronto (sem destinatário, sem envio automático)", () => {
    const u = new URL(whatsappShareUrl("https://www.puriongt.com.br/i/K7Q3M9XA", 10));
    expect(u.origin + u.pathname).toBe("https://wa.me/");
    expect(u.searchParams.has("phone")).toBe(false);
    expect(u.searchParams.get("text")).toContain("https://www.puriongt.com.br/i/K7Q3M9XA");
    expect(u.searchParams.get("text")).toContain("R$ 10,00");
  });
});

describe("roteamento dos eventos de pagamento", () => {
  it("cupom do indicado (PGI) e crédito (PGC) vão para o programa; benefício (PG15) não", () => {
    expect(isReferralCode("PGI-AAAA-BBBB-CCCC")).toBe(true);
    expect(isReferralCode("pgc-aaaa-bbbb-cccc")).toBe(true);
    expect(isReferralCode("PG15-AAAA-BBBB-CCCC")).toBe(false);
    expect(isReferralCode(null)).toBe(false);
  });
});
