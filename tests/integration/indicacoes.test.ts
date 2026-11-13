// Integração REAL do programa de indicação: serviço → funções SQL → PostgreSQL.
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { randomToken, loadSecrets, decrypt } from "@/lib/private/crypto";
import { activateToken, issueAccessToken, sessionCliente, type Cliente } from "@/lib/private/service";
import {
  applyReferralPaymentEvent,
  createInvite,
  generateCredit,
  inviteCheckout,
  metrics,
  myLink,
  panel,
  processReferrals,
  registerClick,
  updateProgram,
  visitorInvite,
} from "@/lib/indicacoes/service";

const db = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const s = loadSecrets()!;
const SITE = "https://www.puriongt.com.br";
let seq = 0;

afterAll(() => db.end());

beforeEach(async () => {
  await db.query(`TRUNCATE pa_clientes, vendas, crm_outbox, notificacoes, beneficio_auditoria, indicacao_eventos_pagamento CASCADE`);
  await db.query(`UPDATE indicacao_programas SET ativo = true, desconto_indicado = 10, credito_indicador = 10, compra_minima = 97.90,
                  janela_validacao_dias = 14, max_recompensas_por_indicador = 10, max_convites_por_ip_dia = 5`);
});

type Venda = { email: string; doc?: string; tel?: string; cep?: string; numero?: string; status?: string; pedido?: string; valor?: number };
async function venda(v: Venda) {
  await db.query(
    `INSERT INTO vendas (cliente_email, cliente_documento, cliente_telefone, cep, numero, status, pedido_appmax, valor_total, quantidade, frascos_por_unidade)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,1,$9)`,
    [v.email, v.doc ?? null, v.tel ?? "", v.cep ?? null, v.numero ?? null, v.status ?? "aprovado", v.pedido ?? null, v.valor ?? 97.9, v.valor && v.valor > 150 ? 2 : 1]
  );
}

async function indicador(email: string, extra: Partial<Venda> = {}): Promise<{ cliente: Cliente; codigo: string }> {
  await venda({ email, ...extra });
  const t = await issueAccessToken(s, { email, primeiroNome: "Ana", origem: "teste", emitidoPor: "t" }, SITE);
  const a = await activateToken(s, t.url.split("#t=")[1], `ip-${email}`);
  const cliente = (await sessionCliente(s, a.sessionId!))!;
  const l = await myLink(cliente, SITE);
  expect(l.resultado).toBe("criado");
  return { cliente, codigo: l.codigo! };
}

async function convite(codigo: string, ip = `ip-${++seq}`) {
  const visitor = randomToken();
  await registerClick(s, codigo, visitor, ip);
  const r = await createInvite(s, codigo, visitor, ip, null);
  const inv = await visitorInvite(s, visitor);
  return { visitor, r, cupom: inv?.cupom ?? null, atribuicaoId: inv?.atribuicaoId };
}

const pago = (cupom: string, pedido: string, valor = 97.9) =>
  applyReferralPaymentEvent(s, { eventId: `evt-${pedido}-${++seq}`, tipo: "pago", pedidoRef: pedido, codigo: cupom, valorPedido: valor });
const evento = (tipo: string, cupom: string, pedido: string) =>
  applyReferralPaymentEvent(s, { eventId: `evt-${tipo}-${pedido}-${++seq}`, tipo, pedidoRef: pedido, codigo: cupom, valorPedido: 97.9 });

async function compraQualificada(codigo: string, amigo: Venda & { pedido: string }) {
  const c = await convite(codigo);
  await venda(amigo);
  const r = await pago(c.cupom!, amigo.pedido, amigo.valor);
  return { ...c, r };
}

const saldo = async (cliente: Cliente) => (await panel(s, cliente, SITE)).saldo;
const outboxTipos = async () => (await db.query(`SELECT tipo FROM crm_outbox ORDER BY id`)).rows.map((r) => r.tipo);

describe("link do indicador", () => {
  it("só quem tem compra paga gera link; código único, aleatório e sem dado pessoal", async () => {
    const { cliente, codigo } = await indicador("ana@ex.com");
    expect(codigo).toMatch(/^[2-9A-HJ-NP-Z]{8}$/);
    expect((await myLink(cliente, SITE)).resultado).toBe("existente");
    const t = await issueAccessToken(s, { email: "sem@ex.com", origem: "teste", emitidoPor: "t" }, SITE);
    const sem = (await sessionCliente(s, (await activateToken(s, t.url.split("#t=")[1], "x")).sessionId!))!;
    expect((await myLink(sem, SITE)).resultado).toBe("nao_elegivel");
    expect(await outboxTipos()).toContain("referral_link_created");
  });

  it("programa inativo não gera link nem convite", async () => {
    const { codigo } = await indicador("bia@ex.com");
    await db.query(`UPDATE indicacao_programas SET ativo = false`);
    expect((await convite(codigo)).r.resultado).toBe("inativo");
  });

  it("criação concorrente do link gera um só código", async () => {
    await venda({ email: "conc@ex.com" });
    const t = await issueAccessToken(s, { email: "conc@ex.com", origem: "teste", emitidoPor: "t" }, SITE);
    const cliente = (await sessionCliente(s, (await activateToken(s, t.url.split("#t=")[1], "y")).sessionId!))!;
    const rs = await Promise.all(Array.from({ length: 10 }, () => myLink(cliente, SITE)));
    expect(new Set(rs.map((r) => r.codigo)).size).toBe(1);
    expect(rs.filter((r) => r.resultado === "criado")).toHaveLength(1);
  });
});

describe("clique e atribuição", () => {
  it("vários cliques do mesmo visitante contam uma vez; muitos do mesmo IP não contam", async () => {
    const { codigo, cliente } = await indicador("cris@ex.com");
    const v = randomToken();
    expect((await registerClick(s, codigo, v, "1.1.1.1")).resultado).toBe("registrado");
    expect((await registerClick(s, codigo, v, "1.1.1.1")).resultado).toBe("repetido");
    for (let i = 0; i < 30; i++) await registerClick(s, codigo, randomToken(), "6.6.6.6");
    expect((await registerClick(s, codigo, randomToken(), "6.6.6.6")).resultado).toBe("limitado");
    expect((await panel(s, cliente, SITE)).resumo.visitantes).toBe(31);
    expect((await registerClick(s, "ZZZZZZZZ", v, "1.1.1.1")).resultado).toBe("invalido");
  });

  it("primeiro convite vence: outro link não troca a atribuição; concorrência gera 1 convite", async () => {
    const a = await indicador("dani@ex.com");
    const b = await indicador("edu@ex.com");
    const v = randomToken();
    const rs = await Promise.all(Array.from({ length: 10 }, () => createInvite(s, a.codigo, v, "2.2.2.2", null)));
    expect(rs.filter((r) => r.resultado === "criado")).toHaveLength(1);
    const outro = await createInvite(s, b.codigo, v, "2.2.2.2", null);
    expect(outro).toMatchObject({ resultado: "existente", mesmo_link: false });
    const { rows } = await db.query(`SELECT count(*)::int AS n FROM indicacao_atribuicoes`);
    expect(rows[0].n).toBe(1);
  });

  it("autoindicação pela própria sessão é bloqueada; limite de convites por IP", async () => {
    const a = await indicador("fabi@ex.com");
    expect((await createInvite(s, a.codigo, randomToken(), "3.3.3.3", a.cliente.cliente_id)).resultado).toBe("autoindicacao");
    for (let i = 0; i < 5; i++) expect((await createInvite(s, a.codigo, randomToken(), "4.4.4.4", null)).resultado).toBe("criado");
    expect((await createInvite(s, a.codigo, randomToken(), "4.4.4.4", null)).resultado).toBe("limite");
  });

  it("checkout real do indicado: cupom pessoal + atribuição no link, preço do servidor", async () => {
    const a = await indicador("gabi@ex.com");
    const c = await convite(a.codigo);
    expect(c.cupom).toMatch(/^PGI-/);
    const r = await inviteCheckout(s, c.visitor, "duo");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const u = new URL(r.checkoutUrl);
    expect(u.hostname).toBe("pay.puriongt.com.br");
    expect(u.searchParams.get("coupon")).toBe(c.cupom);
    expect(u.searchParams.get("indicacao")).toBe(c.atribuicaoId);
    expect(await inviteCheckout(s, c.visitor, "trio")).toEqual({ ok: false, motivo: "oferta_indisponivel" });
    expect(await inviteCheckout(s, randomToken(), "duo")).toEqual({ ok: false, motivo: "sem_convite" });
  });
});

describe("qualificação da compra (antifraude)", () => {
  it("primeira compra paga qualifica: recompensa PENDENTE + eventos para o CRM", async () => {
    const a = await indicador("hugo@ex.com");
    const q = await compraQualificada(a.codigo, { email: "amigo1@ex.com", pedido: "P-1" });
    expect(q.r.resultado).toBe("qualificada");
    expect(await saldo(a.cliente)).toEqual({ pendente: 10, disponivel: 0 });
    expect(await outboxTipos()).toEqual(expect.arrayContaining(["referral_clicked", "referral_attributed", "referral_purchase_qualified", "referral_reward_pending"]));
  });

  it.each([
    ["mesmo e-mail", { email: "ivo@ex.com" }],
    ["mesmo CPF", { email: "outro1@ex.com", doc: "123.456.789-00" }],
    ["mesmo telefone", { email: "outro2@ex.com", tel: "(61) 99999-1234" }],
    ["mesmo endereço", { email: "outro3@ex.com", cep: "70000-000", numero: " 12 " }],
  ])("autoindicação (%s) não gera recompensa", async (_, amigo) => {
    const a = await indicador("ivo@ex.com", { doc: "12345678900", tel: "61999991234", cep: "70000000", numero: "12" });
    const q = await compraQualificada(a.codigo, { ...amigo, pedido: `P-auto-${++seq}` } as Venda & { pedido: string });
    expect(q.r.resultado).toBe("nao_qualificada");
    expect(await saldo(a.cliente)).toEqual({ pendente: 0, disponivel: 0 });
    expect(await outboxTipos()).toContain("referral_fraud_suspected");
  });

  it("comprador que já era cliente não qualifica", async () => {
    const a = await indicador("joao@ex.com");
    await venda({ email: "antigo@ex.com", pedido: "P-velho" });
    const q = await compraQualificada(a.codigo, { email: "antigo@ex.com", pedido: "P-2" });
    expect(q.r.resultado).toBe("nao_qualificada");
  });

  it("compra abaixo do mínimo não qualifica", async () => {
    await db.query(`UPDATE indicacao_programas SET compra_minima = 150`);
    const a = await indicador("kai@ex.com");
    const q = await compraQualificada(a.codigo, { email: "amigo2@ex.com", pedido: "P-3", valor: 97.9 });
    expect(q.r.resultado).toBe("nao_qualificada");
  });

  it("mesmo comprador por dois indicadores: só a primeira indicação conta", async () => {
    const a = await indicador("leo@ex.com");
    const b = await indicador("mia@ex.com");
    expect((await compraQualificada(a.codigo, { email: "disputado@ex.com", pedido: "P-4" })).r.resultado).toBe("qualificada");
    // O mesmo comprador volta com outro convite: não é mais primeira compra.
    expect((await compraQualificada(b.codigo, { email: "disputado@ex.com", pedido: "P-5" })).r.resultado).toBe("nao_qualificada");
    expect((await saldo(b.cliente)).pendente).toBe(0);
  });

  it("limite de recompensas por indicador", async () => {
    await db.query(`UPDATE indicacao_programas SET max_recompensas_por_indicador = 2`);
    const a = await indicador("nina@ex.com");
    for (let i = 0; i < 3; i++) await compraQualificada(a.codigo, { email: `lim${i}@ex.com`, pedido: `P-lim-${i}` });
    expect((await saldo(a.cliente)).pendente).toBe(20);
  });

  it("cupom do indicado reutilizado em outro pedido é sinalizado e não paga de novo", async () => {
    const a = await indicador("otto@ex.com");
    const q = await compraQualificada(a.codigo, { email: "amigo3@ex.com", pedido: "P-6" });
    await venda({ email: "terceiro@ex.com", pedido: "P-7" });
    expect((await pago(q.cupom!, "P-7")).resultado).toBe("uso_duplicado");
    expect((await saldo(a.cliente)).pendente).toBe(10);
  });

  it("evento de pagamento repetido (inclusive concorrente) lança o ledger uma única vez", async () => {
    const a = await indicador("pia@ex.com");
    const c = await convite(a.codigo);
    await venda({ email: "amigo4@ex.com", pedido: "P-8" });
    const e = { eventId: "evt-unico-P-8", tipo: "pago", pedidoRef: "P-8", codigo: c.cupom!, valorPedido: 97.9 };
    const rs = await Promise.all(Array.from({ length: 8 }, () => applyReferralPaymentEvent(s, e)));
    expect(rs.filter((r) => r.resultado === "qualificada")).toHaveLength(8);
    expect(rs.filter((r) => r.repetido)).toHaveLength(7);
    const { rows } = await db.query(`SELECT count(*)::int AS n FROM indicacao_ledger WHERE tipo = 'pendente'`);
    expect(rows[0].n).toBe(1);
  });

  it("pedido que chega ao banco depois do evento é qualificado pela rotina", async () => {
    const a = await indicador("rui@ex.com");
    const c = await convite(a.codigo);
    expect((await pago(c.cupom!, "P-9")).resultado).toBe("aguardando_pedido");
    await venda({ email: "amigo5@ex.com", pedido: "P-9" });
    await processReferrals();
    expect((await saldo(a.cliente)).pendente).toBe(10);
  });

  it("pagamento falho devolve o convite; a mesma pessoa pode tentar de novo", async () => {
    const a = await indicador("sara@ex.com");
    const c = await convite(a.codigo);
    expect((await evento("falhou", c.cupom!, "P-10")).resultado).toBe("convite_liberado");
    await venda({ email: "amigo6@ex.com", pedido: "P-11" });
    expect((await pago(c.cupom!, "P-11")).resultado).toBe("qualificada");
  });
});

describe("validação, aprovação e reversão (ledger)", () => {
  async function vencerJanela() {
    await db.query(`UPDATE indicacao_atribuicoes SET validar_apos = now() - interval '1 second' WHERE status = 'qualificada'`);
  }

  it("após a janela de validação, recompensa vai de pendente para disponível", async () => {
    const a = await indicador("tito@ex.com");
    await compraQualificada(a.codigo, { email: "amigo7@ex.com", pedido: "P-12" });
    expect(await processReferrals()).toMatchObject({ aprovadas: 0 }); // ainda na janela
    await vencerJanela();
    expect(await processReferrals()).toMatchObject({ aprovadas: 1 });
    expect(await saldo(a.cliente)).toEqual({ pendente: 0, disponivel: 10 });
    expect(await processReferrals()).toMatchObject({ aprovadas: 0 }); // idempotente
    expect(await outboxTipos()).toContain("referral_reward_approved");
  });

  it("estorno dentro da janela reverte a recompensa pendente", async () => {
    const a = await indicador("ugo@ex.com");
    const q = await compraQualificada(a.codigo, { email: "amigo8@ex.com", pedido: "P-13" });
    expect((await evento("estornado", q.cupom!, "P-13")).resultado).toBe("revertida");
    expect(await saldo(a.cliente)).toEqual({ pendente: 0, disponivel: 0 });
    expect(await outboxTipos()).toContain("referral_reward_reversed");
  });

  it("chargeback após aprovação debita o disponível (ledger negativo, auditável)", async () => {
    const a = await indicador("vera@ex.com");
    const q = await compraQualificada(a.codigo, { email: "amigo9@ex.com", pedido: "P-14" });
    await vencerJanela();
    await processReferrals();
    await evento("chargeback", q.cupom!, "P-14");
    expect(await saldo(a.cliente)).toEqual({ pendente: 0, disponivel: 0 });
    const { rows } = await db.query(`SELECT tipo, bucket, valor::float FROM indicacao_ledger ORDER BY id`);
    expect(rows.map((r) => `${r.tipo}:${r.bucket}:${r.valor}`)).toEqual([
      "pendente:pendente:10",
      "aprovacao_saida:pendente:-10",
      "aprovacao_entrada:disponivel:10",
      "reversao_aprovada:disponivel:-10",
    ]);
  });

  it("pedido devolvido no CRM antes da janela acabar é revertido na validação", async () => {
    const a = await indicador("wil@ex.com");
    await compraQualificada(a.codigo, { email: "amigo10@ex.com", pedido: "P-15" });
    await db.query(`UPDATE vendas SET status = 'reembolsado' WHERE pedido_appmax = 'P-15'`);
    await vencerJanela();
    expect(await processReferrals()).toMatchObject({ revertidas: 1, aprovadas: 0 });
    expect(await saldo(a.cliente)).toEqual({ pendente: 0, disponivel: 0 });
  });

  it("ledger é imutável", async () => {
    const a = await indicador("xan@ex.com");
    await compraQualificada(a.codigo, { email: "amigo11@ex.com", pedido: "P-16" });
    await expect(db.query(`UPDATE indicacao_ledger SET valor = 999`)).rejects.toThrow(/somente inserção/);
    await expect(db.query(`DELETE FROM indicacao_ledger`)).rejects.toThrow(/somente inserção/);
  });
});

describe("crédito do indicador", () => {
  it("vira código de uso único (não vira dinheiro), debita o saldo e volta se expirar", async () => {
    const a = await indicador("yan@ex.com");
    await compraQualificada(a.codigo, { email: "amigo12@ex.com", pedido: "P-17" });
    await db.query(`UPDATE indicacao_atribuicoes SET validar_apos = now() - interval '1 second'`);
    await processReferrals();
    expect(await generateCredit(s, a.cliente)).toMatchObject({ resultado: "criado" });
    expect(await generateCredit(s, a.cliente)).toMatchObject({ resultado: "ja_existe" });
    const p = await panel(s, a.cliente, SITE);
    expect(p.saldo.disponivel).toBe(0);
    expect(p.creditos[0]).toMatchObject({ valor: 10, status: "disponivel" });
    expect(p.creditos[0].codigo).toMatch(/^PGC-/);
    await db.query(`UPDATE indicacao_creditos SET expira_em = now() - interval '1 second'`);
    await processReferrals();
    expect((await saldo(a.cliente)).disponivel).toBe(10);
  });

  it("código de crédito pago é consumido; reuso em outro pedido é alerta", async () => {
    const a = await indicador("zoe@ex.com");
    await compraQualificada(a.codigo, { email: "amigo13@ex.com", pedido: "P-18" });
    await db.query(`UPDATE indicacao_atribuicoes SET validar_apos = now() - interval '1 second'`);
    await processReferrals();
    await generateCredit(s, a.cliente);
    const code = (await panel(s, a.cliente, SITE)).creditos[0].codigo!;
    expect((await pago(code, "P-19")).resultado).toBe("credito_utilizado");
    expect((await pago(code, "P-20")).resultado).toBe("uso_duplicado");
    expect(await generateCredit(s, a.cliente)).toMatchObject({ resultado: "sem_saldo" });
  });
});

describe("privacidade, admin e mensuração", () => {
  it("o painel do indicador não expõe nenhum dado do indicado", async () => {
    const a = await indicador("ana2@ex.com");
    await compraQualificada(a.codigo, { email: "segredo@amigo.com", doc: "98765432100", tel: "11988887777", pedido: "P-SEG", valor: 176.22 });
    await compraQualificada(a.codigo, { email: "ana2@ex.com", pedido: "P-AUTO" });
    const json = JSON.stringify(await panel(s, a.cliente, SITE));
    for (const proibido of ["segredo", "amigo.com", "98765432100", "88887777", "P-SEG", "176.22", "autoindicacao", "nao_primeira_compra"]) {
      expect(json).not.toContain(proibido);
    }
    const p = await panel(s, a.cliente, SITE);
    expect(p.indicacoes.map((i) => i.status).sort()).toEqual(["em_validacao", "nao_elegivel"]);
  });

  it("admin ajusta valores com nova versão de termos; rejeita campo e valor inválidos", async () => {
    expect(await updateProgram({ credito_indicador: 15 }, "t")).toMatchObject({ resultado: "termos_versao_obrigatoria" });
    expect(await updateProgram({ credito_indicador: 15, termos_versao: "v2" }, "t")).toMatchObject({ resultado: "ok" });
    expect(await updateProgram({ credito_indicador: -1, termos_versao: "v3" }, "t")).toMatchObject({ resultado: "valor_invalido" });
    expect(await updateProgram({ tenant_id: "x" }, "t")).toMatchObject({ resultado: "campo_invalido" });
    expect(await updateProgram({ max_recompensas_por_indicador: 3 }, "t")).toMatchObject({ resultado: "ok" });
    const { rows } = await db.query(`SELECT credito_indicador::float, max_recompensas_por_indicador, termos_versao FROM indicacao_programas`);
    expect(rows[0]).toEqual({ credito_indicador: 15, max_recompensas_por_indicador: 3, termos_versao: "v2" });
    // Atribuições antigas mantêm o valor da época (congelado na atribuição).
  });

  it("métricas: visitantes, compradores novos, receita, descontos, margem e CAC", async () => {
    const a = await indicador("met@ex.com");
    await compraQualificada(a.codigo, { email: "m1@ex.com", pedido: "M-1", valor: 97.9 });
    await compraQualificada(a.codigo, { email: "m2@ex.com", pedido: "M-2", valor: 176.22 });
    await compraQualificada(a.codigo, { email: "met@ex.com", pedido: "M-3" }); // autoindicação
    const m = (await metrics(new Date(Date.now() - 86_400_000))) as Record<string, number>;
    expect(m).toMatchObject({ visitantes: 3, convites: 3, compradores_novos: 2, nao_qualificadas: 1 });
    expect(Number(m.receita_atribuida)).toBeCloseTo(274.12, 2);
    expect(Number(m.descontos_concedidos)).toBe(30); // 3 cupons usados
    expect(Number(m.creditos_pendentes)).toBe(20);
    expect(Number(m.custo_produto_estimado)).toBe(90); // 1 + 2 frascos
    expect(Number(m.margem_contribuicao)).toBeCloseTo(274.12 - 90 - 20, 2);
    expect(Number(m.custo_aquisicao_por_cliente)).toBe(25); // (30 + 20) / 2
  });

  it("anon/authenticated não executam as funções do programa", async () => {
    const c = await db.connect();
    try {
      await c.query(`SET ROLE anon`);
      await expect(c.query(`SELECT public.indicacao_programa_publico('PILOTO_INDICACAO_10')`)).rejects.toThrow(/permission denied/);
      await expect(c.query(`SELECT * FROM indicacao_ledger`)).rejects.toThrow(/permission denied/);
    } finally {
      await c.query(`RESET ROLE`);
      c.release();
    }
  });

  it("cupom do indicado fica cifrado no banco", async () => {
    const a = await indicador("cif@ex.com");
    const c = await convite(a.codigo);
    const { rows } = await db.query(`SELECT cupom_cifrado FROM indicacao_atribuicoes`);
    expect(rows[0].cupom_cifrado).not.toContain(c.cupom);
    expect(decrypt(s.codeKey, rows[0].cupom_cifrado)).toBe(c.cupom);
  });
});
