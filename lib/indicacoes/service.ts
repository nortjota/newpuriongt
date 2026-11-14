// Programa de indicação PURION GT. Só servidor.
// Regras e estados vivem nas funções SQL (db/migrations/20261114_indicacoes.sql);
// aqui: geração/hash/cifra de códigos, preço pelo catálogo do servidor e
// formato das respostas. O indicador NUNCA recebe dados do indicado.
import { randomBytes } from "node:crypto";
import { getGiftCatalog, isAvailable } from "@/lib/gift/catalog";
import { CHECKOUT_PAUSED, buildCheckoutUrl } from "@/lib/content/checkout-links";
import { callFn } from "@/lib/private/db";
import { checkoutMode } from "@/lib/private/checkout-discount";
import { decrypt, encrypt, generateVoucherCode, hashIp, hmacHex, hashVoucherCode, isWellFormedToken, type Secrets } from "@/lib/private/crypto";
import type { Cliente } from "@/lib/private/service";

export const PROGRAMA = process.env.INDICACAO_PROGRAMA || "PILOTO_INDICACAO_10";
export const INVITE_PREFIX = "PGI";
export const CREDIT_PREFIX = "PGC";
export const REFERRAL_PARAM = "indicacao";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const REFERRAL_CODE_RE = /^[2-9A-HJ-NP-Z]{8}$/;

export function generateReferralCode(): string {
  return Array.from(randomBytes(8), (b) => ALPHABET[b & 31]).join("");
}

export function normalizeReferralCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const c = raw.trim().toUpperCase();
  return REFERRAL_CODE_RE.test(c) ? c : null;
}

export const hashVisitor = (s: Secrets, visitorId: string) => hmacHex(s.pepper, "visitor", visitorId);

export function referralLink(siteUrl: string, code: string) {
  return `${siteUrl.replace(/\/$/, "")}/i/${code}`;
}

// Mensagem de WhatsApp: abre o app com o texto pronto; o envio é do usuário.
export function whatsappShareUrl(link: string, desconto: number) {
  const valor = desconto.toFixed(2).replace(".", ",");
  const text = `Conheci o PURION GT, perfume automotivo premium, e lembrei de você. Com o meu convite você ganha R$ ${valor} de desconto na primeira compra: ${link}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export type ProgramaPublico = {
  ativo: boolean;
  desconto_indicado: number;
  credito_indicador: number;
  compra_minima: number;
  desconto_max_percentual: number;
  janela_atribuicao_dias: number;
  janela_validacao_dias: number;
  max_recompensas_por_indicador: number;
  validade_credito_dias: number;
  termos_versao: string;
  termos_texto: string;
};

const NUM_FIELDS = ["desconto_indicado", "credito_indicador", "compra_minima", "desconto_max_percentual"] as const;
function normProgram(p: ProgramaPublico | null): ProgramaPublico | null {
  if (!p) return null;
  const out = { ...p };
  for (const k of NUM_FIELDS) out[k] = Number(p[k]);
  return out;
}

export async function publicProgram() {
  return normProgram(await callFn<ProgramaPublico | null>("indicacao_programa_publico", { p_programa: PROGRAMA }));
}

// ── Indicador ────────────────────────────────────────────────────────────
export async function myLink(cliente: Cliente, siteUrl: string) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await callFn<{ resultado: string; codigo?: string }>("indicacao_meu_codigo", {
        p_cliente: cliente.cliente_id,
        p_programa: PROGRAMA,
        p_codigo_novo: generateReferralCode(),
      });
      return { ...r, link: r.codigo ? referralLink(siteUrl, r.codigo) : null };
    } catch (e) {
      if (!/uq_indicacao_codigos_codigo/.test(String(e))) throw e; // colisão: tenta outro
    }
  }
  throw new Error("não foi possível gerar um código único");
}

type RawPanel = {
  pode_indicar: boolean;
  codigo: string | null;
  saldo: { pendente: number; disponivel: number };
  resumo: { visitantes: number; convites: number; em_validacao: number; aprovadas: number };
  indicacoes: { status: string; data: string; recompensa: number | null; liberacao_prevista: string | null }[];
  extrato: { tipo: string; bucket: string; valor: number; data: string }[];
  creditos: { id: string; valor: number; status: string; codigo_cifrado: string; codigo_final: string; expira_em: string }[];
};

export async function panel(s: Secrets, cliente: Cliente, siteUrl: string) {
  const r = await callFn<RawPanel>("indicacao_painel", { p_cliente: cliente.cliente_id, p_programa: PROGRAMA });
  const programa = await publicProgram();
  return {
    programa,
    podeIndicar: r.pode_indicar,
    codigo: r.codigo,
    link: r.codigo ? referralLink(siteUrl, r.codigo) : null,
    whatsapp: r.codigo && programa ? whatsappShareUrl(referralLink(siteUrl, r.codigo), programa.desconto_indicado) : null,
    saldo: { pendente: Number(r.saldo.pendente), disponivel: Number(r.saldo.disponivel) },
    resumo: r.resumo,
    indicacoes: r.indicacoes.map((i) => ({ ...i, recompensa: i.recompensa === null ? null : Number(i.recompensa) })),
    extrato: r.extrato.map((e) => ({ ...e, valor: Number(e.valor) })),
    creditos: r.creditos.map(({ codigo_cifrado, ...c }) => ({
      ...c,
      valor: Number(c.valor),
      codigo: c.status === "disponivel" ? safeDecrypt(s, codigo_cifrado) : null,
    })),
    checkoutMode: checkoutMode(),
  };
}

function safeDecrypt(s: Secrets, payload: string) {
  try {
    return decrypt(s.codeKey, payload);
  } catch {
    return null;
  }
}

export async function generateCredit(s: Secrets, cliente: Cliente) {
  const code = generateVoucherCode(CREDIT_PREFIX);
  return callFn<{ resultado: string; valor?: number }>("indicacao_gerar_credito", {
    p_cliente: cliente.cliente_id,
    p_programa: PROGRAMA,
    p_codigo_hash: hashVoucherCode(s, code),
    p_codigo_cifrado: encrypt(s.codeKey, code),
    p_codigo_final: code.slice(-4),
  });
}

// ── Visitante / indicado ─────────────────────────────────────────────────
export async function registerClick(s: Secrets, code: string, visitorId: string, ip: string) {
  return callFn<{ resultado: string; clique_id?: string }>("indicacao_registrar_clique", {
    p_codigo: code,
    p_visitante_hash: hashVisitor(s, visitorId),
    p_ip_hash: hashIp(s, ip),
  });
}

export async function createInvite(s: Secrets, code: string, visitorId: string, ip: string, clienteSessao: string | null) {
  const cupom = generateVoucherCode(INVITE_PREFIX);
  return callFn<{ resultado: string; atribuicao_id?: string; mesmo_link?: boolean }>("indicacao_gerar_convite", {
    p_codigo: code,
    p_visitante_hash: hashVisitor(s, visitorId),
    p_ip_hash: hashIp(s, ip),
    p_cupom_hash: hashVoucherCode(s, cupom),
    p_cupom_cifrado: encrypt(s.codeKey, cupom),
    p_cupom_final: cupom.slice(-4),
    p_cliente_sessao: clienteSessao,
  });
}

export async function visitorInvite(s: Secrets, visitorId: string | undefined) {
  if (!visitorId || !isWellFormedToken(visitorId)) return null;
  const r = await callFn<{ atribuicao_id: string; status: string; cupom_cifrado: string; desconto: number; expira_em: string } | null>(
    "indicacao_convite_visitante",
    { p_programa: PROGRAMA, p_visitante_hash: hashVisitor(s, visitorId) }
  );
  if (!r) return null;
  return { atribuicaoId: r.atribuicao_id, status: r.status, cupom: safeDecrypt(s, r.cupom_cifrado), desconto: Number(r.desconto), expiraEm: r.expira_em };
}

// Link de checkout real com o cupom pessoal do indicado. Preço e compra
// mínima vêm do servidor; o desconto é aplicado pelo checkout (Appmax).
export async function inviteCheckout(s: Secrets, visitorId: string | undefined, offerId: unknown) {
  const invite = await visitorInvite(s, visitorId);
  if (!invite || !invite.cupom) return { ok: false as const, motivo: "sem_convite" };
  const programa = await publicProgram();
  if (!programa?.ativo) return { ok: false as const, motivo: "inativo" };
  const offer = (await getGiftCatalog()).find((o) => o.id === offerId);
  if (!offer || !isAvailable(offer)) return { ok: false as const, motivo: "oferta_indisponivel" };
  if (offer.amount < programa.compra_minima) return { ok: false as const, motivo: "compra_minima" };
  if (CHECKOUT_PAUSED || checkoutMode() !== "coupon_param") return { ok: false as const, motivo: "checkout_desligado" };
  const url = new URL(buildCheckoutUrl(offer.planId));
  url.searchParams.set(process.env.APPMAX_COUPON_PARAM!, invite.cupom);
  url.searchParams.set(REFERRAL_PARAM, invite.atribuicaoId);
  return { ok: true as const, checkoutUrl: url.toString() };
}

// ── Pagamento / rotina / admin ───────────────────────────────────────────
export function isReferralCode(code: string | null): boolean {
  return Boolean(code && /^(PGI|PGC)-/i.test(code.trim()));
}

export async function applyReferralPaymentEvent(
  s: Secrets,
  e: { eventId: string; tipo: string; pedidoRef: string; codigo: string; valorPedido: number | null }
) {
  return callFn<{ resultado: string; repetido?: boolean }>("indicacao_evento_pagamento", {
    p_event_id: e.eventId,
    p_tipo: e.tipo,
    p_pedido_ref: e.pedidoRef,
    p_codigo_hash: hashVoucherCode(s, e.codigo),
    p_valor_pedido: e.valorPedido,
  });
}

export async function processReferrals() {
  return callFn("indicacao_processar", {});
}

export async function updateProgram(campos: Record<string, unknown>, por: string) {
  return callFn<{ resultado: string }>("indicacao_programa_atualizar", { p_programa: PROGRAMA, p_campos: campos, p_por: por });
}

export async function metrics(desde: Date) {
  return callFn<Record<string, unknown>>("indicacao_metricas", { p_programa: PROGRAMA, p_desde: desde.toISOString() });
}
