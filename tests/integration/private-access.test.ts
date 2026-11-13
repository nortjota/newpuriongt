// Integração REAL: serviço Node → funções SQL → PostgreSQL (sem mocks).
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { loadSecrets } from "@/lib/private/crypto";
import {
  activateToken,
  applyPaymentEvent,
  cancelReservation,
  endSession,
  issueAccessToken,
  issueVoucher,
  maintenance,
  panel,
  publicPolicies,
  reserve,
  sessionCliente,
  setConsent,
  unsubscribe,
  type Cliente,
} from "@/lib/private/service";

const db = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const s = loadSecrets()!;
const SITE = "https://www.puriongt.com.br";
let seq = 0;
const key = () => `idem-${Date.now()}-${++seq}-xxxxxxxx`;

afterAll(() => db.end());

beforeEach(async () => {
  await db.query(`TRUNCATE pa_clientes, vendas, crm_outbox, beneficio_eventos_pagamento, notificacoes, beneficio_auditoria, consentimentos, pa_descadastro_tokens CASCADE`);
  await db.query(`DELETE FROM beneficio_politicas WHERE codigo <> 'PILOTO_PRESENTE_15'`);
  await db.query(`UPDATE beneficio_politicas SET ativo = true, reativar_em_estorno = false, liberar_em_falha = true, valor = 15, desconto_max_percentual = 20, compra_minima = 97.90`);
});

async function venda(email: string, extra: Partial<{ status: string; status_pagamento: string; compra_presente: boolean }> = {}) {
  await db.query(`INSERT INTO vendas (cliente_email, status, status_pagamento, compra_presente) VALUES ($1,$2,$3,$4)`, [
    email,
    extra.status ?? "aprovado",
    extra.status_pagamento ?? "pendente",
    extra.compra_presente ?? false,
  ]);
}

async function token(email: string, nome = "Ana") {
  const r = await issueAccessToken(s, { email, primeiroNome: nome, origem: "teste", emitidoPor: "teste" }, SITE);
  return { ...r, token: r.url.split("#t=")[1] };
}

async function login(email: string, opts: { paid?: boolean; ip?: string } = {}): Promise<{ cliente: Cliente; sessionId: string }> {
  if (opts.paid !== false) await venda(email);
  const { token: t } = await token(email);
  const r = await activateToken(s, t, opts.ip ?? `ip-${email}`);
  expect(r.resultado).toBe("ok");
  const cliente = (await sessionCliente(s, r.sessionId!))!;
  return { cliente, sessionId: r.sessionId! };
}

async function loginComVoucher(email: string) {
  const l = await login(email);
  const emit = await issueVoucher(s, l.cliente, "PILOTO_PRESENTE_15", "ip");
  expect(emit.resultado).toBe("emitido");
  return { ...l, voucherId: emit.voucher_id! };
}

describe("token de acesso", () => {
  it("token válido cria sessão; o link e o QR não contêm dados pessoais", async () => {
    await venda("ana@ex.com");
    const r = await token("ana@ex.com");
    expect(r.url).toMatch(/^https:\/\/www\.puriongt\.com\.br\/private-access#t=[A-Za-z0-9_-]{43}$/);
    expect(r.url).not.toContain("ana");
    expect(r.qrSvg).toContain("<svg");
    const a = await activateToken(s, r.token, "1.1.1.1");
    expect(a.resultado).toBe("ok");
    expect(await sessionCliente(s, a.sessionId!)).toMatchObject({ primeiro_nome: "Ana", email_norm: "ana@ex.com" });
    // Banco guarda só hash.
    const { rows } = await db.query(`SELECT token_hash FROM pa_tokens`);
    expect(rows[0].token_hash).not.toContain(r.token);
  });

  it("inválido, malformado, já utilizado, expirado e revogado", async () => {
    const r = await token("b@ex.com");
    expect((await activateToken(s, "x".repeat(43), "2.2.2.2")).resultado).toBe("invalido");
    expect((await activateToken(s, "curto", "2.2.2.2")).resultado).toBe("invalido");
    expect((await activateToken(s, r.token, "2.2.2.2")).resultado).toBe("ok");
    expect((await activateToken(s, r.token, "2.2.2.2")).resultado).toBe("utilizado");

    const e = await token("c@ex.com");
    await db.query(`UPDATE pa_tokens SET expira_em = now() - interval '1 second' WHERE id = $1`, [e.token_id]);
    expect((await activateToken(s, e.token, "2.2.2.3")).resultado).toBe("expirado");

    const antigo = await token("d@ex.com");
    await token("d@ex.com"); // novo token revoga o anterior
    expect((await activateToken(s, antigo.token, "2.2.2.4")).resultado).toBe("revogado");
  });

  it("bloqueia força bruta por IP (10 falhas em 15 min), mesmo com token válido depois", async () => {
    const ok = await token("e@ex.com");
    for (let i = 0; i < 10; i++) await activateToken(s, "y".repeat(43), "9.9.9.9");
    expect((await activateToken(s, ok.token, "9.9.9.9")).resultado).toBe("bloqueado");
    expect((await activateToken(s, ok.token, "8.8.8.8")).resultado).toBe("ok"); // outro IP segue
  });

  it("sessão inválida, expirada ou encerrada não identifica ninguém", async () => {
    const { sessionId } = await login("f@ex.com");
    expect(await sessionCliente(s, "z".repeat(43))).toBeNull();
    expect(await sessionCliente(s, null)).toBeNull();
    await endSession(s, sessionId);
    expect(await sessionCliente(s, sessionId)).toBeNull();
    const l2 = await login("g@ex.com");
    await db.query(`UPDATE pa_sessoes SET expira_em = now() - interval '1 second'`);
    expect(await sessionCliente(s, l2.sessionId)).toBeNull();
  });
});

describe("elegibilidade e emissão", () => {
  it("cliente sem compra paga não é elegível", async () => {
    const { cliente } = await login("h@ex.com", { paid: false });
    expect(await issueVoucher(s, cliente, "PILOTO_PRESENTE_15", "ip")).toMatchObject({ resultado: "nao_elegivel", motivo: "sem_compra_paga" });
    expect((await panel(s, cliente)).estado).toEqual({ estado: "nao_elegivel", motivo: "sem_compra_paga" });
  });

  it("compra estornada não conta; quem já comprou presente não é elegível", async () => {
    await venda("i@ex.com", { status: "estornado" });
    const { cliente } = await login("i@ex.com", { paid: false });
    expect((await issueVoucher(s, cliente, "PILOTO_PRESENTE_15", "ip")).motivo).toBe("sem_compra_paga");
    await venda("j@ex.com", { compra_presente: true });
    const j = await login("j@ex.com", { paid: false });
    expect((await issueVoucher(s, j.cliente, "PILOTO_PRESENTE_15", "ip")).motivo).toBe("ja_comprou_presente");
  });

  it("política inativa não aparece e não emite", async () => {
    await db.query(`UPDATE beneficio_politicas SET ativo = false`);
    expect(await publicPolicies()).toEqual([]);
    const { cliente } = await login("k@ex.com");
    expect((await issueVoucher(s, cliente, "PILOTO_PRESENTE_15", "ip")).motivo).toBe("politica_inativa");
  });

  it("uma emissão por cliente, inclusive sob concorrência", async () => {
    const { cliente } = await login("l@ex.com");
    const results = await Promise.all(Array.from({ length: 10 }, () => issueVoucher(s, cliente, "PILOTO_PRESENTE_15", "ip")));
    expect(results.filter((r) => r.resultado === "emitido")).toHaveLength(1);
    expect(results.filter((r) => r.resultado === "ja_emitido")).toHaveLength(9);
    const { rows } = await db.query(`SELECT codigo_cifrado, codigo_final, valor, expira_em - emitido_em AS validade FROM beneficio_vouchers`);
    expect(rows).toHaveLength(1);
    expect(Number(rows[0].valor)).toBe(15);
    expect(rows[0].validade.days).toBe(60);
    const p = await panel(s, cliente);
    expect(p.vouchers[0].codigo).toMatch(/^PG15-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
    expect(p.vouchers[0].codigo!.endsWith(rows[0].codigo_final)).toBe(true);
    expect(rows[0].codigo_cifrado).not.toContain(p.vouchers[0].codigo);
  });
});

describe("reserva (checkout)", () => {
  it("reserva com valor do servidor, teto de desconto e link de checkout com o código pessoal", async () => {
    const { cliente, voucherId } = await loginComVoucher("m@ex.com");
    const r = await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip");
    expect(r).toMatchObject({ ok: true, desconto: 15 });
    if (!r.ok) return;
    const url = new URL(r.checkoutUrl!);
    expect(url.searchParams.get("coupon")).toMatch(/^PG15-/);
    expect(url.searchParams.get("beneficio")).toBe(r.resgateId);
    expect(url.searchParams.get("product")).toBe("12c09776-a3c7-11f1-a1eb-46da4690ad53");
  });

  it("desconto nunca passa do teto % da regra comercial", async () => {
    await db.query(`UPDATE beneficio_politicas SET valor = 50`);
    const { cliente, voucherId } = await loginComVoucher("n@ex.com");
    const r = await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip");
    expect(r.ok && r.desconto).toBe(19.58); // 20% de 97,90
  });

  it("regras: somente presente, oferta indisponível (Trio) e compra mínima", async () => {
    const { cliente, voucherId } = await loginComVoucher("o@ex.com");
    expect(await reserve(s, cliente, { voucherId, offerId: "individual", presente: false, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "somente_presente" });
    expect(await reserve(s, cliente, { voucherId, offerId: "trio", presente: true, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "oferta_indisponivel" });
    await db.query(`UPDATE beneficio_politicas SET compra_minima = 150`);
    expect(await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "compra_minima" });
  });

  it("acesso indevido: outro cliente não reserva nem vê o voucher alheio", async () => {
    const a = await loginComVoucher("p@ex.com");
    const b = await login("q@ex.com");
    expect(await reserve(s, b.cliente, { voucherId: a.voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "acesso_negado" });
    expect((await panel(s, b.cliente)).vouchers).toEqual([]);
  });

  it("concorrência: 20 reservas simultâneas do mesmo voucher → exatamente 1", async () => {
    const { cliente, voucherId } = await loginComVoucher("r@ex.com");
    const results = await Promise.all(
      Array.from({ length: 20 }, () => reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip"))
    );
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok).every((r) => !r.ok && r.motivo === "reserva_em_andamento")).toBe(true);
    const { rows } = await db.query(`SELECT count(*)::int AS n FROM beneficio_resgates WHERE status = 'reservado'`);
    expect(rows[0].n).toBe(1);
  });

  it("idempotência: a mesma chave repetida (inclusive em paralelo) devolve a mesma reserva", async () => {
    const { cliente, voucherId } = await loginComVoucher("s@ex.com");
    const k = key();
    const results = await Promise.all(Array.from({ length: 5 }, () => reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: k }, "ip")));
    const ids = new Set(results.filter((r) => r.ok).map((r) => r.ok && r.resgateId));
    expect(ids.size).toBe(1);
    expect(results.every((r) => r.ok)).toBe(true);
  });

  it("não cumulativo com outro benefício reservado", async () => {
    await db.query(`INSERT INTO beneficio_politicas (codigo, nome, descricao, valor, validade_dias, ativo, termos_versao, termos_texto, tenant_id)
                    VALUES ('OUTRO_10','Outro','Outro',10,30,true,'v1','t','a1b2c3d4-e5f6-7890-abcd-ef1234567890')`);
    const { cliente, voucherId } = await loginComVoucher("t@ex.com");
    const outro = await issueVoucher(s, cliente, "OUTRO_10", "ip");
    expect((await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).ok).toBe(true);
    expect(await reserve(s, cliente, { voucherId: outro.voucher_id!, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "nao_cumulativo" });
  });

  it("voucher expirado não reserva", async () => {
    const { cliente, voucherId } = await loginComVoucher("u@ex.com");
    await db.query(`UPDATE beneficio_vouchers SET expira_em = now() - interval '1 second'`);
    expect(await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).toEqual({ ok: false, motivo: "expirado" });
    expect((await panel(s, cliente)).estado.estado).toBe("expirado");
  });
});

describe("pagamento, cancelamento e estorno", () => {
  async function reservado(email: string) {
    const l = await loginComVoucher(email);
    const r = await reserve(s, l.cliente, { voucherId: l.voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip");
    if (!r.ok) throw new Error(r.motivo);
    return { ...l, resgateId: r.resgateId };
  }
  const evt = (tipo: "pago" | "falhou" | "cancelado" | "estornado" | "chargeback", resgateId: string | null, pedido = "APX-1", codigo: string | null = null) =>
    applyPaymentEvent(s, { eventId: `evt-${tipo}-${pedido}-${++seq}`, tipo, pedidoRef: pedido, resgateId, codigo, valorPedido: 97.9 });

  it("pagamento aprovado confirma o resgate; o voucher passa a utilizado; evento repetido não duplica", async () => {
    const { cliente, resgateId } = await reservado("v@ex.com");
    const eventId = `evt-unico-${seq}`;
    const e = { eventId, tipo: "pago" as const, pedidoRef: "APX-10", resgateId, codigo: null, valorPedido: 97.9 };
    expect(await applyPaymentEvent(s, e)).toMatchObject({ resultado: "confirmado" });
    expect(await applyPaymentEvent(s, e)).toMatchObject({ resultado: "confirmado", repetido: true });
    const p = await panel(s, cliente);
    expect(p.estado.estado).toBe("utilizado");
    expect(p.vouchers[0].codigo).toBeNull(); // código não é mais exibido
    expect(p.historico[0]).toMatchObject({ status: "confirmado", valor_desconto: 15 });
  });

  it("erro de pagamento libera o benefício, que pode ser usado de novo", async () => {
    const { cliente, voucherId, resgateId } = await reservado("w@ex.com");
    expect(await evt("falhou", resgateId)).toMatchObject({ resultado: "liberado" });
    expect((await panel(s, cliente)).estado.estado).toBe("disponivel");
    expect((await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip")).ok).toBe(true);
  });

  it("cancelamento pelo cliente libera; cancelar reserva de outro cliente é negado", async () => {
    const a = await reservado("x@ex.com");
    const b = await login("y@ex.com");
    expect(await cancelReservation(s, b.cliente, a.resgateId, "ip")).toEqual({ resultado: "acesso_negado" });
    expect(await cancelReservation(s, a.cliente, a.resgateId, "ip")).toEqual({ resultado: "liberado" });
    expect((await panel(s, a.cliente)).estado.estado).toBe("disponivel");
  });

  it("estorno após uso cancela o benefício (política padrão) — sem virar dinheiro ou crédito", async () => {
    const { cliente, resgateId } = await reservado("z@ex.com");
    await evt("pago", resgateId, "APX-20");
    expect(await evt("estornado", resgateId, "APX-20")).toMatchObject({ resultado: "estornado" });
    const p = await panel(s, cliente);
    expect(p.estado.estado).toBe("cancelado");
    expect(p.historico[0].status).toBe("estornado");
  });

  it("chargeback com política de reativação devolve o benefício dentro da validade", async () => {
    await db.query(`UPDATE beneficio_politicas SET reativar_em_estorno = true`);
    const { cliente, resgateId } = await reservado("aa@ex.com");
    await evt("pago", resgateId, "APX-21");
    await evt("chargeback", resgateId, "APX-21");
    expect((await panel(s, cliente)).estado.estado).toBe("disponivel");
  });

  it("recuperação de falha: reserva vencida volta a disponível; pagamento atrasado ainda confirma", async () => {
    const { cliente, resgateId } = await reservado("bb@ex.com");
    await db.query(`UPDATE beneficio_resgates SET reserva_expira_em = now() - interval '1 second'`);
    expect((await panel(s, cliente)).estado.estado).toBe("disponivel");
    expect((await panel(s, cliente)).historico[0].status).toBe("expirado");
    expect(await evt("pago", resgateId, "APX-30")).toMatchObject({ resultado: "confirmado" });
    expect((await panel(s, cliente)).historico[0]).toMatchObject({ status: "confirmado", motivo: "pago_apos_expirado" });
  });

  it("código usado em um segundo pedido é sinalizado como uso duplicado (cupom não reaproveitável)", async () => {
    const { cliente, resgateId } = await reservado("cc@ex.com");
    await evt("pago", resgateId, "APX-40");
    const codigo = (await db.query(`SELECT codigo_cifrado FROM beneficio_vouchers`)).rows[0].codigo_cifrado;
    const { decrypt } = await import("@/lib/private/crypto");
    const r = await evt("pago", null, "APX-41", decrypt(s.codeKey, codigo));
    expect(r.resultado).toBe("uso_duplicado");
    const { rows } = await db.query(`SELECT tipo FROM crm_outbox WHERE tipo = 'beneficio.alerta_uso_duplicado'`);
    expect(rows).toHaveLength(1);
    expect((await panel(s, cliente)).historico.filter((h) => h.status === "confirmado")).toHaveLength(1);
  });

  it("código digitado no checkout sem reserva prévia também é consumido uma única vez", async () => {
    const { cliente } = await loginComVoucher("dd@ex.com");
    const code = (await panel(s, cliente)).vouchers[0].codigo!;
    expect(await evt("pago", null, "APX-50", code)).toMatchObject({ resultado: "confirmado", sem_reserva: true });
    expect((await panel(s, cliente)).estado.estado).toBe("utilizado");
  });

  it("evento para benefício inexistente é ignorado sem efeito", async () => {
    expect(await evt("pago", null, "APX-60", "PG15-AAAA-BBBB-CCCC")).toMatchObject({ resultado: "ignorado" });
  });
});

describe("auditoria, outbox e permissões", () => {
  it("emissão, tentativa, reserva, confirmação e cancelamento são auditados; auditoria é imutável", async () => {
    const { cliente, voucherId } = await loginComVoucher("ee@ex.com");
    await reserve(s, cliente, { voucherId, offerId: "individual", presente: false, idempotencyKey: key() }, "ip");
    const r = await reserve(s, cliente, { voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip");
    if (r.ok) await cancelReservation(s, cliente, r.resgateId, "ip");
    const { rows } = await db.query(`SELECT evento, sucesso, motivo FROM beneficio_auditoria ORDER BY id`);
    const eventos = rows.map((x) => `${x.evento}:${x.sucesso}`);
    expect(eventos).toEqual(expect.arrayContaining(["token_emitido:true", "token_ativacao:true", "voucher_emissao:true", "resgate_tentativa:false", "resgate_reserva:true", "reserva_cancelada:true"]));
    await expect(db.query(`UPDATE beneficio_auditoria SET motivo = 'x'`)).rejects.toThrow(/somente inserção/);
    await expect(db.query(`DELETE FROM beneficio_auditoria`)).rejects.toThrow(/somente inserção/);
  });

  it("outbox entrega ao CRM (notificacoes) e se recupera de falha com retentativa", async () => {
    const l = await loginComVoucher("ff@ex.com");
    const r = await reserve(s, l.cliente, { voucherId: l.voucherId, offerId: "individual", presente: true, idempotencyKey: key() }, "ip");
    if (!r.ok) throw new Error();
    await applyPaymentEvent(s, { eventId: `evt-ff-${seq}`, tipo: "pago", pedidoRef: "APX-70", resgateId: r.resgateId, codigo: null, valorPedido: 97.9 });

    await db.query(`ALTER TABLE notificacoes RENAME TO notificacoes_off`);
    try {
      const falha = (await maintenance()).outbox as { erros: number };
      expect(falha.erros).toBe(1);
      const { rows } = await db.query(`SELECT status, tentativas, ultimo_erro FROM crm_outbox WHERE tipo = 'beneficio.resgatado'`);
      expect(rows[0]).toMatchObject({ status: "erro", tentativas: 1 });
    } finally {
      await db.query(`ALTER TABLE notificacoes_off RENAME TO notificacoes`);
    }
    await db.query(`UPDATE crm_outbox SET proxima_tentativa = now()`);
    await maintenance();
    const { rows } = await db.query(`SELECT status FROM crm_outbox WHERE tipo = 'beneficio.resgatado'`);
    expect(rows[0].status).toBe("enviado");
    expect((await db.query(`SELECT titulo FROM notificacoes`)).rows[0].titulo).toBe("Benefício Private Access resgatado");
    expect((await db.query(`SELECT count(*)::int AS n FROM crm_outbox WHERE status <> 'enviado'`)).rows[0].n).toBe(0);
  });

  it("anon e authenticated não leem tabelas nem executam funções", async () => {
    const c = await db.connect();
    try {
      for (const role of ["anon", "authenticated"]) {
        await c.query(`SET ROLE ${role}`);
        await expect(c.query(`SELECT * FROM pa_tokens`)).rejects.toThrow(/permission denied/);
        await expect(c.query(`SELECT public.pa_sessao('x')`)).rejects.toThrow(/permission denied/);
        await expect(c.query(`SELECT public.beneficio_reservar(NULL,NULL,'un',1,true,'xxxxxxxxxxxxxxxxxx',NULL)`)).rejects.toThrow(/permission denied/);
        await c.query(`RESET ROLE`);
      }
    } finally {
      await c.query(`RESET ROLE`);
      c.release();
    }
  });
});

describe("consentimento de marketing", () => {
  it("opt-in opcional, revogável, com versão e hash do texto; histórico preservado", async () => {
    const { cliente } = await login("gg@ex.com");
    expect((await panel(s, cliente)).consent).toEqual({ email: false, whatsapp: false }); // nada pré-marcado
    await setConsent(s, cliente, "email", true, "ip");
    expect((await panel(s, cliente)).consent).toEqual({ email: true, whatsapp: false });
    await setConsent(s, cliente, "email", false, "ip");
    expect((await panel(s, cliente)).consent.email).toBe(false);
    const { rows } = await db.query(`SELECT concedido, texto_versao, origem, length(texto_hash) AS h FROM consentimentos ORDER BY id`);
    expect(rows).toEqual([
      { concedido: true, texto_versao: "mkt-email-2026-11", origem: "private_access", h: 64 },
      { concedido: false, texto_versao: "mkt-email-2026-11", origem: "private_access", h: 64 },
    ]);
  });

  it("descadastro pelo link do e-mail revoga todos os canais sem login", async () => {
    const { cliente } = await login("hh@ex.com");
    await setConsent(s, cliente, "email", true, "ip");
    await setConsent(s, cliente, "whatsapp", true, "ip");
    const { rows } = await db.query(`SELECT payload->>'url' AS url FROM crm_outbox WHERE tipo = 'consentimento.link_descadastro' ORDER BY id DESC LIMIT 1`);
    const t = rows[0].url.split("#u=")[1];
    expect(await unsubscribe(s, "invalido", "ip")).toEqual({ resultado: "invalido" });
    expect(await unsubscribe(s, t, "ip")).toEqual({ resultado: "ok" });
    expect((await panel(s, cliente)).consent).toEqual({ email: false, whatsapp: false });
  });
});
