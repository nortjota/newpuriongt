// Como o benefício chega ao checkout do Appmax.
//
// O checkout é hospedado pelo Appmax; o site não aplica desconto sozinho.
// Modos (env BENEFITS_CHECKOUT_MODE):
//   • "off" (padrão): o benefício é emitido, reservado e auditado, mas o botão
//     de usar no checkout fica desligado — até a operação confirmar o
//     mecanismo de cupom no Appmax.
//   • "coupon_param": o código PESSOAL do voucher (uso único no nosso banco)
//     vai no link do checkout no parâmetro APPMAX_COUPON_PARAM. Exige que o
//     Appmax aceite esse parâmetro e que cada código esteja cadastrado lá como
//     cupom de uso único (ver relatório). A confirmação vem pelo webhook.
import { buildCheckoutUrl } from "@/lib/content/checkout-links";
import type { Plan } from "@/lib/content/plans";

export type CheckoutMode = "off" | "coupon_param";

export function checkoutMode(env: NodeJS.ProcessEnv = process.env): CheckoutMode {
  return env.BENEFITS_CHECKOUT_MODE === "coupon_param" && env.APPMAX_COUPON_PARAM ? "coupon_param" : "off";
}

export const BENEFIT_REF_PARAM = "beneficio";

export function checkoutUrlWithBenefit(
  planId: Plan["id"],
  code: string,
  resgateId: string,
  env: NodeJS.ProcessEnv = process.env
): string | null {
  if (checkoutMode(env) !== "coupon_param") return null;
  const url = new URL(buildCheckoutUrl(planId));
  url.searchParams.set(env.APPMAX_COUPON_PARAM!, code);
  // Id da reserva (não é credencial: só é aceito via webhook assinado).
  url.searchParams.set(BENEFIT_REF_PARAM, resgateId);
  return url.toString();
}
