import { describe, expect, it } from "vitest";
import {
  decrypt,
  encrypt,
  generateVoucherCode,
  hashToken,
  hashVoucherCode,
  isWellFormedToken,
  loadSecrets,
  randomToken,
  signWebhook,
  verifyWebhook,
} from "@/lib/private/crypto";
import { checkoutMode, checkoutUrlWithBenefit } from "@/lib/private/checkout-discount";
import { benefitState, parsePaymentEvent, type Policy } from "@/lib/private/service";
import { CONSENT_TEXTS, consentRecord } from "@/lib/private/consent";

const env = { PRIVATE_ACCESS_PEPPER: "p".repeat(40), BENEFITS_CODE_KEY: Buffer.alloc(32, 1).toString("base64") } as unknown as NodeJS.ProcessEnv;
const s = loadSecrets(env)!;

describe("tokens e hashes", () => {
  it("token de 256 bits, base64url, sem colisões em 10 mil", () => {
    const set = new Set(Array.from({ length: 10_000 }, () => randomToken()));
    expect(set.size).toBe(10_000);
    for (const t of Array.from(set).slice(0, 50)) expect(isWellFormedToken(t)).toBe(true);
  });
  it("hash depende do pepper e do propósito; nunca contém o token", () => {
    const t = randomToken();
    const h = hashToken(s, t);
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).not.toContain(t);
    const other = loadSecrets({ ...env, PRIVATE_ACCESS_PEPPER: "q".repeat(40) } as unknown as NodeJS.ProcessEnv)!;
    expect(hashToken(other, t)).not.toBe(h);
  });
  it("código de voucher normaliza caixa/hífens no hash", () => {
    const c = generateVoucherCode();
    expect(c).toMatch(/^PG15-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
    expect(hashVoucherCode(s, c.toLowerCase().replace(/-/g, " "))).toBe(hashVoucherCode(s, c));
  });
  it("configuração fraca é rejeitada", () => {
    expect(loadSecrets({} as NodeJS.ProcessEnv)).toBeNull();
    expect(() => loadSecrets({ ...env, PRIVATE_ACCESS_PEPPER: "curto" } as unknown as NodeJS.ProcessEnv)).toThrow();
    expect(() => loadSecrets({ ...env, BENEFITS_CODE_KEY: "abc" } as unknown as NodeJS.ProcessEnv)).toThrow();
  });
});

describe("AES-256-GCM do código", () => {
  it("cifra com IV aleatório e detecta adulteração", () => {
    const a = encrypt(s.codeKey, "PG15-AAAA-BBBB-CCCC");
    expect(a).not.toBe(encrypt(s.codeKey, "PG15-AAAA-BBBB-CCCC"));
    expect(decrypt(s.codeKey, a)).toBe("PG15-AAAA-BBBB-CCCC");
    const parts = a.split(".");
    parts[3] = Buffer.from("PG15-ZZZZ-BBBB-CCCC").toString("base64url");
    expect(() => decrypt(s.codeKey, parts.join("."))).toThrow();
  });
});

describe("assinatura do webhook de pagamento", () => {
  const secret = "w".repeat(40);
  const body = JSON.stringify({ event_id: "evt-1" });
  const now = 1_800_000_000_000;
  const ts = String(now / 1000);
  it("aceita assinatura correta dentro da janela", () => {
    expect(verifyWebhook(secret, ts, signWebhook(secret, Number(ts), body), body, now)).toBe(true);
  });
  it("recusa corpo alterado, segredo errado, timestamp velho e cabeçalhos ausentes", () => {
    const sig = signWebhook(secret, Number(ts), body);
    expect(verifyWebhook(secret, ts, sig, body + " ", now)).toBe(false);
    expect(verifyWebhook("x".repeat(40), ts, sig, body, now)).toBe(false);
    expect(verifyWebhook(secret, ts, sig, body, now + 301_000)).toBe(false);
    expect(verifyWebhook(secret, null, sig, body, now)).toBe(false);
    expect(verifyWebhook(secret, ts, null, body, now)).toBe(false);
  });
});

describe("parsePaymentEvent", () => {
  it("exige event_id, tipo conhecido, pedido e reserva ou código", () => {
    expect(parsePaymentEvent({ event_id: "evt-123", tipo: "pago", pedido_ref: "APX-1", codigo: "PG15-AAAA-BBBB-CCCC" }).ok).toBe(true);
    expect(parsePaymentEvent({ event_id: "evt-123", tipo: "pago", pedido_ref: "APX-1" }).ok).toBe(false);
    expect(parsePaymentEvent({ event_id: "evt-123", tipo: "reembolso_em_dinheiro", pedido_ref: "APX-1", codigo: "x" }).ok).toBe(false);
    expect(parsePaymentEvent({ event_id: "e", tipo: "pago", pedido_ref: "APX-1", codigo: "x" }).ok).toBe(false);
    expect(parsePaymentEvent({ event_id: "evt-123", tipo: "pago", pedido_ref: "APX-1", resgate_id: "nao-uuid" }).ok).toBe(false);
  });
});

describe("checkout com benefício", () => {
  it("desligado por padrão; só gera link com modo e parâmetro configurados", () => {
    expect(checkoutMode({} as NodeJS.ProcessEnv)).toBe("off");
    expect(checkoutMode({ BENEFITS_CHECKOUT_MODE: "coupon_param" } as unknown as NodeJS.ProcessEnv)).toBe("off");
    expect(checkoutUrlWithBenefit("un", "PG15-AAAA-BBBB-CCCC", "id", {} as NodeJS.ProcessEnv)).toBeNull();
    const on = { BENEFITS_CHECKOUT_MODE: "coupon_param", APPMAX_COUPON_PARAM: "cupom" } as unknown as NodeJS.ProcessEnv;
    const u = new URL(checkoutUrlWithBenefit("k2", "PG15-AAAA-BBBB-CCCC", "r-1", on)!);
    expect(u.searchParams.get("cupom")).toBe("PG15-AAAA-BBBB-CCCC");
    expect(u.searchParams.get("beneficio")).toBe("r-1");
    expect(u.searchParams.get("product")).toBe("5611c8a9-946a-11f1-a1eb-46da4690ad53");
  });
});

describe("benefitState", () => {
  const pol = { codigo: "PILOTO_PRESENTE_15", elegibilidade: "elegivel" } as Policy;
  it("mapeia os estados exibidos ao cliente", () => {
    expect(benefitState([], [])).toEqual({ estado: "sem_beneficio_ativo" });
    expect(benefitState([pol], [])).toEqual({ estado: "pode_ativar" });
    expect(benefitState([{ ...pol, elegibilidade: "sem_compra_paga" }], [])).toEqual({ estado: "nao_elegivel", motivo: "sem_compra_paga" });
    expect(benefitState([pol], [{ politica: pol.codigo, status: "resgatado" }])).toEqual({ estado: "utilizado" });
    expect(benefitState([pol], [{ politica: pol.codigo, status: "expirado" }])).toEqual({ estado: "expirado" });
    expect(benefitState([pol], [{ politica: pol.codigo, status: "disponivel" }])).toEqual({ estado: "disponivel" });
  });
});

describe("consentimento", () => {
  it("cada canal tem texto versionado e hash estável", () => {
    expect(consentRecord("email").hash).toMatch(/^[0-9a-f]{64}$/);
    expect(consentRecord("email").versao).toBe(CONSENT_TEXTS.email.versao);
    expect(consentRecord("email").hash).not.toBe(consentRecord("whatsapp").hash);
  });
});
