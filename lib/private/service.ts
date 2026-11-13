// Serviço do PURION PRIVATE ACCESS / benefícios. Só servidor.
// Toda regra de estado está nas funções SQL (transacionais); aqui ficam a
// geração/hash de segredos, a resolução de preço pelo catálogo do servidor e
// o formato das respostas para o navegador.
import QRCode from "qrcode";
import { getGiftCatalog, isAvailable } from "@/lib/gift/catalog";
import { callFn } from "./db";
import {
  decrypt,
  encrypt,
  generateVoucherCode,
  hashIp,
  hashSession,
  hashToken,
  hashUnsubscribe,
  hashVoucherCode,
  isWellFormedToken,
  randomToken,
  type Secrets,
} from "./crypto";
import { checkoutMode, checkoutUrlWithBenefit } from "./checkout-discount";
import { consentRecord, type ConsentChannel } from "./consent";

export const SESSION_DAYS = 30;
export const ACCESS_TOKEN_DAYS = 90;
export const PILOT_POLICY = "PILOTO_PRESENTE_15";

export type Cliente = { cliente_id: string; primeiro_nome: string | null; email_norm: string };

export type Policy = {
  codigo: string;
  nome: string;
  descricao: string;
  valor: number;
  compra_minima: number;
  desconto_max_percentual: number;
  validade_dias: number;
  cumulativo: boolean;
  somente_presente: boolean;
  planos_permitidos: string[];
  termos_versao: string;
  termos_texto: string;
  elegibilidade?: string;
};

type RawVoucher = {
  id: string;
  politica: string;
  status: "disponivel" | "reservado" | "resgatado" | "expirado" | "cancelado";
  valor: number;
  codigo_cifrado: string;
  codigo_final: string;
  emitido_em: string;
  expira_em: string;
  reserva: { id: string; plano: string; valor_desconto: number; expira_em: string } | null;
};

export type Voucher = Omit<RawVoucher, "codigo_cifrado" | "reserva"> & {
  codigo: string | null;
  reserva: (NonNullable<RawVoucher["reserva"]> & { checkoutUrl: string | null }) | null;
};

export type HistoryItem = {
  id: string;
  status: string;
  plano: string;
  valor_desconto: number;
  valor_pedido: number;
  reservado_em: string;
  confirmado_em: string | null;
  encerrado_em: string | null;
  motivo: string | null;
};

export type BenefitState = "sem_beneficio_ativo" | "pode_ativar" | "disponivel" | "reservado" | "utilizado" | "expirado" | "cancelado" | "nao_elegivel";

const num = (v: unknown) => Number(v);

function normalizePolicy(p: Policy): Policy {
  return { ...p, valor: num(p.valor), compra_minima: num(p.compra_minima), desconto_max_percentual: num(p.desconto_max_percentual) };
}

export async function publicPolicies(): Promise<Policy[]> {
  const rows = await callFn<Policy[]>("beneficio_politicas_publicas", {});
  return (rows ?? []).map(normalizePolicy);
}

// ── Acesso ───────────────────────────────────────────────────────────────
export async function issueAccessToken(
  s: Secrets,
  input: { email: string; documento?: string | null; primeiroNome?: string | null; origem: string; validadeDias?: number; emitidoPor: string },
  siteUrl: string
) {
  const token = randomToken();
  const res = await callFn<{ cliente_id: string; token_id: string }>("pa_emitir_token", {
    p_email: input.email,
    p_documento: input.documento ?? null,
    p_primeiro_nome: input.primeiroNome ?? null,
    p_token_hash: hashToken(s, token),
    p_origem: input.origem,
    p_validade_dias: input.validadeDias ?? ACCESS_TOKEN_DAYS,
    p_emitido_por: input.emitidoPor,
  });
  // Token no FRAGMENTO (#): não vai para logs de servidor nem para Referer.
  // O QR aponta só para este link — nenhum dado pessoal.
  const url = `${siteUrl.replace(/\/$/, "")}/private-access#t=${token}`;
  const qrSvg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
  return { ...res, url, qrSvg };
}

export type ActivationResult = "ok" | "invalido" | "expirado" | "utilizado" | "revogado" | "bloqueado";

export async function activateToken(s: Secrets, token: unknown, ip: string): Promise<{ resultado: ActivationResult; sessionId?: string }> {
  const ipHash = hashIp(s, ip);
  if (!isWellFormedToken(token)) {
    // Formato inválido também conta como tentativa (anti força bruta).
    const r = await callFn<{ resultado: ActivationResult }>("pa_ativar_token", {
      p_token_hash: "0".repeat(64),
      p_sessao_hash: hashSession(s, randomToken()),
      p_sessao_dias: SESSION_DAYS,
      p_ip_hash: ipHash,
    });
    return { resultado: r.resultado === "bloqueado" ? "bloqueado" : "invalido" };
  }
  const sessionId = randomToken();
  const r = await callFn<{ resultado: ActivationResult }>("pa_ativar_token", {
    p_token_hash: hashToken(s, token),
    p_sessao_hash: hashSession(s, sessionId),
    p_sessao_dias: SESSION_DAYS,
    p_ip_hash: ipHash,
  });
  return r.resultado === "ok" ? { resultado: "ok", sessionId } : { resultado: r.resultado };
}

export async function sessionCliente(s: Secrets, sessionId: string | undefined | null): Promise<Cliente | null> {
  if (!sessionId || !isWellFormedToken(sessionId)) return null;
  return (await callFn<Cliente | null>("pa_sessao", { p_sessao_hash: hashSession(s, sessionId) })) ?? null;
}

export async function endSession(s: Secrets, sessionId: string) {
  if (isWellFormedToken(sessionId)) await callFn("pa_encerrar_sessao", { p_sessao_hash: hashSession(s, sessionId) });
}

// ── Painel do cliente ────────────────────────────────────────────────────
export async function panel(s: Secrets, cliente: Cliente) {
  const raw = await callFn<{ politicas: Policy[]; vouchers: RawVoucher[]; historico: HistoryItem[] }>("beneficio_painel", {
    p_cliente: cliente.cliente_id,
  });
  const vouchers: Voucher[] = raw.vouchers.map(({ codigo_cifrado, ...v }) => {
    let codigo: string | null = null;
    // O código só é exibido enquanto puder ser usado.
    if (v.status === "disponivel" || v.status === "reservado") {
      try {
        codigo = decrypt(s.codeKey, codigo_cifrado);
      } catch {
        codigo = null;
      }
    }
    const reserva = v.reserva
      ? {
          ...v.reserva,
          valor_desconto: num(v.reserva.valor_desconto),
          checkoutUrl: codigo ? checkoutUrlWithBenefit(v.reserva.plano as "un" | "k2" | "k3", codigo, v.reserva.id) : null,
        }
      : null;
    return { ...v, valor: num(v.valor), codigo, reserva };
  });
  const historico = raw.historico.map((h) => ({ ...h, valor_desconto: num(h.valor_desconto), valor_pedido: num(h.valor_pedido) }));
  const politicas = raw.politicas.map(normalizePolicy);
  const consent = await callFn<Record<string, boolean>>("consentimento_vigente_cliente", { p_email: cliente.email_norm });
  return {
    cliente: { primeiroNome: cliente.primeiro_nome },
    politicas,
    vouchers,
    historico,
    estado: benefitState(politicas, vouchers),
    checkoutMode: checkoutMode(),
    consent: { email: consent?.email === true, whatsapp: consent?.whatsapp === true },
  };
}

export function benefitState(politicas: Policy[], vouchers: Pick<Voucher, "politica" | "status">[], codigo = PILOT_POLICY): { estado: BenefitState; motivo?: string } {
  const pol = politicas.find((p) => p.codigo === codigo) ?? politicas[0];
  if (!pol) return { estado: "sem_beneficio_ativo" };
  const v = vouchers.find((x) => x.politica === pol.codigo);
  if (v) {
    const map: Record<Voucher["status"], BenefitState> = {
      disponivel: "disponivel",
      reservado: "reservado",
      resgatado: "utilizado",
      expirado: "expirado",
      cancelado: "cancelado",
    };
    return { estado: map[v.status] };
  }
  return pol.elegibilidade === "elegivel" ? { estado: "pode_ativar" } : { estado: "nao_elegivel", motivo: pol.elegibilidade };
}

export async function issueVoucher(s: Secrets, cliente: Cliente, politica: string, ip: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateVoucherCode();
    try {
      return await callFn<{ resultado: string; motivo?: string; voucher_id?: string }>("beneficio_emitir_voucher", {
        p_cliente: cliente.cliente_id,
        p_politica_codigo: politica,
        p_codigo_hash: hashVoucherCode(s, code),
        p_codigo_cifrado: encrypt(s.codeKey, code),
        p_codigo_final: code.slice(-4),
        p_ip_hash: hashIp(s, ip),
      });
    } catch (e) {
      // Colisão de código (2^-60): tenta outro.
      if (!/uq_beneficio_vouchers_codigo/.test(String(e))) throw e;
    }
  }
  throw new Error("não foi possível gerar um código único");
}

export type ReserveOutcome =
  | { ok: true; resgateId: string; desconto: number; expiraEm: string; checkoutUrl: string | null; repetido: boolean }
  | { ok: false; motivo: string };

export async function reserve(
  s: Secrets,
  cliente: Cliente,
  input: { voucherId: string; offerId: string; presente: boolean; idempotencyKey: string },
  ip: string
): Promise<ReserveOutcome> {
  // Preço SEMPRE do catálogo do servidor (o mesmo que o checkout cobra).
  const offer = (await getGiftCatalog()).find((o) => o.id === input.offerId);
  if (!offer || !isAvailable(offer)) return { ok: false, motivo: "oferta_indisponivel" };
  const r = await callFn<{ resultado: string; resgate_id?: string; valor_desconto?: number; reserva_expira_em?: string; repetido?: boolean }>(
    "beneficio_reservar",
    {
      p_cliente: cliente.cliente_id,
      p_voucher: input.voucherId,
      p_plano: offer.planId,
      p_valor_pedido: offer.amount,
      p_presente: input.presente,
      p_idempotency_key: input.idempotencyKey,
      p_ip_hash: hashIp(s, ip),
    }
  );
  if (r.resultado !== "reservado" || !r.resgate_id) return { ok: false, motivo: r.resultado };
  const v = (await panel(s, cliente)).vouchers.find((x) => x.id === input.voucherId);
  const checkoutUrl = v?.codigo ? checkoutUrlWithBenefit(offer.planId, v.codigo, r.resgate_id) : null;
  return {
    ok: true,
    resgateId: r.resgate_id,
    desconto: num(r.valor_desconto),
    expiraEm: r.reserva_expira_em!,
    checkoutUrl,
    repetido: Boolean(r.repetido),
  };
}

export async function cancelReservation(s: Secrets, cliente: Cliente, resgateId: string, ip: string) {
  return callFn<{ resultado: string }>("beneficio_cancelar_reserva", { p_cliente: cliente.cliente_id, p_resgate: resgateId, p_ip_hash: hashIp(s, ip) });
}

// ── Pagamento (webhook assinado) ─────────────────────────────────────────
export const PAYMENT_EVENT_TYPES = ["pago", "falhou", "cancelado", "estornado", "chargeback"] as const;
export type PaymentEventType = (typeof PAYMENT_EVENT_TYPES)[number];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parsePaymentEvent(body: unknown):
  | { ok: true; value: { eventId: string; tipo: PaymentEventType; pedidoRef: string; resgateId: string | null; codigo: string | null; valorPedido: number | null } }
  | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const b = body as Record<string, unknown>;
  const eventId = typeof b.event_id === "string" && /^[\w:.-]{6,100}$/.test(b.event_id) ? b.event_id : null;
  const tipo = PAYMENT_EVENT_TYPES.find((t) => t === b.tipo);
  const pedidoRef = typeof b.pedido_ref === "string" && b.pedido_ref.length <= 80 ? b.pedido_ref : null;
  const resgateId = typeof b.resgate_id === "string" && UUID.test(b.resgate_id) ? b.resgate_id : null;
  const codigo = typeof b.codigo === "string" && b.codigo.length <= 40 ? b.codigo : null;
  const valorPedido = typeof b.valor_pedido === "number" && Number.isFinite(b.valor_pedido) && b.valor_pedido >= 0 ? b.valor_pedido : null;
  if (!eventId || !tipo || !pedidoRef || (!resgateId && !codigo)) return { ok: false };
  return { ok: true, value: { eventId, tipo, pedidoRef, resgateId, codigo, valorPedido } };
}

export async function applyPaymentEvent(s: Secrets, e: Extract<ReturnType<typeof parsePaymentEvent>, { ok: true }>["value"]) {
  return callFn<{ resultado: string; repetido?: boolean }>("beneficio_evento_pagamento", {
    p_event_id: e.eventId,
    p_tipo: e.tipo,
    p_pedido_ref: e.pedidoRef,
    p_resgate: e.resgateId,
    p_codigo_hash: e.codigo ? hashVoucherCode(s, e.codigo) : null,
    p_valor_pedido: e.valorPedido,
  });
}

// ── Consentimento ────────────────────────────────────────────────────────
export async function setConsent(s: Secrets, cliente: Cliente, canal: ConsentChannel, concedido: boolean, ip: string) {
  const rec = consentRecord(canal);
  const unsubscribe = concedido ? randomToken() : null;
  await callFn("consentimento_registrar", {
    p_email: cliente.email_norm,
    p_cliente: cliente.cliente_id,
    p_canal: canal,
    p_concedido: concedido,
    p_origem: "private_access",
    p_texto_versao: rec.versao,
    p_texto_hash: rec.hash,
    p_ip_hash: hashIp(s, ip),
    p_descadastro_hash: unsubscribe ? hashUnsubscribe(s, unsubscribe) : null,
  });
  // O link de descadastro vai para o CRM pela outbox (é ele quem envia os
  // e-mails de marketing). Só permite descadastrar — risco baixo por design.
  if (unsubscribe) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puriongt.com.br";
    await callFn("pa__outbox", {
      p_tipo: "consentimento.link_descadastro",
      p_agregado: cliente.cliente_id,
      p_payload: { canal, url: `${site}/private-access/descadastro#u=${unsubscribe}` },
      p_chave: `descadastro:${hashUnsubscribe(s, unsubscribe)}`,
    });
  }
  return { ok: true };
}

export async function unsubscribe(s: Secrets, token: unknown, ip: string) {
  if (!isWellFormedToken(token)) return { resultado: "invalido" };
  return callFn<{ resultado: string }>("consentimento_descadastrar", { p_token_hash: hashUnsubscribe(s, token), p_ip_hash: hashIp(s, ip) });
}

export async function maintenance() {
  const a = await callFn("beneficio_manutencao", {});
  // Programa de indicação: aprova recompensas após a janela de validação,
  // reprocessa pedidos que chegaram depois do evento e expira convites/créditos.
  const i = await callFn("indicacao_processar", {});
  const b = await callFn("crm_outbox_processar", { p_limite: 200 });
  return { manutencao: a, indicacoes: i, outbox: b };
}
