"use client";

import { useEffect, useState } from "react";
import { getStoredReferral } from "@/lib/referral";

// Checkout real (Appmax/Nuvemshop). ID de produto confirmado pelo usuário em 2026-10-14.
// Todos os planos levam ao mesmo checkout por ora — não há variantes por plano ainda.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ||
  "https://pay.puriongt.com.br/checkout?product=12c09776-a3c7-11f1-a1eb-46da4690ad53";

// Mesmo CHECKOUT_URL, mas com ?ref=<slug> anexado quando a visita veio de um
// link de afiliado (/marcelo10, /cristiano10, /jujuba10) — ver lib/referral.ts.
// Só resolve o referral depois de montar no cliente (localStorage não existe
// no SSR), então o primeiro render usa o link base e atualiza em seguida.
export function useCheckoutUrl(): string {
  const [url, setUrl] = useState(CHECKOUT_URL);

  useEffect(() => {
    const referral = getStoredReferral();
    if (!referral) return;
    const separator = CHECKOUT_URL.includes("?") ? "&" : "?";
    setUrl(`${CHECKOUT_URL}${separator}ref=${encodeURIComponent(referral.slug)}`);
  }, []);

  return url;
}
