"use client";

import { useEffect, useState } from "react";
import { getStoredReferral } from "@/lib/referral";
import { usePurion } from "@/lib/store/PurionProvider";
import type { Plan } from "./plans";

// Checkout real (Appmax/Nuvemshop). ID de produto confirmado pelo usuário em 2026-10-14.
// Fica como fallback pros planos que ainda não têm link próprio.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ||
  "https://pay.puriongt.com.br/checkout?product=12c09776-a3c7-11f1-a1eb-46da4690ad53";

// Links dedicados por plano, conforme confirmados pelo usuário. Plano sem
// entrada aqui cai no CHECKOUT_URL genérico acima.
const CHECKOUT_URL_BY_PLAN: Partial<Record<Plan["id"], string>> = {
  // Kit 2 frascos — confirmado pelo usuário em 2026-11-04.
  k2: "https://pay.puriongt.com.br/checkout?product=5611c8a9-946a-11f1-a1eb-46da4690ad53",
};

function baseCheckoutUrl(planId: Plan["id"]): string {
  return CHECKOUT_URL_BY_PLAN[planId] ?? CHECKOUT_URL;
}

// Link de checkout do plano atualmente selecionado (ver PurionProvider), com
// ?ref=<slug> anexado quando a visita veio de um link de afiliado (ver
// lib/referral.ts). Só resolve o referral depois de montar no cliente
// (localStorage não existe no SSR), então o primeiro render usa o link base
// e atualiza em seguida.
export function useCheckoutUrl(): string {
  const { plan } = usePurion();
  const base = baseCheckoutUrl(plan.id);
  const [url, setUrl] = useState(base);

  useEffect(() => {
    const referral = getStoredReferral();
    if (!referral) {
      setUrl(base);
      return;
    }
    const separator = base.includes("?") ? "&" : "?";
    setUrl(`${base}${separator}ref=${encodeURIComponent(referral.slug)}`);
  }, [base]);

  return url;
}
