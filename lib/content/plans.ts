// Valores herdados do protótipo de design — ver PLACEHOLDERS.md (preços não confirmados pelo usuário).
export function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

export type Plan = {
  id: "un" | "k2" | "k3" | "sub";
  title: string;
  description: string;
  price: string;
  perQuickBuy: string;
  badge?: string;
  badgeTone?: "ink" | "signal";
  isSubscription?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "un",
    title: "Unidade",
    description: "1 frasco · 60 ml",
    price: fmt(97.9),
    perQuickBuy: "Preço de lançamento · 35% off",
  },
  {
    id: "k2",
    title: "Kit 2 frascos",
    description: "Economize 10%",
    price: fmt(176.22),
    perQuickBuy: `${fmt(176.22 / 2)} por frasco · economize 10%`,
    badge: "−10%",
    badgeTone: "ink",
  },
  {
    id: "k3",
    title: "Kit 3 frascos",
    description: "Economize 15% · melhor custo",
    price: fmt(249.65),
    perQuickBuy: `${fmt(249.65 / 3)} por frasco · economize 15% · melhor custo`,
    badge: "−15%",
    badgeTone: "ink",
  },
  {
    id: "sub",
    title: "Assinatura",
    description: "15% off em toda entrega · cancele quando quiser",
    price: `${fmt(83.22)}/entrega`,
    perQuickBuy: "a cada 60 dias · 15% off em toda entrega",
    badge: "Recorrente",
    badgeTone: "signal",
    isSubscription: true,
  },
];

export const SUBSCRIPTION_FREQUENCIES = [30, 60, 90];

// Estado inicial do protótipo: plano "Unidade", quantidade 1.
export const DEFAULT_TOTAL = fmt(97.9);
export const DEFAULT_OLD_PRICE = fmt(149.9);
export const DEFAULT_INSTALLMENT = fmt(97.9 / 3);

export const TRUST_SEALS = [
  { icon: "shield-check", title: "Compra segura", desc: "Pagamento protegido" },
  { icon: "truck", title: "Envio no mesmo dia", desc: "Rastreio após aprovação" },
  { icon: "map-pin", title: "Frete seguro", desc: "Para todo o Brasil" },
  { icon: "rotate-ccw", title: "Garantia de 7 dias", desc: "100% de volta, sem perguntas" },
  { icon: "receipt", title: "Nota fiscal emitida", desc: "Em todo pedido" },
] as const;
