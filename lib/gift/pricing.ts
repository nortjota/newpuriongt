// Resumo de preço da PURION GIFT — função pura, usada no servidor (fonte de
// verdade) e no cliente (só para pré-visualização).
//
// Regras:
//  • preço do kit = preço do plano real (lib/content/plans.ts), o mesmo que o
//    link de checkout cobra;
//  • desconto exibido = diferença entre N frascos avulsos e o kit — é o ÚNICO
//    desconto aplicado aqui (nada de somar cupom ou outro desconto por cima);
//  • frete NÃO é calculado no site: é definido no checkout pelo CEP.
import { PLAN_AMOUNT } from "@/lib/content/plans";

export type PriceSummary = {
  quantity: number;
  units: number; // frascos por kit
  totalBottles: number;
  listPrice: number; // frascos avulsos
  kitPrice: number; // kit × quantidade
  discount: number; // só o desconto do kit
  shipping: null; // calculado no checkout
  total: number; // sem frete
};

const round2 = (v: number) => Math.round(v * 100) / 100;

export function computeSummary({ amount, units }: { amount: number; units: number }, quantity: number): PriceSummary {
  if (!Number.isInteger(quantity) || quantity < 1) throw new RangeError("quantidade inválida");
  const unitPrice = PLAN_AMOUNT.un;
  const listPrice = round2(unitPrice * units * quantity);
  const kitPrice = round2(amount * quantity);
  return {
    quantity,
    units,
    totalBottles: units * quantity,
    listPrice,
    kitPrice,
    discount: round2(Math.max(0, listPrice - kitPrice)),
    shipping: null,
    total: kitPrice,
  };
}
