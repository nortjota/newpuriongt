// HIPÓTESES COMERCIAIS — NÃO PUBLICADAS.
//
// Preços sugeridos para a linha PURION GIFT, ainda sem validação de SKU,
// custo e checkout. Este arquivo NÃO é importado por nenhuma página: os
// preços exibidos e cobrados continuam vindo de lib/content/plans.ts, que é
// o que o checkout do Appmax cobra hoje. Para ativar uma hipótese:
//   1. criar/ajustar o produto no Appmax com esse preço e confirmar o link;
//   2. atualizar PLAN_AMOUNT/PLANS e CHECKOUT_URL_BY_PLAN;
//   3. alinhar produtos_sku no CRM (hoje Kit 2 = 179,90 e Kit 3 = 259,90 lá).
export const KIT_PRICE_PROPOSALS = [
  { offerId: "individual", units: 1, proposedPrice: 97.9, status: "hipotese" },
  { offerId: "duo", units: 2, proposedPrice: 179.9, status: "hipotese" },
  { offerId: "trio", units: 3, proposedPrice: 259.9, status: "hipotese" },
] as const;

// Custo industrial por frasco informado pelo negócio (sem frete, gateway,
// mídia e impostos). Usado só para análise, nunca para preço público.
export const INDUSTRIAL_COST_PER_BOTTLE = 30;
