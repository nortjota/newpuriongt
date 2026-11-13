// Links de checkout (módulo puro — pode ser usado no servidor e no cliente).
// O hook React que escolhe o link do plano atual fica em ./checkout.ts.
import type { Plan } from "./plans";
import { appendTracking, type TrackingParams } from "@/lib/tracking/utm";

// Checkout real (Appmax/Nuvemshop). ID de produto confirmado pelo usuário em 2026-10-14.
// Fica como fallback pros planos que ainda não têm link próprio.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ||
  "https://pay.puriongt.com.br/checkout?product=12c09776-a3c7-11f1-a1eb-46da4690ad53";

// Links dedicados por plano, conforme confirmados pelo usuário. Plano sem
// entrada aqui cai no CHECKOUT_URL genérico acima.
export const CHECKOUT_URL_BY_PLAN: Partial<Record<Plan["id"], string>> = {
  // Kit 2 frascos — confirmado pelo usuário em 2026-11-04.
  k2: "https://pay.puriongt.com.br/checkout?product=5611c8a9-946a-11f1-a1eb-46da4690ad53",
};

// Planos cujo link de checkout foi confirmado pelo usuário como cobrando o
// produto certo. Unidade usa o link genérico (produto confirmado em
// 2026-10-14); Kit 2 tem link próprio. Kit 3 e assinatura ainda caem no link
// genérico — que cobra o produto avulso —, então NÃO contam como confirmados.
// Usado pela /presentes para não ativar uma oferta sem checkout operacional.
const CONFIRMED_CHECKOUT_PLANS: ReadonlySet<Plan["id"]> = new Set<Plan["id"]>(["un", "k2"]);

export function hasConfirmedCheckout(planId: Plan["id"]): boolean {
  return CONFIRMED_CHECKOUT_PLANS.has(planId) || Boolean(CHECKOUT_URL_BY_PLAN[planId]);
}

// O link de checkout do Appmax aponta para UM produto e não recebe
// quantidade — por isso cada pedido leva 1 unidade do plano escolhido.
// Só aumentar depois de confirmar um parâmetro de quantidade no Appmax.
export const CHECKOUT_MAX_QUANTITY = 1;

// Parâmetro com a referência da personalização de presente (PG-XXXXXXXX).
// PENDENTE: confirmar se o Appmax repassa parâmetros extras no webhook; sem
// isso, o vínculo com o pedido é feito manualmente no Despacho do CRM.
export const GIFT_REF_PARAM = "gift_ref";

// ── Pausa de vendas (estoque esgotado, 2026-11) ─────────────────────────
// Pausado, TODO botão de compra do site leva a /em-breve em vez do Appmax:
// home, carrinho, barra fixa, rodapé, kits de presente, indicações e
// benefícios. Pausado por padrão; para reabrir as vendas, definir
// NEXT_PUBLIC_CHECKOUT_PAUSED=false na Vercel (ou trocar o padrão aqui) e
// publicar de novo — a variável é lida no build.
export const CHECKOUT_PAUSED = process.env.NEXT_PUBLIC_CHECKOUT_PAUSED !== "false";
export const COMING_SOON_PATH = "/em-breve";
// Pausado, /em-breve abre na mesma aba; com o Appmax, em aba nova como antes.
export const CHECKOUT_LINK_TARGET: "_blank" | undefined = CHECKOUT_PAUSED ? undefined : "_blank";

export function baseCheckoutUrl(planId: Plan["id"]): string {
  if (CHECKOUT_PAUSED) return COMING_SOON_PATH;
  return CHECKOUT_URL_BY_PLAN[planId] ?? CHECKOUT_URL;
}

// Monta o link final: ref de afiliado + origem de campanha (UTM/gclid/fbclid)
// persistida por lib/tracking/utm.ts. Nunca sobrescreve parâmetros já
// presentes no link.
export function buildCheckoutUrl(
  planId: Plan["id"],
  { referralSlug, tracking, giftRef }: { referralSlug?: string | null; tracking?: TrackingParams; giftRef?: string | null } = {}
): string {
  // Sem parâmetros de rastreio na página "em breve": ela não é um checkout.
  if (CHECKOUT_PAUSED) return COMING_SOON_PATH;
  return appendTracking(baseCheckoutUrl(planId), {
    ref: referralSlug ?? undefined,
    ...tracking,
    [GIFT_REF_PARAM]: giftRef ?? undefined,
  });
}

